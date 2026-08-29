/* QURAL-SAIMAN — каталог: фильтры, сортировка, группировка по категориям */
(function(){
  var QS = window.QS || {};
  var icons = function(){ if(window.lucide) lucide.createIcons() };

  var SORTS = [
    {id:'pop',   label:'По популярности'},
    {id:'cheap', label:'Сначала дешёвые'},
    {id:'exp',   label:'Сначала дорогие'},
    {id:'az',    label:'По названию А–Я'}
  ];

  var state = { fam:'all', brands:[], powers:[], promo:false, sort:'pop', q:'' };
  var norm = function(s){ return (s||'').toLowerCase().replace(/ё/g,'е') };

  /* ── восстановление из hash / localStorage ── */
  var hash = (location.hash||'').replace('#','');
  var hashCat = (QS.categories||[]).some(function(c){ return c.id===hash }) ? hash : null;
  var hashFam = (QS.families||[]).some(function(f){ return f.id===hash }) ? hash : null;
  if(hashFam) state.fam = hashFam;
  if(hashCat) state.fam = (QS.catById(hashCat)||{}).family || 'all';
  try{
    var saved = JSON.parse(localStorage.getItem('qs_sort')||'null');
    if(saved && SORTS.some(function(s){ return s.id===saved })) state.sort = saved;
  }catch(e){}

  /* ── семейства (верхний рельс) ── */
  var famrail = document.getElementById('famrail');
  var sidefams = document.getElementById('sidefams');
  var renderFams = function(){
    var counts = {}; (QS.tools||[]).forEach(function(t){
      var f=(QS.catById(t.cat)||{}).family; if(f) counts[f]=(counts[f]||0)+1;
    });
    var html = '<button type="button" class="fam'+(state.fam==='all'?' on':'')+'" data-fam="all">Все<small>'+(QS.tools||[]).length+'</small></button>'+
      (QS.families||[]).map(function(f){
        return '<button type="button" class="fam'+(state.fam===f.id?' on':'')+'" data-fam="'+f.id+'">'+f.name+'<small>'+(counts[f.id]||0)+'</small></button>';
      }).join('');
    famrail.innerHTML = html;
    if(sidefams) sidefams.innerHTML = html;
    var on = famrail.querySelector('.fam.on');
    if(on) famrail.scrollLeft = Math.max(0, on.offsetLeft - 18);
  };

  /* ── фильтрация ── */
  var visible = function(){
    return (QS.tools||[]).filter(function(t){
      var fam = (QS.catById(t.cat)||{}).family;
      if(state.fam!=='all' && fam!==state.fam) return false;
      if(state.brands.length && state.brands.indexOf(t.brand)<0) return false;
      if(state.powers.length && state.powers.indexOf(t.power)<0) return false;
      if(state.promo && !QS.isPromoPower(t.power)) return false;
      if(state.q){
        var hay = norm(t.name+' '+(t.spec||'')+' '+(t.brand||'')+' '+((QS.catById(t.cat)||{}).name||''));
        if(state.q.split(/\s+/).some(function(w){ return hay.indexOf(w)<0 })) return false;
      }
      return true;
    });
  };
  var sortFn = function(a,b){
    if(state.sort==='cheap') return a.price-b.price;
    if(state.sort==='exp')   return b.price-a.price;
    if(state.sort==='az')    return a.name.localeCompare(b.name,'ru');
    var w = function(t){ return (t.badge==='hit'?2:0) + (t.top?1:0) + (QS.hasPhoto(t.id)?1:0) };
    return w(b)-w(a) || a.price-b.price;
  };

  var cardHTML = function(t){
    return '<a class="card" href="product.html?id='+t.id+'">'+
      '<div class="ph">'+(t.badge==='hit'?'<span class="badge">хит</span>':'')+
        (QS.hasPhoto(t.id) ? '<img src="'+QS.photo(t.id)+'" alt="" loading="lazy" />' : '<span class="noph"></span>')+
        '<button class="fav" type="button" data-fav="'+t.id+'" aria-label="В избранное"><i data-lucide="heart"></i></button>'+'</div>'+
      '<div class="body"><span class="nm">'+t.name+'</span>'+
        (t.spec ? '<span class="sp">'+t.spec+'</span>' : '')+
        '<span class="foot"><span class="pr">'+(t.priceNote?'от ':'')+QS.fmt(t.price)+'<small>в сутки</small></span>'+
        '<span class="plus"><i data-lucide="plus"></i></span></span></div></a>';
  };

  /* ── рендер каталога ── */
  var wrap = document.getElementById('catalog');
  var empty = document.getElementById('catempty');
  var countEl = document.getElementById('catcount');
  var plural = function(n){ var a=n%10,b=n%100; return n+' '+(a===1&&b!==11?'позиция':(a>1&&a<5&&(b<10||b>20)?'позиции':'позиций')) };

  var render = function(){
    var list = visible();
    countEl.textContent = plural(list.length);
    empty.hidden = list.length>0;
    var eb = empty.querySelector('b');
    if(eb) eb.textContent = state.q ? 'По запросу «'+qEl.value.trim()+'» ничего нет' : 'Под эти фильтры ничего нет';
    if(!list.length){ wrap.innerHTML=''; icons(); return; }

    var byCat = {};
    list.forEach(function(t){ (byCat[t.cat]=byCat[t.cat]||[]).push(t) });
    wrap.innerHTML = (QS.categories||[]).filter(function(c){ return byCat[c.id] }).map(function(c){
      var items = byCat[c.id].slice().sort(sortFn);
      return '<section class="catsec" id="'+c.id+'">'+
        '<div class="csechead"><span class="cic">'+QS.catIcon(c.id,c.icon)+'</span>'+
        '<h2>'+c.name+'</h2><em>'+items.length+'</em></div>'+
        '<div class="grid">'+items.map(cardHTML).join('')+'</div></section>';
    }).join('');
    icons();
    if(window.QSFav) QSFav.sync();
  };

  /* ── фильтры (лист) ── */
  var fcount = document.getElementById('fcount');
  var syncCount = function(){
    var n = state.brands.length + state.powers.length + (state.promo?1:0);
    fcount.textContent = n ? n : ''; fcount.classList.toggle('show', n>0);
  };

  var filterBody = document.getElementById('filterBody');
  var sideFilters = document.getElementById('sideFilters');
  var renderFilters = function(){
    filterBody.innerHTML =
      '<div class="fgroup"><div class="flab">Питание</div><div class="chips2">'+
        (QS.powers||[]).map(function(p){
          return '<button type="button" data-power="'+p+'" class="'+(state.powers.indexOf(p)>=0?'on':'')+'">'+p+'<small>'+(QS.powerCount[p]||0)+'</small></button>';
        }).join('')+'</div></div>'+
      '<div class="fgroup"><div class="flab">Бренд</div><div class="chips2">'+
        (QS.brands||[]).map(function(b){
          return '<button type="button" data-brand="'+b+'" class="'+(state.brands.indexOf(b)>=0?'on':'')+'">'+b+'<small>'+(QS.brandCount[b]||0)+'</small></button>';
        }).join('')+'</div></div>'+
      '<div class="fgroup"><button type="button" class="frow'+(state.promo?' on':'')+'" data-promo>'+
        '<span><b>6-й день в подарок</b><small>Бензин, электро и аккумуляторный инструмент</small></span>'+
        '<span class="sw"></span></button></div>';
    if(sideFilters){
      sideFilters.innerHTML = filterBody.innerHTML;
      var brandGroup = sideFilters.querySelector('[data-brand]');
      if(brandGroup) brandGroup.closest('.fgroup').remove();
    }
    renderChips();
    icons();
    if(window.QSFav) QSFav.sync();
  };

  /* ── активные фильтры чипами (десктоп) ── */
  var chipsRow = document.getElementById('activeChips');
  var renderChips = function(){
    if(!chipsRow) return;
    var parts = [];
    state.powers.forEach(function(p){ parts.push('<button type="button" class="achip" data-drop-power="'+p+'">'+p+'<i data-lucide="x"></i></button>') });
    state.brands.forEach(function(b){ parts.push('<button type="button" class="achip" data-drop-brand="'+b+'">'+b+'<i data-lucide="x"></i></button>') });
    if(state.promo) parts.push('<button type="button" class="achip" data-drop-promo>6-й день в подарок<i data-lucide="x"></i></button>');
    chipsRow.innerHTML = parts.length ? parts.join('')+'<button type="button" class="achip all" id="chipsClear">Сбросить всё</button>' : '';
    chipsRow.classList.toggle('on', parts.length>0);
  };

  var toggle = function(arr,v){ var i=arr.indexOf(v); if(i<0) arr.push(v); else arr.splice(i,1); };
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-power],[data-brand],[data-promo]'); if(!b) return;
    if(b.hasAttribute('data-promo')) state.promo = !state.promo;
    else if(b.hasAttribute('data-power')) toggle(state.powers, b.getAttribute('data-power'));
    else toggle(state.brands, b.getAttribute('data-brand'));
    renderFilters(); syncCount(); render();
    document.getElementById('applyBtn').textContent = 'Показать · ' + visible().length;
  });

  /* ── сортировка (лист) ── */
  var sortOpts = document.getElementById('sortOpts');
  var sortLabel = document.getElementById('sortLabel');
  var dsortSel = document.getElementById('dsortSel');
  if(dsortSel) dsortSel.addEventListener('change', function(){
    state.sort = dsortSel.value;
    try{ localStorage.setItem('qs_sort', JSON.stringify(state.sort)) }catch(err){}
    renderSort(); render();
  });
  var renderSort = function(){
    sortOpts.innerHTML = SORTS.map(function(s){
      return '<button type="button" data-sort="'+s.id+'" class="'+(state.sort===s.id?'on':'')+'">'+s.label+'<i data-lucide="check"></i></button>';
    }).join('');
    sortLabel.textContent = (SORTS.find(function(s){ return s.id===state.sort })||SORTS[0]).label;
    if(dsortSel) dsortSel.innerHTML = SORTS.map(function(s){
      return '<option value="'+s.id+'"'+(state.sort===s.id?' selected':'')+'>'+s.label+'</option>';
    }).join('');
    icons();
    if(window.QSFav) QSFav.sync();
  };
  sortOpts.addEventListener('click', function(e){
    var b = e.target.closest('[data-sort]'); if(!b) return;
    state.sort = b.getAttribute('data-sort');
    try{ localStorage.setItem('qs_sort', JSON.stringify(state.sort)) }catch(err){}
    renderSort(); render(); close();
  });

  /* ── модалки ── */
  var openM = function(el){
    el.classList.add('open'); document.body.classList.add('noscroll');
    if(el.id==='filterModal') document.getElementById('applyBtn').textContent = 'Показать · ' + visible().length;
  };
  var close = function(){
    document.querySelectorAll('.modal.open').forEach(function(m){ m.classList.remove('open') });
    document.body.classList.remove('noscroll');
  };
  document.getElementById('openFilters').addEventListener('click', function(){ openM(document.getElementById('filterModal')) });
  document.getElementById('openSort').addEventListener('click', function(){ openM(document.getElementById('sortModal')) });
  document.addEventListener('click', function(e){ if(e.target.closest('[data-close]')) close() });
  addEventListener('keydown', function(e){ if(e.key==='Escape') close() });

  var clearAll = function(){
    state.brands=[]; state.powers=[]; state.promo=false;
    renderFilters(); syncCount(); render();
    document.getElementById('applyBtn').textContent = 'Показать · ' + visible().length;
  };
  document.getElementById('clearFilters').addEventListener('click', clearAll);
  var sideClear = document.getElementById('sideClear');
  if(sideClear) sideClear.addEventListener('click', clearAll);
  if(chipsRow) chipsRow.addEventListener('click', function(e){
    var b = e.target.closest('[data-drop-power],[data-drop-brand],[data-drop-promo],#chipsClear'); if(!b) return;
    if(b.id==='chipsClear') return clearAll();
    if(b.hasAttribute('data-drop-promo')) state.promo=false;
    else if(b.hasAttribute('data-drop-power')) toggle(state.powers, b.getAttribute('data-drop-power'));
    else toggle(state.brands, b.getAttribute('data-drop-brand'));
    renderFilters(); syncCount(); render();
  });
  document.getElementById('resetEmpty').addEventListener('click', function(){ clearAll(); close() });

  /* ── семейства: переключение ── */
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-fam]'); if(!b) return;
    state.fam = b.getAttribute('data-fam');
    history.replaceState(null,'', state.fam==='all' ? location.pathname : '#'+state.fam);
    renderFams(); render(); scrollTo({top:0,behavior:'smooth'});
  });

  /* ── корзина + залипание аппбара ── */
  if(window.QSCart) QSCart.syncBadge();

  /* «+» на карточке — в корзину */
  var toast=function(msg){
    var el=document.createElement('div'); el.className='toast'; el.textContent=msg;
    document.body.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('on') });
    setTimeout(function(){ el.classList.remove('on'); setTimeout(function(){ el.remove() },250) },1700);
  };

  document.addEventListener('click', function(e){
    var b=e.target.closest('[data-fav]'); if(!b) return;
    e.preventDefault(); e.stopPropagation();
    if(!window.QSFav) return;
    var on=QSFav.toggle(b.getAttribute('data-fav'));
    b.classList.toggle('on', on);
    toast(on?'Добавлено в избранное':'Убрано из избранного');
  });
  document.addEventListener('click', function(e){
    var p=e.target.closest('.card .plus'); if(!p) return;
    var card=p.closest('.card'); if(!card) return;
    e.preventDefault(); e.stopPropagation();
    var id=(card.getAttribute('href')||'').split('id=')[1];
    if(!id||!window.QSCart) return;
    QSCart.add(id,1);
    p.classList.add('done'); setTimeout(function(){ p.classList.remove('done') },900);
    toast('Добавлено в корзину');
  });

  var bar = document.getElementById('appbar');
  var onScroll = function(){ bar.classList.toggle('stuck', window.scrollY > 4) };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ── поиск по каталогу ── */
  var qEl = document.getElementById('catq'), qx = document.getElementById('catqx');
  if(qEl){
    var qt;
    var applyQ = function(){
      state.q = norm(qEl.value).trim();
      qx.hidden = !qEl.value;
      render();
    };
    qEl.addEventListener('input', function(){ clearTimeout(qt); qt = setTimeout(applyQ, 140) });
    qEl.addEventListener('keydown', function(e){ if(e.key==='Escape'){ qEl.value=''; applyQ() } });
    qx.addEventListener('click', function(){ qEl.value=''; applyQ(); qEl.focus() });
  }

  renderFams(); renderFilters(); renderSort(); syncCount(); render();

  if(hashCat){
    var target = document.getElementById(hashCat);
    if(target){
      var y = target.getBoundingClientRect().top + window.scrollY - (bar.offsetHeight + 8);
      window.scrollTo(0, y);
    }
  }
})();
