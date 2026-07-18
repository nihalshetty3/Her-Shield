import math

POLICE_STATIONS=[
    {
        "name":"Nitte Police Station",
        "email":"anvithpoojary07@gmail.com",
        "latitude": 13.1858,
        "longitude": 74.9365
    },

    {
        "name": "Karkala Police Station",
        "email": "nnm23is069@nmamit.in",
        "latitude": 13.2148,
        "longitude": 74.9923
    },

    {
        "name": "Mangalore Police Station",
        "email": "nnm23is074@nmamit.in",
        "latitude": 12.9141,
        "longitude": 74.8560
    }

]

def distance(lat1, lon1, lat2, lon2):

    return math.sqrt(
        (lat1 - lat2) ** 2 +
        (lon1 - lon2) ** 2
    )



def find_nearest_police(latitude,longitude):
    nearest=None
    minimum=float("inf")

    for station in POLICE_STATIONS:

        d = distance(
            latitude,
            longitude,
            station["latitude"],
            station["longitude"]
        )

        if d < minimum:
            minimum = d
            nearest = station
    return nearest        
