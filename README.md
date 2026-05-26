# NephroAI — Clinical CKD Prediction System

<div align="center">

![NephroAI Banner](https://img.shields.io/badge/NephroAI-Clinical%20AI%20Platform-06B6D4?style=for-the-badge&logo=flask&logoColor=white)
&nbsp;
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
&nbsp;
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-EC4E20?style=for-the-badge&logo=xgboost&logoColor=white)
&nbsp;
![Flask](https://img.shields.io/badge/Flask-2.3-000000?style=for-the-badge&logo=flask&logoColor=white)
&nbsp;
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A production-grade clinical decision support system for early Chronic Kidney Disease (CKD) detection using XGBoost and SHAP explainability.**

[Live Demo](https://nephroai.netlify.app) · [Research Report](https://github.com/kaushik-parida/nephroai/blob/main/docs/report.pdf) · [API Reference](#api-reference)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [ML Pipeline](#ml-pipeline)
- [Model Performance](#model-performance)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Dataset](#dataset)
- [Team](#team)
- [License](#license)

---

## Overview

NephroAI is a full-stack clinical AI platform that predicts Chronic Kidney Disease (CKD) risk from 24 biochemical and clinical biomarkers. The platform is built as part of a Final Year Research Project at SOA University (2025) and addresses the critical clinical challenge of **early, asymptomatic CKD detection**.

The system trains and benchmarks 8 machine learning classifiers across 3 feature representations (Raw, PCA, LDA), selects the best-performing model (XGBoost), and deploys it with SHAP-based per-patient explainability through an interactive clinical web dashboard.

> **Disclaimer**: NephroAI is a research prototype. It is not a certified medical device and should not be used as a sole basis for clinical decisions.

---

## Key Features

- **96.50% Test Accuracy** — XGBoost on raw 24 clinical features
- **0.9913 AUC-ROC** — Excellent discrimination between CKD and healthy patients
- **SHAP Explainability** — Individual biomarker impact breakdown for every prediction
- **Dual-View Interface** — Clinical Portal (light) and Research Hub (dark) tabs
- **Patient History** — localStorage-based prediction history with reload functionality
- **OCR Lab Report Upload** — Tesseract.js auto-extracts values from uploaded lab reports
- **Zero Data Leakage** — Strict train-first, split-first preprocessing pipeline

---

## ML Pipeline

```
Raw Dataset (2,000 patients, 24 features)
        │
        ▼
Data Cleaning → Missing Value Imputation (Median/Mode)
        │
        ▼
Stratified 80:20 Train-Test Split  ← No leakage
        │
        ▼
SMOTE Balancing (Train only: 1,000 CKD → 1,000 Not-CKD)
        │
        ├──→ Raw Features (24)
        ├──→ PCA (19 components, 95% variance)
        └──→ LDA (1 dimension)
                │
                ▼
    8 Classifiers × 3 Feature Sets = 24 Experiments
    (10-Fold Stratified Cross-Validation)
                │
                ▼
    XGBoost (Raw) — Best performer → GridSearchCV tuning
                │
                ▼
    SHAP TreeExplainer → NephroAI Web App
```

---

## Model Performance

All models evaluated on 400 unseen test patients (80:20 split).

| Model               | CV Accuracy | Test Accuracy | AUC-ROC | F1-Score |
|---------------------|:-----------:|:-------------:|:-------:|:--------:|
| Logistic Regression | 98.10%      | 96.75%        | 0.9969  | 0.9739   |
| Decision Tree       | 94.75%      | 91.25%        | 0.9313  | 0.9301   |
| Random Forest       | 96.60%      | 95.00%        | 0.9866  | 0.9603   |
| **XGBoost** ⭐     | **97.60%**  | **96.50%**    | **0.9913** | **0.9722** |
| Gradient Boosting   | 97.35%      | 96.00%        | 0.9909  | 0.9681   |
| SVM (RBF)           | 97.90%      | 96.50%        | 0.9942  | 0.9721   |
| KNN                 | 95.35%      | 91.75%        | 0.9765  | 0.9333   |
| Naïve Bayes         | 91.80%      | 88.25%        | 0.9591  | 0.9105   |

> CV scores use **10-Fold Stratified Cross-Validation** applied to the SMOTE-balanced training set.
> XGBoost was selected for deployment based on highest balanced F1, recall, and SHAP compatibility.

**Tuned XGBoost Hyperparameters** (via 5-Fold GridSearchCV):
```
learning_rate=0.1 | max_depth=4 | n_estimators=100
subsample=0.8 | colsample_bytree=0.8 | random_state=42
```

---

## Tech Stack

| Layer       | Technology                               |
|-------------|------------------------------------------|
| **ML**      | XGBoost, scikit-learn, SHAP, pandas, numpy |
| **Backend** | Python 3.10+, Flask 2.3, Flask-CORS, Gunicorn |
| **Frontend** | Vanilla HTML5, TailwindCSS (CDN), Chart.js, Three.js |
| **OCR**     | Tesseract.js (in-browser)               |
| **Hosting** | Netlify (frontend) + Render (backend)   |
| **Storage** | Browser localStorage (patient history) |

---

## Project Structure

```
NephroAI_App/
├── app.py                  # Flask REST API backend
├── requirements.txt        # Python dependencies
├── netlify.toml            # Netlify frontend deployment config
├── .gitignore
├── xgboost_ckd_model.pkl   # Trained XGBoost model (serialized)
├── scaler.pkl              # Fitted MinMaxScaler (serialized)
└── nephroai/               # Frontend static files
    ├── index.html          # Main SPA (2,100+ lines, Tailwind + Three.js)
    ├── app.js              # Frontend logic (SHAP charts, OCR, chatbot, history)
    ├── style.css           # Custom CSS (glassmorphism, animations, chatbot)
    └── kidney3d.png        # Anatomical kidney diagram
```

---

## Local Development

### Prerequisites

- Python 3.10+
- pip or pipenv

### 1. Clone the repository

```bash
git clone https://github.com/kaushik-parida/nephroai.git
cd nephroai
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the backend server

```bash
python app.py
# Server starts at http://127.0.0.1:5000
```

### 4. Open the frontend

Open your browser and navigate to:
```
http://127.0.0.1:5000
```

> The Flask server simultaneously serves the static frontend from the `nephroai/` folder.

---

## API Reference

All endpoints return JSON. CORS is enabled for all origins.

### `GET /api/status`
Returns the current server and model load status.

**Response:**
```json
{
  "status": "active",
  "models_loaded": true
}
```

---

### `GET /api/models-data`
Returns benchmark performance metrics for all 8 models.

**Response:**
```json
{
  "models": [
    { "name": "XGBoost", "cv_acc": 97.60, "test_acc": 96.50, "auc": 0.9913, "f1": 0.9722 },
    ...
  ]
}
```

---

### `POST /api/predict`
Runs a CKD risk prediction for a given patient's biomarkers.

**Request Body:**
```json
{
  "age": 68, "bp": 90, "sg": 1.010, "al": 4, "su": 3,
  "rbc": 0, "pc": 0, "pcc": 1, "ba": 1,
  "bgr": 200, "bu": 80, "sc": 7.2, "sod": 130, "pot": 5.5,
  "hemo": 8.5, "pcv": 24, "wc": 9800, "rc": 2.8,
  "htn": 1, "dm": 1, "cad": 1, "appet": 1, "pe": 1, "ane": 1
}
```

**Response:**
```json
{
  "probability": 0.9842,
  "prediction": 1,
  "shap_values": [
    { "feature": "hemo", "value": 0.412 },
    { "feature": "sc",   "value": 0.338 },
    ...
  ]
}
```

| Field         | Type    | Description                              |
|---------------|---------|------------------------------------------|
| `probability` | float   | CKD risk score (0.0 – 1.0)              |
| `prediction`  | int     | `1` = CKD, `0` = Healthy                |
| `shap_values` | array   | Top 10 features by absolute SHAP impact |

---

## Deployment

### Frontend → Netlify

The `netlify.toml` in the repo root automates the deployment configuration.

1. Push this repository to GitHub.
2. Log in to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
3. Select your repository and apply these settings:
   - **Publish directory**: `nephroai`
   - *(Auto-detected from `netlify.toml`)*
4. Click **Deploy site**. ✅

### Backend → Render

1. Log in to [render.com](https://render.com) → **New Web Service** → connect GitHub repo.
2. Apply these settings:
   - **Runtime**: Python 3
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `gunicorn app:app`
3. Click **Deploy**. Copy the live URL (e.g., `https://nephroai-api.onrender.com`).
4. Update the `API_BASE_URL` constant in `nephroai/app.js` with your Render URL.
5. Commit and push — Netlify auto-redeploys.

---

## Dataset

- **Source**: [UCI Machine Learning Repository — CKD Dataset](https://archive.ics.uci.edu/dataset/336/chronic+kidney+disease)
- **Records**: 2,000 patients
- **Features**: 24 clinical attributes (11 numerical, 13 categorical)
- **Classes**: CKD (1,250) / Not-CKD (750) — balanced via SMOTE

---

## Team

**Group 11 — Final Year Research Project, SOA University (2025)**

| Student              | Roll Number  | Contribution                                        |
|----------------------|:------------:|-----------------------------------------------------|
| Kaushik Parida       | 2241016196   | Lead ML Engineer, Full-Stack Dev, Documentation     |
| Madhumita Parida     | 2241016198   | Literature Survey, Problem Formulation              |
| Prakash Shaw         | 2241019425   | Experimentation, Result Analysis                    |
| Ankit Bisoyi         | 2241002190   | Result Validation, Documentation                   |
| Tatwaprakash Mishra  | 2241013193   | Result Validation, Documentation                   |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ at SOA University, Bhubaneswar · 2025</sub>
</div>
