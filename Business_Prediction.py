import streamlit as st
import numpy as np
import joblib

st.set_page_config(page_title="Business Prediction", page_icon="📈", layout="wide")

def load_css():
    with open("assets/style.css", "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css()

st.title("📈 Business Price Prediction")
st.write("Predict property price using the business-oriented model.")

col1, col2 = st.columns(2)

with col1:
    bedrooms = st.number_input("Bedrooms", min_value=0, value=2)
    bathrooms = st.number_input("Bathrooms", min_value=0, value=1)
    living_rooms = st.number_input("Living Rooms", min_value=0, value=1)
    area = st.number_input("Floor Area (sqm)", min_value=10, value=80)

with col2:
    latitude = st.number_input("Latitude", value=51.50, format="%.6f")
    longitude = st.number_input("Longitude", value=-0.12, format="%.6f")
    confidence = st.selectbox("Confidence Level", ["LOW", "MEDIUM", "HIGH"])

confidence_map = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}

if st.button("Predict Price"):
    predicted_price = 650000  # مؤقتًا لحد ما نربط الموديل الحقيقي
    st.markdown(f"""
    <div class='card'>
        <h3>💷 Predicted Price</h3>
        <p style='font-size:28px;font-weight:bold;'>£{predicted_price:,.0f}</p>
    </div>
    """, unsafe_allow_html=True)