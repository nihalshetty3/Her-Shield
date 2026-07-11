from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
allow_credentials = True,
allow_methods = ["*"],
allow_headers = ["*"],
)   

import os
import uuid
import shutil
import time

from pydantic import BaseModel

from services.unified_ai_service import analyze_complete_incident

from services.guardian_service import guardian_chat
from services.whisper_service import transcribe
from services.keyword_service import detect_keywords
from services.risk_service import calculate_risk
from services.response_service import build_response
from services.scream_service import detect_scream
from services.context_service import build_context
from services.evidence_service import save_incident, load_incident
from services.report_service import generate_report
from services.decision_service import should_trigger_sos
from services.pdf_service import create_pdf
from services.shake_service import detect_shake
from services.timeline_service import (
    add_event,
    get_timeline,
    clear_timeline
)

from fastapi.responses import FileResponse
latest_incident = None


os.makedirs("audio", exist_ok=True)
clear_timeline()
add_event("Emergency Monitoring Staeted")
@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):

    path = f"audio/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ------------------------------
    # Parallel Processing
    # ------------------------------
    start = time.time()

    with ThreadPoolExecutor(max_workers=2) as executor:

        whisper_future = executor.submit(transcribe, path)
        scream_future = executor.submit(detect_scream, path)

        transcription = whisper_future.result()
        scream_result = scream_future.result()

    print(f"Whisper + YAMNet completed in {time.time() - start:.2f} sec")

    add_event("Voice Transcribed", transcription)
    add_event("Scream Detection Completed", scream_result)

    # ------------------------------
    # Keyword Detection
    # ------------------------------
    keyword_result = detect_keywords(transcription)

    add_event("Keywords Detected", keyword_result)

    score = keyword_result["score"]

    if scream_result["isScream"]:
        score += 10

    risk = calculate_risk(score)

    add_event(
        "Risk Calculated",
        {
            "risk": risk,
            "score": score
        }
    )

    # ------------------------------
    # Build Context
    # ------------------------------
    incident = build_context(
        transcription,
        keyword_result,
        risk,
        scream_result
    )

    try:

        # ----------------------------------
        # ONE Ollama Call
        # ----------------------------------

        ai_result = analyze_complete_incident(incident)

        fake_result = {
            "isEmergency": ai_result["isEmergency"]
        }

        ai_decision = {
            "triggerSOS": ai_result["triggerSOS"],
            "confidence": ai_result["confidence"],
            "reason": ai_result["reason"]
        }

        analysis = {
            "incidentType": ai_result["incidentType"],
            "risk": ai_result["risk"],
            "summary": ai_result["summary"],
            "recommendedAction": ai_result["recommendedAction"]
        }

        add_event("Unified AI Completed", ai_result)

        trigger_sos = ai_decision["triggerSOS"]

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

        save_incident(incident_record)

        add_event(
            "Evidence Saved",
            incident_record["incidentId"]
        )

    except Exception as e:

        print("\n========== AI ERROR ==========")
        print(e)

        trigger_sos = should_trigger_sos(
            risk,
            scream_result
        )

        fake_result = {
            "isEmergency": trigger_sos
        }

        ai_decision = {
            "triggerSOS": trigger_sos,
            "confidence": 0,
            "reason": "Fallback Rule Engine"
        }

        analysis = {
            "incidentType": "Unknown",
            "risk": risk,
            "summary": "AI analysis unavailable.",
            "recommendedAction": "Manual verification required."
        }

        incident_record = {
            "incidentId": str(uuid.uuid4())
        }

    # ------------------------------
    # Response
    # ------------------------------

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
    response["incidentId"] = incident_record["incidentId"]

    global latest_incident

    incident["analysis"] = analysis

    latest_incident = incident

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