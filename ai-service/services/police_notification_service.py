from services.report_service import generate_report
from services.pdf_service import create_pdf
from services.police_service import find_nearest_police
from services.email_service import send_email

def notify_police(incident):

    print("\n" + "=" * 70)
    print(" STARTING POLICE NOTIFICATION WORKFLOW")
    print("=" * 70)
    
    try:
        print("\n generating incident report")

        report=generate_report(incident)

        print("report generated")
        print("\nGenerating PDF Report...")

        pdf_path = create_pdf(
            incident["incidentId"],
            report
        )

        print("PDF Created")
        print("PDF :", pdf_path)

        location=incident.get("location")

        if location is None:
            raise Exception("Location not found")
        latitude = location["latitude"]
        longitude = location["longitude"]
        address = location["address"]

        print("\nVictim Location")
        print(f"Latitude  : {latitude}")
        print(f"Longitude : {longitude}")
        print(f"Address   : {address}")

        print("\nSearching Nearby Police Station...")

        station = find_nearest_police(
            latitude,
            longitude
        )

        if station is None:

            print("No Police Station Found")

            return False

        print(" Police Station Found")

        print(f"Station : {station['name']}")
        print(f"Email   : {station['email']}")
        
        print("\nSending Incident Report...")

        send_email(
            recipient=station["email"],
            incident_id=incident["incidentId"],
            location=address,
            risk=incident["risk"],
            summary=incident["analysis"]["summary"],
            attachment=pdf_path
        )

        print("Email Sent Successfully")

        
        print("\nPolice Notification Completed Successfully")
        print("=" * 70)

        return True

    except Exception as e:

        print("\n" + "=" * 70)
        print("POLICE NOTIFICATION FAILED")
        print("=" * 70)
        print(e)
        print("=" * 70)

        return False



