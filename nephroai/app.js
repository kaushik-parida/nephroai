'use strict';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5000'
  : 'https://nephroai-api.onrender.com';

// ─── FEATURES DEFINITION ────────────────────────
const FEATURES = [
  { id:'age',  label:'Age (years)', type:'num', default:48,    section:'num' },
  { id:'bp',   label:'Blood Pressure (mm Hg)', type:'num', default:80, section:'num' },
  { id:'bgr',  label:'Blood Glucose Random', type:'num', default:121, section:'num' },
  { id:'bu',   label:'Blood Urea', type:'num', default:36,   section:'num' },
  { id:'sc',   label:'Serum Creatinine', type:'num', default:1.2,  section:'num' },
  { id:'sod',  label:'Sodium (mEq/L)', type:'num', default:138,  section:'num' },
  { id:'pot',  label:'Potassium (mEq/L)', type:'num', default:4.4,  section:'num' },
  { id:'hemo', label:'Hemoglobin (g/dL)', type:'num', default:15.4, section:'num' },
  { id:'pcv',  label:'Packed Cell Vol. (%)', type:'num', default:44,   section:'num' },
  { id:'wc',   label:'WBC Count (cells/µL)', type:'num', default:7800, section:'num' },
  { id:'rc',   label:'RBC Count (millions/µL)', type:'num', default:5.2,  section:'num' },
  { id:'al',   label:'Albumin (0-5)', type:'num', default:0,    section:'num' },
  { id:'su',   label:'Sugar (0-5)', type:'num', default:0,    section:'num' },
  { id:'sg',   label:'Specific Gravity', type:'num', default:1.020, section:'num' },
  { id:'rbc',   label:'Red Blood Cells', type:'cat', opts:[{v:1,l:'Normal'},{v:0,l:'Abnormal'}], default:1, section:'cat' },
  { id:'pc',    label:'Pus Cell', type:'cat', opts:[{v:1,l:'Normal'},{v:0,l:'Abnormal'}], default:1, section:'cat' },
  { id:'pcc',   label:'Pus Cell Clumps', type:'cat', opts:[{v:0,l:'Not Present'},{v:1,l:'Present'}], default:0, section:'cat' },
  { id:'ba',    label:'Bacteria', type:'cat', opts:[{v:0,l:'Not Present'},{v:1,l:'Present'}], default:0, section:'cat' },
  { id:'htn',   label:'Hypertension', type:'cat', opts:[{v:0,l:'No'},{v:1,l:'Yes'}], default:0, section:'cat' },
  { id:'dm',    label:'Diabetes Mellitus', type:'cat', opts:[{v:0,l:'No'},{v:1,l:'Yes'}], default:0, section:'cat' },
  { id:'cad',   label:'Coronary Artery Disease', type:'cat', opts:[{v:0,l:'No'},{v:1,l:'Yes'}], default:0, section:'cat' },
  { id:'appet', label:'Appetite', type:'cat', opts:[{v:0,l:'Good'},{v:1,l:'Poor'}], default:0, section:'cat' },
  { id:'pe',    label:'Pedal Edema', type:'cat', opts:[{v:0,l:'No'},{v:1,l:'Yes'}], default:0, section:'cat' },
  { id:'ane',   label:'Anemia', type:'cat', opts:[{v:0,l:'No'},{v:1,l:'Yes'}], default:0, section:'cat' },
];

function generateForm() {
  const numGrid = document.getElementById('form-num-grid');
  const catGrid = document.getElementById('form-cat-grid');
  if (!numGrid || !catGrid) return;

  const createInputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-accent focus:ring focus:ring-cyan-200 focus:ring-opacity-50 text-sm py-2 px-3 border bg-white text-medical-primary";
  const createLabelClass = "block text-xs font-semibold text-medical-secondary";

  FEATURES.forEach(f => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.className = createLabelClass;
    label.htmlFor = f.id;
    label.textContent = f.label;
    wrapper.appendChild(label);

    if (f.type === 'num') {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.id = f.id;
      input.value = f.default;
      input.required = true;
      input.className = createInputClass;
      wrapper.appendChild(input);
      numGrid.appendChild(wrapper);
    } else {
      const select = document.createElement('select');
      select.id = f.id;
      select.className = createInputClass;
      f.opts.forEach(o => {
        const option = document.createElement('option');
        option.value = o.v;
        option.textContent = o.l;
        if (o.v === f.default) option.selected = true;
        select.appendChild(option);
      });
      wrapper.appendChild(select);
      catGrid.appendChild(wrapper);
    }
  });
}

// ─── 1. NAVBAR SCROLL EFFECT ────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
});

