import ollama
import json

SYSTEM_PROMPT = """
You are an AI emergency response assistant.

Analyze the emergency incident and return ONLY valid JSON.

Format:

{
    "risk": "",
    "summary": "",
    "keywords": [],
    "recommendedAction": ""
}
"""


def analyze_incident(incident):

    prompt = f"""
Analyze the following emergency incident.

Trigger Type:
{incident["triggerType"]}

Transcription:
{incident["transcription"]}

Detected Keywords:
{incident["keywords"]}

Keyword Score:
{incident["keywordScore"]}

Calculated Risk:
{incident["risk"]}

Scream Detection:
{incident["screamDetection"]}

Incident Time:
{incident["time"]}

Generate ONLY valid JSON.
"""

    response = ollama.chat(
        model="mistral:latest",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response["message"]["content"].strip()

    # Remove markdown code fences if Mistral returns them
    if content.startswith("```json"):
        content = content.replace("```json", "").replace("```", "").strip()
    elif content.startswith("```"):
        content = content.replace("```", "").strip()

    try:
        return json.loads(content)

    except Exception:
        return {
            "risk": incident["risk"],
            "summary": content,
            "keywords": [],
            "recommendedAction": "AI parsing failed"
        }