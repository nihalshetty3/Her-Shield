import json
import ollama

SYSTEM_PROMPT = """
You are an AI Police Report Generator.

Generate a professional incident report.
Return ONLY JSON.

Format:

{

"incidentSummary":"",

"timeline":"",

"evidence":[],

"riskAssessment":"",

"recommendedAction":""

}
"""
def generate_report(incident):
    response = ollama.chat(
        model="mistral:latest",
        messages = [
            {
                "role":"system",
                "content":SYSTEM_PROMPT
            },
            {
                "role":"user",
                "content":json.dumps(
                    incident,
                    indent=4
                )
            }
        ]
    )
    return json.loads(
        response["message"]["content"]
    )