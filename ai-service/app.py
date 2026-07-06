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

app=FastAPI()

os.makedirs("audio", exist_ok=True)
    
@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):
    
    path = f"audio/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    transcription = transcribe(path)
    keyword_result = detect_keywords(transcription)
    risk = calculate_risk(keyword_result["score"])
    scream_result = detect_scream(path)
    trigger_sos = should_trigger_sos(risk , scream_result)
    
    incident={
       "triggerType": "VOICE",
       "transcription": transcription,
       "keywordScore": keyword_result["score"],
       "risk": risk,
       "screamDetection": scream_result
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
    
    return response