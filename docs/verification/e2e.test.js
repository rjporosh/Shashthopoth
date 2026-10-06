require('fake-indexeddb/auto');
const {JSDOM}=require('jsdom'); const path=require('path');
const URL='file://'+path.resolve(require('path').resolve(__dirname,'../../index.html'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0; const ok=(c,m)=>{ if(!c){fails++;console.log('FAIL',m);} else console.log('ok  ',m); };
async function open(){
  const errs=[];
  const dom=await JSDOM.fromFile(require('path').resolve(__dirname,'../../index.html'),{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,
    beforeParse(w){ w.indexedDB=indexedDB; w.IDBKeyRange=IDBKeyRange; w.scrollTo=()=>{}; w.confirm=()=>true; w.print=()=>{w.__printed=true};
      w.addEventListener('error',e=>errs.push(e.message)); const ce=w.console.error; w.console.error=(...a)=>{errs.push(a.join(' '));}; }});
  const w=dom.window, d=w.document;
  await sleep(500);
  const api={w,d,errs,
    txt:()=>d.getElementById('view').textContent.replace(/\s+/g,' '),
    async click(sel){ const el=typeof sel==='string'?d.querySelector(sel):sel; if(!el) throw new Error('no element '+sel+' | view: '+api.txt().slice(0,200)); el.dispatchEvent(new w.MouseEvent('click',{bubbles:true})); await sleep(120); },
    async type(sel,v){ const el=d.querySelector(sel); if(!el) throw new Error('no input '+sel); el.value=v; el.dispatchEvent(new w.Event('input',{bubbles:true})); },
    act:(a,extra='')=>`[data-act="${a}"]${extra}`,
    toast:()=>d.getElementById('toast').textContent };
  return api;
}
(async()=>{
 const a=await open();
 ok(a.txt().includes('আমি চিকিৎসা নিতে চাই'),'home shows Bengali primary action');
 ok(a.d.getElementById('foot').textContent.includes('demonstration system')||a.d.getElementById('foot').textContent.includes('ডেমো সিস্টেম'),'demo privacy notice visible');
 // empty & unknown input
 await a.click(a.act('startNew')); ok(a.txt().includes('আপনার কী সমস্যা'),'problem screen');
 await a.click(a.act('submitText')); ok(a.txt().includes('বুঝতে পারিনি'),'empty input handled');
 await a.type('#ptext','xyzzy'); await a.click(a.act('submitText')); ok(a.txt().includes('বুঝতে পারিনি')&&a.txt().includes('xyzzy'),'unknown input handled, tiles still available');
 await a.click(a.act('listenProblem')); ok(a.toast().includes('ভয়েস'),'voice unsupported -> graceful message, no block');
 // main flow
 await a.type('#ptext','আমার হাতে ব্যথা'); await a.click(a.act('submitText'));
 ok(a.txt().includes('এখন কি এগুলোর কোনোটি'),'-> red-flag screen first'); 
 await a.click(a.act('answer','[data-v="none"]')); ok(a.txt().includes('কতদিন'),'duration q');
 await a.click(a.act('answer','[data-v="d13"]')); ok(a.txt().includes('আঘাত'),'injury q');
 await a.click(a.act('answer','[data-v="yes"]')); await a.click(a.act('answer','[data-v="no"]')); await a.click(a.act('answer','[data-v="unknown"]'));
 ok(a.txt().includes('অর্থোপেডিক্স')&&a.txt().includes('রোগ নির্ণয় নয়'),'route to orthopedics + not-diagnosis note');
 await a.click(a.act('whoGo')); ok(a.txt().includes('আপনার পরিচয়'),'who screen');
 await a.type('[data-bind="draft.who.age"]','abc'); await a.click(a.act('whoNext')); ok(a.toast().includes('বয়স')&&a.txt().includes('আপনার পরিচয়'),'invalid age rejected, not guessed');
 await a.type('[data-bind="draft.who.age"]','999'); await a.click(a.act('whoNext')); ok(a.txt().includes('আপনার পরিচয়'),'out-of-range age rejected');
 await a.click(a.act('fill')); await a.click(a.act('whoNext')); ok(a.txt().includes('স্বাস্থ্য তথ্য'),'health screen');
 await a.type('[data-bind="draft.health.temp"]','9000'); await a.click(a.act('healthGo')); ok(a.txt().includes('স্বাস্থ্য তথ্য'),'invalid temp rejected');
 await a.type('[data-bind="draft.health.temp"]',''); await a.type('[data-bind="draft.health.weight"]','৬২'); await a.click(a.act('healthGo'));
 ok(a.txt().includes('ORT-001'),'token ORT-001 issued'); ok(a.txt().includes('২০৭')&&a.txt().includes('ভবন-খ'),'ticket has building/room (Bengali digits)');
 ok(a.txt().includes('আনুমানিক অপেক্ষা')||a.txt().includes('আপনার সামনে'),'queue position shown');
 await a.click(a.act('print')); ok(a.w.__printed,'print triggered');
 await a.click(a.act('goGuide')); ok(a.d.querySelector('svg')&&a.txt().includes('কীভাবে যাবেন')&&a.txt().includes('ঢাকা পথ'),'navigation: map + text directions');
 await a.click(a.act('back')); ok(a.txt().includes('ORT-001'),'back to ticket');
 // queue display
 await a.click(a.act('mode','[data-v="display"]')); ok(a.txt().includes('ORT-001')&&a.txt().includes('NOW SERVING')||a.txt().includes('এখন ডাকা হচ্ছে'),'display shows waiting token');
 // doctor
 await a.click(a.act('mode','[data-v="doctor"]')); ok(a.txt().includes('ORT-001'),'doctor sees queue');
 await a.click(a.act('callNext')); ok(a.txt().includes('ইনটেক সারাংশ')&&a.txt().includes('আব্দুল করিম'),'doctor summary visible after call');
 ok(a.txt().includes('মাপা হয়নি')&&a.txt().includes('রোগী জানেন না')&&a.txt().includes('রোগী বলেননি'),'unknowns preserved: not measured / patient does not know / not reported');
 ok(a.txt().includes('৬২ kg')&&a.txt().includes('হাত'),'entered weight + complaint shown');
 ok(!/diagnos(is|ed)\s*:/i.test(a.txt()),'no diagnosis field');
 await a.click(a.act('callNext','')); // disabled while serving
 await a.click(a.act('recall')); ok(a.txt().includes('ORT-001'),'recall ok');
 // patient sees call
 await a.click(a.act('mode','[data-v="kiosk"]')); if(a.d.querySelector('[data-act="myToken"]')) await a.click(a.act('myToken'));
 ok(a.txt().includes('আপনার ডাক এসেছে')&&a.txt().includes('আবার ডাকা হচ্ছে'),'patient status: your turn + recalled');
 // follow-up scheduling by doctor, then complete
 await a.click(a.act('mode','[data-v="doctor"]')); await a.click(a.act('fuOpen'));
 ok(a.txt().includes('ডাক্তার লিখবেন'),'follow-up form opens'); 
 await a.type('[data-bind="doc.form.note"]','Review as instructed'); await a.click(a.act('fuSave')); ok(a.toast().includes('সংরক্ষিত'),'follow-up saved');
 await a.click(a.act('complete')); ok(a.txt().includes('কেউ চলছে না'),'complete -> nobody serving');
 await a.click(a.act('mode','[data-v="kiosk"]')); ok(a.txt().includes('আপনার সিরিয়াল শেষ')&&a.txt().includes('আপনার পরবর্তী তারিখ'),'patient sees done + next date');
 // follow-up workflow
 await a.click(a.act('home')); await a.click(a.act('goFu')); await a.type('[data-bind="fu.phone"]','123'); await a.click(a.act('fuFind')); ok(a.txt().includes('পাওয়া যায়নি'),'unknown phone -> not found message');
 await a.click(a.act('fuDemo','[data-v="01700000001"]')); await a.click(a.act('fuFind')); await a.click(a.act('fuPick'));
 ok(a.txt().includes('রহিম উদ্দিন')&&a.txt().includes('ভিজিট নং ২'),'identity + visit no. shown'); await a.click(a.act('fuYes'));
 ok(a.txt().includes('AR-FU-001')&&a.txt().includes('ফলো-আপ'),'follow-up token AR-FU-001 (dedicated queue)');
 // future follow-up blocked
 await a.click(a.act('home')); await a.click(a.act('goFu')); await a.click(a.act('fuDemo','[data-v="01700000002"]')); await a.click(a.act('fuFind')); await a.click(a.act('fuPick'));
 ok(a.txt().includes('সেদিন এসে')&&!a.d.querySelector('[data-act="fuYes"]'),'future date -> no token offered');
 // emergency via text + english
 await a.click(a.act('home')); await a.click(a.act('startNew')); await a.type('#ptext','বুকে ব্যথা'); await a.click(a.act('submitText'));
 ok(a.txt().includes('এখনই জরুরি বিভাগে যান')&&a.txt().includes('বুকে তীব্র ব্যথা'),'emergency escalation from text');
 await a.click(a.act('lang')); ok(a.txt().includes('Please proceed immediately to Emergency.'),'English fallback (spec wording)');
 await a.click(a.act('emrToken')); ok(a.txt().includes('EMR-001'),'emergency token EMR-001');
 // directory
 await a.click(a.act('home')); await a.click(a.act('goDir')); ok(a.txt().includes('Toilet')&&a.txt().includes('Pharmacy')&&a.txt().includes('Food area'),'directory has toilet/pharmacy/food (en)');
 await a.click(a.act('openLoc','[data-id="loc-PHA"]')); ok(a.txt().includes('pharmacy counter 1')&&!a.txt().includes('Room Pharmacy'),'location detail (counter not labelled Room)');
 // admin
 await a.click(a.act('mode','[data-v="admin"]')); ok(a.txt().includes('Seed demo queue')&&a.txt().includes('tokens:'),'admin renders');
 await a.click(a.act('seedQ')); await a.click(a.act('mode','[data-v="display"]')); ok(a.txt().includes('MED-001'),'seeded demo queue on display');
 // refresh persistence
 const b=await open(); ok(b.txt().includes('EMR-001')||b.txt().includes('Emergency')||b.txt().includes('জরুরি'),'page reload restores home');
 ok(b.txt().includes('EMR-001'),'active token persisted across reload'); ok(b.d.documentElement.lang==='en','language persisted');
 await b.click(b.act('mode','[data-v="display"]')); ok(b.txt().includes('MED-001')&&b.txt().includes('AR-FU-001'),'active queues persisted in IndexedDB');
 // reset
 await b.click(b.act('mode','[data-v="admin"]')); await b.click(b.act('reset')); await b.click(b.act('mode','[data-v="display"]')); ok(b.txt().includes('No active queues'),'reset clears queues');
 const real=[...a.errs,...b.errs].filter(e=>!/Not implemented|navigation/i.test(e)); ok(real.length===0,'no JS errors: '+real.slice(0,3).join(' | '));
 console.log(fails?('FAILED '+fails):'ALL PASS'); process.exit(fails?1:0);
})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
