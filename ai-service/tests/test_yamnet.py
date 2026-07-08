from services.scream_service import detect_scream
result=detect_scream("tests/normalspeech.mp3")
print(result)