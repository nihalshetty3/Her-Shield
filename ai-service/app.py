from fastapi import FastAPI, UploadFile, File
import os
import uuid
import shutil
from pydantic import BaseModel

from services.guardian_service import guardian_chat
from services.whisper_service import transcribe
from services.keyword_service import detect_keywords
from services.risk_service import calculate_risk
from services.response_service import build_response
from services.scream_service import detect_scream
from services.analyzer_service import analyze_incident
from services.decision_service import should_trigger_sos
from services.ai_decision_service import ai_should_trigger_sos
from services.fake_sos_service import detect_fake_sos
from services.context_service import build_context
from services.evidence_service import save_incident
from fastapi.responses import FileResponse
from services.evidence_service import load_incident
from services.report_service import generate_report
from services.pdf_service import create_pdf
from services.shake_service import detect_shake
from services.timeline_service import (
    add_event, get_timeline, clear_timeline
)
latest_incident = None

app = FastAPI()

os.makedirs("audio", exist_ok=True)
clear_timeline()
add_event("Emergency Monitoring Staeted")

@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):

    path = f"audio/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transcription = transcribe(path)
    add_event(
        "Voice Transcribed",
        transcription
    )
    
    keyword_result = detect_keywords(transcription)
    add_event(
        "Keywords Detected",
        keyword_result
    )
    
    scream_result = detect_scream(path)
    add_event(
        "Scream Detection Completed",
        scream_result
    )
    
    score = keyword_result["score"]
    if scream_result["isScream"]:
        score+=10
    
    risk = calculate_risk(score)
    add_event(
        "Risk Calculated",
        {
            "risk": risk,
            "score": score
        }
    )
    
    incident = build_context(
        transcription,
        keyword_result,
        risk,
        scream_result
    )

    fake_result = detect_fake_sos(incident)
    add_event(
        "Fake SOS Analysis",
        fake_result
    )
    
    # Increase risk further if AI thinks it's a real emergency
    if fake_result["isEmergency"]:
        score+=5
        risk = calculate_risk(score)
        
    # Rebuild context with updated risk
    incident = build_context(
        transcription,
        keyword_result,
        risk,
        scream_result
    )
    try:
        
        ai_decision = ai_should_trigger_sos(incident)
        add_event(
            "AI Decision",
            ai_decision
        )
        
        analysis = analyze_incident(incident)
        add_event(
            "Incident Analysis Completed",
            analysis
        )
        
        incident_record = {
            "incidentId": str(uuid.uuid4()),
            "time": incident["time"],
            "transcription": transcription,
            "keywords": keyword_result["matched"],
            "keywordScore": keyword_result["score"],
            "risk": risk,
            "screamDetection": scream_result,
            "analysis": analysis,
            "aiDecision": ai_decision,
            "fakeSOSDetection": fake_result
        }
        
        if not fake_result["isEmergency"]:
            trigger_sos = False
        else:
            trigger_sos = ai_decision["triggerSOS"]
            if trigger_sos:
                add_event(
                    "SOS Triggered"
                )
            else:
                add_event(
                    "SOS Not triggered"
                )
        
        save_incident(incident_record)
        add_event(
            "Evidence Saved",
            incident_record["incidentId"]
        )
                
    except Exception as e:

        print("\n========== AI DECISION ERROR ==========")
        print(e)

        trigger_sos = should_trigger_sos(
            risk,
            scream_result
        )

        ai_decision = {
            "triggerSOS": trigger_sos,
            "confidence":0,
            "reason":"Fallback Rule Engine"
        }

        analysis = {
            "incidentType":"Unknown",
            "severity":risk,
            "summary":"AI analysis unavailable"
        }

    # Build Response
    response = build_response(
        transcription,
        keyword_result["matched"],
        keyword_result["score"],
        risk
    )

    response["screamDetection"] = scream_result
    response["analysis"] = analysis
    response["triggerSOS"] = trigger_sos
    response["aiDecision"] = ai_decision
    response["fakeSOSDetection"] = fake_result
    response["incidentId"]= incident_record["incidentId"]
    
    # ================= DEBUG LOGS =================

    print("\n========== TRANSCRIPTION ==========")
    print(transcription)

    print("\n========== KEYWORD RESULT ==========")
    print(keyword_result)

    print("\n========== RISK ==========")
    print(risk)

    print("\n========== INCIDENT ==========")
    print(incident)

    print("\n========== SCREAM DETECTION ==========")
    print(scream_result)

    print("\n========== FAKE SOS ==========")
    print(fake_result)

    print("\n========== AI ANALYSIS ==========")
    print(analysis)

    print("\n========== AI DECISION ==========")
    print(ai_decision)

    print("\n========== FINAL RESULT ==========")
    print("Trigger SOS :", trigger_sos)

    print("\n========== RESPONSE ==========")
    print(response)

    print("=====================================\n")

    global latest_incident
    incident["analysis"]=analysis
    latest_incident = incident
    
    print("\n========== INCIDENT SAVED ==========")
    print(latest_incident)
    
    return response

class GuardianRequest(BaseModel):
    question:str
    
@app.post(("/guardian/chat"))
async def guardian_chat_endpoint(request: GuardianRequest):
    
    global latest_incident
    if latest_incident is None:
        return {
            "answer": "No incident available"
        }
    
    answer = guardian_chat(
        latest_incident,
        request.question
    )
    
    print("\n========== GUARDIAN ANSWER ==========")
    print(answer)
     
    return {
         "answer": answer
    }
    
@app.get("/report/{incident_id}")
def generate_police_report(incident_id):
    incident = load_incident(
        incident_id
    )
    
    if incident is None:
        return {
            "error":"Incident not found"
        }
    report = generate_report(
        incident
    )
    pdf = create_pdf(
        incident_id,
        report
    )
    
    add_event(
        "Police Report Generated",
        incident_id
    )
    return FileResponse(
        pdf,
        media_type="application/pdf",
        filename=f"{incident_id}.pdf"
    )

class ShakeRequest(BaseModel):
    shakeCount: int
    peakAcceleration: float
    duration: float
    
@app.post("/shake/detect")
def shake_detect(request: ShakeRequest):
    result = detect_shake(
        request.shakeCount,
        request.peakAcceleration,
        request.duration
    )
    
    return result

@app.get("/timeline")
def incident_timeline():
    return get_timeline()