import streamlit as st
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.naive_bayes import MultinomialNB

# Load Vectorizer
vectorizer = joblib.load("../src/models/trained_models/vectorizer.pkl")

# Available Models
model_options = {
    "Logistic Regression": "../src/models/trained_models/sentiment_LogisticRegression.pkl",
    "Random Forest": "../src/models/trained_models/sentiment_RandomForest.pkl",
    "XGBoost": "../src/models/trained_models/sentiment_XGBoost.pkl",
    "Naive Bayes": "../src/models/trained_models/sentiment_NaiveBayes.pkl",
    "Logistic Regression (SMOTE)": "../src/models/trained_models/sentiment_lr_smote.pkl",
    "XGBoost (Tuned)": "../src/models/trained_models/xgboost_tuned.pkl",
}

# App Config
st.set_page_config(page_title="Sentiment Analyzer", page_icon="🧠", layout="centered")

# Custom Styling
st.markdown("""
    <style>
    .main {background: #F9FAFC; padding: 20px; border-radius: 15px;}
    .title {font-size: 36px; font-weight: bold; color: #0066cc;}
    .subtitle {font-size: 16px; color: #333333;}
    .footer {text-align: center; font-size: 13px; color: #888;}
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown('<div class="main"><div class="title">🧠 Customer Sentiment Analyzer</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">🔍 Real-time prediction using ML models trained on customer reviews</div><br>', unsafe_allow_html=True)

# Input
review_text = st.text_area("📝 Enter a customer review:", height=150)

# Model Selection
selected_model = st.selectbox("📊 Choose a model:", list(model_options.keys()))

# Predict Button
if st.button("🚀 Analyze"):
    if review_text.strip() == "":
        st.warning("⚠️ Please enter a review first!")
    else:
        # Load Model
        model_path = model_options[selected_model]
        model = joblib.load(model_path)

        # Vectorize & Predict
        X_input = vectorizer.transform([review_text])
        prediction = model.predict(X_input)[0]

        sentiment_map = {0: "Negative 😠", 1: "Neutral 😐", 2: "Positive 😊"}
        reverse_map = {"Logistic Regression": [0, 1, 2], "XGBoost": [0, 1, 2]}

        # Display Result
        st.markdown("### ✅ Sentiment Prediction:")
        if prediction == 2:
            st.success(f"Positive Sentiment Detected! 😊")
        elif prediction == 1:
            st.info(f"Neutral Sentiment Detected 😐")
        else:
            st.error(f"Negative Sentiment Detected 😠")

# Footer
st.markdown('<br><div class="footer">Made with ❤️ using Streamlit | Hackathon Project 2025</div>', unsafe_allow_html=True)
