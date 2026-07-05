COMMAND_SCORES = {

    "help":10,
    "help me":10,
    "save me":10,
    "emergency":10,
    "danger":8,
    "leave me":9,
    "don't touch me":10,
    "someone help":10,
    "stop":5,
    "please":2

}

def detect_keywords(text):

    score = 0

    matched = []

    text = text.lower()

    for command, value in COMMAND_SCORES.items():

        if command in text:

            matched.append(command)

            score += value

    return {

        "matched":matched,

        "score":score

    }