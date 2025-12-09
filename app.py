import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# --- 1. LOAD THE MODEL (.h5) ---
print("Loading Model...")
model = load_model("millet_leaf_model.h5")

# --- 2. LOAD THE LABELS (.pkl) ---
print("Loading Labels...")
with open("class_indices.pkl", "rb") as f:
    CLASS_NAMES = pickle.load(f) # Loads the dictionary {0: 'Blast', 1: 'Healthy', ...}

def prepare_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = image / 255.0  # Normalize
    return image

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    
    try:
        image = Image.open(io.BytesIO(file.read()))
        processed_image = prepare_image(image, target_size=(224, 224))
        
        prediction = model.predict(processed_image)
        
        # Get the index with highest confidence
        class_idx = np.argmax(prediction[0])
        confidence = float(np.max(prediction[0]))
        
        # Look up the name using the loaded Pickle dictionary
        result_label = CLASS_NAMES[class_idx]
        
        return jsonify({
            "prediction": result_label,
            "confidence": f"{confidence * 100:.2f}%"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)