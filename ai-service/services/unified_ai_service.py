import json
import ollama

SYSTEM_PROMPT = """
You are an intelligent AI Emergency Response Assistant.

Analyze the emergency incident using all available information.

Your responsibilities are:

1. Determine whether this is a REAL emergency or a fake/accidental alert.
2. Decide whether the SOS should be triggered.
3. Estimate your confidence (0-100).
4. Classify the incident type.
5. Summarize the situation.
6. Recommend the next action.

Return ONLY valid JSON.

Format:

{
    "isEmergency": true,
    "triggerSOS": true,
    "confidence": 95,
    "risk": "HIGH",
    "incidentType": "Possible Assault",
    "summary": "Short summary of the emergency.",
    "recommendedAction": "Immediately notify emergency contacts and police.",
    "reason": "Brief explanation of the decision."
}

Rules:

- If the transcription contains emergency words like
  "help", "save me", "danger", "please help",
  increase confidence.

- If screamDetection.isScream is true,
  strongly increase confidence.

- If risk is HIGH,
  strongly consider triggering SOS.

- If the transcription clearly indicates
  a joke, movie, testing, or accidental trigger,
  classify it as NOT an emergency.

Return ONLY JSON.
Do not include markdown.
Do not include explanations.
"""


def analyze_complete_incident(incident):

    prompt = f"""
Emergency Incident

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

Analyze this incident completely.

Determine:

1. Is it a real emergency?
2. Should SOS be triggered?
3. Confidence score.
4. Incident type.
5. Summary.
6. Recommended action.
7. Reason.

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

    except Exception as e:

        print("AI JSON Parsing Error:", e)
        print("AI Response:", content)

        return {
            "isEmergency": False,
            "triggerSOS": False,
            "confidence": 0,
            "risk": incident["risk"],
            "incidentType": "Unknown",
            "summary": "AI returned invalid JSON.",
            "recommendedAction": "Manual verification required.",
            "reason": "Failed to parse AI response."
        }