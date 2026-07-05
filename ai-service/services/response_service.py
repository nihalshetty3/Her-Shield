def build_response(transcription , matched , score , risk):
    
    return {
        "transcription":transcription,
        "matchedKeywords": matched,
        "score": score,
        "risk": risk,
        "triggerSOS": risk in ["HIGH" , "CRITICAL"]
    }