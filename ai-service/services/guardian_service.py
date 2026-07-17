import ollama
from services.timeline_service import get_timeline

SYSTEM_PROMPT = """
You are Aura Guardian AI.

You assist emergency contacts after an SOS.

You have access to:

• Incident details
• Live location
• Nearby Safe Zones
• Timeline of events

Rules:

- If asked where the victim is, answer using the Address field.
- Mention GPS coordinates only if explicitly requested.
- If asked where the victim should go, recommend the nearest safe zone.
- If no nearby safe zone exists, clearly mention that.
- Never invent information.
- Use the timeline when answering questions about what happened.
- Keep responses under 4 sentences.
"""


def guardian_chat(incident, questions):

    timeline = get_timeline()

    location = incident.get("location", {})

    safe_zones = location.get("safeZones", [])

    prompt = f"""
Emergency Incident

Trigger Type:
{incident.get("triggerType")}

Risk:
{incident.get("risk")}

Transcription:
{incident.get("transcription")}

Keywords:
{incident.get("keywords")}

Keyword Score:
{incident.get("keywordScore")}

Scream Detection:
{incident.get("screamDetection")}

Current Location

Address:
{location.get("address")}

Latitude:
{location.get("latitude")}

Longitude:
{location.get("longitude")}

Nearby Safe Zones
"""

    if len(safe_zones) == 0:

        prompt += "\nNo nearby safe zones detected.\n"

    else:

        for zone in safe_zones:

            prompt += f"""
• {zone.get("name")}
  Type: {zone.get("type")}
  Distance: {zone.get("distance")} meters
"""

    prompt += f"""

Timeline

{timeline}

Guardian Question

{questions}

Answer naturally.
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