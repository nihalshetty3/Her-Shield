from math import radians, sin, cos , sqrt , atan2

def calculate_distance(lat1 , lon1 , lat2 , lon2):
    R=6371000
    
    dLat = radians(lat2 - lat1)
    dLon = radians(long2 - lon1)
    
    a=(
        sin(dLat / 2) ** 2
        +cos(radians(lat1))
        *cos(radians(lat2))
        *sin(dLon / 2) ** 2
    )
    
    c = 2 * atan2(sqrt(a) , sqrt(1 - a))
    return round(R * c)