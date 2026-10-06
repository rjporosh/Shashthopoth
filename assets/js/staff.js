/* ShasthoPath — queue display, doctor/staff console, demo/admin, render loop, live sync, boot. */
(function () {
  const SP = window.SP, L = SP.logic, db = SP.db, ui = SP.ui, seed = SP.seed;
  const { S, D, t, Lb, esc, num, fmtDate, fmtDT, locLine, optLabel, toast, deptLoc, queueList, queueName, U } = ui;
  const V = ui.views, A = ui.acts;
  const $ = (s) => document.querySelector(s);

  // ---------- intake summary (shown to doctor; patient-reported, never a diagnosis) ----------
  function summary(tok) {
    const pat = D.patients.find((p) => p.id === tok.patientId) || {}, it = tok.intake || {}, a = it.answers || {}, h = it.health || {};
    const ans = (qid, v) => (v === undefined || v === null ? t('notAvail') : v === 'unknown' ? t('dkPat') : optLabel(qid, v) || esc(v));
    const sexL = pat.sex === 'male' ? t('male') : pat.sex === 'female' ? t('female') : t('unk');
    const fus = D.followups.filter((f) => f.patientId === tok.patientId && f.status === 'scheduled');
    const row = (k, v) => `<tr><th>${t(k)}</th><td>${v}</td></tr>`;
    const fuTxt = (tok.kind === 'followup' ? `<b>${t('vFu', num(tok.visitNo))}</b>` : '') + (fus.length ? fus.map((f) => `<div>📅 ${fmtDate(f.date)} · ${esc(Lb(f.label) || Lb(D.depts[f.deptId].name))} (${t('fuVisit', num(f.visitNo))})</div>`).join('') : tok.kind === 'followup' ? '' : t('sFuNone'));
    return `<div class="summary"><div class="sum-h">${t('sum')}</div><table>
${row('sPat', `${esc(tok.patientName || t('unk'))} <small>(${esc(tok.code)})</small>`)}${row('sAge', pat.age ? num(pat.age) : t('unk'))}${row('sSex', sexL)}
${row('sCompl', esc(Lb(it.complaintLabel)) || t('notAvail'))}${it.complaintText ? row('sRaw', '“' + esc(it.complaintText) + '”') : ''}
${row('sDur', ans('duration', a.duration !== undefined ? a.duration : a.biteWhen))}${'injury' in a ? row('sInj', ans('injury', a.injury)) : ''}${'pregnant' in a ? row('sPreg', ans('pregnant', a.pregnant)) : ''}
${row('sPrev', ans('prev', a.prev))}${row('sRep', ans('reports', a.reports))}
${row('sBP', h.sys && h.dia ? num(h.sys + '/' + h.dia) + ' mmHg' : t('notMeas'))}${row('sTemp', h.temp ? num(h.temp) + ' °F' : t('notMeas'))}${row('sGlu', h.glucose ? num(h.glucose) + ' mmol/L' : t('notAvail'))}${row('sWt', h.weight ? num(h.weight) + ' kg' : t('unk'))}
${row('sCond', h.cond ? esc(h.cond) : t('notRep'))}${row('sMeds', h.meds ? esc(h.meds) : t('notRep'))}${row('sAll', h.allergy ? esc(h.allergy) : t('notRep'))}${row('sFu', fuTxt)}</table></div>`;
  }
  ui.summary = summary;

  // ---------- queue display ----------
  V.display = () => {
    const cards = queueList().map((q) => ({ q, serv: L.servingOf(D.tokens, q.id), wait: L.waitingOf(D.tokens, q.id) })).filter((x) => x.serv || x.wait.length)
      .sort((a, b) => (b.q.id === 'EMR') - (a.q.id === 'EMR'));
    return `<div class="guide"><div><h1>${t('dispTitle')}</h1></div></div>${cards.length ? `<div class="dgrid">${cards.map(({ q, serv, wait }) => {
      const loc = deptLoc(q.dept);
      return `<section class="dcard ${q.id === 'EMR' ? 'emrc' : ''}"><h2>${q.dept.icon} ${esc(queueName(q))}</h2><p class="loc">${esc(locLine(loc))}</p>
<div class="dnow"><small>${t('nowServing')}</small><b class="${serv && serv.recalls ? 'blink' : ''}">${serv ? esc(serv.code) : '—'}${serv && serv.recalls ? ' 🔔' : ''}</b></div>
<div class="dnext"><small>${t('nextL')}</small> <b>${wait[0] ? esc(wait[0].code) : '—'}</b></div>
<div class="dwait"><small>${t('waiting')}</small> ${wait.slice(1, 6).map((w) => `<span>${esc(w.code)}</span>`).join('') || '<span class="mute">—</span>'}${wait.length > 6 ? `<span class="mute">+${num(wait.length - 6)}</span>` : ''}</div></section>`;
    }).join('')}</div>` : `<p class="warn big">${t('dispNone')}</p>`}`;
  };

  // ---------- doctor / staff console ----------
  const hasAct = (id) => L.waitingOf(D.tokens, id).length || L.servingOf(D.tokens, id);
  V.doctor = () => {
    const qs = queueList();
    if (!S.doc.queueId || !qs.some((q) => q.id === S.doc.queueId)) S.doc.queueId = (qs.find((q) => hasAct(q.id)) || qs.find((q) => q.id === 'MED')).id;
    const qid = S.doc.queueId, cur = qs.find((q) => q.id === qid), serv = L.servingOf(D.tokens, qid), wait = L.waitingOf(D.tokens, qid);
    const skipped = L.todays(D.tokens).filter((x) => x.queueId === qid && x.status === 'skipped');
    const chips = qs.slice().sort((a, b) => !!hasAct(b.id) - !!hasAct(a.id)).map((q) => { const w = L.waitingOf(D.tokens, q.id).length; return `<button class="chip ${q.id === qid ? 'on' : ''}" data-act="dq" data-id="${q.id}">${q.dept.icon} ${esc(queueName(q))}${w ? ` <i class="badge">${num(w)}</i>` : ''}${L.servingOf(D.tokens, q.id) ? ' ●' : ''}</button>`; }).join('');
    const f = S.doc.form;
    const form = f ? `<div class="fform"><h3>${t('sched')}</h3><p class="small">${t('fNoteHint')}</p><div class="grid2">
<label class="fld"><span>${t('fDate')}</span><input class="input" type="date" data-bind="doc.form.date" value="${esc(f.date)}"></label>
<label class="fld"><span>${t('fVisit')}</span><input class="input" inputmode="numeric" data-bind="doc.form.visitNo" value="${esc(f.visitNo)}"></label>
<label class="fld"><span>${t('fDept')}</span><select class="input" data-bind="doc.form.deptId">${Object.values(D.depts).filter((d) => d.fu).map((d) => `<option value="${d.id}" ${d.id === f.deptId ? 'selected' : ''}>${esc(Lb(d.name))}</option>`).join('')}</select></label>
<label class="fld"><span>${t('fNote')}</span><input class="input" data-bind="doc.form.note" value="${esc(f.note)}"></label></div>
<div class="navrow"><button class="btn" data-act="fuSave">${t('fSave')}</button><button class="btn ghost" data-act="fuClose">${t('back')}</button></div></div>` : '';
    const xfer = (id) => `<select class="input sm" data-bind="doc.xfer"><option value="">${t('transfer')}…</option>${Object.values(D.depts).filter((d) => d.queue && d.code !== cur.dept.code).map((d) => `<option value="${d.id}" ${S.doc.xfer === d.id ? 'selected' : ''}>${esc(Lb(d.name))}</option>`).join('')}</select><button class="btn sm" data-act="xfer" data-id="${id}">${t('transfer')}</button>`;
    const now = serv ? `<div class="nowcard"><div class="nc-h"><small>${t('serving')}</small><b>${esc(serv.code)}</b>${serv.priority ? `<span class="pri">⭐ ${serv.priority > 1 ? t('emr') : ''}</span>` : ''}</div>
<div class="btns"><button class="btn" data-act="complete" data-id="${serv.id}">${t('complete')}</button><button class="btn ghost" data-act="recall" data-id="${serv.id}">${t('recall')}</button><button class="btn ghost" data-act="skipT" data-id="${serv.id}">${t('skip')}</button><button class="btn ghost" data-act="cancelT" data-id="${serv.id}">${t('cancel')}</button><button class="btn ghost" data-act="fuOpen" data-id="${serv.id}">${t('sched')}</button></div>
<div class="btns">${xfer(serv.id)}</div>${form}${summary(serv)}</div>` : `<div class="nowcard empty"><p>${t('nobody')}</p></div>`;
    return `<div class="guide"><div><h1>${t('dTitle')}</h1><p class="hint">${t('sum')}</p></div></div><div class="chips qchips">${chips}</div>
<div class="split doc"><div>${now}</div><div class="side"><button class="btn big wide" data-act="callNext" ${serv || !wait.length ? 'disabled' : ''}>${t('callNext')}</button>${serv && wait.length ? `<p class="small">${t('servingFirst')}</p>` : ''}
<h3>${t('waitList')} (${num(wait.length)})</h3>${wait.length ? `<ul class="wl">${wait.map((w) => `<li><b>${esc(w.code)}</b> <span>${esc(w.patientName || t('unk'))}</span> <small>${esc(Lb((w.intake || {}).complaintLabel))}</small>${w.priority ? ' <span class="pri">⭐</span>' : ''}<span class="grow"></span><button class="chip" data-act="prio" data-id="${w.id}" data-v="${w.priority ? 0 : 1}">${w.priority ? t('unprio') : t('prio')}</button><button class="chip" data-act="cancelT" data-id="${w.id}">✖</button></li>`).join('')}</ul>` : `<p class="mute">${t('emptyQ')}</p>`}
${skipped.length ? `<h3>${t('skipped')}</h3><ul class="wl">${skipped.map((w) => `<li><b>${esc(w.code)}</b> <span>${esc(w.patientName || t('unk'))}</span><span class="grow"></span><button class="chip" data-act="requeue" data-id="${w.id}">${t('requeue')}</button></li>`).join('')}</ul>` : ''}</div></div>`;
  };

  const docQ = () => S.doc.queueId;
  A.dq = (el) => { S.doc.queueId = el.dataset.id; S.doc.form = null; };
  A.callNext = async () => { try { const n = await L.callNext(docQ()); if (!n) toast(t('emptyQ')); } catch (e) { toast(e.message === 'SERVING' ? t('servingFirst') : e.message); } };
  A.recall = (el) => L.recall(el.dataset.id);
  A.skipT = (el) => L.skip(el.dataset.id);
  A.cancelT = (el) => L.cancel(el.dataset.id);
  A.requeue = (el) => L.requeue(el.dataset.id);
  A.prio = (el) => L.setPriority(el.dataset.id, +el.dataset.v);
  A.complete = async (el) => { await L.complete(el.dataset.id); S.doc.form = null; };
  A.xfer = async (el) => { if (!S.doc.xfer) return toast(t('transfer') + '?'); const nt = await L.transfer(el.dataset.id, S.doc.xfer); S.doc.xfer = ''; S.doc.form = null; toast('→ ' + nt.code); };
  A.fuOpen = (el) => { const tok = D.tokens.find((x) => x.id === el.dataset.id); S.doc.form = { tokenId: tok.id, deptId: D.depts[tok.deptId].fu ? tok.deptId : 'MED', date: L.addDays(7), visitNo: String((tok.visitNo || 1) + 1), note: '' }; };
  A.fuClose = () => { S.doc.form = null; };
  A.fuSave = async () => {
    const f = S.doc.form, tok = D.tokens.find((x) => x.id === f.tokenId);
    if (!tok.patientId) return toast(t('unk'));
    if (!f.date || f.date < L.dayStr()) return toast(t('bad', t('fDate')));
    const vn = L.num(f.visitNo);
    if (!vn || +vn < 1) return toast(t('bad', t('fVisit')));
    await L.scheduleFollowup({ patientId: tok.patientId, deptId: f.deptId, date: f.date, visitNo: +vn, label: f.note, sourceTokenId: tok.id });
    S.doc.form = null; toast(t('fSaved'));
  };

  // ---------- admin / demo ----------
  V.admin = () => {
    const counts = SP.counts || {};
    const th = (a) => `<tr>${a.map((x) => `<th>${x}</th>`).join('')}</tr>`;
    return `<div class="guide"><div><h1>${t('aTitle')}</h1><p class="hint">${t('demoNotice')}</p></div></div>
<div class="navrow"><button class="btn" data-act="mode" data-v="kiosk">${t('mKiosk')}</button><button class="btn" data-act="mode" data-v="display">${t('mDisplay')}</button><button class="btn" data-act="mode" data-v="doctor">${t('mDoctor')}</button><button class="btn" data-act="seedQ">${t('aSeed')}</button><button class="btn ghost" data-act="demoToggle">${S.demo ? '☑' : '☐'} ${t('fill')}</button><button class="btn danger" data-act="reset">${t('aReset')}</button></div>
<h2>${t('aScript')}</h2><ol class="script">${U.scr.map((s) => `<li>${s[S.lang === 'bn' ? 0 : 1]}</li>`).join('')}</ol>
<h2>${t('aStore')}</h2><div class="chips">${Object.keys(counts).map((k) => `<span class="chip">${k}: ${num(counts[k])}</span>`).join('')}</div>
<h2>${t('aCfg')}</h2><p class="small">${t('aNote')}</p>
<div class="tbl"><table>${th(['Code', 'Service', 'Queue', 'Follow-up queue', 'Location', 'min'])}${Object.values(D.depts).map((d) => `<tr><td>${d.code}</td><td>${d.icon} ${esc(Lb(d.name))}</td><td>${d.queue ? '✔' : '—'}</td><td>${d.fu ? d.code + '-FU' : '—'}</td><td>${esc(locLine(deptLoc(d)))}</td><td>${num(d.avgMin)}</td></tr>`).join('')}</table></div>
<div class="tbl"><table>${th(['Problem → service', 'Keywords (routing config)'])}${seed.services.map((s) => `<tr><td>${s.icon} ${esc(Lb(s.label))} → <b>${s.deptId}</b></td><td>${esc(s.kw.slice(0, 8).join(', '))}</td></tr>`).join('')}</table></div>
<div class="tbl"><table>${th(['Emergency red flag', 'Keywords'])}${seed.redFlags.map((r) => `<tr><td>${r.icon} ${esc(Lb(r.label))}</td><td>${esc(r.kw.join(', '))}</td></tr>`).join('')}</table></div>`;
  };
  A.seedQ = async () => { await L.seedWaiting(); toast(t('aDone')); };
  A.reset = async () => { if (typeof confirm === 'function' && !confirm(t('aResetQ'))) return; await L.resetDemo(); S.activeTokenId = null; S.draft = null; S.step = 'home'; S.doc = { queueId: null, xfer: '', form: null }; toast(t('aDone')); };
  A.demoToggle = async () => { await L.setSetting('demo', !S.demo); };

  // ---------- chrome, render loop ----------
  A.mode = (el) => { S.mode = el.dataset.v; window.scrollTo(0, 0); };
  A.lang = async () => { S.lang = S.lang === 'bn' ? 'en' : 'bn'; await L.setSetting('lang', S.lang); };
  A.fullscreen = () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch (e) {} };

  function paintBar() {
    document.documentElement.lang = S.lang === 'bn' ? 'bn' : 'en';
    $('#brand').innerHTML = `<b>${t('app')}</b><small>${t('motto')}</small>`;
    $('#modes').innerHTML = [['kiosk', 'mKiosk'], ['display', 'mDisplay'], ['doctor', 'mDoctor'], ['admin', 'mAdmin']].map(([m, k]) => `<button class="tab ${S.mode === m ? 'on' : ''}" data-act="mode" data-v="${m}">${t(k)}</button>`).join('');
    $('#tools').innerHTML = `${S.mode === 'kiosk' && S.step !== 'home' ? `<button class="tab" data-act="home">${t('home')}</button>` : ''}<button class="tab" data-act="lang">${S.lang === 'bn' ? 'English' : 'বাংলা'}</button><button class="tab" data-act="fullscreen">${t('full')}</button>`;
    $('#foot').textContent = t('demoNotice') + ' · ' + t('notDx');
  }
  const sigOf = () => JSON.stringify(D.tokens.map((x) => [x.id, x.status, x.priority, x.recalls, x.orderAt])) + D.followups.length + ':' + D.followups.map((f) => f.status).join('');
  async function render() {
    await ui.loadAll();
    if (S.activeTokenId && !L.resolve(S.activeTokenId, D.tokens)) S.activeTokenId = null;
    SP.counts = S.mode === 'admin' ? await L.counts() : SP.counts;
    const view = S.mode === 'kiosk' ? (ui.kioskSteps[S.step] || V.home) : V[S.mode];
    $('#view').className = 'view m-' + S.mode + ' s-' + (S.mode === 'kiosk' ? S.step : '');
    $('#view').innerHTML = view();
    S.sig = sigOf(); paintBar();
    const tok = S.mode === 'kiosk' && S.step === 'ticket' && S.activeTokenId && L.resolve(S.activeTokenId, D.tokens);
    if (tok && tok.status === 'serving') { const key = tok.id + ':' + tok.calledAt; if (S.spoken !== key) { S.spoken = key; ui.speak(t('stYours', locLine(deptLoc(D.depts[tok.deptId])))); } }
  }
  ui.render = render;

  let bc = null;
  const notify = () => { try { bc && bc.postMessage('x'); } catch (e) {} };
  async function live() {
    const on = (S.mode === 'kiosk' && S.step === 'ticket') || S.mode === 'display' || (S.mode === 'doctor' && !S.doc.form);
    if (!on || document.hidden) return;
    const [tk, fu] = await Promise.all([db.all('tokens'), db.all('followups')]);
    const old = D.tokens, oldF = D.followups; D.tokens = tk; D.followups = fu;
    const changed = sigOf() !== S.sig; D.tokens = old; D.followups = oldF;
    if (changed) await render();
  }
  SP.live = live;

  document.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = A[el.dataset.act];
    if (!fn) return;
    try { await fn(el, e); } catch (err) { console.error(err); toast(String(err.message || err)); }
    notify(); await render();
  });
  const bind = (e) => { const p = e.target.dataset && e.target.dataset.bind; if (p) { const ks = p.split('.'), last = ks.pop(); ks.reduce((o, k) => (o[k] = o[k] || {}), S)[last] = e.target.value; } };
  document.addEventListener('input', bind);
  document.addEventListener('change', bind);
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'ptext') { e.preventDefault(); A.submitText(); render(); } });

  async function boot() {
    try {
      await L.init();
      S.lang = await L.getSetting('lang', 'bn'); S.activeTokenId = await L.getSetting('activeToken', null);
    } catch (e) { $('#view').innerHTML = `<p class="warn big">IndexedDB error: ${esc(e.message || e)}<br>Use a normal (non-private) browser window.</p>`; return; }
    try { bc = new BroadcastChannel('shasthopath'); bc.onmessage = () => live(); } catch (e) { bc = null; }
    await render();
    setInterval(live, 2500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
