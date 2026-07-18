COMMAND_SCORES = {
    "help":10,
    "help me":12,
    "save me":15,
    "please help":12,
    "someone help":12,
    "call police":15,
    "don't touch me":18,
    "leave me":15,
    "stop":8,
    "no":5,
    "please":3,
    "emergency":20,
    "danger":15,
    "scream":20
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