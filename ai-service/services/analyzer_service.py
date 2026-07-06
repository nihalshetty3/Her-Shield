import ollama 
SYSTEM_PROMPT = """
You are an AI emergency response assistant.

Analyze emergency incidents.

Always return ONLY valid JSON.

Format:

{
    "risk":"",
    "summary":"",
    "keywords":[],
    "recommendedAction":""
}
"""

def analyze_incident(incident):
    prompt = f"""
Trigger Type:
{incident["triggerType"]}

Transcription:
{incident["transcription"]}

Keyword Score:
{incident["keywordScore"]}

Risk:
{incident["risk"]}
"""

    response = ollama.chat(
        model="mistral:latest",
        messages=[
            {
                "role": "system",
                "content":SYSTEM_PROMPT
            },
            {
                "role":"user",
                "content":prompt
            }
        ]
    )
    return response["message"]["content"]