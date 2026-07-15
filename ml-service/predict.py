import joblib
import re
import sys
import json
# -------------------------------
# Load Trained Model
# -------------------------------

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "password_model.pkl")

model = joblib.load(MODEL_PATH)

# -------------------------------
# Input Password
# -------------------------------

password = sys.argv[1]

# -------------------------------
# Feature Extraction
# -------------------------------

length = len(password)

uppercase = 1 if any(c.isupper() for c in password) else 0

lowercase = 1 if any(c.islower() for c in password) else 0

digits = sum(c.isdigit() for c in password)

special = len(re.findall(r'[^A-Za-z0-9]', password))

# Very simple dictionary check
dictionary_words = [
    "password",
    "welcome",
    "admin",
    "india",
    "hello",
    "qwerty"
]

dictionary_word = 0

for word in dictionary_words:

    if word.lower() in password.lower():

        dictionary_word = 1

        break

# -------------------------------
# Prediction
# -------------------------------

import pandas as pd

sample = pd.DataFrame(
    [[
        length,
        uppercase,
        lowercase,
        digits,
        special,
        dictionary_word
    ]],
    columns=[
        "length",
        "uppercase",
        "lowercase",
        "digits",
        "special",
        "dictionary_word"
    ]
)

prediction = model.predict(sample)

probability = model.predict_proba(sample)



result = {

    "prediction": "Strong" if prediction[0] == 1 else "Weak",

    "confidence": round(max(probability[0]) * 100, 2),

    "features": {

        "length": length,

        "uppercase": uppercase,

        "lowercase": lowercase,

        "digits": digits,

        "special": special,

        "dictionary_word": dictionary_word

    }

}

print(json.dumps(result))