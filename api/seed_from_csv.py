import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

# --- 1. Setup Firebase ---
# Ensure serviceAccountKey.json is in your api/ folder
cred = credentials.Certificate("./api/serviceAccountKey.json")
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# --- 2. Read the CSV ---
# Ensure 'Stanford Cars Dataset Specs.csv' is in the same folder or update path
csv_path = "./api/Stanford Cars Dataset Specs.csv" 

try:
    # Try 'ISO-8859-1' (Latin-1) which handles Excel files better
    df = pd.read_csv(csv_path, encoding='ISO-8859-1')
    print(f"Loaded {len(df)} rows from CSV.")
except FileNotFoundError:
    print("Error: CSV file not found. Please verify the path.")
    exit(1)

# --- 3. Helper to Parse Make/Model/Year from "Car Model" string ---
def parse_car_name_string(full_name, body_type_hint):
    # Example: "Acura RL Sedan 2012"
    parts = full_name.split(" ")
    year = parts[-1]
    
    # Make Detection
    make = parts[0]
    if make in ["Aston", "Land", "Range", "AM", "Rolls-Royce"]: 
        make = " ".join(parts[:2])
        if len(parts) > 2 and parts[2] == "General": # Fix for "AM General Hummer"
             make = "AM General"
             model_start_idx = 3
        else:
             model_start_idx = 2
    else:
        model_start_idx = 1
        
    # Extract Model by removing Make, Year, and Body Type from the string
    # We use the body_type from CSV to help clean the model string
    model_parts = parts[model_start_idx:-1]
    model = " ".join(model_parts)
    
    # Clean up model string (remove body type if it appears in the name)
    # e.g. "RL Sedan" -> "RL" if body is "Sedan"
    if body_type_hint:
        # Simple removal of the body type word if it exists case-insensitive
        body_words = body_type_hint.split(" ")
        for bw in body_words:
            model = model.replace(bw, "").replace(bw.lower(), "").strip()
            
    return make, model, year

# --- 4. Main Upload Logic ---
batch = db.batch()
count = 0

print(f"Preparing to upload {len(df)} cars...")

for index, row in df.iterrows():
    class_name = row['Car Model']
    
    # --- FIX: Sanitize ID (Replace '/' with '_') ---
    safe_id = class_name.replace("/", "_") 
    
    # Extract data from CSV columns
    horsepower = str(row['Horsepower'])
    acceleration = str(row['Acceleration (0-60 mph)'])
    fuel_type = str(row['Fuel Type'])
    origin = str(row['Origin'])
    body_type = str(row['Body Type'])

    # Parse derived fields
    make, model, year = parse_car_name_string(class_name, body_type)

    # Create Document Structure
    car_doc = {
        "id": safe_id, # Use the safe ID here
        "original_name": class_name, # Keep the real name for display
        "name": f"{make} {model}",
        "make": make,
        "model": model,
        "year": year,
        "bodyType": body_type,
        "specs": {
            "horsepower": horsepower,
            "acceleration": acceleration,
            "fuelType": fuel_type,
            "origin": origin
        },
        # Search keywords for the frontend
        "search_keywords": [
            x.lower() for x in [make, model, year, body_type, origin] 
            if x and x != "nan"
        ]
    }

    # Add to Batch using the SAFE ID
    doc_ref = db.collection("cars").document(safe_id)
    batch.set(doc_ref, car_doc)
    count += 1

    # Commit every 400 docs
    if count % 400 == 0:
        batch.commit()
        batch = db.batch()
        print(f"Uploaded batch of {count}...")

# Commit remaining
batch.commit()
print(f"Success! {count} cars uploaded to Firestore from CSV.")