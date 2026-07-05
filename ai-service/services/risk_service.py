def calculate_risk(score):
    
    if score>=15:
        return "CRITICAL"

    if score>=10:
        return "HIGH"
    
    if score>=5:
        return "MEDIUM"
    
    return "LOW"