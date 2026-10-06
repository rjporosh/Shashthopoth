/* ShasthoPath — IndexedDB wrapper (no libraries). Stores are plain {id}-keyed. */
(function () {
  const SP = (window.SP = window.SP || {});
  const NAME = 'shasthopath', VER = 1;
  const STORES = ['patients', 'departments', 'services', 'doctors', 'locations', 'tokens', 'queues', 'followups', 'settings'];
  let _db = null;

  function open() {
    if (_db) return Promise.resolve(_db);
    return new Promise((res, rej) => {
      const r = indexedDB.open(NAME, VER);
      r.onupgradeneeded = () => STORES.forEach((s) => { if (!r.result.objectStoreNames.contains(s)) r.result.createObjectStore(s, { keyPath: 'id' }); });
      r.onsuccess = () => { _db = r.result; _db.onversionchange = () => { _db.close(); _db = null; }; res(_db); };
      r.onerror = () => rej(r.error);
      r.onblocked = () => rej(new Error('IndexedDB blocked'));
    });
  }
  const req = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const store = async (s, mode) => (await open()).transaction(s, mode).objectStore(s);

  // Run fn(api) inside ONE readwrite transaction (atomic). Only await IndexedDB calls inside fn.
  async function tx(stores, fn) {
    const d = await open();
    return new Promise((res, rej) => {
      const t = d.transaction(stores, 'readwrite');
      const api = {
        get: (s, id) => req(t.objectStore(s).get(id)),
        put: (s, v) => req(t.objectStore(s).put(v)),
        all: (s) => req(t.objectStore(s).getAll()),
      };
      let out;
      t.oncomplete = () => res(out);
      t.onerror = () => rej(t.error);
      t.onabort = () => rej(t.error || new Error('aborted'));
      Promise.resolve().then(() => fn(api)).then((v) => { out = v; }).catch((e) => { try { t.abort(); } catch (_) {} rej(e); });
    });
  }

  SP.db = {
    STORES, open, tx,
    all: async (s) => req((await store(s)).getAll()),
    get: async (s, id) => req((await store(s)).get(id)),
    put: async (s, v) => req((await store(s, 'readwrite')).put(v)),
    putMany: (s, arr) => tx([s], async (a) => { for (const v of arr) await a.put(s, v); }),
    clearAll: () => tx(STORES, async () => {}).then(async () => {
      const d = await open();
      return new Promise((res, rej) => { const t = d.transaction(STORES, 'readwrite'); STORES.forEach((s) => t.objectStore(s).clear()); t.oncomplete = res; t.onerror = () => rej(t.error); });
    }),
    count: async (s) => req((await store(s)).count()),
  };
})();
