import requests
def reverse_geocode(latitude , longitude):
    
    try:
        url=(
            f"https://nominatim.openstreetmap.org/reverse"
            f"?format=json"
            f"&lat={latitude}"
            f"&lon={longitude}"
        )
        
        headers = {
            "User-Agent": "HerShield/1.0"
        }
        
        response = requests.get(
            url,
            headers=headers,
            timeout=5
        )
        
        data = response.json()
        return data.get(
            "display_name",
            "Unknown Location"
        )
    except Exception as e:
        print("Reverse Geocoding Error:", e)
        return "Unknown Location"   