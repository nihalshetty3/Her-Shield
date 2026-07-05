from fastapi import FastAPI , UploadFile , File 

from whisper_service import transcribe
from keyword_detector import detect_keyword

import shutil
app=FastAPI()

@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):
    
    path = f"audio/{file.filename}"
    with open(path , "wb") as buffer:
        shutil.copyfileobj(file.file , buffer)
        
    text = transcribe(path)
    detected = detect_keyword(text)
    
    return {
        "transcription": text,
        "triggerSOS": detected
    }