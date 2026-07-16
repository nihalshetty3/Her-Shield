from services.email_service import send_email

send_email(
    recipient="anvithpoojary07@gmail.com",
    incident_id="HS-0001",
    location="NMAMIT, Nitte, Karnataka",
    risk="HIGH",
    summary="A distress call was detected. The AI identified a high probability of an emergency requiring immediate assistance.",
    attachment=None

)

print("email test completed")