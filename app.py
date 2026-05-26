import os, warnings
import joblib, pandas as pd, numpy as np, shap
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__, static_folder='nephroai')
CORS(app)

FEATURE_NAMES = [
    'age','bp','sg','al','su','rbc','pc','pcc','ba',
    'bgr','bu','sc','sod','pot','hemo','pcv','wc','rc',
    'htn','dm','cad','appet','pe','ane'
]

model = scaler = explainer = None

def load_resources():
    global model, scaler, explainer
    try:
        model    = joblib.load("xgboost_ckd_model.pkl")
        scaler   = joblib.load("scaler.pkl")
        explainer = shap.TreeExplainer(model)
        print("[OK] Models loaded.")
    except Exception as e:
        print(f"[ERROR] {e}")

load_resources()

@app.route('/')
def index():
    return send_from_directory('nephroai', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('nephroai', path)

@app.route('/api/status')
def status():
    return jsonify({"status": "active", "models_loaded": model is not None})

@app.route('/api/models-data')
def models_data():
    return jsonify({
        'models': [
            {'name': 'Logistic Regression', 'cv_acc': 98.10, 'test_acc': 96.75, 'auc': 0.9969, 'f1': 0.9739},
            {'name': 'Decision Tree',       'cv_acc': 94.75, 'test_acc': 91.25, 'auc': 0.9313, 'f1': 0.9301},
            {'name': 'Random Forest',       'cv_acc': 96.60, 'test_acc': 95.00, 'auc': 0.9866, 'f1': 0.9603},
            {'name': 'XGBoost',             'cv_acc': 97.60, 'test_acc': 96.50, 'auc': 0.9913, 'f1': 0.9722},
            {'name': 'Gradient Boosting',   'cv_acc': 97.35, 'test_acc': 96.00, 'auc': 0.9909, 'f1': 0.9681},
            {'name': 'SVM (RBF)',           'cv_acc': 97.90, 'test_acc': 96.50, 'auc': 0.9942, 'f1': 0.9721},
            {'name': 'KNN',                 'cv_acc': 95.35, 'test_acc': 91.75, 'auc': 0.9765, 'f1': 0.9333},
            {'name': 'Naive Bayes',         'cv_acc': 91.80, 'test_acc': 88.25, 'auc': 0.9591, 'f1': 0.9105},
        ]
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Models not loaded."}), 500
    try:
        data   = request.json
        row    = [float(data.get(f, 0.0)) for f in FEATURE_NAMES]
        df     = pd.DataFrame([row], columns=FEATURE_NAMES)
        scaled = scaler.transform(df)
        prob   = float(model.predict_proba(scaled)[0][1])
        pred   = int(model.predict(scaled)[0])
        sv     = explainer.shap_values(scaled)[0]
        shap_out = sorted(
            [{"feature": FEATURE_NAMES[i], "value": float(sv[i])} for i in range(24)],
            key=lambda x: abs(x["value"]), reverse=True
        )[:10]
        return jsonify({"probability": prob, "prediction": pred, "shap_values": shap_out})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"[START] NephroAI running at http://0.0.0.0:{port}")
    app.run(debug=False, host='0.0.0.0', port=port)
