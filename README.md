# NephroAI

<div align="center">

![NephroAI](https://img.shields.io/badge/NephroAI-CKD%20Prediction-06B6D4?style=for-the-badge&logo=flask&logoColor=white)
&nbsp;
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
&nbsp;
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-EC4E20?style=for-the-badge&logo=xgboost&logoColor=white)
&nbsp;
![Flask](https://img.shields.io/badge/Flask-2.3-000000?style=for-the-badge&logo=flask&logoColor=white)
&nbsp;
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[Live Demo](https://nephroai.netlify.app) · [Notebook](notebooks/CKD_Prediction_Final_Year_Project.ipynb) · [API Reference](#api-reference)

</div>

---

This is our Final Year Research Project at SOA University (2025). The idea was to build something actually useful — a tool that can flag Chronic Kidney Disease early, when most patients have no symptoms yet.

The project notebook is at [`notebooks/CKD_Prediction_Final_Year_Project.ipynb`](notebooks/CKD_Prediction_Final_Year_Project.ipynb) — it has all the data cleaning, model training, SHAP analysis, and the code that generated the `.pkl` model files.

We trained and compared 8 different ML models on the UCI CKD dataset (400 patients, 24 features), and the final system uses XGBoost with SHAP explainability so you can see *why* it made a particular prediction, not just what it predicted. There's also a web interface where you can enter lab values and get an instant risk assessment.

> **Note**: This is a research prototype, not a certified medical tool. Don't use it as the sole basis for any clinical decision.

---

## Table of Contents

- [What it does](#what-it-does)
- [How the ML pipeline works](#how-the-ml-pipeline-works)
- [Model results](#model-results)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Running it locally](#running-it-locally)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Dataset](#dataset)
- [Team](#team)
- [License](#license)

---

## What it does

- Takes 24 clinical biomarkers as input (blood urea, creatinine, hemoglobin, etc.)
- Predicts CKD risk with 96.50% accuracy and a 0.9913 AUC-ROC score
- Explains the prediction using SHAP — shows which values pushed the result up or down
- Lets you upload a lab report PDF and auto-extract values via OCR (Tesseract.js)
- Saves a history of past predictions in your browser locally

---

## How the ML pipeline works

```
Dataset: 2,000 records, 24 features (UCI CKD)
        │
        ▼
Fix dirty strings in categorical columns (tabs, leading spaces)
        │
        ▼
Impute missing values (median for numerical, mode for categorical)
No rows dropped — all 2,000 records used
        │
        ▼
Stratified 80:20 split → 1,600 train / 400 test  ← split first, always
        │
        ▼
SMOTE on training set only (balances CKD vs Not-CKD class ratio)
        │
        ├── Raw 24 features
        ├── PCA → 19 components (95% variance retained)
        └── LDA → 1 component
                │
                ▼
        8 models × 3 feature sets = 24 experiments
        (10-fold stratified cross-validation throughout)
                │
                ▼
        XGBoost on raw features won → fine-tuned with 5-fold GridSearchCV
                │
                ▼
        Deployed with SHAP TreeExplainer
```

---

## Model results

Evaluated on 400 held-out test patients (the 20% split, never seen during training or SMOTE).

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

We went with XGBoost over SVM (which had the same test accuracy) because SHAP has native, fast support for tree-based models, which made the explainability side much cleaner.

**Final XGBoost hyperparameters** (tuned via 5-fold GridSearchCV):
```
learning_rate=0.1  |  max_depth=4  |  n_estimators=100
subsample=0.8      |  colsample_bytree=0.8  |  random_state=42
```

---

## Tech stack

| Layer       | Tools |
|-------------|-------|
| ML          | XGBoost, scikit-learn, SHAP, pandas, numpy |
| Backend     | Python 3.10+, Flask, Flask-CORS, Gunicorn |
| Frontend    | HTML5, TailwindCSS (CDN), Chart.js, Three.js |
| OCR         | Tesseract.js (runs entirely in the browser) |
| Hosting     | Netlify (frontend) + Render (backend) |

---

## Project structure

```
NephroAI_App/
├── app.py                    # Flask API — prediction, model data, static serving
├── requirements.txt
├── netlify.toml              # Netlify deploy config
├── xgboost_ckd_model.pkl     # Trained XGBoost model
├── scaler.pkl                # Fitted MinMaxScaler
├── data/
│   └── kidney_disease.csv    # Full 2,000-record UCI CKD dataset
├── notebooks/
│   └── CKD_Prediction_Final_Year_Project.ipynb
└── nephroai/
    ├── index.html
    ├── app.js
    ├── style.css
    └── kidney3d.png
```

---

## Running it locally

You need Python 3.10+ installed.

```bash
git clone https://github.com/kaushik-parida/nephroai.git
cd nephroai
pip install -r requirements.txt
python app.py
```

Then open `http://127.0.0.1:5000` in your browser. Flask serves both the API and the frontend from the same server.

---

## API reference

### `GET /api/status`

Quick check to confirm the server is up and the model is loaded.

```json
{ "status": "active", "models_loaded": true }
```

---

### `GET /api/models-data`

Returns the benchmark results for all 8 models (used by the Research section charts).

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

Send a patient's 24 biomarker values and get back a risk score with SHAP explanations.

**Request body:**
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
    { "feature": "sc",   "value": 0.338 }
  ]
}
```

`prediction` is `1` for CKD and `0` for healthy. `shap_values` contains the top 10 features ranked by impact magnitude.

---

## Deployment

### Frontend → Netlify

1. Push the repo to GitHub.
2. On [netlify.com](https://netlify.com), go to **Add new site → Import from Git** and select this repo.
3. Netlify will auto-read the `netlify.toml` and set the publish directory to `nephroai`.
4. Hit **Deploy**.

### Backend → Render

1. On [render.com](https://render.com), create a **New Web Service** and connect this GitHub repo.
2. Set the build command to `pip install -r requirements.txt` and start command to `gunicorn app:app`.
3. After it deploys, copy the URL (looks like `https://nephroai-api.onrender.com`).
4. Paste it into the `API_BASE_URL` variable at the top of `nephroai/app.js`, commit, and push. Netlify will redeploy automatically.

---

## Dataset

UCI Machine Learning Repository — [Chronic Kidney Disease dataset](https://archive.ics.uci.edu/dataset/336/chronic+kidney+disease)

- 2,000 patient records; missing values filled via median/mode imputation (no rows dropped)
- 24 features (11 numerical, 13 categorical)
- 80:20 stratified split → 1,600 train / 400 test
- Class imbalance in the training set handled with SMOTE

---

## Team

Group 11 — B.Tech Final Year, SOA University (2025)

| Student              | Roll No.     | Contribution                              |
|----------------------|:------------:|-------------------------------------------|
| Kaushik Parida       | 2241016196   | ML experiments, web app, documentation    |
| Madhumita Parida     | 2241016198   | Literature survey, problem formulation    |
| Prakash Shaw         | 2241019425   | Experimentation, result analysis          |
| Ankit Bisoyi         | 2241002190   | Result validation, documentation          |
| Tatwaprakash Mishra  | 2241013193   | Result validation, documentation          |

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
  <sub>SOA University, Bhubaneswar · 2026</sub>
</div>
