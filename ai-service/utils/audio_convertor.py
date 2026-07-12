import ffmpeg
from pathlib import Path

def convert_to_wav(input_file):
    input_path = Path(input_file)

    output_path = input_path.with_suffix(".wav")

    (
        ffmpeg
        .input(str(input_path))
        .output(
            str(output_path),
            ac=1,
            ar=16000
        )
        .overwrite_output()
        .run(quiet=True)
    )

    return str(output_path)