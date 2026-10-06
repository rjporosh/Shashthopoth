/* ShasthoPath — logic: seeding, routing assistance, tokens, queues, follow-ups.
   No diagnosis, no prescribing, no guessing of missing values (null stays null). */
(function () {
  const SP = (window.SP = window.SP || {});
  const db = SP.db, B = SP.B;
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const dayStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dayStr(d); };
  const uid = (p) => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const err = (code, extra) => Object.assign(new Error(code), extra || {});
  const digits = (s) => String(s == null ? '' : s).replace(/[০-৯]/g, (c) => '০১২৩৪৫৬৭৮৯'.indexOf(c)).replace(/\D/g, '');
  const num = (s) => { const d = String(s == null ? '' : s).replace(/[০-৯]/g, (c) => '০১২৩৪৫৬৭৮৯'.indexOf(c)).replace(/[^\d.]/g, ''); return d === '' || isNaN(+d) ? null : d; };
  const hist = (t, action, note) => t.history.push({ ts: Date.now(), action, note: note || null });
  const order = (a, b) => (b.priority - a.priority) || (a.orderAt - b.orderAt);

  // ---------- settings ----------
  const getSetting = async (k, d) => { const r = await db.get('settings', k); return r ? r.value : d; };
  const setSetting = (k, v) => db.put('settings', { id: k, value: v });

  // ---------- seeding ----------
  async function seedConfig() {
    const s = SP.seed;
    await db.putMany('departments', s.departments);
    await db.putMany('locations', s.locations);
    await db.putMany('doctors', s.doctors);
    await db.putMany('services', s.services.concat(s.redFlags.map((r) => ({ id: 'flag-' + r.id, kind: 'redflag', label: r.label, kw: r.kw, icon: r.icon, flagId: r.id }))));
    await db.putMany('settings', [{ id: 'hospital', value: s.hospital }, { id: 'demo', value: true }, { id: 'lang', value: 'bn' }]);
  }
  async function seedDemoPeople() {
    const now = Date.now();
    await db.putMany('patients', [
      { id: 'pat_demo_rahim', name: 'রহিম উদ্দিন', age: '45', sex: 'male', phone: '01700000001', createdAt: now },
      { id: 'pat_demo_salma', name: 'সালমা খাতুন', age: '32', sex: 'female', phone: '01700000002', createdAt: now },
    ]);
    // Dates/labels below are FICTIONAL demo data entered "by a clinician". No universal schedule is hard-coded.
    await db.putMany('followups', [
      { id: 'fu_demo_1', patientId: 'pat_demo_rahim', deptId: 'AR', date: dayStr(), visitNo: 2, label: B('অ্যান্টি-র‍্যাবিস ফলো-আপ (ডাক্তারের নির্দেশমতো)', 'Anti-rabies follow-up (as instructed by clinician)'), status: 'scheduled' },
      { id: 'fu_demo_2', patientId: 'pat_demo_salma', deptId: 'MED', date: addDays(3), visitNo: 2, label: B('মেডিসিন রিভিউ ভিজিট', 'Medicine review visit'), status: 'scheduled' },
    ]);
  }
  async function init() {
    await db.open();
    if ((await db.count('departments')) === 0) { await seedConfig(); await seedDemoPeople(); }
  }
  async function resetDemo() {
    const lang = await getSetting('lang', 'bn');
    await db.clearAll(); await seedConfig(); await seedDemoPeople(); await setSetting('lang', lang);
  }

  // ---------- routing assistance ----------
  function kwHits(text, kws) {
    const s = String(text || '').toLowerCase();
    return kws.reduce((n, k) => {
      const kk = k.toLowerCase();
      if (/^[a-z0-9][a-z0-9 \-]*$/.test(kk)) return n + (new RegExp('\\b' + kk.replace(/-/g, '\\-') + 's?\\b').test(s) ? 1 : 0);
      return n + (s.includes(kk) ? 1 : 0);
    }, 0);
  }
  const matchRedFlag = (text) => SP.seed.redFlags.find((r) => kwHits(text, r.kw) > 0) || null;
  function matchService(text) {
    let best = null, bestN = 0;
    SP.seed.services.forEach((s) => { const n = kwHits(text, s.kw); if (n > bestN) { best = s; bestN = n; } });
    return best;
  }
  function matchOption(opts, text) { // unknown first so "জানি না" is not read as "না"
    const sorted = opts.slice().sort((a) => (a.v === 'unknown' ? -1 : 1));
    return (sorted.find((o) => kwHits(text, o.kw) > 0) || {}).v || null;
  }

  // ---------- patients ----------
  async function savePatient(p) {
    const phone = digits(p.phone) || null;
    const ex = phone ? (await db.all('patients')).find((x) => x.phone === phone) : null;
    const rec = Object.assign({ id: uid('pat'), createdAt: Date.now() }, ex || {}, {
      name: (p.name || '').trim() || (ex && ex.name) || null,
      age: p.age != null ? p.age : ex ? ex.age : null,
      sex: p.sex || (ex && ex.sex) || 'unknown',
      phone, updatedAt: Date.now(),
    });
    await db.put('patients', rec);
    return rec;
  }

  // ---------- tokens & queues ----------
  async function _issue(a, o) {
    const dept = o.dept, queueId = o.followup ? dept.code + '-FU' : dept.code, day = dayStr();
    let q = (await a.get('queues', queueId)) || { id: queueId, deptId: dept.id, followup: !!o.followup, seq: 0, day };
    if (q.day !== day) { q.seq = 0; q.day = day; }
    q.seq += 1;
    await a.put('queues', q);
    const all = await a.all('tokens'), pr = o.priority || 0, now = Date.now();
    const ahead = all.filter((t) => t.queueId === queueId && t.day === day && t.status === 'waiting' && t.priority >= pr).length;
    const tok = {
      id: uid('tok'), code: `${queueId}-${pad(q.seq, 3)}`, queueId, deptId: dept.id, kind: o.kind || 'new', priority: pr,
      seq: q.seq, day, status: 'waiting', createdAt: now, orderAt: now, patientId: o.patientId || null, patientName: o.patientName || null,
      intake: o.intake || null, visitNo: o.visitNo || 1, followupId: o.followupId || null, transferredFrom: o.transferredFrom || null,
      aheadAtIssue: ahead, recalls: 0, history: [{ ts: now, action: 'issued', note: null }],
    };
    await a.put('tokens', tok);
    return tok;
  }
  const createToken = (o) => db.tx(['queues', 'tokens', 'departments'], async (a) => {
    const dept = await a.get('departments', o.deptId);
    if (!dept || !dept.queue) throw err('NO_QUEUE');
    return _issue(a, Object.assign({}, o, { dept }));
  });

  const todays = (tokens) => tokens.filter((t) => t.day === dayStr());
  const waitingOf = (tokens, queueId) => todays(tokens).filter((t) => t.queueId === queueId && t.status === 'waiting').sort(order);
  const servingOf = (tokens, queueId) => todays(tokens).find((t) => t.queueId === queueId && t.status === 'serving') || null;
  const aheadOf = (t, tokens) => waitingOf(tokens, t.queueId).filter((x) => x.id !== t.id && order(x, t) < 0).length;
  function resolve(id, tokens) { // follow transfer chain to the patient's live token
    let t = tokens.find((x) => x.id === id), n = 0;
    while (t && t.transferredTo && n++ < 10) t = tokens.find((x) => x.id === t.transferredTo) || t;
    return t || null;
  }

  const mutate = (id, fn) => db.tx(['tokens', 'followups'], async (a) => {
    const t = await a.get('tokens', id);
    if (!t) throw err('NOT_FOUND');
    await fn(t, a);
    await a.put('tokens', t);
    return t;
  });
  const callNext = (queueId) => db.tx(['tokens'], async (a) => {
    const all = todays(await a.all('tokens'));
    if (all.some((t) => t.queueId === queueId && t.status === 'serving')) throw err('SERVING');
    const next = all.filter((t) => t.queueId === queueId && t.status === 'waiting').sort(order)[0];
    if (!next) return null;
    next.status = 'serving'; next.calledAt = Date.now(); hist(next, 'called');
    await a.put('tokens', next);
    return next;
  });
  const recall = (id) => mutate(id, (t) => { if (t.status !== 'serving') throw err('NOT_SERVING'); t.recalls += 1; t.calledAt = Date.now(); hist(t, 'recalled'); });
  const skip = (id) => mutate(id, (t) => { if (!['serving', 'waiting'].includes(t.status)) throw err('BAD_STATE'); t.status = 'skipped'; hist(t, 'skipped'); });
  const requeue = (id) => mutate(id, (t) => { if (t.status !== 'skipped') throw err('BAD_STATE'); t.status = 'waiting'; t.orderAt = Date.now(); hist(t, 'requeued'); });
  const cancel = (id) => mutate(id, (t) => { if (!['serving', 'waiting', 'skipped'].includes(t.status)) throw err('BAD_STATE'); t.status = 'cancelled'; hist(t, 'cancelled'); });
  const setPriority = (id, level) => mutate(id, (t) => { if (t.status !== 'waiting') throw err('BAD_STATE'); t.priority = level; hist(t, level ? 'priority' : 'priority-removed'); });
  const complete = (id) => mutate(id, async (t, a) => {
    if (t.status !== 'serving') throw err('NOT_SERVING');
    t.status = 'done'; t.doneAt = Date.now(); hist(t, 'completed');
    if (t.followupId) { const f = await a.get('followups', t.followupId); if (f) { f.status = 'completed'; await a.put('followups', f); } }
  });
  const transfer = (id, toDeptId) => db.tx(['tokens', 'queues', 'departments'], async (a) => {
    const old = await a.get('tokens', id), dept = await a.get('departments', toDeptId);
    if (!old || !dept || !dept.queue) throw err('NOT_FOUND');
    if (!['waiting', 'serving'].includes(old.status)) throw err('BAD_STATE');
    const nt = await _issue(a, { dept, kind: old.kind === 'emergency' ? 'emergency' : 'new', priority: old.priority, patientId: old.patientId, patientName: old.patientName, intake: old.intake, visitNo: old.visitNo, transferredFrom: old.code });
    old.status = 'transferred'; old.transferredTo = nt.id; hist(old, 'transferred', nt.code);
    await a.put('tokens', old);
    return nt;
  });

  // ---------- follow-up ----------
  async function scheduleFollowup(o) { // o: {patientId, deptId, date, visitNo, label(string), sourceTokenId}
    if (!o.date || !o.deptId || !o.patientId) throw err('MISSING');
    const f = { id: uid('fu'), patientId: o.patientId, deptId: o.deptId, date: o.date, visitNo: o.visitNo || 2, label: (o.label || '').trim() || null, status: 'scheduled', sourceTokenId: o.sourceTokenId || null };
    await db.put('followups', f);
    return f;
  }
  async function findFollowups(phone) {
    const p = digits(phone);
    if (p.length < 6) return [];
    const pats = (await db.all('patients')).filter((x) => x.phone === p), fus = await db.all('followups');
    return fus.filter((f) => f.status === 'scheduled' && pats.some((x) => x.id === f.patientId)).map((f) => ({ f, patient: pats.find((x) => x.id === f.patientId) })).sort((a, b) => a.f.date.localeCompare(b.f.date));
  }
  const checkinFollowup = (fid) => db.tx(['followups', 'queues', 'tokens', 'departments', 'patients'], async (a) => {
    const f = await a.get('followups', fid);
    if (!f) throw err('NOT_FOUND');
    if (f.status === 'checked-in' && f.tokenId) return { token: await a.get('tokens', f.tokenId), existing: true };
    if (f.status !== 'scheduled') throw err('NOT_SCHEDULED');
    if (f.date > dayStr()) throw err('NOT_YET', { date: f.date });
    const [dept, pat] = [await a.get('departments', f.deptId), await a.get('patients', f.patientId)];
    const intake = { followupVisit: true, complaintLabel: f.label, problemId: null, answers: {}, health: {} };
    const token = await _issue(a, { dept, followup: true, kind: 'followup', patientId: pat.id, patientName: pat.name, intake, visitNo: f.visitNo, followupId: f.id });
    f.status = 'checked-in'; f.tokenId = token.id;
    await a.put('followups', f);
    return { token, existing: false };
  });

  // ---------- demo helper ----------
  async function seedWaiting() {
    const rows = [['MED', 'রহিমা বেগম', 'fever', 0], ['MED', 'আব্দুল করিম', 'head', 1], ['MED', 'সুমন মিয়া', 'stomach', 0], ['ORT', 'নাজমা খাতুন', 'bone', 0], ['ORT', 'হাসান আলী', 'bone', 0], ['LAB', 'জাহিদ হোসেন', 'test', 0]];
    for (const [deptId, name, sid, pr] of rows) {
      const svc = SP.seed.services.find((s) => s.id === sid), p = await savePatient({ name });
      await createToken({ deptId, kind: svc.kind === 'task' ? 'service' : 'new', priority: pr, patientId: p.id, patientName: name, intake: { problemId: sid, complaintLabel: svc.label, complaintText: null, answers: svc.kind === 'task' ? {} : { duration: 'd13' }, health: {} } });
    }
  }
  async function counts() { const o = {}; for (const s of db.STORES) o[s] = await db.count(s); return o; }

  SP.logic = { dayStr, addDays, uid, digits, num, getSetting, setSetting, init, resetDemo, seedWaiting, counts, matchRedFlag, matchService, matchOption, savePatient, createToken, todays, waitingOf, servingOf, aheadOf, resolve, callNext, recall, skip, requeue, cancel, setPriority, complete, transfer, scheduleFollowup, findFollowups, checkinFollowup };
})();