// ─── 2. THREE.JS PARTICLE BACKGROUND (RESEARCH SECTION) ────────────────────
function initResearchParticles() {
  const canvas = document.getElementById('research-particles-canvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(parent.clientWidth, parent.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, parent.clientWidth / parent.clientHeight, 0.1, 100);
  camera.position.z = 20;

  const particleCount = 200;
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    });
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x06B6D4,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geom, mat);
  scene.add(particles);

  // Mouse Parallax effect
  let mouseX = 0, mouseY = 0;
  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / parent.clientWidth - 0.5) * 4;
    mouseY = -((e.clientY - rect.top) / parent.clientHeight - 0.5) * 4;
  });

  function animate() {
    requestAnimationFrame(animate);

    const pos = geom.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Wrap around boundaries
      if (Math.abs(pos[i * 3]) > 20) pos[i * 3] = -pos[i * 3];
      if (Math.abs(pos[i * 3 + 1]) > 13) pos[i * 3 + 1] = -pos[i * 3 + 1];
      if (Math.abs(pos[i * 3 + 2]) > 10) pos[i * 3 + 2] = -pos[i * 3 + 2];
    }
    geom.attributes.position.needsUpdate = true;

    // Smooth movement towards mouse parallax
    particles.rotation.y += (mouseX * 0.01 - particles.rotation.y) * 0.05;
    particles.rotation.x += (mouseY * 0.01 - particles.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!parent) return;
    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parent.clientWidth, parent.clientHeight);
  });
}

// ─── 4. ANIMATED COMPARISON CHART (CHART.JS) ────────────────────
let comparisonChartInstance = null;
function initComparisonChart() {
  const ctx = document.getElementById('comparisonChart');
  if (!ctx) return;

  const MODEL_DATA = {
    labels: ['Logistic Reg.', 'Decision Tree', 'Random Forest', 'XGBoost', 'Grad. Boost', 'SVM (RBF)', 'KNN', 'Naive Bayes'],
    accuracy: [96.75, 91.25, 95.00, 96.50, 96.00, 96.50, 91.75, 88.25],
    auc:      [99.69, 93.13, 98.66, 99.13, 99.09, 99.42, 97.65, 95.91], // values normalized to 100-scale
    f1:       [97.39, 93.01, 96.03, 97.22, 96.81, 97.21, 93.33, 91.05]
  };

  comparisonChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MODEL_DATA.labels,
      datasets: [
        {
          label: 'Test Accuracy (%)',
          data: MODEL_DATA.accuracy,
          backgroundColor: MODEL_DATA.labels.map(l => l === 'XGBoost' ? '#06B6D4' : 'rgba(71, 85, 105, 0.4)'),
          borderColor: MODEL_DATA.labels.map(l => l === 'XGBoost' ? '#06B6D4' : 'rgba(71, 85, 105, 0.6)'),
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'AUC-ROC Score (×100)',
          data: MODEL_DATA.auc,
          backgroundColor: MODEL_DATA.labels.map(l => l === 'XGBoost' ? '#3B82F6' : 'rgba(59, 130, 246, 0.2)'),
          borderColor: MODEL_DATA.labels.map(l => l === 'XGBoost' ? '#3B82F6' : 'rgba(59, 130, 246, 0.4)'),
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'F1 Score (%)',
          data: MODEL_DATA.f1,
          backgroundColor: MODEL_DATA.labels.map(l => l === 'XGBoost' ? '#10B981' : 'rgba(16, 185, 129, 0.2)'),
          borderColor: MODEL_DATA.labels.map(l => l === 'XGBoost' ? '#10B981' : 'rgba(16, 185, 129, 0.4)'),
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#F0F4F8', font: { family: 'Inter', size: 11 } }
        },
        tooltip: {
          backgroundColor: '#0F172A',
          titleColor: '#06B6D4',
          bodyColor: '#F0F4F8',
          borderColor: 'rgba(0, 212, 212, 0.2)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#8899AA', font: { family: 'Inter', size: 10 } }
        },
        y: {
          min: 80,
          max: 102,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#8899AA', font: { family: 'Inter', size: 10 } }
        }
      }
    }
  });
}

// ─── 5. PRESETS ENGINE ────────────────────
const PRESETS = {
  healthy: {
    age: 35, bp: 70, sg: 1.025, al: 0, su: 0, bgr: 90, bu: 20, sc: 0.8,
    sod: 140, pot: 4.0, hemo: 15.5, pcv: 46, wc: 8000, rc: 5.4,
    rbc: 1, pc: 1, pcc: 0, ba: 0, htn: 0, dm: 0, cad: 0, appet: 0, pe: 0, ane: 0
  },
  ckd: {
    age: 68, bp: 90, sg: 1.010, al: 4, su: 3, bgr: 200, bu: 80, sc: 7.2,
    sod: 130, pot: 5.5, hemo: 8.5, pcv: 24, wc: 9800, rc: 2.8,
    rbc: 0, pc: 0, pcc: 1, ba: 1, htn: 1, dm: 1, cad: 1, appet: 1, pe: 1, ane: 1
  }
};

