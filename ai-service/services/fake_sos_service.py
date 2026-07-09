import ollama
import json

SYSTEM_PROMPT = """
You are an intelligent emergency classifier.

Analyze the complete incident.

Use:
- transcription
- keyword score
- risk
- scream detection

Determine if this is a real emergency.

Return ONLY JSON.

{
    "isEmergency": true,
    "confidence": 95,
    "reason":"..."
}
"""


def detect_fake_sos(incident):

    prompt = f"""
Transcription:
{incident["transcription"]}

Risk:
{incident["risk"]}

Keyword Score:
{incident["keywordScore"]}

Scream Detection:
{incident["screamDetection"]}
"""

    response = ollama.chat(
        model="mistral:latest",
        messages=[
            {
                "role":"system",
                "content":SYSTEM_PROMPT
            },
            {
                "role":"user",
                "content":prompt
            }
        ]
    )

    content = response["message"]["content"]

    try:
        return json.loads(content)

    except Exception:

        return {
            "isEmergency": True,
            "confidence":0,
            "reason":"Unable to classify."
        }