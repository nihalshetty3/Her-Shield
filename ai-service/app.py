from fastapi import FastAPI , UploadFile , File 

from services.whisper_service import transcribe
from services.keyword_service import detect_keywords
from services.risk_service import calculate_risk
from services.response_service import build_response


import shutil
app=FastAPI()

@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):
    
    path = f"audio/{file.filename}"
    with open(path , "wb") as buffer:
        shutil.copyfileobj(file.file , buffer)
        
    transcription = transcribe(path)
    keyword_result = detect_keywords(transcription)
    risk = calculate_risk(keyword_result["score"])
    
    incident={
       "triggerType": "VOICE",
       "transcription": transcription,
       "keywordScore": keyword_result["score"],
       "risk": risk
    }
    
    analysis = analyze_incident(incident)
   
    response=build_response(
        transcription,
        keyword_result["matched"],
        keyword_result["score"],
        risk
    )
    
    response["analysis"]=analysis
    return response