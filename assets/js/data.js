/* ShasthoPath — seed configuration (all fictional demo data).
   Routing rules, red flags, questions and locations are CONFIG, copied into IndexedDB on first run.
   Hospital clinicians/admins own these rules — nothing here is a diagnosis or a medical schedule. */
(function () {
  const SP = (window.SP = window.SP || {});
  const B = (bn, en) => ({ bn, en });
  SP.B = B;

  SP.buildings = {
    A: B('ভবন-ক (মূল বহির্বিভাগ)', 'Building A (Main OPD)'),
    B: B('ভবন-খ (বিশেষায়িত বহির্বিভাগ)', 'Building B (Specialist OPD)'),
    E: B('জরুরি ভবন', 'Emergency Block'),
  };

  const loc = (id, building, floor, room, name, how) => ({ id: 'loc-' + id, building, floor, room, name, how });
  const locations = [
    loc('INFO', 'A', 0, 'Hall', B('তথ্য ডেস্ক', 'Information desk'), B('আপনার ঠিক সামনে, প্রধান প্রবেশপথের পাশে।', 'Right in front of you, next to the main entrance.')),
    loc('REG', 'A', 0, '1-2', B('রেজিস্ট্রেশন কাউন্টার', 'Registration counter'), B('প্রধান হলের বাম পাশে কাউন্টার ১ ও ২।', 'On the left side of the main hall, counters 1 and 2.')),
    loc('MED', 'A', 1, '105', B('মেডিসিন বহির্বিভাগ', 'Medicine OPD'), B('হলের শেষ প্রান্তের সিঁড়ি দিয়ে ১ম তলায় উঠুন। ডানে ঘুরে ১০৫ নম্বর রুম।', 'Take the stairs at the end of the hall to the 1st floor. Turn right, Room 105.')),
    loc('SURG', 'A', 2, '203', B('সার্জারি বহির্বিভাগ', 'Surgery OPD'), B('সিঁড়ি দিয়ে ২য় তলায় উঠুন। বামে ঘুরে ২০৩ নম্বর রুম।', 'Take the stairs to the 2nd floor. Turn left, Room 203.')),
    loc('PED', 'A', 1, '112', B('শিশু বিভাগ', 'Pediatrics OPD'), B('সিঁড়ি দিয়ে ১ম তলায় উঠুন। বামে ঘুরে শেষ রুম, ১১২।', 'Take the stairs to the 1st floor. Turn left, last room (112).')),
    loc('ORT', 'B', 2, '207', B('অর্থোপেডিক্স বহির্বিভাগ', 'Orthopedics OPD'), B('মূল প্রবেশপথ দিয়ে ঢুকে ডান দিকের ঢাকা পথ ধরে ভবন-খ-তে যান। সিঁড়ি দিয়ে ২য় তলায় উঠে বামে ঘুরুন। ২০৭ নম্বর রুম।', 'Enter by the main entrance and take the covered walkway on the right to Building B. Climb the stairs to the 2nd floor and turn left. Room 207.')),
    loc('GYN', 'B', 1, '110', B('গাইনি বহির্বিভাগ', 'Gynecology OPD'), B('ঢাকা পথ ধরে ভবন-খ-তে যান। ১ম তলায় উঠে ডানে ১১০ নম্বর রুম।', 'Take the covered walkway to Building B. Go up to the 1st floor, Room 110 on the right.')),
    loc('EYE', 'B', 3, '304', B('চক্ষু বহির্বিভাগ', 'Eye OPD'), B('ঢাকা পথ ধরে ভবন-খ-তে যান। লিফট বা সিঁড়ি দিয়ে ৩য় তলায় উঠুন। ৩০৪ নম্বর রুম।', 'Take the covered walkway to Building B. Lift or stairs to the 3rd floor. Room 304.')),
    loc('ENT', 'B', 3, '310', B('নাক-কান-গলা বহির্বিভাগ', 'ENT OPD'), B('ভবন-খ-র ৩য় তলায় উঠে বামে ঘুরুন। ৩১০ নম্বর রুম।', 'In Building B go to the 3rd floor and turn left. Room 310.')),
    loc('DEN', 'B', 0, '005', B('দন্ত বিভাগ', 'Dental unit'), B('ঢাকা পথ ধরে ভবন-খ-তে যান। নিচতলাতেই ০০৫ নম্বর রুম।', 'Take the covered walkway to Building B. Room 005 is on the ground floor.')),
    loc('LAB', 'A', 0, 'Lab 1-3', B('ল্যাবরেটরি (পরীক্ষা)', 'Laboratory (tests)'), B('প্রধান হলের ডান পাশে ল্যাব কাউন্টার ১–৩।', 'On the right side of the main hall, lab counters 1 to 3.')),
    loc('RAD', 'B', 0, 'X-ray', B('এক্স-রে ও আল্ট্রাসনো', 'X-ray & ultrasound'), B('ঢাকা পথ ধরে ভবন-খ-তে যান। নিচতলায় এক্স-রে কক্ষ।', 'Take the covered walkway to Building B. X-ray room on the ground floor.')),
    loc('PHA', 'A', 0, 'Pharmacy 1', B('ফার্মেসি (ওষুধ)', 'Pharmacy'), B('প্রধান হলের শেষে ফার্মেসি কাউন্টার ১।', 'At the end of the main hall, pharmacy counter 1.')),
    loc('EMR', 'E', 0, 'ER', B('জরুরি বিভাগ', 'Emergency'), B('প্রধান প্রবেশপথ থেকে সোজা বাইরে গিয়ে লাল সাইনের জরুরি ভবনে ঢুকুন। দৌড়ে নয়, দ্রুত হাঁটুন—সাহায্য চাইতে পারেন।', 'Go straight out of the main entrance to the Emergency Block (red sign). Walk quickly and ask anyone for help.')),
    loc('BIL', 'A', 0, 'Billing 2', B('বিলিং', 'Billing'), B('প্রধান হলের বাম পাশে বিলিং কাউন্টার ২।', 'Left side of the main hall, billing counter 2.')),
    loc('REP', 'A', 0, 'Report 4', B('রিপোর্ট ডেস্ক', 'Report desk'), B('বিলিং কাউন্টারের পাশে রিপোর্ট ডেস্ক ৪।', 'Next to billing, report desk 4.')),
    loc('AR', 'A', 0, '012', B('অ্যান্টি-র‍্যাবিস / ইনজেকশন কক্ষ', 'Anti-rabies / injection room'), B('প্রধান হলের ডান পাশের করিডোরে ০১২ নম্বর ইনজেকশন কক্ষ।', 'In the right-hand corridor off the main hall, injection room 012.')),
    loc('WC', 'A', 0, 'WC', B('টয়লেট', 'Toilet'), B('সিঁড়ির পাশে, প্রতি তলায় আছে।', 'Next to the stairs, on every floor.')),
    loc('FOOD', 'A', 0, 'Canteen', B('খাবারের জায়গা (ক্যান্টিন)', 'Food area (canteen)'), B('প্রধান হলের পূর্ব দিকে ক্যান্টিন।', 'East side of the main hall.')),
  ];

  // kind: clinic | service | facility. queue: has a token queue. fu: supports a follow-up queue (CODE-FU).
  const dep = (code, icon, kind, name, avgMin, o) => Object.assign({ id: code, code, icon, kind, name, avgMin, locationId: 'loc-' + code, queue: true, fu: false }, o || {});
  const departments = [
    dep('INFO', 'ℹ️', 'facility', B('তথ্য ডেস্ক', 'Information desk'), 0, { queue: false }),
    dep('REG', '📝', 'facility', B('রেজিস্ট্রেশন', 'Registration'), 0, { queue: false }),
    dep('MED', '🩺', 'clinic', B('মেডিসিন', 'Medicine'), 8, { fu: true, doctorId: 'dr-med' }),
    dep('SURG', '🔪', 'clinic', B('সার্জারি', 'Surgery'), 10, { fu: true, doctorId: 'dr-surg' }),
    dep('ORT', '🦴', 'clinic', B('অর্থোপেডিক্স (হাড় ও জোড়া)', 'Orthopedics (bones & joints)'), 10, { fu: true, doctorId: 'dr-ort' }),
    dep('PED', '👶', 'clinic', B('শিশু বিভাগ', 'Pediatrics (children)'), 8, { fu: true, doctorId: 'dr-ped' }),
    dep('GYN', '🤰', 'clinic', B('গাইনি (নারী ও প্রসূতি)', 'Gynecology'), 10, { fu: true, doctorId: 'dr-gyn' }),
    dep('EYE', '👁️', 'clinic', B('চক্ষু', 'Eye'), 8, { fu: true, doctorId: 'dr-eye' }),
    dep('ENT', '👂', 'clinic', B('নাক-কান-গলা', 'ENT (ear, nose, throat)'), 8, { fu: true, doctorId: 'dr-ent' }),
    dep('DEN', '🦷', 'clinic', B('দন্ত', 'Dental'), 12, { fu: true, doctorId: 'dr-den' }),
    dep('LAB', '🧪', 'service', B('ল্যাবরেটরি (পরীক্ষা)', 'Laboratory (tests)'), 4),
    dep('RAD', '🩻', 'service', B('এক্স-রে / আল্ট্রাসনো', 'X-ray / ultrasound'), 6),
    dep('PHA', '💊', 'service', B('ফার্মেসি (ওষুধ)', 'Pharmacy'), 3),
    dep('EMR', '🚨', 'clinic', B('জরুরি বিভাগ', 'Emergency'), 0, { doctorId: 'dr-emr' }),
    dep('BIL', '💳', 'service', B('বিলিং', 'Billing'), 3),
    dep('REP', '📄', 'service', B('রিপোর্ট ডেস্ক', 'Report desk'), 3),
    dep('AR', '💉', 'service', B('অ্যান্টি-র‍্যাবিস / ফলো-আপ সেবা', 'Anti-rabies / follow-up service'), 6, { fu: true }),
    dep('WC', '🚻', 'facility', B('টয়লেট', 'Toilet'), 0, { queue: false }),
    dep('FOOD', '🍚', 'facility', B('খাবারের জায়গা', 'Food area'), 0, { queue: false }),
  ];

  const doctors = [
    { id: 'dr-med', deptId: 'MED', name: B('ডা. ফারজানা আহমেদ', 'Dr. Farzana Ahmed') },
    { id: 'dr-surg', deptId: 'SURG', name: B('ডা. রফিকুল ইসলাম', 'Dr. Rafiqul Islam') },
    { id: 'dr-ort', deptId: 'ORT', name: B('ডা. মাহমুদুল হাসান', 'Dr. Mahmudul Hasan') },
    { id: 'dr-ped', deptId: 'PED', name: B('ডা. নাসরিন সুলতানা', 'Dr. Nasrin Sultana') },
    { id: 'dr-gyn', deptId: 'GYN', name: B('ডা. শাহনাজ পারভীন', 'Dr. Shahnaz Parvin') },
    { id: 'dr-eye', deptId: 'EYE', name: B('ডা. তানভীর আলম', 'Dr. Tanvir Alam') },
    { id: 'dr-ent', deptId: 'ENT', name: B('ডা. ইমরান হোসেন', 'Dr. Imran Hossain') },
    { id: 'dr-den', deptId: 'DEN', name: B('ডা. সাবরিনা খান', 'Dr. Sabrina Khan') },
    { id: 'dr-emr', deptId: 'EMR', name: B('ডিউটি ডাক্তার', 'Duty doctor') },
  ];

  // Symptom/problem -> service routing. kw = substring (Bengali) / whole-word (English) keywords.
  // This is ROUTING ASSISTANCE for navigation, never a diagnosis.
  const svc = (id, icon, kind, label, deptId, kw, questions, o) => Object.assign({ id, icon, kind, label, deptId, kw, questions: questions || [] }, o || {});
  const CLIN = ['duration', 'prev', 'reports'];
  const services = [
    svc('bone', '✋', 'problem', B('হাত, পা, হাড় বা কোমরে ব্যথা', 'Pain in hand, leg, bone or back'), 'ORT', ['হাত', 'পায়ে', 'পায়ের', 'পা ব্যথা', 'হাড়', 'কোমর', 'ঘাড়', 'জোড়া', 'হাঁটু', 'ভেঙে', 'hand', 'leg', 'arm', 'bone', 'back', 'joint', 'knee', 'neck', 'fracture', 'shoulder'], ['duration', 'injury', 'prev', 'reports']),
    svc('head', '🤕', 'problem', B('মাথা ব্যথা বা মাথা ঘোরা', 'Headache or dizziness'), 'MED', ['মাথা', 'ঘুরছে', 'headache', 'head', 'dizzy', 'dizziness'], CLIN),
    svc('fever', '🤒', 'problem', B('জ্বর, সর্দি, কাশি বা দুর্বলতা', 'Fever, cold, cough or weakness'), 'MED', ['জ্বর', 'জ্বরের', 'সর্দি', 'কাশি', 'দুর্বল', 'fever', 'cold', 'cough', 'weak', 'weakness'], CLIN),
    svc('stomach', '🤢', 'problem', B('পেটে সমস্যা, বমি বা পাতলা পায়খানা', 'Stomach problem, vomiting or loose motion'), 'MED', ['পেট', 'বমি', 'পাতলা', 'stomach', 'vomit', 'vomiting', 'diarrhea', 'diarrhoea', 'loose motion'], CLIN),
    svc('eye', '👁️', 'problem', B('চোখের সমস্যা', 'Eye problem'), 'EYE', ['চোখ', 'দেখতে', 'eye', 'vision'], ['duration', 'injury', 'prev', 'reports']),
    svc('ent', '👂', 'problem', B('কান, নাক বা গলার সমস্যা', 'Ear, nose or throat problem'), 'ENT', ['কান', 'নাক', 'গলা', 'ear', 'nose', 'throat'], CLIN),
    svc('dental', '🦷', 'problem', B('দাঁতের সমস্যা', 'Dental problem'), 'DEN', ['দাঁত', 'মাড়ি', 'tooth', 'teeth', 'dental', 'gum'], CLIN),
    svc('women', '🤰', 'problem', B('নারীদের সমস্যা বা গর্ভাবস্থা', "Women's health or pregnancy"), 'GYN', ['গর্ভ', 'প্রসব', 'মাসিক', 'pregnant', 'pregnancy', 'period', 'delivery'], ['duration', 'pregnant', 'prev', 'reports']),
    svc('child', '👶', 'problem', B('শিশুর সমস্যা (১২ বছরের কম)', "Child's problem (under 12)"), 'PED', ['শিশু', 'বাচ্চা', 'বাচ্চার', 'child', 'baby', 'kid'], CLIN),
    svc('wound', '🩹', 'problem', B('কাটা, ফোঁড়া, গোটা বা ঘা', 'Cut, boil, lump or wound'), 'SURG', ['কাটা', 'ফোঁড়া', 'গোটা', 'ঘা', 'cut', 'boil', 'lump', 'wound', 'swelling'], ['duration', 'injury', 'prev', 'reports']),
    svc('bite', '🐕', 'problem', B('কুকুর, বিড়াল বা প্রাণীর কামড়', 'Dog, cat or animal bite'), 'AR', ['কুকুর', 'বিড়াল', 'কামড়', 'বানর', 'dog', 'cat', 'bite', 'bitten', 'monkey'], ['biteWhen', 'prev']),
    svc('report', '📄', 'task', B('রিপোর্ট নিতে এসেছি', 'I came to collect a report'), 'REP', ['রিপোর্ট', 'report']),
    svc('medicine', '💊', 'task', B('ওষুধ নিতে এসেছি', 'I came to collect medicine'), 'PHA', ['ওষুধ', 'ফার্মেসি', 'medicine', 'pharmacy']),
    svc('bill', '💳', 'task', B('বিল দিতে এসেছি', 'I came to pay a bill'), 'BIL', ['বিল', 'টাকা', 'bill', 'payment']),
    svc('test', '🧪', 'task', B('রক্ত/প্রস্রাব পরীক্ষা করাতে এসেছি', 'I came for a blood/urine test'), 'LAB', ['পরীক্ষা', 'টেস্ট', 'ল্যাব', 'blood test', 'lab', 'test']),
    svc('xray', '🩻', 'task', B('এক্স-রে বা আল্ট্রাসনো', 'X-ray or ultrasound'), 'RAD', ['এক্স-রে', 'এক্সরে', 'আল্ট্রা', 'x-ray', 'xray', 'ultrasound', 'usg']),
    svc('unsure', '❓', 'task', B('বুঝতে পারছি না', 'I am not sure'), 'INFO', []),
  ];

  // Emergency red flags (hospital-configurable). Any hit => EMERGENCY screen. Escalation only, no diagnosis.
  const redFlags = [
    { id: 'bleeding', icon: '🩸', label: B('খুব বেশি রক্তপাত', 'Severe bleeding'), kw: ['রক্তপাত', 'রক্ত পড়ছে', 'রক্তক্ষরণ', 'bleeding'] },
    { id: 'breath', icon: '😮‍💨', label: B('শ্বাস নিতে খুব কষ্ট', 'Difficulty breathing'), kw: ['শ্বাস কষ্ট', 'শ্বাসকষ্ট', 'শ্বাস নিতে', 'দম বন্ধ', 'breathing', 'cannot breathe'] },
    { id: 'unconscious', icon: '😵', label: B('অজ্ঞান / জ্ঞান নেই', 'Unconscious / lost consciousness'), kw: ['অজ্ঞান', 'জ্ঞান হারা', 'unconscious', 'fainted'] },
    { id: 'chest', icon: '💔', label: B('বুকে তীব্র ব্যথা', 'Severe chest pain'), kw: ['বুকে ব্যথা', 'বুক ব্যথা', 'বুকে চাপ', 'chest pain'] },
    { id: 'trauma', icon: '🚑', label: B('বড় দুর্ঘটনা বা গুরুতর আঘাত', 'Major accident or serious injury'), kw: ['দুর্ঘটনা', 'গুরুতর আঘাত', 'accident', 'serious injury'] },
    { id: 'allergy', icon: '🐝', label: B('হঠাৎ তীব্র অ্যালার্জি (মুখ/গলা ফোলা)', 'Sudden severe allergic reaction'), kw: ['অ্যালার্জি', 'এলার্জি', 'allergic reaction'] },
    { id: 'seizure', icon: '🌀', label: B('খিঁচুনি', 'Seizure / fit'), kw: ['খিঁচুনি', 'খিচুনি', 'seizure'] },
  ];

  const YN = [
    { v: 'yes', label: B('হ্যাঁ', 'Yes'), icon: '✅', kw: ['হ্যাঁ', 'হ্যা', 'জি', 'yes', 'yeah'] },
    { v: 'no', label: B('না', 'No'), icon: '❌', kw: ['না', 'no'] },
    { v: 'unknown', label: B('জানি না', "Don't know"), icon: '❔', kw: ['জানি না', 'জানিনা', 'know'] },
  ];
  const DUR = [
    { v: 'today', label: B('আজ', 'Today'), icon: '🕐', kw: ['আজ', 'ঘণ্টা', 'today', 'hour'] },
    { v: 'd13', label: B('১–৩ দিন', '1–3 days'), icon: '📅', kw: ['এক দিন', 'দুই দিন', 'তিন দিন', '১', '২', '৩', '1', '2', '3', 'day'] },
    { v: 'w1', label: B('প্রায় ১ সপ্তাহ', 'About 1 week'), icon: '🗓️', kw: ['সপ্তাহ', 'week', '৪', '৫', '৬', '৭', '4', '5', '6', '7'] },
    { v: 'long', label: B('১ সপ্তাহের বেশি', 'More than 1 week'), icon: '⏳', kw: ['মাস', 'বছর', 'month', 'year'] },
    { v: 'unknown', label: B('জানি না', "Don't know"), icon: '❔', kw: ['জানি না', 'জানিনা', 'know'] },
  ];
  const questions = {
    flags: { text: B('এখন কি এগুলোর কোনোটি আছে?', 'Do you have any of these right now?') },
    duration: { text: B('কতদিন ধরে এই সমস্যা?', 'For how long have you had this problem?'), opts: DUR },
    biteWhen: { text: B('কামড়ের পর কতদিন হয়েছে?', 'How long since the bite?'), opts: DUR },
    injury: { text: B('কোনো আঘাত পেয়েছেন?', 'Did you get any injury?'), opts: YN },
    prev: { text: B('এই সমস্যায় আগে ডাক্তার দেখিয়েছেন?', 'Have you seen a doctor for this before?'), opts: YN },
    reports: { text: B('সাথে কোনো রিপোর্ট বা এক্স-রে আছে?', 'Do you have any reports or X-rays with you?'), opts: YN },
    pregnant: { text: B('আপনি কি গর্ভবতী? (জানলে বলুন)', 'Are you pregnant? (only if you know)'), opts: YN },
  };

  SP.seed = { hospital: B('ডেমো মেডিকেল কলেজ হাসপাতাল', 'Demo Medical College Hospital'), locations, departments, doctors, services, redFlags, questions };
})();
