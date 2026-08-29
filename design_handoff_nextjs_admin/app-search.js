/* QURAL-SAIMAN — общий поиск (оверлей). Требует tools-data.js + lucide. */
(function(){
  var QS = window.QS || {};
  var POPULAR=['Перфоратор','Виброплита','Генератор','Бетономешалка','Шлифмашина','Отбойный молоток','Штроборез','Компрессор'];
  var catName={}; (QS.categories||[]).forEach(function(c){ catName[c.id]=c.name });

  var wrap=document.createElement('div');
  wrap.className='sheet'; wrap.id='searchSheet'; wrap.setAttribute('role','dialog');
  wrap.setAttribute('aria-modal','true'); wrap.setAttribute('aria-label','Поиск по каталогу');
  wrap.innerHTML=
    '<div class="shead">'+
      '<button class="sback" type="button" id="searchClose" aria-label="Закрыть"><i data-lucide="arrow-left"></i></button>'+
      '<label class="sfield"><i data-lucide="search"></i>'+
      '<input type="search" id="searchInput" placeholder="Что нужно для работы?" autocomplete="off" enterkeyhint="search" />'+
      '<button class="clr" type="button" id="searchClear" aria-label="Очистить"><i data-lucide="x"></i></button></label>'+
    '</div><div class="sbody" id="searchBody"></div>';
  document.body.appendChild(wrap);

  var sheet=wrap, input=wrap.querySelector('#searchInput'),
      sbody=wrap.querySelector('#searchBody'), clr=wrap.querySelector('#searchClear');

  var norm=function(s){ return (s||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,' ').trim() };
  var recent=function(){ try{ return JSON.parse(localStorage.getItem('qs_recent')||'[]') }catch(e){ return [] } };
  var pushRecent=function(q){
    q=(q||'').trim(); if(q.length<2) return;
    var r=recent().filter(function(x){ return norm(x)!==norm(q) }); r.unshift(q);
    try{ localStorage.setItem('qs_recent', JSON.stringify(r.slice(0,6))) }catch(e){}
  };
  var esc=function(s){ return String(s).replace(/[&<>]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c] }) };
  var hl=function(name,words){
    var out=esc(name);
    (words||[]).forEach(function(w){
      if(w.length<3) return;
      var base=w.replace(END,'');
      out=out.replace(new RegExp('('+(base.length>=3?base:w).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[а-яё]*)','gi'),'<mark>$1</mark>');
    });
    return out;
  };

  /* лёгкий стеммер: режем русские окончания, оставляем основу */
  var END=/(ами|ями|ому|его|ой|ые|ый|ая|ое|ие|ии|ий|ям|ах|ях|ов|ев|ей|ам|ом|ем|ы|и|а|я|у|ю|е|о|ь)$/;
  var stem=function(w){ var s=w; for(var i=0;i<2 && s.length>3;i++){ var t=s.replace(END,''); if(t===s||t.length<3) break; s=t } return s };
  var stemAll=function(s){ return s.split(' ').filter(Boolean).map(stem).join(' ') };
  var SYN={'болгарка':'ушм углошлифовальная шлифовальная','ушм':'углошлифовальная болгарка','отбойник':'отбойный молоток',
    'бетономешалка':'бетоносмеситель','дгу':'дизельный генератор','генератор':'электростанция',
    'леса':'вышка тура','тура':'вышка леса','стремянка':'лестница','нивелир':'уровень лазерный',
    'мойка':'уборочное','пылесос':'уборочное','краскопульт':'окрасочное краскораспылитель','тельфер':'таль',
    'сварка':'сварочный инвертор','пила':'пилы циркулярная торцовочная','шуруповерт':'шуруповерт дрель'};

  var find=function(q){
    var raw=norm(q).split(' ').filter(Boolean); if(!raw.length) return {tools:[],cats:[],words:[]};
    /* каждое слово запроса → список допустимых основ (само слово + синонимы) */
    var variants=raw.map(function(w){
      var s=stem(w), syn=SYN[w]||SYN[s]||'';
      var v=[s];
      if(syn) stemAll(syn).split(' ').forEach(function(x){ if(x && v.indexOf(x)<0) v.push(x) });
      return v;
    });
    var hit=function(hay,v){ for(var j=0;j<v.length;j++){ if(hay.indexOf(v[j])>=0) return true } return false };
    var tools=(QS.tools||[]).map(function(t){
      var cat=QS.catById?QS.catById(t.cat):null;
      var hay=stemAll(norm([t.name,t.brand,t.power,catName[t.cat],cat&&cat.short,t.spec].filter(Boolean).join(' ')));
      var nm=stemAll(norm(t.name)), score=0;
      for(var i=0;i<variants.length;i++){
        if(!hit(hay,variants[i])) return null;
        var s=variants[i][0];
        score += nm.indexOf(s)===0 ? 3 : (nm.indexOf(s)>=0 ? 2 : 1);
      }
      return {t:t,score:score};
    }).filter(Boolean).sort(function(a,b){ return b.score-a.score || a.t.price-b.t.price }).map(function(x){ return x.t });
    var cats=(QS.categories||[]).filter(function(c){
      var h=stemAll(norm(c.name+' '+(c.short||'')));
      return variants.every(function(v){ return hit(h,v) });
    });
    return {tools:tools,cats:cats,words:raw};
  };

  var renderIdle=function(){
    var r=recent(), h='';
    if(r.length){
      h+='<div class="slab">Вы искали</div><div class="chips">'+r.map(function(q){
        return '<button type="button" data-q="'+esc(q)+'"><i data-lucide="clock"></i>'+esc(q)+'</button>';
      }).join('')+'</div>';
    }
    h+='<div class="slab">Часто ищут</div><div class="chips">'+POPULAR.map(function(q){
      return '<button type="button" data-q="'+q+'">'+q+'</button>';
    }).join('')+'</div>';
    h+='<div class="slab">Категории</div><div class="sres">'+(QS.categories||[]).map(function(c){
      return '<a href="catalog.html#'+c.id+'"><span class="th">'+QS.catIcon(c.id,c.icon)+'</span>'+
             '<span class="tx"><b>'+c.name+'</b></span><i data-lucide="chevron-right" class="chev"></i></a>';
    }).join('')+'</div>';
    sbody.innerHTML=h; if(window.lucide) lucide.createIcons();
  };

  var renderResults=function(q){
    var res=find(q);
    if(!res.tools.length && !res.cats.length && !/дгу|дизел/.test(norm(q))){
      sbody.innerHTML='<div class="sempty"><i data-lucide="search-x"></i><b>Ничего не нашлось</b>'+
        '<p>Попробуйте короче — «перфоратор» вместо модели. Или спросите нас: подберём под задачу.</p>'+
        '<a class="call" href="tel:+77057802074"><i data-lucide="phone"></i>+7 705 780 2074</a></div>';
    } else {
      var h='';
      if(/генерат|дизел|дгу|квт|электростан/.test(norm(q))){
        h+='<div class="slab">Аренда на объект</div><div class="sres">'+
          '<a href="dgu.html"><span class="th"><i data-lucide="zap"></i></span>'+
          '<span class="tx"><b>Дизельные генераторы 50–240 кВт</b><span>В кожухе, с АВР · сутки, месяц, сезон</span></span>'+
          '<i data-lucide="chevron-right" class="chev"></i></a></div>';
      }
      if(res.cats.length){
        h+='<div class="slab">Категории</div><div class="sres">'+res.cats.map(function(c){
          return '<a href="catalog.html#'+c.id+'"><span class="th">'+QS.catIcon(c.id,c.icon)+'</span>'+
                 '<span class="tx"><b>'+hl(c.name,res.words)+'</b></span><i data-lucide="chevron-right" class="chev"></i></a>';
        }).join('')+'</div>';
      }
      if(res.tools.length){
        h+='<div class="slab">Инструмент · '+res.tools.length+'</div><div class="sres">'+res.tools.slice(0,40).map(function(t){
          return '<a href="product.html?id='+t.id+'">'+
            '<span class="th">'+(QS.hasPhoto(t.id) ? '<img src="'+QS.photo(t.id)+'" alt="" loading="lazy" />' : '<span class="noph"></span>')+'</span>'+
            '<span class="tx"><b>'+hl(t.name,res.words)+'</b><span>'+(catName[t.cat]||'')+(t.brand?' · '+t.brand:'')+'</span></span>'+
            '<span class="pp">'+QS.fmt(t.price)+'<small>в сутки</small></span></a>';
        }).join('')+'</div>';
      }
      sbody.innerHTML=h;
    }
    if(window.lucide) lucide.createIcons();
  };

  var run=function(){
    var q=input.value.trim();
    clr.classList.toggle('show', q.length>0);
    if(q.length<2) renderIdle(); else renderResults(q);
  };
  var open=function(){
    sheet.classList.add('open'); document.body.classList.add('noscroll');
    run(); setTimeout(function(){ input.focus() },60);
  };
  var close=function(){
    pushRecent(input.value);
    sheet.classList.remove('open'); document.body.classList.remove('noscroll'); input.blur();
  };

  wrap.querySelector('#searchClose').addEventListener('click', close);
  sheet.addEventListener('mousedown', function(e){ if(e.target===sheet) close() });
  clr.addEventListener('click', function(){ input.value=''; run(); input.focus() });
  input.addEventListener('input', run);
  input.addEventListener('keydown', function(e){
    if(e.key==='Enter'){ e.preventDefault(); pushRecent(input.value); input.blur() }
    if(e.key==='Escape') close();
  });
  sbody.addEventListener('click', function(e){
    var b=e.target.closest('button[data-q]'); if(!b) return;
    input.value=b.getAttribute('data-q'); run(); input.focus();
  });
  sbody.addEventListener('mousedown', function(e){ if(e.target.closest('a')) pushRecent(input.value) });
  addEventListener('keydown', function(e){ if(e.key==='Escape' && sheet.classList.contains('open')) close() });
  document.querySelectorAll('[data-search-open]').forEach(function(el){
    el.addEventListener('click', function(e){ e.preventDefault(); open() });
  });
  window.QSSearch={open:open,close:close};
  if(window.lucide) lucide.createIcons();
})();
