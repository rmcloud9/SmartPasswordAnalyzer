import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# -------------------------------
# Load Dataset
# -------------------------------

data = pd.read_csv("password_dataset.csv")

print("Dataset Loaded Successfully")
print()

# -------------------------------
# Features
# -------------------------------

X = data[
    [
        "length",
        "uppercase",
        "lowercase",
        "digits",
        "special",
        "dictionary_word"
    ]
]

# -------------------------------
# Label
# -------------------------------

y = data["strong"]

# -------------------------------
# Train-Test Split
# -------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# -------------------------------
# Train Model
# -------------------------------

models = {

    "Decision Tree": DecisionTreeClassifier(),

    "Random Forest": RandomForestClassifier(
        n_estimators=100,
        random_state=42
    ),

    "Logistic Regression": LogisticRegression(
        max_iter=1000
    )

}

best_model = None

best_accuracy = 0

for model_name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print(f"{model_name:25} Accuracy : {accuracy*100:.2f}%")

    if accuracy > best_accuracy:

        best_accuracy = accuracy

        best_model = model

joblib.dump(best_model, "password_model.pkl")

print()

print("Best Model Saved Successfully")