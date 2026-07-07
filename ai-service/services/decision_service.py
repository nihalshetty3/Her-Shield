def should_trigger_sos(risk , scream_result):
    
    if scream_result["isScream"]:
        return True
    
    if risk in ["HIGH" , "CRITICAL"]:
        return True
    
    return False