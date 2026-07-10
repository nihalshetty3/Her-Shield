import ollama
import json

SYSTEM_PROMPT = """
You are an AI Police Documentation Officer.

Generate a professional police incident report.

Return ONLY valid JSON.

Format:

{
    "executiveSummary":"",
    "timeline":[],
    "evidenceSummary":"",
    "riskAssessment":"",
    "recommendedActions":[]
}
"""


def generate_report(incident):

    prompt = f"""
Generate a professional police report.

Incident

Time:
{incident["time"]}

Transcription:
{incident["transcription"]}

Risk:
{incident["risk"]}

Scream Detection:
{incident["screamDetection"]}

AI Analysis:
{incident["analysis"]}

AI Decision:
{incident["aiDecision"]}

Fake SOS:
{incident["fakeSOSDetection"]}
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

    content = content.replace("```json","")
    content = content.replace("```","").strip()
    report = json.loads(content)

    print("\n========== GENERATED REPORT ==========")
    print(report)

    for k, v in report.items():
        print(k, type(v))

    return report
    return json.loads(content)