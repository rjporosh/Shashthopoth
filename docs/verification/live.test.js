require('fake-indexeddb/auto');
const {JSDOM}=require('jsdom'); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let f=0; const ok=(c,m)=>{if(!c){f++;console.log('FAIL',m)}else console.log('ok  ',m)};
(async()=>{
 const dom=await JSDOM.fromFile(require('path').resolve(__dirname,'../../index.html'),{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,beforeParse(w){w.indexedDB=indexedDB;w.IDBKeyRange=IDBKeyRange;w.scrollTo=()=>{};}});
 const w=dom.window,d=w.document; await sleep(500);
 const c=async s=>{d.querySelector(s).dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await sleep(120)};
 const txt=()=>d.getElementById('view').textContent.replace(/\s+/g,' ');
 const L=w.SP.logic;
 await c('[data-act="mode"][data-v="admin"]'); await c('[data-act="seedQ"]'); await c('[data-act="mode"][data-v="display"]');
 ok(/NOW SERVING|এখন ডাকা হচ্ছে/.test(txt()),'display rendered');
 // a different "tab" (here: direct logic call) changes the queue; display must update on poll without a click
 await L.callNext('LAB'); await w.SP.live(); await sleep(150);
 ok(/LAB-001/.test(d.querySelector('.dcard .dnow b').textContent) || txt().includes('LAB-001'),'display auto-updates via live() after external change');
 // doctor form open => live() must not clobber typed input
 await c('[data-act="mode"][data-v="doctor"]'); await c('[data-act="dq"][data-id="LAB"]'); 
 await L.callNext('MED'); await c('[data-act="dq"][data-id="MED"]'); await c('[data-act="fuOpen"]');
 const inp=d.querySelector('[data-bind="doc.form.note"]'); inp.value='typing…'; inp.dispatchEvent(new w.Event('input',{bubbles:true}));
 await L.complete((await w.SP.db.all('tokens')).find(t=>t.status==='serving'&&t.queueId==='MED').id); await w.SP.live(); await sleep(100);
 ok(d.querySelector('[data-bind="doc.form.note"]').value==='typing…','open follow-up form not clobbered by live refresh');
 console.log(f?'FAILED':'ALL PASS'); process.exit(f?1:0);
})();