function loadPreset(type) {
  const patient = PRESETS[type];
  if (!patient) return;

  // Animate values filling in
  Object.keys(patient).forEach((key) => {
    const el = document.getElementById(key);
    if (el) {
      el.value = patient[key];
      // Highlight element briefly
      el.classList.add('border-cyan-500', 'ring', 'ring-cyan-200');
      setTimeout(() => {
        el.classList.remove('border-cyan-500', 'ring', 'ring-cyan-200');
      }, 500);
    }
  });

  // Highlight selected preset button
  const healthyBtn = document.getElementById('btn-preset-healthy');
  const ckdBtn = document.getElementById('btn-preset-ckd');
  if (type === 'healthy' && healthyBtn && ckdBtn) {
    healthyBtn.classList.add('ring-2', 'ring-offset-2', 'ring-green-500');
    ckdBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-red-500');
  } else if (type === 'ckd' && healthyBtn && ckdBtn) {
    ckdBtn.classList.add('ring-2', 'ring-offset-2', 'ring-red-500');
    healthyBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-green-500');
  }
}

// ─── 6. OCR FILE UPLOAD PARSER ────────────────────
function initOCRParser() {
  const dropzone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('ocr-file-input');
  if (!dropzone || !fileInput) return;

  // Prevent defaults
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight drop area
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
  });

  // Handle dropped files
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleOCRFile(files[0]);
    }
  });

  // Handle selected files
  fileInput.addEventListener('change', (e) => {
    if (fileInput.files.length > 0) {
      handleOCRFile(fileInput.files[0]);
    }
  });

  dropzone.addEventListener('click', () => fileInput.click());
}

async function handleOCRFile(file) {
  const ocrStatus = document.getElementById('ocr-status');
  const ocrProgress = document.getElementById('ocr-progress');
  const progressText = document.getElementById('ocr-progress-text');

  if (!ocrStatus || !ocrProgress || !progressText) return;

  // Reset UI
  ocrStatus.classList.remove('hidden');
  ocrProgress.style.width = '0%';
  progressText.textContent = 'Preparing image...';

  try {
    const worker = await Tesseract.createWorker('eng');
    
    // Set progress callbacks
    worker.logger = (message) => {
      if (message.status === 'recognizing text') {
        const percent = Math.round(message.progress * 100);
        ocrProgress.style.width = percent + '%';
        progressText.textContent = `Extracting Data... (${percent}%)`;
      }
    };

    const ret = await worker.recognize(file);
    const text = ret.data.text;
    await worker.terminate();

    // Parse values from extracted text
    parseOCRText(text);

    progressText.textContent = '✓ Extraction complete!';
    ocrProgress.style.width = '100%';
    setTimeout(() => {
      ocrStatus.classList.add('hidden');
    }, 1500);

  } catch (error) {
    console.error(error);
    progressText.textContent = '⚠ Extraction failed.';
    ocrProgress.style.width = '0%';
    alert('Failed to extract text from the file. Please enter values manually.');
  }
}

function parseOCRText(text) {
  console.log("OCR Extracted Text:\n", text);
  
  // Regular expressions to search for biomarkers
  const rules = [
    { id: 'age', regex: /(?:age|years?)[:\s]+(\d+)/i },
    { id: 'bp', regex: /(?:bp|blood\s+pressure|sys\/dia)[:\s]+(\d+)/i },
    { id: 'bgr', regex: /(?:bgr|glucose|random\s+glucose|blood\s+sugar)[:\s]+(\d+)/i },
    { id: 'bu', regex: /(?:bu|urea|blood\s+urea)[:\s]+(\d+)/i },
    { id: 'sc', regex: /(?:sc|creatinine|serum\s+creatinine)[:\s]+([\d.]+)/i },
    { id: 'sod', regex: /(?:sod|sodium)[:\s]+(\d+)/i },
    { id: 'pot', regex: /(?:pot|potassium)[:\s]+([\d.]+)/i },
    { id: 'hemo', regex: /(?:hemo|hemoglobin|hb)[:\s]+([\d.]+)/i },
    { id: 'pcv', regex: /(?:pcv|packed\s+cell|haematocrit)[:\s]+(\d+)/i },
    { id: 'wc', regex: /(?:wc|wbc|white\s+blood\s+count)[:\s]+(\d+)/i },
    { id: 'rc', regex: /(?:rc|rbc|red\s+blood\s+count)[:\s]+([\d.]+)/i },
    { id: 'al', regex: /(?:al|albumin)[:\s]+(\d)/i },
    { id: 'su', regex: /(?:su|sugar)[:\s]+(\d)/i },
    { id: 'sg', regex: /(?:sg|specific\s+gravity)[:\s]+([\d.]+)/i }
  ];

  let matchesCount = 0;
  const parsedValues = {};

  rules.forEach(rule => {
    const match = text.match(rule.regex);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      const el = document.getElementById(rule.id);
      if (el) {
        el.value = val;
        parsedValues[rule.id] = val;
        matchesCount++;
        // Apply visual highlights
        el.classList.add('border-cyan-500', 'ring', 'ring-cyan-200');
        setTimeout(() => el.classList.remove('border-cyan-500', 'ring', 'ring-cyan-200'), 2000);
      }
    }
  });

  if (matchesCount > 0) {
    alert(`Successfully extracted and filled ${matchesCount} biomarkers from the lab report! Please review the highlighted fields.`);
  } else {
    alert('No matching biomarkers could be automatically extracted from the uploaded document. Please check key fields like Creatinine, Hemoglobin, Specific Gravity, or fill the parameters manually.');
  }
}

