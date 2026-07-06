from services.analyzer_service import analyze_incident

incident = {
    "triggerType": "VOICE",
    "transcription": "Help me. Someone is following me.",
    "keywordScore": 20,
    "risk": "CRITICAL"
}

print(analyze_incident(incident))