import random
import pandas as pd
dictionary_word = random.randint(0, 1)
dataset = []

for i in range(1000):

    length = random.randint(4, 20)

    uppercase = random.randint(0, 1)

    lowercase = 1

    digits = random.randint(0, 5)

    special = random.randint(0, 3)

    score = 0

    # Length contributes
    if length >= 10:
        score += 2
    elif length >= 8:
        score += 1

    # Character types
    if uppercase:
        score += 1

    if digits >= 2:
        score += 1

    if special >= 1:
        score += 2

    if dictionary_word == 1:
        score -= 2

    # Add randomness (simulates real-world variation)
    score += random.choice([-1, 0, 0, 0, 1])

    # Final label
    strong = 1 if score >= 5 else 0

    dataset.append([
        length,
        uppercase,
        lowercase,
        digits,
        special,
        dictionary_word,
        strong
    ])
    dictionary_word = random.randint(0, 1)

df = pd.DataFrame(
    dataset,
    columns=[
    "length",
    "uppercase",
    "lowercase",
    "digits",
    "special",
    "dictionary_word",
    "strong"
]
)

df.to_csv("password_dataset.csv", index=False)

print(df.head())

print()

print("Dataset Generated Successfully")