// ─── 7. PATIENT HISTORY SIDEBAR (LOCALSTORAGE) ────────────────────
const HISTORY_KEY = 'nephroai_history';

function getHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveHistory(name, inputs, probability, prediction) {
  const history = getHistory();
  const newRecord = {
    id: Date.now(),
    name: name || `Patient #${history.length + 1}`,
    date: new Date().toLocaleString(),
    inputs,
    probability,
    prediction
  };
  history.unshift(newRecord);
  // Keep last 30 assessments
  if (history.length > 30) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function deleteHistoryItem(id, e) {
  if (e) {
    e.stopPropagation();
  }
  let history = getHistory();
  history = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function clearAllHistory() {
  if (confirm('Are you sure you want to clear your local patient prediction history?')) {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }
}

function loadHistoryItem(id) {
  const history = getHistory();
  const item = history.find(i => i.id === id);
  if (!item) return;

  // Fill form inputs
  Object.keys(item.inputs).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      el.value = item.inputs[key];
    }
  });

  // Auto-fill Patient Name in input
  const nameInput = document.getElementById('patient-name-input');
  if (nameInput) {
    nameInput.value = item.name;
  }

  // Visual cues
  alert(`Loaded patient data for "${item.name}" into diagnostics panel.`);
  closeHistorySidebar();
}

