# 🚗 Otosearch - Auto Lens AI

<div align="center">
  <img src="logo_otosearch.png" alt="Otosearch Logo" width="200"/>
  
  ### AI-Powered Car Recognition System
  
  [![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
  [![Streamlit](https://img.shields.io/badge/Streamlit-1.0+-FF4B4B.svg)](https://streamlit.io/)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0+-FF6F00.svg)](https://www.tensorflow.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📋 Overview

**Otosearch** is an intelligent car recognition application that uses deep learning to identify vehicle makes, models, and years from uploaded images. Built with TensorFlow and Streamlit, it provides instant car identification with detailed specifications fetched from Firebase Firestore.

### ✨ Key Features

- 🎯 **AI-Powered Recognition**: Uses EfficientNetV2B0 model trained on car images
- 📊 **High Accuracy**: Provides confidence scores and alternative matches
- 🔥 **Firebase Integration**: Fetches real-time vehicle specifications from Firestore
- 🖼️ **Easy Upload**: Supports JPG, JPEG, PNG, and WEBP formats
- 📱 **Responsive UI**: Clean, modern interface built with Streamlit
- ⚡ **Fast Performance**:  Model warm-up for quick predictions

---

## 🛠️ Technology Stack

- **Frontend**: Streamlit
- **Deep Learning**: TensorFlow/Keras (EfficientNetV2B0)
- **Database**: Firebase Firestore
- **Image Processing**: PIL (Pillow), NumPy
- **Language**: Python 3.8+

---

## 📦 Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Firebase account (optional, for specifications)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nicksonleviel/auto-lens-ai.git
   cd auto-lens-ai
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements. txt
   ```

3. **Set up Firebase (Optional)**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Generate a service account key
   - Save it as `serviceAccountKey.json` in the root directory
   - Or configure it in Streamlit secrets

4. **Ensure model files are present**
   - `api/cars_effnetv2b0_best.keras` - Pre-trained model
   - `api/class_names.json` - Car class mappings

---

## 🚀 Usage

### Running Locally

```bash
streamlit run streamlit_app.py
```

The app will open in your default browser at `http://localhost:8501`

### Using the Application

1. **Upload an Image**:  Click "Choose an image..." and select a car photo
2. **Analyze**: Click the "🔍 Analyze Car" button
3. **View Results**: See the identified car with: 
   - Make, Model, and Year
   - Confidence percentage
   - Specifications (Horsepower, 0-60 time, Fuel type, Origin)
   - Alternative matches

---

## 📂 Project Structure

```
auto-lens-ai/
├── api/
│   ├── cars_effnetv2b0_best. keras    # Trained model
│   ├── class_names.json               # Car class labels
│   ├── Stanford Cars Dataset Specs.csv
│   └── seed_from_csv.py              # Database seeding script
├── streamlit_app. py                   # Main application
├── requirements.txt                   # Python dependencies
├── logo_otosearch.png                # Application logo
├── . gitignore
└── serviceAccountKey.json            # Firebase credentials (not tracked)
```

---

## 🔧 Configuration

### Firebase Setup

You can configure Firebase credentials in two ways:

**Method 1: Local File**
```
Place serviceAccountKey.json in the root directory
```

**Method 2: Streamlit Secrets**
```toml
# . streamlit/secrets.toml
[firebase]
type = "service_account"
project_id = "your-project-id"
private_key_id = "your-private-key-id"
private_key = "your-private-key"
client_email = "your-client-email"
client_id = "your-client-id"
auth_uri = "https://accounts.google.com/o/oauth2/auth"
token_uri = "https://oauth2.googleapis.com/token"
```

---

## 🤖 Model Information

- **Architecture**: EfficientNetV2B0
- **Input Size**: 224x224x3 RGB images
- **Training Dataset**: Based on Stanford Cars Dataset
- **Classes**: 196+ car models
- **Output**: Top 3 predictions with confidence scores

---

## 📊 Features Breakdown

### Car Recognition
- Upload any car image
- AI analyzes visual features
- Returns top 3 matches with confidence scores

### Specifications Display
- **Horsepower**: Engine power
- **0-60 Acceleration**: Time in seconds
- **Fuel Type**:  Gasoline/Diesel/Electric/Hybrid
- **Origin**: Country of manufacture

### Database Integration
- ✅ Verified specs from Firestore
- ⚠️ Fallback parsing from AI predictions

---

## 🎨 User Interface

The application features: 
- Clean, centered layout
- Logo and branding
- Image upload preview
- Progress bars for confidence
- Expandable alternative matches
- Responsive metrics grid

---

## 🔒 Privacy & Security

- Images are processed locally and not stored
- Firebase credentials should be kept secure
- Add `serviceAccountKey.json` to `.gitignore`

---

## 🐛 Troubleshooting

### Model Not Found
Ensure `api/cars_effnetv2b0_best.keras` exists in the api directory

### Firebase Errors
- Check credentials are valid
- Ensure Firestore database is created
- Verify collection name is "cars"

### Image Upload Issues
Supported formats: JPG, JPEG, PNG, WEBP

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Nicksonleviel**
- GitHub: [@Nicksonleviel](https://github.com/Nicksonleviel)

---

## 🙏 Acknowledgments

- Stanford Cars Dataset for training data
- TensorFlow team for EfficientNetV2
- Streamlit for the amazing framework
- Firebase for backend services

---

## 📞 Support

If you encounter any issues or have questions: 
- Open an [Issue](https://github.com/Nicksonleviel/auto-lens-ai/issues)
- Contact via GitHub

---

<div align="center">
  Made with ❤️ and AI
</div>
