from dotenv import load_dotenv
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
print("Loading env from:", env_path)

load_dotenv(dotenv_path=env_path)
import google.generativeai as genai 

from PIL import Image 
import os
import json

api_key = os.getenv("GEMINI_API_KEY")

print("Gemini Key:", os.getenv("GEMINI_API_KEY"))# Temporary debug

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_image(image_path):
    image = Image.open(image_path)
    
    prompt= """
You are an AI Women Safety Expert.
Analyze this image.

Return ONLY valid JSON.
{
    "people":0,
    "victimVisible":false,
    "attackerVisible":false,
    "weapon":false,
    "blood":false,
    "environment":"",
    "vehicle":"",
    "riskScore":0,
    "threat":"LOW",
    "description":"",
    "reason":""
}
"""
    response = model.generate_content([prompt, image])

    print("========== GEMINI RESPONSE ==========")
    print(response.text)
    print("=====================================")

    return {"raw": response.text}
    