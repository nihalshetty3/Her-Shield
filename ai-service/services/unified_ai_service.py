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

Rules:

SAFETY HAS THE HIGHEST PRIORITY.

Trigger SOS if ANY of the following are true:

1. A scream is detected.
2. The transcription contains words like:
   help, help me, save me, somebody help, don't touch me,
   leave me alone, stop, emergency, danger, police.
3. The calculated risk is HIGH or CRITICAL.
4. The user repeatedly asks for help.
5. The user sounds frightened, panicked, or distressed.
6. There is uncertainty but the situation may involve physical danger.

Only classify the incident as NOT an emergency when there is strong evidence that it is a test, joke, movie dialogue, or an explicit practice recording.

When uncertain, ALWAYS prioritize user safety.

Repeated cries for help should ALWAYS be treated as a real emergency.

Return ONLY JSON.
Do not include markdown.
Do not include explanations.

Examples

Example 1

Transcript:
Help! Help! Please save me!

Scream Detection:
False

Risk:
CRITICAL

Output:

{
"isEmergency": true,
"triggerSOS": true,
"confidence": 99,
"risk":"CRITICAL",
"incidentType":"Possible Assault"
}

Example 2

Transcript:
Testing the microphone.

Scream Detection:
False

Risk:
LOW

Output:

{
"isEmergency": false,
"triggerSOS": false,
"confidence":99,
"risk":"LOW",
"incidentType":"Test Recording"
}
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