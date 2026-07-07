import ollama

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

    return response["message"]["content"]