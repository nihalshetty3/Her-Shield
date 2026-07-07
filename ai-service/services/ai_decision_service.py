import ollama
import json

def ai_should_trigger_sos(incident):
    prompt = f"""
You are an intelligent emergency response AI.
Analyze the following incident ans determine whether an SOS should be triggered.

Incident:

Trigger Type:
{incident["triggerType"]}

Transcription:
{incident["transcription"]}

Risk:
{incident["risk"]}

Keyword Score:
{incident["keywordScore"]}

Scream Detection:
{incident["screamDetection"]}

Return ONLY valid JSON.

{{
    "triggerSOS": true,
    "confidence": 95,
    "reason": "Short explanation"
}}
"""

    response = ollama.chat(
        model="mistral:latest",
        messages=[
            {
                "role":"user",
                "content": prompt
            }
        ]
    )
    
    content = response["message"]["content"]
    
    try:
        return json.loads(content)
    except Exception:
        return{
            "triggerSOS": False,
            "confidence": 0,
            "reason": "AI returned invalid JSON."
        }