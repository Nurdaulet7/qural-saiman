/* =========================================================
   QURAL-SAIMAN — подключение каталога из базы.
   Подключать СРАЗУ ПОСЛЕ tools-data.js, до остальных скриптов.

   Как работает:
   1. Сохранённая копия каталога применяется мгновенно, без ожидания сети —
      страница рисуется сразу и не мигает.
   2. В фоне запрашивается свежая версия. Изменилась — копия обновляется,
      и на следующем переходе по сайту данные уже новые.
   3. Сети нет или админка недоступна — работает встроенный каталог
      из tools-data.js. Сайт не ломается никогда.

   Чтобы отключить и вернуться к файлу: закомментировать API_URL.
   ========================================================= */
(function(){
  const API_URL = 'https://qural-saiman-admin.vercel.app/api/catalog';
  if(!API_URL || !window.QS || !window.QS.build) return;

  const KEY = 'qs-catalog-v1';
  const MAX_AGE = 5 * 60 * 1000; // как часто ходить за обновлением

  function valid(d){
    return d && Array.isArray(d.tools) && d.tools.length
      && Array.isArray(d.categories) && d.categories.length
      && Array.isArray(d.families) && d.families.length;
  }

  function apply(data){
    try {
      const next = window.QS.build({ ...data, source: 'db' });
      window.QS = next;
      document.dispatchEvent(new CustomEvent('qs:catalog', { detail: next }));
      return true;
    } catch(e){ return false }
  }

  let cached = null, fetchedAt = 0;
  try {
    const raw = localStorage.getItem(KEY);
    if(raw){
      const box = JSON.parse(raw);
      if(valid(box.data)){ cached = box.data; fetchedAt = box.at || 0 }
    }
  } catch(e){}

  if(cached) apply(cached);

  if(Date.now() - fetchedAt < MAX_AGE) return;

  fetch(API_URL, { cache: 'no-store' })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if(!valid(data)) return;
      try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data })) } catch(e){}
      /* Применяется при следующей загрузке страницы: подмена данных
         под уже отрисованным каталогом дала бы «прыжок» содержимого. */
    })
    .catch(()=>{});
})();
