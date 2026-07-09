import os 
import json

EVIDENCE_DIR = "evidence"

os.makedirs(EVIDENCE_DIR , exist_ok=True)

def save_incident(incident):
    incident_id = incident["incidentId"]
    
    path = os.path.join(
        EVIDENCE_DIR,
        f"{incident_id}.json"
    )
    
    with open(path , "w") as f:
        json.dump(
            incident,
            f,
            
            indent=4
        )
    return incident_id

def load_incident(incident_id):
    path = os.path.join(
        EVIDENCE_DIR,
        f"{incident_id}.json"
    )
    
    if not os.path.exists(path):
        return None
    
    with open(path) as f:
        return json.load(f)