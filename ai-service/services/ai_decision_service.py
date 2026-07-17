import ollama
import json


SYSTEM_PROMPT = """
You are an intelligent emergency decision engine.

Your task is to determine whether an SOS should be triggered.

Use ALL available context.

Return ONLY valid JSON.

Format:

{
    "triggerSOS": true,
    "confidence": 95,
    "reason": "Short explanation"
}
"""


def ai_should_trigger_sos(incident):

    prompt = f"""
Emergency Incident Context

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

Assume the user's safety is the highest priority.

If there is ANY indication of physical danger,
violence,
continuous calls for help,
panic,
screaming,
or uncertainty,

triggerSOS MUST be true.

Only return false when there is strong evidence that
the situation is completely safe.

Return ONLY valid JSON.
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

    content = response["message"]["content"]

    try:
        return json.loads(content)

    except Exception:

        return {
            "triggerSOS": False,
            "confidence": 0,
            "reason": "AI returned invalid JSON."
        }