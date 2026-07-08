from models.yamnet_model import predict_audio

DISTRESS_LABELS = {
    "Screaming",
    "Groan",
    "Wail, moan",
    "Grunt",
    "Crying",
    "Child crying",
    "Yell",
    "Shout"
}

THRESHOLD = 0.30


def detect_scream(audio_path):

    prediction = predict_audio(audio_path)

    distress_score = 0.0

    matched_labels = []

    for item in prediction["top_predictions"]:

        if item["label"] in DISTRESS_LABELS:
            distress_score += item["confidence"]
            matched_labels.append(item)

    return {
        "isScream": distress_score >= THRESHOLD,
        "distressScore": round(distress_score, 4),
        "matchedLabels": matched_labels,
        "topPrediction": prediction["label"],
        "topConfidence": prediction["confidence"]
    }