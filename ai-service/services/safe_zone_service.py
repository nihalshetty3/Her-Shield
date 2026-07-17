import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

def find_safe_zones(latitude, longitude, radius=500):

    query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:{radius},{latitude},{longitude});
      node["amenity"="police"](around:{radius},{latitude},{longitude});
      node["amenity"="fire_station"](around:{radius},{latitude},{longitude});
      node["amenity"="university"](around:{radius},{latitude},{longitude});
    );
    out;
    """

    try:

        response = requests.post(
            OVERPASS_URL,
            data=query,
            timeout=10,
            headers={
                "User-Agent": "AuraGuard/1.0"
            }
        )

        response.raise_for_status()

        data = response.json()

    except Exception as e:

        print("SAFE ZONE API ERROR")
        print(e)

        return []

    safe_places = []

    for place in data.get("elements", []):

        tags = place.get("tags", {})

        safe_places.append({

            "name": tags.get("name", "Unknown"),

            "type": tags.get("amenity", "Unknown"),

            "latitude": place["lat"],

            "longitude": place["lon"]

        })

    return safe_places