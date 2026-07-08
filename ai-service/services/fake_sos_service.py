import ollama
import json


def detect_fake_sos(transcription):

    prompt = f"""
You are an emergency AI.

Determine whether the following sentence is a REAL emergency or a NORMAL conversation.

Sentence:
{transcription}

Examples:

"Help me! Someone is following me."
→ REAL

"Don't touch me!"
→ REAL

"Please save me."
→ REAL

"Help me with my homework."
→ FAKE

"Can you help me carry this bag?"
→ FAKE

Return ONLY valid JSON.

{{
    "isEmergency": true,
    "confidence": 98,
    "reason": "..."
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
    
    content = response ["messages"]["content"]
    try:
        return json.loads(content)
    except:
        return {
            "isEmergency": True,
            "confidence": 0,
            "reason": "Unable to determine"
        }