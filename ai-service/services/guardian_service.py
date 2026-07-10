import ollama
from services.timeline_service import get_timeline

SYSTEM_PROMPT = """
You are Aura Guardian AI.

You assist emergency contacts after an SOS.

You have access to:

• Incident details
• AI analysis
• Timeline of events

Use BOTH the incident information and the timeline to answer.

If asked:
- what happened
- what happened first
- when SOS was triggered
- what happened after the scream
- was evidence saved
- when police report was generated

answer using the timeline.

Keep answers under 4 sentences.

Never invent information.
"""

def guardian_chat(incident , questions):
    timeline = get_timeline()
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