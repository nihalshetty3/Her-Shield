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
from services.police_notification_service import notify_police
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
from services.geocoding_service import reverse_geocode

from utils.audio_convertor import prepare_audio

from services.timeline_service import (
    add_event,
    get_timeline,
    clear_timeline
)

from fastapi.responses import FileResponse
latest_incident = None

latest_location = {
     "latitude": 12.9143,
    "longitude": 74.8560
}
location_history=[]

os.makedirs("audio", exist_ok=True)

@app.post("/voice/detect")
async def detect_voice(file: UploadFile = File(...)):
    clear_timeline()
    add_event("Emergency Monitoring Started")

    # ------------------------------
    # Save Uploaded Audio
    # ------------------------------
    original_path = f"audio/{file.filename}"

    with open(original_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Convert to WAV if required
    path = prepare_audio(original_path)

    print("\n========== AUDIO RECEIVED ==========")
    print("Filename      :", file.filename)
    print("Content Type  :", file.content_type)
    print("Original Path :", original_path)
    print("Processing    :", path)
    print("Size          :", os.path.getsize(path), "bytes")
    print("====================================\n")

    # ------------------------------
    # AI Processing
    # ------------------------------
    start = time.time()

    with ThreadPoolExecutor(max_workers=2) as executor:

        whisper_future = executor.submit(transcribe, path)
        scream_future = executor.submit(detect_scream, path)

        transcription = whisper_future.result()
        scream_result = scream_future.result()

    print(f"Whisper + YAMNet completed in {time.time() - start:.2f} sec\n")

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
    # Build Incident Context
    # ------------------------------
    incident = build_context(
        transcription,
        keyword_result,
        risk,
        scream_result
    )
    incident["location"]=latest_location
    incident["route"]=location_history

    try:

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
            "fakeSOSDetection": fake_result,
            "location": latest_location,
            "route": location_history
        }

       

        save_incident(incident_record)

        if trigger_sos:
          print("\nEmergency detected. Notifying police...")
          try:
               notify_police(incident_record)
          except Exception as e:
               print(f"Police Notification Failed: {e}")

        add_event("Unified AI Completed", ai_result)
        add_event("Evidence Saved", incident_record["incidentId"])

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
    # Cleanup Converted File
    # ------------------------------
    if path != original_path and os.path.exists(path):
        os.remove(path)

    # ------------------------------
    # Build Response
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
    incident["aiDecision"] = ai_decision
    incident["fakeSOSDetection"] = fake_result

    incident["location"]=latest_location
    incident["route"]=location_history
    latest_incident = incident

    return response

class GuardianRequest(BaseModel):
    question:str
    
class LocationRequest(BaseModel):
    latitude:float
    longitude:float
    
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

@app.post("/location/update")
def update_location(request: LocationRequest):
    
    global latest_location
    global location_history
    
    address = reverse_geocode(
        request.latitude,
        request.longitude
    )
    
    latest_location={
        "latitude": request.latitude,
        "longitude": request.longitude,
        "address": address
    }
    
    location_history.append([
        request.latitude,
        request.longitude
    ])
    
    if len(location_history) > 200:
        location_history.pop(0)
        
    print("\n========== LOCATION UPDATE ==========")
    print(latest_location)
    print(location_history)
    return {
         "success": True
     }

@app.get("/timeline")
def incident_timeline():
    return get_timeline()

@app.get("/dashboard")
def dashboard():
    
    global latest_incident
    global latest_location
    
    print("\n========== LOCATION ==========")
    print(latest_location)
        
    if latest_incident is None:
        return {
            "status":"No incident",
            "location": latest_location,
            "route": location_history,
            "timeline": []
        }
    return {
        "status": "ACTIVE",
        "risk":latest_incident["risk"],
        
        "incidentType":
            latest_incident["analysis"]["incidentType"],
        "summary":
            latest_incident["analysis"]["summary"],
        "recommendedAction":
            latest_incident["analysis"]["recommendedAction"],
        "triggerSOS":
            latest_incident["aiDecision"]["triggerSOS"],
        "location": latest_location,
        "route": location_history,
        "timeline":
            get_timeline()    
    }