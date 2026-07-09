from fastapi import FastAPI, UploadFile, File
import os
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

latest_incident = None

app = FastAPI()

os.makedirs("audio", exist_ok=True)

@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):

    path = f"audio/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transcription = transcribe(path)

    keyword_result = detect_keywords(transcription)

    scream_result = detect_scream(path)
    
    score = keyword_result["score"]
    if scream_result["isScream"]:
        score+=10
    
    risk = calculate_risk(score)
    
    incident = build_context(
        transcription,
        keyword_result,
        risk,
        scream_result
    )

    fake_result = detect_fake_sos(incident)
    
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

        analysis = analyze_incident(incident)

        if not fake_result["isEmergency"]:
            trigger_sos = False
        else:
            trigger_sos = ai_decision["triggerSOS"]

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