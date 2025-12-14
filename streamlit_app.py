import streamlit as st
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import numpy as np
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

# --- 1. CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "api", "cars_effnetv2b0_best.keras")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "api", "class_names.json")
FIREBASE_KEY_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")
LOGO_PATH = os.path.join(BASE_DIR, ".logo_otosearch.png")
IMG_SIZE = 224

# Page Config - Changed title to Otosearch
st.set_page_config(
    page_title="Otosearch",
    page_icon=".logo_otosearch.png",
    layout="centered"
)

# --- 2. FIREBASE SETUP ---
@st.cache_resource
def initialize_firebase():
    if not os.path.exists(FIREBASE_KEY_PATH):
        st.warning(f"⚠️ 'serviceAccountKey.json' not found. Specs will not be fetched from DB.")
        return None
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(FIREBASE_KEY_PATH)
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        st.error(f"❌ Error connecting to Firebase: {e}")
        return None

db = initialize_firebase()

# --- 3. LOAD MODEL & CLASS NAMES ---
@st.cache_resource
def load_model():
    if not os.path.exists(MODEL_PATH):
        st.error(f"❌ Model not found at: {MODEL_PATH}")
        return None
    try:
        model = keras.models.load_model(MODEL_PATH)
        return model
    except Exception as e:
        st.error(f"❌ Error loading model: {e}")
        return None

@st.cache_data
def load_class_names():
    if not os.path.exists(CLASS_NAMES_PATH):
        st.error(f"❌ Class names file not found at: {CLASS_NAMES_PATH}")
        return None
    with open(CLASS_NAMES_PATH, 'r') as f:
        return json.load(f)

model = load_model()
class_names = load_class_names()

# --- 4. HELPER FUNCTIONS ---
def prepare_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

def fetch_car_details(car_name_raw):
    db_id = car_name_raw.replace("_", " ").replace("/", "_").strip()
    
    car_data = {
        "year": "----",
        "make": "Car",
        "model": car_name_raw,
        "specs": {
            "horsepower": "N/A",
            "acceleration": "N/A",
            "fuelType": "N/A",
            "origin": "N/A"
        }
    }

    if db:
        try:
            doc_ref = db.collection("cars").document(db_id)
            doc = doc_ref.get()
            
            if doc.exists:
                data = doc.to_dict()
                car_data.update({
                    "year": data.get("year", "----"),
                    "make": data.get("make", "Car"),
                    "model": data.get("model", data.get("carName", car_name_raw)),
                    "specs": data.get("specs", car_data["specs"])
                })
                return car_data, True
        except Exception as e:
            print(f"DB Error: {e}")

    print(f"Car not found in DB: {db_id}. Using fallback.")
    parts = db_id.split(" ")
    fallback_year = "----"
    if len(parts) > 1 and parts[-1].isdigit():
        fallback_year = parts.pop()
    
    fallback_make = parts[0] if parts else "Car"
    fallback_model = " ".join(parts) if parts else car_name_raw

    car_data.update({
        "year": fallback_year,
        "make": fallback_make,
        "model": fallback_model
    })
    return car_data, False

# --- 5. MAIN UI ---

# Display Logo and New Title
col1, col2 = st.columns([1, 4])
with col1:
    if os.path.exists(LOGO_PATH):
        st.image(LOGO_PATH, width=224)
    else:
        st.write("🚗") # Fallback icon
with col2:
    # Use custom HTML for tighter spacing between logo and title
    st.markdown("""
        <h1 style='margin-bottom: 0px; padding-top: 10px;'>Otosearch</h1>
        <p style='margin-top: 0px; color: gray;'>AI-Powered Car Recognition</p>
    """, unsafe_allow_html=True)

st.write("---") # Horizontal line separator
st.write("Upload a car photo to identify its Make, Model, and Year.")

uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png", "webp"])

if uploaded_file is not None and model is not None and class_names is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_container_width=True)
    
    if st.button("🔍 Analyze Car", type="primary"):
        with st.spinner("Analyzing visual features..."):
            try:
                processed_image = prepare_image(image, target_size=(IMG_SIZE, IMG_SIZE))
                predictions = model.predict(processed_image)
                
                top_indices = predictions[0].argsort()[-3:][::-1]
                top_result_index = top_indices[0]
                raw_car_name = class_names[top_result_index]
                confidence = float(predictions[0][top_result_index] * 100)

                details, found_in_db = fetch_car_details(raw_car_name)

                st.success("Analysis Complete!")
                
                # Result Header
                c1, c2 = st.columns([2, 1])
                with c1:
                    st.header(f"{details['year']} {details['make']}")
                    st.subheader(details['model'])
                with c2:
                    st.metric(label="Confidence", value=f"{confidence:.2f}%")
                
                st.progress(int(confidence))

                # Specs Grid
                st.markdown("### Specifications")
                specs = details['specs']
                c1, c2, c3, c4 = st.columns(4)
                c1.metric("🐎 HP", specs.get('horsepower', 'N/A'))
                c2.metric("⏱️ 0-60", specs.get('acceleration', 'N/A'))
                c3.metric("⛽ Fuel", specs.get('fuelType', 'N/A'))
                c4.metric("🌍 Origin", specs.get('origin', 'N/A'))

                if found_in_db:
                    st.caption("✅ Verified specifications loaded from database.")
                else:
                    st.caption("⚠️ Specifications unavailable. Name parsed from AI prediction.")

                # Predictions Expander
                with st.expander("See Alternative Matches"):
                    for i in top_indices:
                        name = class_names[i]
                        score = predictions[0][i] * 100
                        st.write(f"**{name}**: {score:.2f}%")
                        
            except Exception as e:
                st.error(f"An error occurred: {e}")