function renderHistory() {
  const container = document.getElementById('history-list-container');
  if (!container) return;

  const history = getHistory();
  if (history.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-medical-secondary text-sm">
        <p>No diagnostics history recorded yet.</p>
        <p class="text-xs opacity-60 mt-1">Run predictions and save them locally.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map(item => {
    const badgeClass = item.prediction === 1 ? 'history-badge danger' : 'history-badge safe';
    const badgeText = item.prediction === 1 ? 'CKD Risk' : 'Healthy';
    const pct = (item.probability * 100).toFixed(1) + '%';
    
    return `
      <div class="history-card" onclick="loadHistoryItem(${item.id})">
        <div class="history-card-header">
          <span class="history-patient-name text-white">${item.name}</span>
          <span class="${badgeClass}">${badgeText} (${pct})</span>
        </div>
        <div class="flex justify-between items-center text-[10px] text-medical-secondary mt-2">
          <span>${item.date}</span>
          <button onclick="deleteHistoryItem(${item.id}, event)" class="hover:text-red-400 font-semibold bg-transparent border-none cursor-pointer">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function openHistorySidebar() {
  const sidebar = document.getElementById('history-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    renderHistory();
  }
}

function closeHistorySidebar() {
  const sidebar = document.getElementById('history-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
}

function setupHistoryEvents() {
  const openBtn = document.getElementById('btn-history-open');
  const closeBtn = document.getElementById('btn-history-close');
  const overlay = document.getElementById('sidebar-overlay');
  const clearBtn = document.getElementById('btn-history-clear');

  if (openBtn) openBtn.addEventListener('click', openHistorySidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeHistorySidebar);
  if (overlay) overlay.addEventListener('click', closeHistorySidebar);
  if (clearBtn) clearBtn.addEventListener('click', clearAllHistory);
}

// ─── 8. CHATBOT WIDGET ENGINE ────────────────────
const CHATBOT_RESPONSES = {
  // Kidney disease & general clinical details
  'ckd': 'Chronic Kidney Disease (CKD) represents the progressive decline of renal function over months or years. The kidneys become unable to filter toxins, leading to waste accumulation in the blood. Early stages are asymptomatic.',
  'chronic kidney disease': 'Chronic Kidney Disease (CKD) represents the progressive decline of renal function over months or years. The kidneys become unable to filter toxins, leading to waste accumulation in the blood. Early stages are asymptomatic.',
  'kidney': 'Kidneys are bean-shaped organs in the upper abdomen. They regulate fluids, blood pressure, red blood cell production (via erythropoietin), and filter metabolic waste. Damaged kidneys struggle with all these vital tasks.',
  'stages': 'CKD is staged 1 to 5 based on GFR (Glomerular Filtration Rate): Stage 1 (>90 eGFR) represents mild kidney damage, whereas Stage 5 (<15 eGFR) represents Kidney Failure (ESRD), requiring dialysis or transplantation.',
  'prevent': 'To protect kidney health: maintain blood pressure below 130/80 mmHg, regulate blood glucose levels, drink plenty of water (2-3L daily), follow a low-sodium diet, and avoid long-term use of NSAID painkillers.',
  'diet': 'Renal diets generally require limiting sodium (salt), potassium (found in bananas, potatoes), and phosphorus (found in dairy, nuts) to prevent these waste items from building up to dangerous levels.',
  'symptoms': 'Early CKD has no symptoms. Advanced stages present with fatigue, loss of appetite, pedal edema (swelling of feet/ankles), short breath, foaming urine, and anemia.',
  
  // Model performance and explanation details
  'xgboost': 'XGBoost (Extreme Gradient Boosting) is our final selected model. It trains an ensemble of decision trees sequentially, with each tree correcting errors of the previous ones. It achieved 96.50% test accuracy and 0.9913 AUC-ROC.',
  'algorithm': 'We benchmarked 8 algorithms: XGBoost, Random Forest, SVM (RBF), Logistic Regression, Gradient Boosting, KNN, Naive Bayes, and Decision Trees. XGBoost was finalized due to optimal generalization and explainability.',
  'model': 'We benchmarked 8 algorithms: XGBoost, Random Forest, SVM (RBF), Logistic Regression, Gradient Boosting, KNN, Naive Bayes, and Decision Trees. XGBoost was finalized due to optimal generalization and explainability.',
  'shap': 'SHAP (SHapley Additive exPlanations) is a game-theory approach that determines the exact directional contribution of each biomarker to a patient\'s CKD risk score. It explains the black box of ML.',
  'explainability': 'Explainability is crucial in clinical AI. Through SHAP, we provide local explanations showing which features increased or decreased a specific patient\'s kidney risk, boosting physician trust.',
  'accuracy': 'Our final XGBoost classifier achieved 96.50% test accuracy, validated on 400 unseen patients. The cross-validation score was 97.60%, proving robust generalization.',
  'auc': 'XGBoost achieved an outstanding Area Under the ROC Curve (AUC) of 0.9913, demonstrating strong discrimination performance between healthy individuals and CKD patients.',
  'f1': 'The F1-score of our XGBoost model stands at 97.22%, showing a perfect balance of sensitivity (minimizing false negatives) and precision (minimizing false positives).',
  'pca': 'Principal Component Analysis (PCA) was used to compress our 24 biomarkers into 19 principal components, capturing 95% of total variance. This is an unsupervised reduction strategy.',
  'lda': 'Linear Discriminant Analysis (LDA) is a supervised method that projects our 24 features into a single dimension, maximizing the separation distance between the CKD and Healthy classes.',
  'smote': 'SMOTE (Synthetic Minority Over-sampling Technique) was used to resolve class imbalance (1,000 CKD cases vs 600 Healthy). We balanced the training dataset to a 1000:1000 split. Crucially, SMOTE was applied ONLY to the training set to prevent data leakage.',
  
  // Specific Biomarkers
  'creatinine': 'Serum Creatinine is a waste product of muscle metabolism. Impaired kidneys fail to filter it, causing it to build up. Normal range is 0.7–1.2 mg/dL. Values above 1.5 mg/dL suggest impaired filtration.',
  'hemoglobin': 'Hemoglobin (Hb) is the oxygen-carrying protein in red blood cells. Healthy kidneys produce erythropoietin (EPO) to stimulate RBC production. CKD causes low EPO, leading to anemia (Hb < 12.0 g/dL).',
  'specific gravity': 'Specific Gravity measures urine concentration. Normal range is 1.002–1.030. Fixed specific gravity around 1.010 indicates loss of the kidney\'s ability to concentrate urine, a hallmark of CKD.',
  'blood urea': 'Blood Urea Nitrogen (BUN) is a protein metabolism waste product. Healthy kidneys clear it. Elevated blood urea (>40 mg/dL) points to kidney congestion or dehydration.',
  'albumin': 'Albumin is a vital protein in the blood. Damaged glomeruli leak albumin into the urine. Albumin scores of 1+ to 5+ in urine tests are highly predictive signs of kidney dysfunction.',
  'potassium': 'Potassium levels are carefully balanced by the kidneys. Impaired excretion causes hyperkalemia (>5.2 mEq/L), which can cause life-threatening cardiac arrhythmias.',
  'sodium': 'Sodium is a key electrolyte regulated by kidneys. Damaged kidneys fail to regulate sodium, leading to fluid retention, elevated blood pressure, and swollen feet (pedal edema).',
  'pcv': 'Packed Cell Volume (PCV) is the percentage of blood volume made of red blood cells. Low PCV (typically below 37%) indicates anemia, commonly caused by kidney failure.',
  'wbc': 'White Blood Cells (WBC) count. Normal range: 4,000-11,000 cells/µL. Highly elevated WBC count (leukocytosis) indicates a urinary tract or kidney infection.',
  'rbc': 'Red Blood Cells (RBC) count. Normal range: 4.5-5.9 million/µL. Low RBC counts are characteristic of CKD-induced anemia.',
  
  // Categorical biomarkers & Symptoms
  'hypertension': 'Hypertension (HTN) is both a major cause and a direct symptom of CKD. High blood pressure damages kidney arteries, while damaged kidneys fail to control BP due to renin imbalances.',
  'diabetes': 'Diabetes Mellitus is the leading cause of CKD worldwide. Prolonged high blood sugar damages the fragile filtration units (glomeruli), leading to diabetic nephropathy.',
  'pedal edema': 'Pedal Edema refers to swelling in the ankles and feet. It happens when impaired kidneys fail to filter sodium and excess fluid, causing fluid to pool in lower extremities.',
  'anemia': 'Renal anemia is caused by deficiency in erythropoietin production. It is a top predictor of advanced kidney disease, causing extreme fatigue and weakness.',
  'appetite': 'Loss of appetite (anorexia) or poor taste is common in advanced kidney failure. Uremic toxins accumulate in the bloodstream, leading to nausea, metallic taste, and lack of appetite.',
  'pus cell': 'Pus cells (white blood cells in urine). Normal is "Not Present". The presence of pus cells ("Abnormal") indicates pyuria, signifying kidney infection or chronic urinary tract inflammation.',
  'bacteria': 'Urinating bacteria ("Present") suggests an active Urinary Tract Infection (UTI), which if untreated can travel up the ureters and cause severe kidney damage (pyelonephritis).',
  
  // General platform details & UI interactions
  'help': 'I can assist you with: 1) Clinical CKD biomarkers, 2) The machine learning workflow (XGBoost, SHAP, SMOTE), 3) Model metrics, 4) Form presets and lab report uploads. What would you like to know?',
  'how to use': '1) Enter patient values in the Biomarkers panel, or use the "Healthy" / "CKD" preset buttons. 2) Click "Run Diagnostic Analysis". 3) Check the risk percentage and SHAP chart. 4) Use "Save to History" to log results.',
  'presets': 'Presets represent typical patient cases. "Load Healthy Patient" fills normal clinical parameters (e.g. Creatinine 0.8, Hb 15.5). "Load CKD Patient" loads pathological parameters (Creatinine 7.2, Hb 8.5).',
  'history': 'Patient diagnostics are saved locally using HTML5 localStorage. Click the clock icon in the navbar to open the sidebar, review past tests, load them into the form, or clear history.',
  'upload': 'Click on "Upload Lab Report" tab above the form. You can drag & drop or click to upload a lab report image (PDF/PNG/JPG). NephroAI uses OCR (Tesseract.js) to extract and auto-fill biomarkers.',
  'nephroai': 'NephroAI is a clinical decision support system for renal health, built as a senior-year research project at SOA University, utilizing XGBoost, PCA, LDA, and SHAP explainability.',
  'soa university': 'SOA (Siksha \'O\' Anusandhan) University, Bhubaneswar. This system was designed by Group 11 senior engineering students for the Final Research Project.',
  'stages of ckd': 'CKD has 5 stages: Stage 1 (eGFR >90, kidney damage with normal function); Stage 2 (eGFR 60-89); Stage 3 (eGFR 30-59); Stage 4 (eGFR 15-29, severe loss); Stage 5 (eGFR <15, kidney failure).'
};

function initChatbot() {
  const btn = document.getElementById('chatbot-btn');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const msgs = document.getElementById('chatbot-messages');

  if (!btn || !panel || !input || !sendBtn || !msgs) return;

  // Toggle chatbot panel
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      input.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.remove('open');
    });
  }

  // Close chatbot when clicking outside
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Handle messages
  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    // Add user bubble
    appendChatBubble(text, 'user');
    input.value = '';

    // Generate response after typing animation delay
    setTimeout(() => {
      const response = generateBotResponse(text);
      appendChatBubble(response, 'bot');
    }, 600);
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function appendChatBubble(text, sender) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = sender === 'user' ? 'chat-bubble chat-bubble-user' : 'chat-bubble chat-bubble-bot';
  bubble.textContent = text;
  
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function generateBotResponse(text) {
  const cleanText = text.toLowerCase().trim();
  
  // Find keyword match
  for (const keyword of Object.keys(CHATBOT_RESPONSES)) {
    if (cleanText.includes(keyword)) {
      return CHATBOT_RESPONSES[keyword];
    }
  }

  // Default fallback response
  return "I'm not sure about that specific term. Try asking about 'creatinine', 'hemo', 'XGBoost', 'SHAP', 'SMOTE', or 'how to use' the platform.";
}

// ─── 9. LIVE PREDICT DIAGNOSTICS & FORM SUBMIT ────────────────────
let shapChartInstance = null;

function drawGauge(prob, color) {
  const canvas = document.getElementById('gaugeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  const r = (w / 2) - 10;
  
  // BG arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = '#F1F5F9';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Fill arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, Math.PI + (prob * Math.PI));
  ctx.strokeStyle = color;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function renderShapChart(shapData) {
  const ctx = document.getElementById('shapChart');
  if (!ctx) return;

  if (shapChartInstance) shapChartInstance.destroy();
  const labels = shapData.map(d => d.feature.toUpperCase());
  const values = shapData.map(d => d.value);
  const colors = values.map(v => v > 0 ? '#EF4444' : '#06B6D4');
  
  shapChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        barThickness: 'flex'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#F1F5F9' }, ticks: { color: '#64748B', font: {size:10} } },
        y: { grid: { display: false }, ticks: { color: '#0F172A', font: {size:11, weight:'bold'} } }
      }
    }
  });
}

function initDiagnosticForm() {
  const form = document.getElementById('ckd-form');
  const btnText = document.getElementById('btn-text');
  const btnLoader = document.getElementById('btn-loader');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (btnText) btnText.textContent = 'Processing...';
    if (btnLoader) btnLoader.classList.remove('hidden');
    
    const placeholder = document.getElementById('result-placeholder');
    const resultActive = document.getElementById('result-active');
    
    if (placeholder) placeholder.classList.add('hidden');
    if (resultActive) {
      resultActive.classList.add('hidden');
      resultActive.classList.remove('result-active-show');
    }

    const payload = {};
    const inputPayload = {}; // for storing in patient history
    
    FEATURES.forEach(f => {
      const val = parseFloat(document.getElementById(f.id).value);
      payload[f.id] = val;
      inputPayload[f.id] = val;
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server prediction failed.');

      const prob = data.probability;
      const pred = data.prediction;
      
      const pctElement = document.getElementById('gauge-pct');
      if (pctElement) pctElement.textContent = (prob * 100).toFixed(1) + '%';
      
      const color = pred === 1 ? '#EF4444' : '#10B981';
      drawGauge(prob, color);

      const badge = document.getElementById('verdict-badge');
      const rec = document.getElementById('recommendation');
      if (pred === 1) {
        if (badge) {
          badge.className = 'px-3 py-1 rounded-full text-xs font-bold border bg-red-50 text-medical-red border-red-200';
          badge.textContent = 'High Risk (CKD)';
        }
        if (rec) {
          rec.className = 'text-sm text-medical-secondary bg-red-50 p-4 rounded-xl border-l-4 border-medical-red';
          rec.innerHTML = '<strong>Clinical Alert:</strong> High probability of CKD detected. Recommend comprehensive metabolic panel and nephrology referral.';
        }
      } else {
        if (badge) {
          badge.className = 'px-3 py-1 rounded-full text-xs font-bold border bg-green-50 text-medical-green border-green-200';
          badge.textContent = 'Low Risk (Healthy)';
        }
        if (rec) {
          rec.className = 'text-sm text-medical-secondary bg-green-50 p-4 rounded-xl border-l-4 border-medical-green';
          rec.innerHTML = '<strong>Assessment Normal:</strong> Biomarkers are within normal ranges. Continue standard annual screening protocol.';
        }
      }

      if (resultActive) {
        resultActive.classList.remove('hidden');
        resultActive.classList.add('result-active-show');
      }
      
      // Allow DOM rendering of canvas before loading Chart.js
      setTimeout(() => renderShapChart(data.shap_values), 80);

      // Make "Save to History" button visible and attach click listener
      const saveBtn = document.getElementById('btn-save-history');
      if (saveBtn) {
        saveBtn.classList.remove('hidden');
        // Recreate event listener to prevent duplicates
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        newSaveBtn.classList.remove('hidden');
        
        newSaveBtn.addEventListener('click', () => {
          const patientNameInput = document.getElementById('patient-name-input');
          const name = patientNameInput ? patientNameInput.value.trim() : '';
          saveHistory(name, inputPayload, prob, pred);
          alert('Diagnostic report successfully saved to Patient History!');
          newSaveBtn.classList.add('hidden');
          if (patientNameInput) patientNameInput.value = '';
        });
      }

    } catch (err) {
      alert('Error: ' + err.message + '\nMake sure the backend is running at ' + API_BASE_URL);
      if (placeholder) placeholder.classList.remove('hidden');
    } finally {
      if (btnText) btnText.textContent = 'Run Diagnostic Analysis';
      if (btnLoader) btnLoader.classList.add('hidden');
    }
  });
}

// ─── 10. INITIALIZATION ON DOM CONTENT LOADED ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Generate input fields dynamically
  generateForm();

  // Init Research background particles

  // Init Research background particles
  initResearchParticles();

  // Init performance chart
  initComparisonChart();

  // Load preset events
  const healthyBtn = document.getElementById('btn-preset-healthy');
  const ckdBtn = document.getElementById('btn-preset-ckd');
  if (healthyBtn) healthyBtn.addEventListener('click', () => loadPreset('healthy'));
  if (ckdBtn) ckdBtn.addEventListener('click', () => loadPreset('ckd'));

  // Init OCR engine
  initOCRParser();

  // Init Patient history system
  setupHistoryEvents();

  // Init Chatbot
  initChatbot();

  // Form submission
  initDiagnosticForm();

  // Tab switcher logic (Manual Entry vs Lab Report Upload)
  const tabForm = document.getElementById('tab-manual-entry');
  const tabUpload = document.getElementById('tab-upload-report');
  const containerForm = document.getElementById('manual-form-container');
  const containerUpload = document.getElementById('ocr-upload-container');

  if (tabForm && tabUpload && containerForm && containerUpload) {
    tabForm.addEventListener('click', () => {
      tabForm.classList.add('active');
      tabUpload.classList.remove('active');
      containerForm.classList.remove('hidden');
      containerUpload.classList.add('hidden');
    });

    tabUpload.addEventListener('click', () => {
      tabUpload.classList.add('active');
      tabForm.classList.remove('active');
      containerForm.classList.add('hidden');
      containerUpload.classList.remove('hidden');
    });
  }
});

// ─── MOBILE HAMBURGER MENU ─────────────────────────────────────────────────
(function initMobileMenu() {
  const btn        = document.getElementById('mobile-menu-btn');
  const menu       = document.getElementById('mobile-menu');
  const hamIcon    = document.getElementById('hamburger-icon');
  const closeIcon  = document.getElementById('close-icon');

  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    menu.classList.add('menu-open');
    hamIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.add('hidden');
    menu.classList.remove('menu-open');
    hamIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    menu.classList.contains('hidden') ? openMenu() : closeMenu();
  });

  // Close when a menu item is clicked
  menu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  // Mobile Clinical/Research tab switching
  const mobileClinical = document.getElementById('mobile-nav-clinical');
  const mobileResearch = document.getElementById('mobile-nav-research');

  if (mobileClinical) {
    mobileClinical.addEventListener('click', () => {
      const ev = new CustomEvent('switchView', { detail: 'clinical' });
      document.dispatchEvent(ev);
      // Sync active style
      mobileClinical.classList.add('text-medical-accent', 'bg-cyan-50', 'border-cyan-100', 'font-semibold');
      mobileResearch && mobileResearch.classList.remove('text-medical-accent', 'bg-cyan-50', 'border-cyan-100', 'font-semibold');
    });
  }

  if (mobileResearch) {
    mobileResearch.addEventListener('click', () => {
      const ev = new CustomEvent('switchView', { detail: 'research' });
      document.dispatchEvent(ev);
      mobileResearch.classList.add('text-medical-accent', 'bg-cyan-50', 'border-cyan-100', 'font-semibold');
      mobileClinical && mobileClinical.classList.remove('text-medical-accent', 'bg-cyan-50', 'border-cyan-100', 'font-semibold');
    });
  }

  // Wire mobile history button to same handler as desktop
  const mobileHistoryBtn = document.getElementById('btn-history-open-mobile');
  const desktopHistoryBtn = document.getElementById('btn-history-open');
  if (mobileHistoryBtn && desktopHistoryBtn) {
    mobileHistoryBtn.addEventListener('click', () => desktopHistoryBtn.click());
  }

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMenu();
  });

  // Flip cards: tap-to-flip on touch devices instead of hover
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
})();
