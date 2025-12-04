import os
import json
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
from tensorflow import keras
import cv2 

app = Flask(__name__)
CORS(app)

# --- 1. CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "cars_effnetv2b0_best.keras")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "class_names.json")
TEMP_IMAGE_PATH = os.path.join(BASE_DIR, "temp_img.jpg")
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

# --- 3. GRAD-CAM FUNCTIONS ---

def get_target_layer_name(model):
    """
    Specifically looks for the EfficientNet backbone layer.
    """
    for layer in model.layers:
        # Check for the backbone layer by common naming conventions
        # EfficientNet usually names the layer 'efficientnetv2-b0' or similar
        if "efficientnet" in layer.name.lower() or "resnet" in layer.name.lower():
            print(f"Grad-CAM: Found backbone layer '{layer.name}'")
            return layer.name
            
        # Fallback: Check for any 4D output (feature map)
        try:
            if len(layer.output_shape) == 4 and "conv" in layer.name:
                return layer.name
        except:
            continue
            
    return None

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    # 1. Create a sub-model that outputs:
    #    [Target Layer Output, Final Prediction]
    grad_model = keras.models.Model(
        inputs=model.inputs,
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )

    # 2. Record operations for Gradient
    with tf.GradientTape() as tape:
        # Cast input to float32 to ensure compatibility
        img_array = tf.cast(img_array, tf.float32)
        
        # Watch the input variables
        tape.watch(img_array)
        
        # Forward pass
        last_conv_layer_output, preds = grad_model(img_array)
        
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    # 3. Calculate Gradients
    grads = tape.gradient(class_channel, last_conv_layer_output)

    # 4. Global Average Pooling of Gradients
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # 5. Multiply feature map by importance
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # 6. Normalize
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def generate_heatmap_overlay(img_path, heatmap):
    # Load original image
    img = cv2.imread(img_path)
    if img is None: return None
    
    # Resize heatmap to match image dimensions
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))

    # Convert to RGB heatmap
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Superimpose
    superimposed_img = heatmap * 0.4 + img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype('uint8')
    
    # Encode
    _, buffer = cv2.imencode('.jpg', superimposed_img)
    return base64.b64encode(buffer).decode('utf-8')

# --- 4. PREPROCESSING ---
def prepare_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

# --- 5. ROUTES ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    try:
        # Save temp file for OpenCV
        image = Image.open(file.stream)
        image.save(TEMP_IMAGE_PATH)
        
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

        # --- GENERATE GRAD-CAM ---
        heatmap_base64 = None
        try:
            target_layer = get_target_layer_name(model)
            if target_layer:
                heatmap = make_gradcam_heatmap(processed_image, model, target_layer)
                heatmap_base64 = generate_heatmap_overlay(TEMP_IMAGE_PATH, heatmap)
                if heatmap_base64:
                    heatmap_base64 = f"data:image/jpeg;base64,{heatmap_base64}"
        except Exception as e:
            print(f"Grad-CAM Warning: {e}")
            # Do not crash the whole request if heatmap fails
            heatmap_base64 = None

        # Clean up
        if os.path.exists(TEMP_IMAGE_PATH):
            os.remove(TEMP_IMAGE_PATH)

        return jsonify({
            "carName": best_result['name'],
            "confidence": best_result['confidence'],
            "topPredictions": top_predictions,
            "heatmapImage": heatmap_base64
        })

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')