def detect_shake(shake_count , peak_acceleration, duration):
    
    if shake_count < 4:
        return{
            isShake:False,
            "confidence": 10,
            "reason": "Not enough shakes"
        }
        
    if peak_acceleration < 22:
        return {
            "isShake": False,
            "confidence": 30,
            "reason": "low acceleration"
        }
    
    if duration < 1:
        return {
            "isShake": False,
            "confidence": 50,
            "reason": "Shake too short"
        }
    return {
        "isShake": True,
        "confidence": 95,
        "reason": "Intentional emergency shake detected"
    }