from services.police_notification_service import notify_police
from datetime import datetime

incident = {
    "incidentId": "HS-0001",

    "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

    "transcription": "Help! Somebody is attacking me!",

    "keywords": ["help", "attacking"],

    "keywordScore": 10,

    "risk": "HIGH",

    "screamDetection": {
        "isScream": True,
        "confidence": 0.96
    },

    "analysis": {
        "incidentType": "Physical Assault",
        "summary": "Victim shouted for help. High probability of emergency.",
        "recommendedAction": "Dispatch police immediately."
    },

    "aiDecision": {
        "triggerSOS": True,
        "confidence": 97,
        "reason": "High confidence emergency"
    },

    "fakeSOSDetection": {
        "isEmergency": True
    },

    "location": {
        "latitude": 13.1858,
        "longitude": 74.9365,
        "address": "NMAMIT, Nitte, Karnataka"
    },

    "route": [
        [13.1858, 74.9365]
    ]
}

result = notify_police(incident)

print("\nResult :", result)