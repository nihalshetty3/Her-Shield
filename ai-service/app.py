from fastapi import FastAPI , UploadFile , File 
import os
import shutil

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

app=FastAPI()

os.makedirs("audio", exist_ok=True)
    
@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):
    
    path = f"audio/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    transcription = transcribe(path)
    fake_result = detect_fake_sos(transcription)
    
    keyword_result = detect_keywords(transcription)
    risk = calculate_risk(keyword_result["score"])
    scream_result = detect_scream(path)
    
    incident=build_context(
        transcription,
        keyword_result,
        risk,
        scream_result
    )
    
    try:
        ai_decision=ai_should_trigger_sos(incident)
        if not fake_result["isEmergency"]:
            trigger_sos=False
        else:
            trigger_sos=ai_decision["triggerSOS"]
    
    except Exception:
        trigger_sos = should_trigger_sos(
            risk,
            scream_result
        )
        ai_decision = {
            "triggerSOS": trigger_sos,
            "confidence": 0,
            "reason": "FallBack Rule Engine"
        }
    
    
    analysis = analyze_incident(incident)
    
    response=build_response(
        transcription,
        keyword_result["matched"],
        keyword_result["score"],
        risk
    )
    
    response["screamDetection"]=scream_result
    response["analysis"]=analysis
    response["triggerSOS"]=trigger_sos
    response["aiDecision"]=ai_decision
    response["fakeSOSDetection"]= fake_result
    return response