import os
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
from tensorflow import keras

app = Flask(__name__)
CORS(app)

# --- 1. CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "cars_effnetv2b0_best.keras")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "class_names.json")
IMG_SIZE = 224

# --- 2. LOAD MODEL ---
if not os.path.exists(MODEL_PATH):
    print(f"CRITICAL ERROR: Model not found at {MODEL_PATH}")
    exit(1)

print("Loading model...")
try:
    model = keras.models.load_model(MODEL_PATH)
    print("Model loaded.")
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

with open(CLASS_NAMES_PATH, 'r') as f:
    class_names = json.load(f)

# --- 3. PREPROCESSING ---
def prepare_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

# --- 4. ROUTES ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    try:
        # Load image directly to PIL
        image = Image.open(file.stream)
        
        # Predict
        processed_image = prepare_image(image, target_size=(IMG_SIZE, IMG_SIZE))
        predictions = model.predict(processed_image)
        
        # Get Results
        top_indices = predictions[0].argsort()[-3:][::-1]
        top_predictions = []
        for i in top_indices:
            top_predictions.append({
                "name": class_names[i],
                "confidence": float(round(predictions[0][i] * 100, 2))
            })

        best_result = top_predictions[0]

        return jsonify({
            "carName": best_result['name'],
            "confidence": best_result['confidence'],
            "topPredictions": top_predictions
        })

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')