/* ShasthoPath — UI core + patient kiosk. Plain DOM, event delegation, no framework. */
(function () {
  const SP = (window.SP = window.SP || {});
  const L = SP.logic, db = SP.db, seed = SP.seed;

  // ---------- strings [bn, en] ----------
  const U = {
    app: ['স্বাস্থ্যপথ', 'ShasthoPath'], motto: ['হাসপাতালে পথ হারাবেন না—সঠিক জায়গা, সঠিক সময়ে।', 'From confusion to care.'],
    demoNotice: ['এটি একটি ডেমো সিস্টেম। সত্যিকারের সংবেদনশীল চিকিৎসা তথ্য দেবেন না।', 'This is a demonstration system. Do not enter real sensitive medical information.'],
    notDx: ['এটি রোগ নির্ণয় নয়—শুধু সঠিক জায়গা দেখানো। ডাক্তারই সিদ্ধান্ত নেন।', 'This is not a diagnosis — it only shows where to go. The doctor decides your care.'],
    mKiosk: ['রোগী কিয়স্ক', 'Patient kiosk'], mDisplay: ['কিউ ডিসপ্লে', 'Queue display'], mDoctor: ['ডাক্তার / স্টাফ', 'Doctor / staff'], mAdmin: ['ডেমো ও অ্যাডমিন', 'Demo & admin'],
    full: ['⛶ ফুলস্ক্রিন', '⛶ Fullscreen'], home: ['🏠 শুরু', '🏠 Home'], back: ['← পিছনে', '← Back'], startOver: ['শুরুতে যান', 'Start over'], listen: ['🔊 শুনুন', '🔊 Listen'],
    homeNew: ['আমি চিকিৎসা নিতে চাই', 'I need treatment'], homeNewSub: ['সমস্যা বললেই হবে — বিভাগের নাম জানতে হবে না', 'Just tell us the problem — no need to know the department'],
    homeFu: ['আমার পরবর্তী তারিখ বা ইনজেকশন আছে', 'I have a scheduled visit or injection'], homeFuSub: ['আবার নিবন্ধন লাগবে না', 'No need to register again'],
    homeDir: ['কোথায় কী আছে', 'Where is what?'], homeDirSub: ['টয়লেট, খাবার, ফার্মেসি, বিল, রিপোর্ট…', 'Toilet, food, pharmacy, billing, reports…'],
    homeMy: ['আমার টোকেন দেখুন', 'See my token'], homeEmr: ['জরুরি! এখনই সাহায্য চাই', 'EMERGENCY — I need help now'],
    steps: [['সমস্যা', 'Problem'], ['প্রশ্ন', 'Questions'], ['সেবা', 'Service'], ['তথ্য', 'Your info'], ['টোকেন', 'Token'], ['পথ', 'Directions']], stepOf: ['ধাপ {0}/{1}', 'Step {0} of {1}'],
    pTitle: ['আপনার কী সমস্যা?', 'What is your problem?'], pHint: ['মাইক চেপে বলুন, অথবা নিচের ছবি ছুঁয়ে বেছে নিন।', 'Press the mic and speak, or touch a picture below.'],
    pMic: ['🎤 বলুন', '🎤 Speak'], pType: ['অথবা এখানে লিখুন (যেমন: আমার হাতে ব্যথা)', 'Or type here (e.g. my hand hurts)'], pGo: ['এগিয়ে যান', 'Continue'], pTasks: ['অন্য কাজে এসেছি', 'I came for something else'],
    heard: ['আপনি বলেছেন:', 'You said:'], noMatch: ['বুঝতে পারিনি। নিচের ছবি থেকে বেছে নিন।', 'Sorry, I did not understand. Please touch a picture below.'],
    noVoice: ['এই ব্রাউজারে ভয়েস চলছে না। ছুঁয়ে বেছে নিন।', 'Voice is not available here. Please touch to choose.'], voiceFail: ['শুনতে পাইনি। আবার চেষ্টা করুন বা ছুঁয়ে বেছে নিন।', 'Could not hear you. Try again or touch to choose.'], listening: ['শুনছি…', 'Listening…'],
    qOf: ['প্রশ্ন {0}/{1}', 'Question {0} of {1}'], qHint: ['একটি বেছে নিন, অথবা মাইক চেপে বলুন।', 'Choose one, or press the mic and say it.'], qNone: ['না, কোনোটিই নেই', 'No, none of these'], notHeard: ['উত্তর বুঝিনি। ছুঁয়ে বেছে নিন।', 'Did not catch that. Please touch an answer.'],
    emr: ['জরুরি', 'EMERGENCY'], emrMsg: ['এখনই জরুরি বিভাগে যান।', 'Please proceed immediately to Emergency.'], emrTok: ['জরুরি টোকেন নিন', 'Get emergency token'], emrNote: ['যে কোনো কর্মীকে জানান। এটি রোগ নির্ণয় নয়।', 'Tell any staff member. This is not a diagnosis.'], emrPat: ['অজানা (জরুরি)', 'Unknown (emergency)'],
    rTitle: ['আপনি এখানে যেতে পারেন', 'You can go here'], rWhy: ['আপনার বলা কথা অনুযায়ী সাধারণত এই সেবা থেকে শুরু করা হয়।', 'Based on what you told us, this is usually the place to start.'],
    rOk: ['ঠিক আছে, টোকেন নিন', 'OK, get my token'], rOther: ['অন্য সেবা বেছে নিই', 'Choose another service'], rNoTok: ['এখানে টোকেন লাগে না। সরাসরি যান।', 'No token needed here. Go directly.'], rWay: ['🧭 পথ দেখুন', '🧭 Show me the way'], rPick: ['কোন সেবায় যেতে চান?', 'Which service do you want?'],
    wTitle: ['আপনার পরিচয়', 'About you'], wHint: ['যা জানেন শুধু তাই দিন। না জানলে "জানি না" চাপুন।', 'Give only what you know. If you do not know, press "Don\'t know".'],
    name: ['নাম', 'Name'], age: ['বয়স (বছর)', 'Age (years)'], sex: ['লিঙ্গ', 'Sex'], male: ['পুরুষ', 'Male'], female: ['নারী', 'Female'], other: ['অন্য / বলতে চাই না', 'Other / prefer not to say'], phone: ['মোবাইল নম্বর', 'Mobile number'], dk: ['জানি না', "Don't know"],
    next: ['পরের ধাপ →', 'Next →'], fill: ['ডেমো তথ্য ভরুন', 'Fill demo data'], bad: ['{0} সঠিক নয়। ঠিক করুন বা ফাঁকা রাখুন।', '{0} looks wrong. Fix it or leave it blank.'],
    hTitle: ['স্বাস্থ্য তথ্য (ঐচ্ছিক)', 'Health information (optional)'], hHint: ['জানা না থাকলে ফাঁকা রাখুন — ডাক্তার "অজানা" দেখবেন, আমরা অনুমান করি না।', 'Leave blank if you do not know — the doctor will see "Unknown". We never guess.'],
    weight: ['ওজন (কেজি)', 'Weight (kg)'], sys: ['রক্তচাপ — ওপরের', 'Blood pressure — upper'], dia: ['নিচের', 'lower'], temp: ['তাপমাত্রা (°F)', 'Temperature (°F)'], glucose: ['রক্তে গ্লুকোজ (mmol/L)', 'Blood glucose (mmol/L)'],
    cond: ['আগে কোনো রোগ আছে বলে জানেন? (আপনি যা জানেন)', 'Any existing condition you know of (as you report it)'], meds: ['এখন কোন ওষুধ খাচ্ছেন?', 'Medicines you take now'], allergy: ['কোনো অ্যালার্জি আছে?', 'Any allergies?'], hSkip: ['এড়িয়ে যান, টোকেন নিন', 'Skip, get token'], hGo: ['টোকেন নিন', 'Get token'],
    unk: ['অজানা', 'Unknown'], notMeas: ['মাপা হয়নি', 'Not measured'], notAvail: ['পাওয়া যায়নি', 'Not available'], notRep: ['রোগী বলেননি', 'Not reported by patient'], dkPat: ['রোগী জানেন না', 'Patient does not know'],
    tkTitle: ['আপনার টোকেন', 'Your token'], tkHint: ['টিকিট রাখুন। কোথায় যাবেন তা নিচে লেখা আছে।', 'Keep your ticket. It shows where to go.'], tkPrint: ['🖨️ টিকিট ছাপুন', '🖨️ Print ticket'],
    tkPatient: ['রোগী', 'Patient'], tkVisit: ['ভিজিট', 'Visit'], vNew: ['নতুন', 'New'], vFu: ['ফলো-আপ (ভিজিট {0})', 'Follow-up (visit {0})'], vSvc: ['সেবা', 'Service'], vEmr: ['জরুরি', 'Emergency'],
    tkDept: ['বিভাগ / সেবা', 'Department / service'], tkDoc: ['ডাক্তার', 'Doctor'], tkBldg: ['ভবন', 'Building'], tkFloor: ['তলা', 'Floor'], tkRoom: ['রুম / কাউন্টার', 'Room / counter'], room: ['রুম', 'Room'], tkQno: ['কিউ নম্বর', 'Queue no.'], tkTime: ['সময়', 'Date/time'], tkNext: ['পরবর্তী তারিখ', 'Next date'],
    tkInstr: ['নির্দেশনা', 'Instructions'], tkInstrTxt: ['টোকেন ডাকা পর্যন্ত রুমের কাছে অপেক্ষা করুন। ডিসপ্লেতে নম্বর দেখুন।', 'Wait near the room until your token is shown on the display.'], unkName: ['অজানা', 'Unknown'],
    ahead: ['আপনার সামনে {0} জন', '{0} ahead of you'], est: ['আনুমানিক অপেক্ষা: প্রায় {0} মিনিট (শুধু অনুমান)', 'Estimated wait: about {0} min (estimate only)'], nowServing: ['এখন ডাকা হচ্ছে', 'NOW SERVING'], none: ['কেউ নেই', 'None'],
    stWait: ['অপেক্ষা করুন', 'Please wait'], stYours: ['আপনার ডাক এসেছে! {0} এ যান।', 'It is your turn! Go to {0}.'], stRecall: ['আবার ডাকা হচ্ছে!', 'Being called again!'], stSkip: ['আপনার টোকেন বাদ পড়েছে। তথ্য ডেস্কে যান।', 'Your token was skipped. Please go to the information desk.'],
    stDone: ['আপনার সিরিয়াল শেষ হয়েছে।', 'Your turn is complete.'], stCancel: ['টোকেন বাতিল হয়েছে।', 'This token was cancelled.'], stXfer: ['আপনাকে অন্য সেবায় পাঠানো হয়েছে (আগের টোকেন {0})।', 'You were sent to another service (previous token {0}).'],
    afterT: ['এরপর কী হবে?', 'What happens next?'], afterTxt: ['ডাক্তার যা বলবেন তাই করুন। পরীক্ষা লিখলে ল্যাবে, ওষুধ লিখলে ফার্মেসিতে যান। রিপোর্ট ও বিলের আলাদা ডেস্ক আছে।', 'Do what the doctor tells you. Tests → Laboratory, medicine → Pharmacy. Reports and bills have their own desks.'],
    afterFu: ['আপনার পরবর্তী তারিখ: {0}। সেদিন এসে "পরবর্তী তারিখ আছে" চাপুন — আবার নিবন্ধন লাগবে না।', 'Your next date: {0}. On that day press "I have a scheduled visit" — no new registration.'],
    gTitle: ['আপনার পথ', 'Your way'], gYou: ['⭐ আপনি এখন: প্রধান প্রবেশপথ, ভবন-ক', '⭐ You are here: main entrance, Building A'], gSteps: ['কীভাবে যাবেন', 'How to get there'], gToken: ['← টোকেনে ফিরুন', '← Back to token'],
    fuTitle: ['আপনার নির্ধারিত সেবা', 'Your scheduled service'], fuHint: ['মোবাইল নম্বর দিন। (সময়সূচি হাসপাতাল/ডাক্তার ঠিক করেন।)', 'Enter your mobile number. (The schedule is set by the hospital/doctor.)'], fuFind: ['খুঁজুন', 'Find'], fuNone: ['এই নম্বরে কোনো নির্ধারিত সেবা পাওয়া যায়নি। তথ্য ডেস্কে জিজ্ঞাসা করুন।', 'No scheduled service found for this number. Please ask at the information desk.'],
    fuVisit: ['ভিজিট নং {0}', 'Visit no. {0}'], fuDate: ['তারিখ', 'Date'], fuAre: ['আপনি কি {0}?', 'Are you {0}?'], fuYes: ['হ্যাঁ, আমি। টোকেন দিন', 'Yes, that is me. Give my token'], fuNot: ['না, আমি নই', 'No, that is not me'], fuEarly: ['আপনার তারিখ {0}। সেদিন এসে আবার চাপুন।', 'Your date is {0}. Please come back on that day.'], fuDemo: ['ডেমো নম্বর:', 'Demo numbers:'], fuNoReg: ['পুনরায় নিবন্ধন ছাড়াই আলাদা ফলো-আপ লাইনে যাবেন।', 'You go to a separate follow-up line — no re-registration.'], fuToday: ['আজ', 'Today'],
    dirTitle: ['কোথায় কী আছে', 'Where is what?'], dirHint: ['ছুঁয়ে দেখুন কোথায় যেতে হবে।', 'Touch one to see how to get there.'], gClinic: ['চিকিৎসক বিভাগ', 'Clinics'], gSvc: ['পরীক্ষা, ওষুধ, বিল, রিপোর্ট', 'Tests, medicine, bills, reports'], gFac: ['অন্যান্য', 'Other'],
    // staff
    dispTitle: ['টোকেন ডিসপ্লে', 'Token display'], waiting: ['অপেক্ষায়', 'WAITING'], nextL: ['পরবর্তী', 'NEXT'], dispNone: ['এখন কোনো সক্রিয় কিউ নেই। অ্যাডমিন ▸ "ডেমো কিউ তৈরি" চাপুন।', 'No active queues. Use Admin ▸ "Seed demo queue".'],
    dTitle: ['ডাক্তার / স্টাফ কনসোল', 'Doctor / staff console'], callNext: ['▶ পরের রোগী ডাকুন', '▶ Call next'], recall: ['🔔 আবার ডাকুন', '🔔 Recall'], skip: ['⏭ বাদ দিন', '⏭ Skip'], complete: ['✔ সম্পন্ন', '✔ Complete'], cancel: ['✖ বাতিল', '✖ Cancel'], transfer: ['↪ স্থানান্তর', '↪ Transfer'],
    prio: ['⭐ অগ্রাধিকার', '⭐ Priority'], unprio: ['অগ্রাধিকার সরান', 'Remove priority'], requeue: ['↩ আবার লাইনে', '↩ Back to queue'], sched: ['📅 পরবর্তী ভিজিট ঠিক করুন', '📅 Schedule follow-up'], serving: ['এখন চলছে', 'Now serving'], waitList: ['অপেক্ষার তালিকা', 'Waiting list'], skipped: ['বাদ পড়েছে', 'Skipped'], nobody: ['কেউ চলছে না', 'Nobody being served'], emptyQ: ['কেউ অপেক্ষায় নেই', 'Nobody waiting'], servingFirst: ['আগে বর্তমান টোকেন সম্পন্ন বা বাদ দিন।', 'Complete or skip the current token first.'],
    sum: ['ইনটেক সারাংশ — রোগীর বলা তথ্য, রোগ নির্ণয় নয়', 'Intake summary — patient-reported, NOT a diagnosis'], sPat: ['রোগী', 'Patient'], sAge: ['বয়স', 'Age'], sSex: ['লিঙ্গ', 'Sex'], sCompl: ['প্রধান সমস্যা', 'Chief complaint'], sDur: ['কতদিন', 'Duration'], sInj: ['আঘাত', 'Injury'], sPrev: ['আগে ডাক্তার দেখানো', 'Previous consultation'], sRep: ['রিপোর্ট সাথে আছে', 'Reports available'], sPreg: ['গর্ভাবস্থা', 'Pregnancy'], sBP: ['রক্তচাপ', 'Blood pressure'], sTemp: ['তাপমাত্রা', 'Temperature'], sGlu: ['গ্লুকোজ', 'Glucose'], sWt: ['ওজন', 'Weight'], sCond: ['রোগীর জানা রোগ', 'Conditions (patient-reported)'], sMeds: ['চলমান ওষুধ (রোগী বলেছেন)', 'Current medicines (patient-reported)'], sAll: ['অ্যালার্জি (রোগী বলেছেন)', 'Allergies (patient-reported)'], sFu: ['ফলো-আপ অবস্থা', 'Follow-up status'], sFuNone: ['কোনো নির্ধারিত ভিজিট নেই', 'No scheduled visit'], sRaw: ['রোগীর নিজের কথা', "Patient's own words"],
    fDate: ['তারিখ', 'Date'], fVisit: ['ভিজিট নং', 'Visit no.'], fNote: ['নির্দেশনা (ডাক্তার লিখবেন)', 'Instruction (written by clinician)'], fDept: ['কোন সেবায়', 'Which service'], fSave: ['সংরক্ষণ', 'Save'], fSaved: ['ফলো-আপ সংরক্ষিত', 'Follow-up saved'], fNoteHint: ['সময়সূচি ডাক্তার ঠিক করেন; সিস্টেম কোনো সময়সূচি নিজে থেকে দেয় না।', 'The clinician sets the schedule; the system never assumes one.'],
    aTitle: ['ডেমো ও অ্যাডমিন', 'Demo & admin'], aSeed: ['ডেমো কিউ তৈরি', 'Seed demo queue'], aReset: ['ডেমো ডেটা রিসেট', 'Reset demo data'], aResetQ: ['সব ডেটা মুছে ডেমো ডেটা ফেরত আসবে। নিশ্চিত?', 'This erases all data and restores demo data. Sure?'], aDone: ['হয়েছে', 'Done'], aScript: ['২–৩ মিনিটের ডেমো স্ক্রিপ্ট', '2–3 minute demo script'], aCfg: ['কনফিগারেশন (শুধু দেখার জন্য)', 'Configuration (read-only)'], aStore: ['সংরক্ষিত ডেটা (IndexedDB)', 'Stored data (IndexedDB)'], aNote: ['রাউটিং নিয়ম, লাল-পতাকা ও অবস্থান data.js থেকে IndexedDB-তে আসে; হাসপাতাল/চিকিৎসক এগুলো ঠিক করবেন।', 'Routing rules, red flags and locations are seeded from data.js into IndexedDB; the hospital/clinicians own them.'],
    scr: [['রোগী কিয়স্কে "আমি চিকিৎসা নিতে চাই" চাপুন', 'Kiosk: touch "I need treatment"'], ['সমস্যা বলুন বা ছবি ছুঁন (যেমন হাতে ব্যথা)', 'Say or touch the problem (e.g. hand pain)'], ['সহজ প্রশ্নের উত্তর দিন', 'Answer the simple questions'], ['সেবা/বিভাগের নির্দেশনা দেখুন', 'See the service guidance'], ['পরিচয় ও স্বাস্থ্য তথ্য দিন (জানা না থাকলে ফাঁকা)', 'Enter info (blank = Unknown)'], ['টোকেন ও টিকিট — ছাপুন', 'Token and ticket — print it'], ['পথ দেখুন (ভবন, তলা, রুম)', 'See directions (building, floor, room)'], ['"কিউ ডিসপ্লে" ট্যাবে সারি দেখুন', 'Open the "Queue display" tab'], ['"ডাক্তার" ট্যাবে টোকেন ডাকুন', 'Open "Doctor" and call the token'], ['ইনটেক সারাংশ দেখুন', 'Show the intake summary'], ['সম্পন্ন করে পরবর্তী ভিজিট ঠিক করুন', 'Complete and schedule a follow-up'], ['কিয়স্কে "পরবর্তী তারিখ" — 01700000001 — ফলো-আপ টোকেন', 'Kiosk "scheduled visit" — 01700000001 — follow-up token']],
    hello: ['', ''],
  };
  const S = (SP.state = { lang: 'bn', mode: 'kiosk', step: 'home', draft: null, activeTokenId: null, demo: true, fu: { phone: '', res: null, sel: null }, loc: null, back: 'home', doc: { queueId: null, xfer: '', form: null }, sig: '', spoken: '' });
  const D = (SP.data = { depts: {}, locs: {}, doctors: {}, tokens: [], followups: [], patients: [], hospital: null });

  // ---------- helpers ----------
  const t = (k, ...a) => { let s = (U[k] || [k, k])[S.lang === 'bn' ? 0 : 1]; a.forEach((v, i) => { s = s.split('{' + i + '}').join(v); }); return s; };
  const Lb = (o) => (o == null ? '' : typeof o === 'string' ? o : o[S.lang] || '');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (x) => { x = String(x == null ? '' : x); return S.lang === 'bn' ? x.replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]) : x; };
  const loc2 = () => (S.lang === 'bn' ? 'bn-BD' : 'en-GB');
  const fmtDate = (s) => { try { return num(new Date(s + 'T00:00:00').toLocaleDateString(loc2(), { day: 'numeric', month: 'short', year: 'numeric' })); } catch (e) { return s; } };
  const fmtDT = (ms) => { const d = new Date(ms); return num(d.toLocaleDateString(loc2(), { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString(loc2(), { hour: '2-digit', minute: '2-digit' })); };
  const FLOORS = [['নিচতলা', 'Ground floor'], ['১ম তলা', '1st floor'], ['২য় তলা', '2nd floor'], ['৩য় তলা', '3rd floor']];
  const floorName = (f) => FLOORS[f][S.lang === 'bn' ? 0 : 1];
  const locLine = (l) => `${Lb(SP.buildings[l.building])} · ${floorName(l.floor)} · ${/^\d/.test(l.room) ? t('room') + ' ' : ''}${num(l.room)}`; // numbered rooms get "Room"; counters (e.g. Pharmacy 1) show as-is
  const optLabel = (qid, v) => { const o = (seed.questions[qid].opts || []).find((x) => x.v === v); return o ? Lb(o.label) : null; };
  const get = (p) => p.split('.').reduce((o, k) => (o == null ? o : o[k]), S);
  const setP = (p, v) => { const ks = p.split('.'), last = ks.pop(); ks.reduce((o, k) => (o[k] = o[k] || {}), S)[last] = v; };
  const toast = (m) => { const el = document.getElementById('toast'); if (!el) return; el.textContent = m; el.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('show'), 3500); };
  const days = (n) => L.addDays(n);

  async function loadAll() {
    const [depts, locs, docs, tokens, fus, pats, hosp, demo] = await Promise.all([db.all('departments'), db.all('locations'), db.all('doctors'), db.all('tokens'), db.all('followups'), db.all('patients'), L.getSetting('hospital', seed.hospital), L.getSetting('demo', true)]);
    D.depts = Object.fromEntries(depts.map((d) => [d.id, d])); D.locs = Object.fromEntries(locs.map((l) => [l.id, l])); D.doctors = Object.fromEntries(docs.map((d) => [d.id, d]));
    D.tokens = tokens; D.followups = fus; D.patients = pats; D.hospital = hosp; S.demo = demo;
  }
  const deptLoc = (d) => D.locs[d.locationId];
  const queueList = () => { const out = []; Object.values(D.depts).filter((d) => d.queue).forEach((d) => { out.push({ id: d.code, dept: d, fu: false }); if (d.fu) out.push({ id: d.code + '-FU', dept: d, fu: true }); }); return out; };
  const queueName = (q) => Lb(q.dept.name) + (q.fu ? (S.lang === 'bn' ? ' — ফলো-আপ' : ' — follow-up') : '');
  SP.ui = { U, S, D, t, Lb, esc, num, fmtDate, fmtDT, floorName, locLine, optLabel, toast, deptLoc, queueList, queueName, loadAll, days, views: {}, acts: {} };
  const V = SP.ui.views, A = SP.ui.acts;
  const render = () => SP.ui.render();

  // ---------- speech (best effort; touch always works) ----------
  function speak(txt) { try { const u = new SpeechSynthesisUtterance(txt); u.lang = S.lang === 'bn' ? 'bn-BD' : 'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { toast(t('noVoice')); } }
  function listen(cb) {
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) return toast(t('noVoice'));
    try {
      const r = new R(); r.lang = S.lang === 'bn' ? 'bn-BD' : 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
      const mark = (on) => document.querySelectorAll('.mic').forEach((m) => m.classList.toggle('listening', on));
      r.onresult = (e) => cb(e.results[0][0].transcript); r.onerror = () => { mark(false); toast(t('voiceFail')); }; r.onend = () => mark(false);
      mark(true); toast(t('listening')); r.start();
    } catch (e) { toast(t('noVoice')); }
  }
  SP.ui.speak = speak;

  // ---------- shared pieces ----------
  const stepBar = (n) => `<ol class="steps" aria-label="progress">${U.steps.map((s, i) => `<li class="${i + 1 < n ? 'done' : i + 1 === n ? 'now' : ''}"><i>${num(i + 1)}</i><span>${s[S.lang === 'bn' ? 0 : 1]}</span></li>`).join('')}</ol>`;
  const guide = (title, hint, n) => `${n ? stepBar(n) : ''}<div class="guide"><div><h1>${esc(title)}</h1>${hint ? `<p class="hint">${esc(hint)}</p>` : ''}</div><button class="btn ghost" data-act="speak" data-text="${esc(title + '. ' + (hint || ''))}">${t('listen')}</button></div>`;
  const navBtns = (noBack) => `<div class="navrow">${noBack ? '' : `<button class="btn ghost" data-act="back">${t('back')}</button>`}<button class="btn ghost" data-act="home">${t('startOver')}</button></div>`;
  const tile = (act, attrs, icon, label, sub, cls) => `<button class="tile ${cls || ''}" data-act="${act}" ${attrs}><span class="ic">${icon}</span><b>${esc(label)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</button>`;
  const draftNew = () => ({ svc: null, deptId: null, text: '', heard: '', answers: {}, qList: [], qIdx: 0, flagId: null, choosing: false, who: { name: '', age: '', ageUnk: false, sex: '', phone: '' }, health: {} });

  function mapSVG(l) {
    const hl = (b) => (l.building === b ? 'class="b hl"' : 'class="b"');
    const route = { A: 'M160 178 H75 V160', B: 'M160 178 H245 V160', E: 'M160 178 V58' }[l.building];
    return `<svg viewBox="0 0 320 200" role="img" aria-label="map"><rect x="135" y="104" width="50" height="22" class="walk"/><rect x="15" y="70" width="120" height="90" ${hl('A')} rx="6"/><rect x="185" y="70" width="120" height="90" ${hl('B')} rx="6"/><rect x="100" y="8" width="120" height="48" ${hl('E')} rx="6"/>
<text x="75" y="120" class="bt">A</text><text x="245" y="120" class="bt">B</text><text x="160" y="38" class="bt">${S.lang === 'bn' ? 'জরুরি' : 'ER'}</text>
<path d="${route}" class="rt"/><circle cx="160" cy="178" r="9" class="you"/><text x="160" y="197" class="yt">${S.lang === 'bn' ? 'আপনি এখানে' : 'You are here'}</text></svg>`;
  }
  const floorsW = (l) => `<div class="floors" aria-label="floor">${[3, 2, 1, 0].map((f) => `<div class="fl ${f === l.floor ? 'hl' : ''}">${floorName(f)}${f === l.floor ? ' ◀' : ''}</div>`).join('')}</div>`;

  // ---------- views: kiosk ----------
  V.home = () => `<div class="hero"><p class="motto">${t('motto')}</p></div><div class="tiles big">
${tile('startNew', '', '🏥', t('homeNew'), t('homeNewSub'), 'primary')}${tile('goFu', '', '💉', t('homeFu'), t('homeFuSub'))}${tile('goDir', '', '🧭', t('homeDir'), t('homeDirSub'))}
${S.activeTokenId && L.resolve(S.activeTokenId, D.tokens) ? tile('myToken', '', '🎫', t('homeMy'), L.resolve(S.activeTokenId, D.tokens).code) : ''}${tile('emergency', '', '🚨', t('homeEmr'), '', 'danger')}</div>`;

  V.problem = () => {
    const d = S.draft, probs = seed.services.filter((s) => s.kind === 'problem'), tasks = seed.services.filter((s) => s.kind === 'task');
    return `${guide(t('pTitle'), t('pHint'), 1)}<div class="voicebar"><button class="btn mic big" data-act="listenProblem">${t('pMic')}</button>
<input id="ptext" class="input" type="text" placeholder="${esc(t('pType'))}" value="${esc(d.text)}" data-bind="draft.text" autocomplete="off"><button class="btn" data-act="submitText">${t('pGo')}</button></div>
${d.heard ? `<p class="heard">${t('heard')} <b>${esc(d.heard)}</b></p>` : ''}${d.noMatch ? `<p class="warn">${t('noMatch')}</p>` : ''}
<div class="tiles">${probs.map((s) => tile('pickService', `data-id="${s.id}"`, s.icon, Lb(s.label))).join('')}</div>
<h2>${t('pTasks')}</h2><div class="tiles small">${tasks.map((s) => tile('pickService', `data-id="${s.id}"`, s.icon, Lb(s.label))).join('')}</div>${navBtns(false)}`;
  };

  V.question = () => {
    const d = S.draft, qid = d.qList[d.qIdx], q = seed.questions[qid], n = d.qList.length;
    const head = guide(Lb(q.text), t('qHint'), 2) + `<p class="qcount">${t('qOf', num(d.qIdx + 1), num(n))}</p>`;
    if (qid === 'flags') return `${head}<div class="tiles">${seed.redFlags.map((f) => tile('flag', `data-id="${f.id}"`, f.icon, Lb(f.label), '', 'danger-soft')).join('')}</div><button class="btn big wide" data-act="answer" data-v="none">${t('qNone')}</button>${navBtns(false)}`;
    return `${head}<div class="tiles">${q.opts.map((o) => tile('answer', `data-v="${o.v}"`, o.icon, Lb(o.label))).join('')}</div><button class="btn mic" data-act="listenAnswer">${t('pMic')}</button>${navBtns(false)}`;
  };

  V.emergency = () => {
    const l = D.locs['loc-EMR'], f = seed.redFlags.find((x) => x.id === (S.draft && S.draft.flagId));
    return `<div class="emr"><div class="emr-t">🚨 ${t('emr')}</div><p class="emr-m">${t('emrMsg')}</p>${f ? `<p class="emr-f">${f.icon} ${esc(Lb(f.label))}</p>` : ''}
<div class="emr-box"><b>${esc(locLine(l))}</b><p>${esc(Lb(l.how))}</p></div><p>${t('emrNote')}</p>
<div class="navrow"><button class="btn big" data-act="emrToken">🎫 ${t('emrTok')}</button><button class="btn ghost" data-act="home">${t('startOver')}</button></div></div>`;
  };

  V.route = () => {
    const d = S.draft, dept = D.depts[d.deptId], l = deptLoc(dept);
    if (d.choosing) return `${guide(t('rPick'), '', 3)}<div class="tiles">${Object.values(D.depts).filter((x) => x.id !== 'EMR').map((x) => tile('setDept', `data-id="${x.id}"`, x.icon, Lb(x.name), locLine(deptLoc(x)))).join('')}</div>${navBtns(false)}`;
    return `${guide(t('rTitle'), t('rWhy'), 3)}<div class="bigcard"><div class="ic">${dept.icon}</div><div><h2>${esc(Lb(dept.name))}</h2><p class="loc">${esc(locLine(l))}</p></div></div>
<p class="note">${t('notDx')}</p><div class="navrow">${dept.queue ? `<button class="btn big" data-act="whoGo">${t('rOk')}</button>` : `<p class="warn">${t('rNoTok')}</p><button class="btn big" data-act="openLoc" data-id="${l.id}" data-back="route">${t('rWay')}</button>`}<button class="btn ghost" data-act="other">${t('rOther')}</button></div>${navBtns(false)}`;
  };

  const field = (lbl, bind, extra) => `<label class="fld"><span>${lbl}</span><input class="input" data-bind="${bind}" value="${esc(get(bind) || '')}" ${extra || ''}></label>`;
  V.who = () => {
    const w = S.draft.who, clin = S.draft.svc && S.draft.svc.kind === 'problem';
    return `${guide(t('wTitle'), t('wHint'), 4)}<div class="form">${field(t('name'), 'draft.who.name', 'autocomplete="off"')}
<div class="fld"><span>${t('age')}</span><div class="row"><input class="input" inputmode="numeric" data-bind="draft.who.age" value="${esc(w.age)}" ${w.ageUnk ? 'disabled' : ''}><button class="chip ${w.ageUnk ? 'on' : ''}" data-act="ageUnk">${t('dk')}</button></div></div>
<div class="fld"><span>${t('sex')}</span><div class="row">${[['male', 'male'], ['female', 'female'], ['unknown', 'other']].map(([v, k]) => `<button class="chip ${w.sex === v ? 'on' : ''}" data-act="setSex" data-v="${v}">${t(k)}</button>`).join('')}</div></div>
${field(t('phone'), 'draft.who.phone', 'inputmode="tel" autocomplete="off"')}</div>
<div class="navrow"><button class="btn big" data-act="whoNext">${clin ? t('next') : t('hGo')}</button>${S.demo ? `<button class="btn ghost" data-act="fill">${t('fill')}</button>` : ''}</div>${navBtns(false)}`;
  };
  V.health = () => `${guide(t('hTitle'), t('hHint'), 4)}<div class="form grid2">${field(t('weight'), 'draft.health.weight', 'inputmode="decimal"')}${field(t('temp'), 'draft.health.temp', 'inputmode="decimal"')}
${field(t('sys'), 'draft.health.sys', 'inputmode="numeric"')}${field(t('dia'), 'draft.health.dia', 'inputmode="numeric"')}${field(t('glucose'), 'draft.health.glucose', 'inputmode="decimal"')}
${field(t('cond'), 'draft.health.cond')}${field(t('meds'), 'draft.health.meds')}${field(t('allergy'), 'draft.health.allergy')}</div>
<div class="navrow"><button class="btn big" data-act="healthGo">${t('hGo')}</button><button class="btn ghost" data-act="healthSkip">${t('hSkip')}</button></div>${navBtns(false)}`;

  function statusPanel(tok) {
    const dept = D.depts[tok.deptId], l = deptLoc(dept), serv = L.servingOf(D.tokens, tok.queueId), roomTxt = `${locLine(l)}`;
    let main = '', cls = 'wait';
    if (tok.status === 'waiting') { const a = L.aheadOf(tok, D.tokens); main = `<div class="st-big">${t('stWait')}</div><p>${t('ahead', num(a))}</p>${dept.avgMin ? `<p class="small">${t('est', num(a * dept.avgMin))}</p>` : ''}`; }
    else if (tok.status === 'serving') { cls = 'go'; main = `<div class="st-big">${tok.recalls ? '🔔 ' + t('stRecall') : '🔔'}</div><p class="st-go">${t('stYours', esc(roomTxt))}</p>`; }
    else if (tok.status === 'skipped') { cls = 'bad'; main = `<p class="st-go">${t('stSkip')}</p>`; }
    else if (tok.status === 'done') { cls = 'done'; main = `<p class="st-go">✅ ${t('stDone')}</p>`; }
    else main = `<p class="st-go">${t('stCancel')}</p>`;
    const fus = D.followups.filter((f) => f.patientId === tok.patientId && f.status === 'scheduled');
    return `<div class="status ${cls}" id="livePanel"><div class="now">${t('nowServing')}: <b>${serv ? esc(serv.code) : '—'}</b></div>${main}${tok.transferredFrom ? `<p class="small">${t('stXfer', esc(tok.transferredFrom))}</p>` : ''}</div>
<div class="after"><h3>${t('afterT')}</h3><p>${t('afterTxt')}</p><div class="chips">${['LAB', 'PHA', 'REP', 'BIL'].map((c) => `<button class="chip" data-act="openLoc" data-id="loc-${c}" data-back="ticket">${D.depts[c].icon} ${esc(Lb(D.depts[c].name))}</button>`).join('')}</div>${fus.map((f) => `<p class="fu">📅 ${t('afterFu', fmtDate(f.date))}</p>`).join('')}</div>`;
  }
  V.ticket = () => {
    const tok = S.activeTokenId && L.resolve(S.activeTokenId, D.tokens);
    if (!tok) return `<p class="warn">—</p>${navBtns(true)}`;
    const dept = D.depts[tok.deptId], l = deptLoc(dept), doc = dept.doctorId && D.doctors[dept.doctorId], pat = D.patients.find((p) => p.id === tok.patientId);
    const visit = tok.kind === 'followup' ? t('vFu', num(tok.visitNo)) : tok.kind === 'emergency' ? t('vEmr') : tok.kind === 'service' ? t('vSvc') : t('vNew');
    const nextFu = D.followups.find((f) => f.patientId === tok.patientId && f.status === 'scheduled' && f.date >= L.dayStr());
    const row = (k, v) => `<tr><th>${t(k)}</th><td>${v}</td></tr>`;
    return `${guide(t('tkTitle'), t('tkHint'), 5)}<div class="split"><div class="paper" id="ticket"><div class="t-h">${esc(Lb(D.hospital))}</div><div class="t-sub">${t('app')}</div><div class="t-code">${esc(tok.code)}</div>
<table>${row('tkPatient', esc(tok.patientName || (tok.kind === 'emergency' ? t('emrPat') : t('unkName'))))}${row('tkVisit', esc(visit))}${row('tkDept', esc(Lb(dept.name)))}${doc ? row('tkDoc', esc(Lb(doc.name))) : ''}${row('tkBldg', esc(Lb(SP.buildings[l.building])))}${row('tkFloor', esc(floorName(l.floor)))}${row('tkRoom', esc(num(l.room)))}${row('tkQno', num(tok.seq) + ' (' + t('ahead', num(tok.aheadAtIssue)) + ')')}${row('tkTime', esc(fmtDT(tok.createdAt)))}${nextFu ? row('tkNext', esc(fmtDate(nextFu.date))) : ''}</table>
<div class="t-i"><b>${t('tkInstr')}:</b> ${t('tkInstrTxt')}</div><div class="t-n">${t('demoNotice')}</div></div>
<div class="side">${statusPanel(tok)}<div class="navrow"><button class="btn big" data-act="goGuide">${t('rWay')}</button><button class="btn" data-act="print">${t('tkPrint')}</button></div>${navBtns(true)}</div></div>`;
  };

  V.loc = () => {
    const l = D.locs[S.loc], dept = Object.values(D.depts).find((d) => d.locationId === l.id);
    return `${S.back === 'ticket' || S.back === 'guideTicket' ? stepBar(6) : ''}<div class="guide"><div><h1>${dept ? dept.icon + ' ' : ''}${esc(Lb(l.name))}</h1><p class="hint">${esc(locLine(l))}</p></div><button class="btn ghost" data-act="speak" data-text="${esc(Lb(l.name) + '. ' + locLine(l) + '. ' + Lb(l.how))}">${t('listen')}</button></div>
<div class="split"><div class="mapbox">${mapSVG(l)}${floorsW(l)}</div><div class="side"><div class="bigcard how"><div><h3>${t('gSteps')}</h3><p class="howtxt">${esc(Lb(l.how))}</p></div></div><p class="note">${t('gYou')}</p>
<table class="kv"><tr><th>${t('tkBldg')}</th><td>${esc(Lb(SP.buildings[l.building]))}</td></tr><tr><th>${t('tkFloor')}</th><td>${esc(floorName(l.floor))}</td></tr><tr><th>${t('tkRoom')}</th><td>${esc(num(l.room))}</td></tr></table></div></div>
<div class="navrow"><button class="btn big" data-act="back">${S.back === 'ticket' || S.back === 'guideTicket' ? t('gToken') : t('back')}</button><button class="btn ghost" data-act="home">${t('startOver')}</button></div>`;
  };

  V.fu = () => {
    const f = S.fu;
    const res = f.res === null ? '' : f.res.length === 0 ? `<p class="warn">${t('fuNone')}</p>` : `<div class="tiles">${f.res.map((r, i) => tile('fuPick', `data-i="${i}"`, D.depts[r.f.deptId].icon, Lb(r.f.label) || Lb(D.depts[r.f.deptId].name), `${t('fuVisit', num(r.f.visitNo))} · ${fmtDate(r.f.date)}`)).join('')}</div>`;
    return `${guide(t('fuTitle'), t('fuHint'), 0)}<div class="voicebar"><input class="input" inputmode="tel" data-bind="fu.phone" value="${esc(f.phone)}" placeholder="01XXXXXXXXX" autocomplete="off"><button class="btn big" data-act="fuFind">${t('fuFind')}</button></div>
${S.demo ? `<p class="small">${t('fuDemo')} <button class="chip" data-act="fuDemo" data-v="01700000001">01700000001</button> <button class="chip" data-act="fuDemo" data-v="01700000002">01700000002</button></p>` : ''}${res}<p class="note">${t('fuNoReg')}</p>${navBtns(false)}`;
  };
  V.fuConfirm = () => {
    const r = S.fu.sel, f = r.f, dept = D.depts[f.deptId], l = deptLoc(dept), early = f.date > L.dayStr();
    return `${guide(t('fuAre', r.patient.name || t('unkName')), '', 0)}<div class="bigcard"><div class="ic">${dept.icon}</div><div><h2>${esc(Lb(f.label) || Lb(dept.name))}</h2><p class="loc">${t('fuVisit', num(f.visitNo))} · ${t('fuDate')}: ${fmtDate(f.date)}${f.date === L.dayStr() ? ' (' + t('fuToday') + ')' : ''}</p><p class="loc">${esc(locLine(l))}</p></div></div>
${early ? `<p class="warn">${t('fuEarly', fmtDate(f.date))}</p>` : `<div class="navrow"><button class="btn big" data-act="fuYes">${t('fuYes')}</button><button class="btn ghost" data-act="back">${t('fuNot')}</button></div>`}${navBtns(false)}`;
  };

  V.dir = () => {
    const groups = [['gClinic', 'clinic'], ['gSvc', 'service'], ['gFac', 'facility']];
    return `${guide(t('dirTitle'), t('dirHint'), 0)}${groups.map(([k, kind]) => `<h2>${t(k)}</h2><div class="tiles small">${Object.values(D.depts).filter((d) => d.kind === kind).map((d) => tile('openLoc', `data-id="${d.locationId}" data-back="dir"`, d.icon, Lb(d.name), locLine(deptLoc(d)))).join('')}</div>`).join('')}${navBtns(false)}`;
  };

  // ---------- kiosk actions ----------
  const go = (step) => { S.step = step; window.scrollTo(0, 0); };
  A.speak = (el) => speak(el.dataset.text);
  A.home = () => { S.draft = null; go('home'); };
  A.startNew = () => { S.draft = draftNew(); go('problem'); };
  A.goFu = () => { S.fu = { phone: '', res: null, sel: null }; go('fu'); };
  A.goDir = () => { S.back = 'dir'; go('dir'); };
  A.myToken = () => go('ticket');
  A.emergency = () => { S.draft = draftNew(); go('emergency'); };
  A.print = () => window.print();
  A.goGuide = () => { const tok = L.resolve(S.activeTokenId, D.tokens); S.loc = deptLoc(D.depts[tok.deptId]).id; S.back = 'ticket'; go('loc'); };
  A.openLoc = (el) => { S.loc = el.dataset.id; S.back = el.dataset.back || 'dir'; go('loc'); };
  A.setSex = (el) => { S.draft.who.sex = el.dataset.v; };
  A.ageUnk = () => { const w = S.draft.who; w.ageUnk = !w.ageUnk; if (w.ageUnk) w.age = ''; };
  A.fill = () => { Object.assign(S.draft.who, { name: 'আব্দুল করিম', age: '58', sex: 'male', phone: '01711000000', ageUnk: false }); };
  A.other = () => { S.draft.choosing = true; };
  A.setDept = (el) => { S.draft.deptId = el.dataset.id; S.draft.choosing = false; };

  function chooseService(svc, text) {
    const d = S.draft; d.svc = svc; d.deptId = svc.deptId; d.noMatch = false;
    d.qList = svc.kind === 'problem' ? ['flags'].concat(svc.questions) : []; d.qIdx = 0; d.answers = {};
    go(d.qList.length ? 'question' : 'route');
  }
  A.pickService = (el) => chooseService(seed.services.find((s) => s.id === el.dataset.id));
  function handleText(txt) {
    const d = S.draft; d.text = txt; d.heard = txt; d.noMatch = false;
    const flag = L.matchRedFlag(txt);
    if (flag) { d.flagId = flag.id; return go('emergency'); }
    const svc = L.matchService(txt);
    if (svc) return chooseService(svc);
    d.noMatch = true;
  }
  A.submitText = () => { const v = (S.draft.text || '').trim(); if (!v) { S.draft.noMatch = true; return; } handleText(v); };
  A.listenProblem = () => listen((txt) => { handleText(txt); render(); });
  A.flag = (el) => { S.draft.flagId = el.dataset.id; go('emergency'); };
  function nextQ() { const d = S.draft; d.qIdx++; go(d.qIdx >= d.qList.length ? 'route' : 'question'); }
  A.answer = (el) => { const d = S.draft, qid = d.qList[d.qIdx]; if (qid !== 'flags') d.answers[qid] = el.dataset.v; nextQ(); };
  A.listenAnswer = () => listen((txt) => { const d = S.draft, qid = d.qList[d.qIdx]; const v = L.matchOption(seed.questions[qid].opts, txt); if (v) { d.answers[qid] = v; nextQ(); } else toast(t('notHeard')); render(); });
  A.whoGo = () => go('who');
  A.back = () => {
    const d = S.draft, s = S.step;
    if (s === 'problem' || s === 'fu' || s === 'dir') return go('home');
    if (s === 'question') { if (d.qIdx > 0) { d.qIdx--; return; } return go('problem'); }
    if (s === 'route') { if (d.choosing) { d.choosing = false; return; } if (d.qList.length) { d.qIdx = d.qList.length - 1; return go('question'); } return go('problem'); }
    if (s === 'who') return go('route');
    if (s === 'health') return go('who');
    if (s === 'fuConfirm') return go('fu');
    if (s === 'loc') return go(S.back === 'route' ? 'route' : S.back === 'ticket' ? 'ticket' : 'dir');
    go('home');
  };

  const RANGES = { age: [0, 120, 'age'], weight: [1, 300, 'weight'], sys: [40, 300, 'sys'], dia: [20, 200, 'dia'], temp: [80, 115, 'temp'], glucose: [1, 60, 'glucose'] };
  function checkNum(raw, key) { // blank => null (Unknown / Not measured). Invalid => throws, never guessed.
    if (raw == null || String(raw).trim() === '') return null;
    const v = L.num(raw), r = RANGES[key];
    if (v == null || +v < r[0] || +v > r[1]) throw Object.assign(new Error('BAD'), { field: t(r[2]) });
    return v;
  }
  A.whoNext = async () => {
    const d = S.draft;
    try { d.whoClean = { age: d.who.ageUnk ? null : checkNum(d.who.age, 'age') }; }
    catch (e) { return toast(t('bad', e.field)); }
    if (d.who.phone && L.digits(d.who.phone).length < 6) return toast(t('bad', t('phone')));
    if (d.svc && d.svc.kind === 'problem') return go('health');
    await issue();
  };
  A.healthSkip = async () => { S.draft.health = {}; await issue(); };
  A.healthGo = async () => {
    const h = S.draft.health, c = {};
    try { ['weight', 'temp', 'sys', 'dia', 'glucose'].forEach((k) => { c[k] = checkNum(h[k], k); }); }
    catch (e) { return toast(t('bad', e.field)); }
    if ((c.sys == null) !== (c.dia == null)) return toast(t('bad', t('sys')));
    ['cond', 'meds', 'allergy'].forEach((k) => { c[k] = (h[k] || '').trim() || null; });
    S.draft.health = c; await issue();
  };
  async function issue() {
    const d = S.draft, w = d.who, svc = d.svc, dept = D.depts[d.deptId];
    const pat = await L.savePatient({ name: w.name, age: d.whoClean ? d.whoClean.age : null, sex: w.sex || 'unknown', phone: w.phone });
    const intake = { problemId: svc.id, complaintLabel: svc.label, complaintText: d.text || null, answers: d.answers, health: d.health };
    const tok = await L.createToken({ deptId: dept.id, kind: svc.kind === 'task' ? 'service' : 'new', patientId: pat.id, patientName: pat.name, intake });
    S.activeTokenId = tok.id; await L.setSetting('activeToken', tok.id); go('ticket');
  }
  A.emrToken = async () => {
    const f = seed.redFlags.find((x) => x.id === (S.draft && S.draft.flagId));
    const tok = await L.createToken({ deptId: 'EMR', kind: 'emergency', priority: 2, patientName: t('emrPat'), intake: { problemId: null, complaintLabel: f ? f.label : B2('জরুরি', 'Emergency'), complaintText: S.draft && S.draft.text || null, answers: {}, health: {} } });
    S.activeTokenId = tok.id; await L.setSetting('activeToken', tok.id); go('ticket');
  };
  const B2 = (bn, en) => ({ bn, en });
  A.fuDemo = (el) => { S.fu.phone = el.dataset.v; };
  A.fuFind = async () => { S.fu.res = await L.findFollowups(S.fu.phone); };
  A.fuPick = (el) => { S.fu.sel = S.fu.res[+el.dataset.i]; go('fuConfirm'); };
  A.fuYes = async () => {
    try { const r = await L.checkinFollowup(S.fu.sel.f.id); S.activeTokenId = r.token.id; await L.setSetting('activeToken', r.token.id); go('ticket'); }
    catch (e) { toast(e.message === 'NOT_YET' ? t('fuEarly', fmtDate(e.date)) : t('fuNone')); }
  };

  V.home.step = 'home';
  SP.ui.kioskSteps = { home: V.home, problem: V.problem, question: V.question, emergency: V.emergency, route: V.route, who: V.who, health: V.health, ticket: V.ticket, loc: V.loc, fu: V.fu, fuConfirm: V.fuConfirm, dir: V.dir };
  SP.ui.statusPanel = statusPanel; SP.ui.stepBar = stepBar; SP.ui.go = go;
})();
