// ==========================================
// 🔐 SECURITY & LOGIN LOGIC
// ==========================================

// 1. पासवर्ड सेट करा (इथे तुझा पासवर्ड टाक)
const ADMIN_PASS = "admin123"; 

function checkLogin() {
    const userPass = document.getElementById('admin-pass').value;
    const errorMsg = document.getElementById('error-msg');
    
    if (userPass === ADMIN_PASS) {
        // पासवर्ड बरोबर असेल तर...
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    } else {
        // पासवर्ड चुकीचा असेल तर...
        errorMsg.style.display = 'block';
    }
}

function logout() {
    location.reload(); // पेज रिफ्रेश करेल म्हणजे पुन्हा लॉक होईल
}

// 2. DISABLE RIGHT CLICK & INSPECT (Security)
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    // F12, Ctrl+U, Ctrl+Shift+I बंद करण्यासाठी
    if(e.keyCode == 123) { return false; }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { return false; }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; }
}

// ==========================================
// 🧠 जुना LOGIC ENGINE (खाली जसाच्या तसा ठेवा)
// ==========================================
// ... (इथे तुमचा जुना generatePaper चा कोड तसाच राहील)
// ==========================================
// 🧠 LOGIC ENGINE
// ==========================================

const sectionsConfig = [
    { id: 'marathi', title: 'विभाग १: मराठी व्याकरण', inputId: 'count-marathi', checkId: 'chk-marathi' },
    { id: 'english', title: 'विभाग २: इंग्रजी व्याकरण', inputId: 'count-english', checkId: 'chk-english' },
    { id: 'gk', title: 'विभाग ३: सामान्य ज्ञान (GK)', inputId: 'count-gk', checkId: 'chk-gk' },
    { id: 'math', title: 'विभाग ४: अंकगणित (Math)', inputId: 'count-math', checkId: 'chk-math' },
    { id: 'reasoning', title: 'विभाग ५: बुद्धिमत्ता चाचणी', inputId: 'count-reasoning', checkId: 'chk-reasoning' }
];

// Shuffle Array
function shuffleArray(array) {
    if (!array) return [];
    let shuffled = JSON.parse(JSON.stringify(array));
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Logic: No Repetition (Standard)
function getSubset(dbArray, count) {
    if (!dbArray || dbArray.length === 0) return [];
    let shuffledPool = shuffleArray(dbArray);
    
    // Safety check: if requested > available, return max available
    if (count > shuffledPool.length) {
        return shuffledPool; 
    }
    return shuffledPool.slice(0, count);
}

function setDefaultDate() {
    const dateInput = document.getElementById('inp-date');
    if (!dateInput.value) {
        dateInput.valueAsDate = new Date();
    }
}

function generatePaper() {
    // 1. Header & Meta Updates
    const className = document.getElementById('inp-class-name').value;
    const examName = document.getElementById('inp-exam-name').value;
    const setCode = document.getElementById('inp-set-code').value;

    document.getElementById('disp-class-name').innerText = className;
    document.getElementById('disp-sub-header').innerText = document.getElementById('inp-sub-header').value;
    document.getElementById('disp-contact').innerText = document.getElementById('inp-contact').value;
    document.getElementById('disp-exam-name').innerText = examName;
    document.getElementById('disp-set-code').innerText = "सेट: " + setCode;
    document.getElementById('disp-time').innerText = "वेळ: " + document.getElementById('inp-time').value;

    // Watermark
    document.getElementById('disp-watermark-bg').innerText = document.getElementById('inp-watermark').value;

    // Date
    const rawDate = document.getElementById('inp-date').value;
    if(rawDate) {
        const d = new Date(rawDate);
        document.getElementById('disp-date').innerText = "दिनांक: " + d.toLocaleDateString('en-GB'); 
    }

    // Footer
    document.getElementById('disp-footer').innerText = `${className} | ${examName} | ${setCode} | यशाची परंपरा!`;
    document.getElementById('disp-key-meta').innerText = `${examName} - ${setCode}`;

    // 2. Clear Content
    const paperContent = document.getElementById('paper-content');
    const keyContent = document.getElementById('key-content');
    paperContent.innerHTML = '';
    keyContent.innerHTML = '';

    let globalQIndex = 1;
    let totalQuestions = 0;
    let sectionCounter = 1;

    // 3. Generate Questions
    sectionsConfig.forEach(section => {
        const isChecked = document.getElementById(section.checkId).checked;
        const inputEl = document.getElementById(section.inputId);
        const count = inputEl ? (parseInt(inputEl.value) || 0) : 0;

        if (isChecked && count > 0 && questionBank[section.id]) {
            const questions = getSubset(questionBank[section.id], count);
            totalQuestions += questions.length;

            if (questions.length > 0) {
                // Section Title
                const secTitle = document.createElement('div');
                secTitle.className = 'section-title';
                const cleanTitle = section.title.split(': ')[1] || section.title;
                secTitle.innerText = `विभाग ${sectionCounter}: ${cleanTitle}`;
                paperContent.appendChild(secTitle);

                // Questions Loop
                questions.forEach((item) => {
                    const qDiv = document.createElement('div');
                    qDiv.className = 'question-item';
                    
                    // Smart Options Layout (Check if long options)
                    const isLongOption = item.opt.some(o => o.length > 25);
                    const listClass = isLongOption ? 'options-list full-width' : 'options-list';

                    qDiv.innerHTML = `
                        <span class="q-text">${globalQIndex}. ${item.q}</span>
                        <ul class="${listClass}">
                            <li>(1) ${item.opt[0]}</li>
                            <li>(2) ${item.opt[1]}</li>
                            <li>(3) ${item.opt[2]}</li>
                            <li>(4) ${item.opt[3]}</li>
                        </ul>
                    `;
                    paperContent.appendChild(qDiv);

                    // Answer Key Entry
                    const keyDiv = document.createElement('div');
                    keyDiv.className = 'key-item';
                    keyDiv.innerHTML = `<strong>${globalQIndex}</strong><br>${item.ans}`;
                    keyContent.appendChild(keyDiv);

                    globalQIndex++;
                });
                sectionCounter++;
            }
        }
    });

    document.getElementById('disp-marks').innerText = `एकूण गुण: ${totalQuestions}`;
}

window.onload = function() {
    setDefaultDate();
    generatePaper();
};
