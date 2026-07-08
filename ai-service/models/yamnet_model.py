from pathlib import Path

import librosa
import numpy as np
import pandas as pd
import tensorflow_hub as hub

print("Loading YAMNet model...")


model = hub.load("https://tfhub.dev/google/yamnet/1")

print("YAMNet Loaded Successfully")


BASE_DIR = Path(__file__).resolve().parent.parent

CLASS_MAP_PATH = BASE_DIR / "assets" / "yamnet_class_map.csv"

if not CLASS_MAP_PATH.exists():
    raise FileNotFoundError(f"Class map not found: {CLASS_MAP_PATH}")

class_map = pd.read_csv(CLASS_MAP_PATH)

class_names = class_map["display_name"].tolist()


def load_audio(audio_path: str):

    audio_file = Path(audio_path)

    if not audio_file.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    waveform, _ = librosa.load(
        audio_file,
        sr=16000,
        mono=True
    )

    return waveform.astype(np.float32)




def predict_audio(audio_path: str):

    waveform = load_audio(audio_path)

    scores, embeddings, spectrogram = model(waveform)

    scores = scores.numpy()

    # Average predictions over all frames
    mean_scores = np.mean(scores, axis=0)

    # Best prediction
    best_index = int(np.argmax(mean_scores))

    label = class_names[best_index]

    confidence = float(mean_scores[best_index])

    # Top 5 predictions 
    top5_idx = np.argsort(mean_scores)[::-1][:5]

    top_predictions = [
        {
            "label": class_names[i],
            "confidence": round(float(mean_scores[i]), 4)
        }
        for i in top5_idx
    ]

    return {
        "label": label,
        "confidence": round(confidence, 4),
        "top_predictions": top_predictions
    }