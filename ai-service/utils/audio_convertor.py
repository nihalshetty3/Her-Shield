

from pathlib import Path
import subprocess
import uuid

SUPPORTED_FORMATS = {
    ".wav",
    ".mp3",
    ".webm",
    ".ogg",
    ".m4a",
    ".flac"
}
FFMPEG_PATH = r"C:\Users\anvit\Downloads\ffmpeg-2026-07-09-git-8de8405796-full_build\ffmpeg-2026-07-09-git-8de8405796-full_build\bin\ffmpeg.exe"
def prepare_audio(audio_path: str):

    path = Path(audio_path)

    extension = path.suffix.lower()

    if extension not in SUPPORTED_FORMATS:
        raise Exception(f"Unsupported format: {extension}")

    # Check if it is REALLY a WAV file
    with open(path, "rb") as f:
        header = f.read(4)

    if header == b"RIFF":
        print("Already a valid WAV.")
        return str(path)

    print("Converting to WAV using FFmpeg...")

    output = path.parent / f"{uuid.uuid4()}.wav"

    subprocess.run(
        [
            FFMPEG_PATH,
            "-y",
            "-i",
            str(path),
            "-ac",
            "1",
            "-ar",
            "16000",
            str(output)
        ],
        check=True
    )

    print("Converted:", output)

    return str(output)

