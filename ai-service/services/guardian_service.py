import ollama
from services.timeline_service import get_timeline

SYSTEM_PROMPT = """
You are Aura Guardian AI.

You assist emergency contacts after an SOS.

You have access to:

• Incident details
• Live location
• Timeline of events

Rules:

- If asked about the victim's location, answer using the Address field.
- Mention GPS coordinates only if the user explicitly asks for them.
- Do not include unrelated incident details when answering location questions.
- If asked what happened, summarize the incident and use the timeline.
- Never invent information.
- Keep responses under 4 sentences.
"""

def guardian_chat(incident , questions):
    timeline = get_timeline()
    location= incident.get("location", {})
    prompt = f"""
Emergency Incident

Trigger Type:
{incident["triggerType"]}

Transcription:
{incident["transcription"]}

Risk:
{incident["risk"]}

Transcription:
{incident["transcription"]}

Keywords:
{incident["keywords"]}

Keyword Score:
{incident["keywordScore"]}

Scream Detection:
{incident["screamDetection"]}

Current Location:

Latitude:
{location.get("latitude")}

Longitude:
{location.get("longitude")}

Address:
{location.get("address")}

TimeLine of Events
{timeline}

Guardian Question:
{questions}
Answer naturally as if you are speaking to the victim's guardian.
Keep the response concise.
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
    return response["message"]["content"]