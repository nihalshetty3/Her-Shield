import ollama

SYSTEM_PROMPT = """
You are Aura guardian.
You assist emergency contacts after an SOS has been triggered.

Answer only using the incident information provided.

Keep answers concise(2-4 sentences).

If information is unavailable , clearly say so.
"""

def guardian_chat(incident , questions):
    prompt = f"""
Emergency Incident

Trigger Type:
{incident["triggerType"]}

Transcription:
{incident["transcription"]}

Risk:
{incident["risk"]}

Keywords:
{incident["keywords"]}

Keyword Score:
{incident["keywordScore"]}

Scream Detection:
{incident["screamDetection"]}

Question:
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