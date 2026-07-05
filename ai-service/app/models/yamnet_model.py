import tensorflow_hub as hub

print("Loading YAMNet model...")

model=hub.load("https://tfhub.dev/google/yamnet/1")

print("YAMNet was Loaded Successfully")

BASE_DIR=Path(__file__).resolve().parent.parent.parent

CLASS_MAP_PATH=BASE_DIR / "assests" / "yamnet_class_map.csv"

class_map=pd.read_csv(CLASS_MAP_PATH)

class_names=class_map["display_name"].tolist()
