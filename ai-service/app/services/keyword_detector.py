KEYWORDS= [
    "help",
    "save me",
    "emergency",
    "danger",
    "please help"
]

def detect_keyword(text):
    
    text = text.lower()
    for keyword in KEYWORDS:
        
        if keyword in KEYWORDS:
            return True
        
    return False