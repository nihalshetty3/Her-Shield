from datetime import datetime


def build_context(
    transcription,
    keyword_result,
    risk,
    scream_result,
    latitude=None,
    longitude=None,
    emotion=None,
    motion=None,
    battery=None,
    network=None
):

    return {

        "triggerType": "VOICE",

        "transcription": transcription,

        "keywords": keyword_result["matched"],

        "keywordScore": keyword_result["score"],

        "risk": risk,

        "screamDetection": scream_result,

        "time": datetime.now().strftime("%H:%M"),

        "latitude": latitude,

        "longitude": longitude,

        "emotion": emotion,

        "motion": motion,

        "battery": battery,

        "network": network
    }