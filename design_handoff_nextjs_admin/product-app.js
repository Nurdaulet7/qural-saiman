/* QURAL-SAIMAN — страница инструмента (мобильная) */
(function(){
  var QS=window.QS, C=window.QSCart, F=window.QSFav;
  if(!QS) return;
  var icons=function(){ if(window.lucide) lucide.createIcons() };
  var esc=function(s){ return String(s==null?'':s).replace(/[&<>]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c] }) };
  var id=new URLSearchParams(location.search).get('id');
  var t=(QS.tools||[]).find(function(x){ return x.id===id });
  var root=document.getElementById('pRoot');

  if(!t){
    if(id && /^dgu-/.test(id)){ location.replace('dgu.html'); return }
    root.innerHTML='<div class="catempty"><i data-lucide="package-open"></i><b>Инструмент не найден</b>'+
      '<p>Возможно, позиция снята с проката.</p><a class="reset" href="catalog.html">Перейти в каталог</a></div>';
    document.getElementById('favBtn').hidden=true; icons(); return;
  }

  document.title=t.name+' — QURAL-SAIMAN';
  var cat=QS.catById(t.cat)||{};
  var crumbs=document.getElementById('pCrumbs');
  if(crumbs) crumbs.innerHTML='<a href="index.html">Главная</a><i data-lucide="chevron-right"></i><a href="catalog.html">Каталог</a>'+
    (cat.name?'<i data-lucide="chevron-right"></i><a href="catalog.html#'+esc(cat.id||'')+'">'+esc(cat.name)+'</a>':'')+
    '<i data-lucide="chevron-right"></i><span>'+esc(t.name)+'</span>';
  var promo=QS.isPromoPower(t.power);
  var pre=t.priceNote?'от ':'';
  var priceTxt=t.price==null?'Цена по запросу':pre+QS.fmt(t.price);
  var photo=QS.hasPhoto(t.id)?QS.photo(t.id):null;

  var calc=t.calc, heightSteps=[], calcState=null;
  if(calc && calc.type==='height'){
    for(var hh=calc.startH; hh<=calc.endH+1e-6; hh=+(hh+calc.step).toFixed(2)) heightSteps.push(+hh.toFixed(2));
    calcState={idx:0,qty:1};
  } else if(calc && calc.type==='scaffold'){
    calcState={sec:1,trap:1};
  }
  var calcPrice=function(){
    if(!calc) return t.price;
    if(calc.type==='height') return t.price+calcState.idx*calc.priceStep;
    return calcState.sec*calc.sectionPrice+calcState.trap*calc.trapPrice;
  };
  var calcLabel=function(){
    if(!calc) return '';
    if(calc.type==='height') return 'высота '+String(heightSteps[calcState.idx]).replace('.',',')+' м';
    var pl=function(n,a,b,c){ var x=n%10,y=n%100; return y>10&&y<20?c : x===1?a : (x>1&&x<5?b:c) };
    var bits=[calcState.sec+' секц.']; if(calcState.trap) bits.push(calcState.trap+' '+pl(calcState.trap,'трап','трапа','трапов'));
    return bits.join(' + ');
  };

  var favBtn=document.getElementById('favBtn');
  var syncFavBtn=function(){ favBtn.classList.toggle('on', F&&F.has(t.id)) };
  favBtn.addEventListener('click', function(){ if(F){ F.toggle(t.id); syncFavBtn() } });
  syncFavBtn();

  var priceBlock;
  if(calc && calc.type==='height'){
    priceBlock = '<div class="pblock pcalc" id="pCalc"><div class="calctop"><span class="calctl">Стоимость аренды</span><span class="calcsum"><b id="calcPrice">'+QS.fmt(calcPrice())+'</b><small>/ сутки</small></span></div>'+
      '<div class="calcrows"><div class="calcrow"><span class="calclbl">Высота</span><div class="heightsteps" id="heightSteps">'+
        heightSteps.map(function(h,i){ return '<button type="button" data-idx="'+i+'" class="'+(i===0?'on':'')+'">'+String(h).replace('.',',')+' м</button>' }).join('')+
      '</div></div>'+
      '<div class="calcrow"><span class="calclbl">Количество</span><div class="stepper2 mini" id="calcQtyBox"><button type="button" data-dec>−</button><b id="calcQtyVal">1</b><button type="button" data-inc>+</button></div></div></div>'+
      '<p class="pcalchint" id="calcBreak">'+String(heightSteps[0]).replace('.',',')+' м — '+QS.fmt(t.price)+(calcState.idx>0?' + '+calcState.idx+'×'+QS.fmt(calc.priceStep):'')+'</p>'+
    '</div>';
  } else if(calc && calc.type==='scaffold'){
    priceBlock = '<div class="pblock pcalc" id="pCalc"><div class="calctop"><span class="calctl">Стоимость аренды</span><span class="calcsum"><b id="calcPrice">'+QS.fmt(calcPrice())+'</b><small>/ сутки</small></span></div>'+
      '<div class="calcrows"><div class="calcrow"><span class="calclbl">Секции комплекта<i>350 ₸/шт</i></span><div class="stepper2 mini" data-k="sec"><button type="button" data-dec>−</button><b id="secVal">1</b><button type="button" data-inc>+</button></div></div>'+
      '<div class="calcrow"><span class="calclbl">Трапы<i>350 ₸/шт</i></span><div class="stepper2 mini" data-k="trap"><button type="button" data-dec>−</button><b id="trapVal">1</b><button type="button" data-inc>+</button></div></div></div>'+
      '<p class="pcalchint" id="calcBreak">'+calcState.sec+' секц. × 350 + '+calcState.trap+' трап × 350</p>'+
    '</div>';
  } else {
    priceBlock = t.price==null
      ? '<div class="pblock"><div class="pricerow"><span class="pnow">Цена по запросу</span></div><p class="pnote">Уточним точную стоимость и сроки в WhatsApp.</p></div>'
      : '<div class="pblock"><div class="pricerow"><span class="pnow">'+priceTxt+'<small>/ сутки</small></span>'+
        (promo ? '<span class="p51"><i data-lucide="gift"></i>5+1 в подарок</span>' : '')+'</div>'+
        (t.priceNote ? '<p class="pnote">'+esc(t.priceNote)+'</p>' : '')+'</div>';
  }

  var metaBits=[t.brand?'<b>'+esc(t.brand)+'</b>':'', esc(t.power)].filter(Boolean).join(' · ');

  var specRows=[
    ['Категория', cat.name],
    ['Бренд', t.brand],
    ['Тип питания', t.power]
  ].filter(function(r){ return r[1] });

  root.innerHTML =
    '<div class="pgrid">'+
    '<div class="pgal">'+(photo?'<img src="'+photo+'" alt="" />':'<span class="noph"></span>')+
      (t.badge==='hit'?'<span class="badge">хит</span>':'')+'</div>'+
    '<div class="pbody">'+
      '<span class="cattag">'+esc(cat.name||'')+'</span>'+
      '<h1 class="pname">'+esc(t.name)+'</h1>'+
      (metaBits?'<div class="pmeta">'+metaBits+'</div>':'')+
      priceBlock+
      (specRows.length ? '<div class="pspec"><b>Характеристики</b><div class="specgrid">'+specRows.map(function(r){
        return '<div class="srowspec"><span>'+esc(r[0])+'</span><b>'+esc(r[1])+'</b></div>';
      }).join('')+'</div>'+(t.spec?'<p>'+esc(t.spec)+'</p>':'')+'</div>' : '')+
      '<div class="pguar">'+
        '<span><i data-lucide="file-text"></i>Договор на каждую аренду</span>'+
        '<span><i data-lucide="shield-check"></i>Без залога</span>'+
        '<span><i data-lucide="truck"></i>Доставка по городу</span>'+
      '</div>'+
    '</div>'+
    '</div>'+
    '<div id="pRelated"></div>';

  /* похожие */
  var rel=(QS.tools||[]).filter(function(x){ return x.id!==t.id && x.cat===t.cat });
  if(rel.length<4){
    var famCats=(QS.categories||[]).filter(function(c){ return c.family===cat.family }).map(function(c){ return c.id });
    rel=rel.concat((QS.tools||[]).filter(function(x){ return x.id!==t.id && x.cat!==t.cat && famCats.indexOf(x.cat)>=0 }));
  }
  rel=rel.slice(0,8);
  if(rel.length){
    var relSec=document.getElementById('pRelated');
    relSec.className='sec';
    relSec.innerHTML =
      '<div class="sechead"><h2>Похожий инструмент</h2></div>'+
      '<div class="rail" id="relRail">'+rel.map(function(x){
        var xpre=x.priceNote?'от ':'';
        return '<a class="card" href="product.html?id='+x.id+'">'+
          '<div class="ph">'+(x.badge==='hit'?'<span class="badge">хит</span>':'')+
            (QS.hasPhoto(x.id)?'<img src="'+QS.photo(x.id)+'" alt="" loading="lazy" />':'<span class="noph"></span>')+'</div>'+
          '<div class="body"><span class="nm">'+esc(x.name)+'</span>'+
            '<span class="foot"><span class="pr">'+(x.price==null?'по запросу':xpre+QS.fmt(x.price)+'<small>в сутки</small>')+'</span></span></div></a>';
      }).join('')+'</div>';
    initRailNav(relSec);
  }

  /* нижняя панель действий */
  var bar=document.createElement('div');
  bar.className='actbar';

  if(calc){
    bar.innerHTML='<button class="wa2" id="addBtn" type="button"><i data-lucide="shopping-cart"></i>'+
      '<span class="t">Добавить в заявку<small id="addPriceLbl">'+QS.fmt(calcPrice())+' / сутки</small></span></button>';
    document.querySelector('.pbody').appendChild(bar);
    document.body.style.setProperty('--hasbar','1');
    var addBtn=bar.querySelector('#addBtn'), addPriceLbl=bar.querySelector('#addPriceLbl');
    var calcPriceEl=document.getElementById('calcPrice');
    var updateCalc=function(){
      var p=calcPrice();
      calcPriceEl.textContent=QS.fmt(p);
      addPriceLbl.textContent=QS.fmt(p)+' / сутки';
      var hint=document.getElementById('calcBreak');
      if(calc.type==='height') hint.textContent=String(heightSteps[0]).replace('.',',')+' м — '+QS.fmt(t.price)+(calcState.idx>0?' + '+calcState.idx+'×'+QS.fmt(calc.priceStep):'');
      else hint.textContent=calcState.sec+' секц. × 350 + '+calcState.trap+' трап × 350';
    };
    if(calc.type==='height'){
      document.getElementById('heightSteps').addEventListener('click', function(e){
        var b=e.target.closest('button[data-idx]'); if(!b) return;
        calcState.idx=+b.dataset.idx;
        this.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on',x===b) });
        updateCalc();
      });
      var calcQtyBox=document.getElementById('calcQtyBox'), calcQtyVal=document.getElementById('calcQtyVal');
      calcQtyBox.addEventListener('click', function(e){
        if(e.target.closest('[data-inc]')) calcState.qty=Math.min(20,calcState.qty+1);
        else if(e.target.closest('[data-dec]')) calcState.qty=Math.max(1,calcState.qty-1);
        else return;
        calcQtyVal.textContent=calcState.qty;
      });
    } else {
      document.getElementById('pCalc').addEventListener('click', function(e){
        var box=e.target.closest('[data-k]'); if(!box) return;
        var key=box.dataset.k;
        if(e.target.closest('[data-inc]')) calcState[key]=Math.min(20,calcState[key]+1);
        else if(e.target.closest('[data-dec]')) calcState[key]=Math.max(key==='sec'?1:0,calcState[key]-1);
        else return;
        document.getElementById(key+'Val').textContent=calcState[key];
        updateCalc();
      });
    }
    addBtn.addEventListener('click', function(){
      C.addConfig(t.id, calc.type==='height'?calcState.qty:1, calcPrice(), calcLabel());
      addBtn.classList.add('inCart');
      setTimeout(function(){ addBtn.classList.remove('inCart') },900);
    });
    icons();
  } else {
    bar.innerHTML =
      '<div class="stepper2" id="qtyBox" hidden><button type="button" data-dec>−</button><b id="qtyVal">1</b><button type="button" data-inc>+</button></div>'+
      '<button class="wa2" id="addBtn" type="button"><i data-lucide="shopping-cart"></i>'+
        '<span class="t">Добавить в заявку'+(t.price!=null?'<small>'+priceTxt+' / сутки</small>':'')+'</span></button>';
    document.querySelector('.pbody').appendChild(bar);
    document.body.style.setProperty('--hasbar','1');

    var qtyBox=bar.querySelector('#qtyBox'), qtyVal=bar.querySelector('#qtyVal'), addBtn=bar.querySelector('#addBtn');
    var syncQty=function(){
      var st=C.read(), it=null; st.items.forEach(function(i){ if(i.id===t.id) it=i });
      if(it){
        qtyBox.hidden=false; qtyVal.textContent=it.qty;
        addBtn.classList.add('inCart');
        addBtn.querySelector('.t').innerHTML='В заявке · '+it.qty+' шт.';
      } else {
        qtyBox.hidden=true; addBtn.classList.remove('inCart');
        addBtn.querySelector('.t').innerHTML='Добавить в заявку'+(t.price!=null?'<small>'+priceTxt+' / сутки</small>':'');
      }
      icons();
    };
    addBtn.addEventListener('click', function(){ C.add(t.id,1); syncQty() });
    qtyBox.addEventListener('click', function(e){
      var st=C.read(), cur=1; st.items.forEach(function(i){ if(i.id===t.id) cur=i.qty });
      if(e.target.closest('[data-inc]')) C.setQty(t.id,cur+1);
      else if(e.target.closest('[data-dec]')) C.setQty(t.id,cur-1);
      syncQty();
    });
    document.addEventListener('cart:change', syncQty);
    syncQty();
  }

  var appbar=document.getElementById('appbar');
  addEventListener('scroll', function(){ appbar.classList.toggle('stuck', scrollY>4) }, {passive:true});

  icons();
})();

/* ── горизонтальная лента: стрелки на десктопе ── */
function initRailNav(sec){
  var rail=sec.querySelector('.rail'); if(!rail) return;
  var scrollable=function(){ return getComputedStyle(rail).overflowX==='auto' && rail.scrollWidth>rail.clientWidth+1 };
  var anim=function(to){
    var from=rail.scrollLeft, d=to-from, t0=performance.now();
    var step=function(t){
      var p=Math.min(1,(t-t0)/320), e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
      rail.scrollLeft=from+d*e; if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var navs=[];
  ['l','r'].forEach(function(side){
    var dir=side==='r'?1:-1;
    var w=document.createElement('div'); w.className='railnav '+side;
    w.innerHTML='<button type="button" aria-label="'+(dir>0?'Вперёд':'Назад')+'"><i data-lucide="chevron-'+(dir>0?'right':'left')+'"></i></button>';
    sec.appendChild(w); navs.push(w);
    var b=w.querySelector('button');
    b.addEventListener('click', function(){
      var c=rail.querySelector('.card');
      anim(rail.scrollLeft+dir*((c?c.getBoundingClientRect().width+18:400)*2));
    });
    w._sync=function(){ var max=rail.scrollWidth-rail.clientWidth-2; b.disabled=dir<0?rail.scrollLeft<=2:rail.scrollLeft>=max };
  });
  var sync=function(){
    var on=scrollable();
    sec.classList.toggle('hasrail',on);
    rail.classList.toggle('scrollable',on);
    navs.forEach(function(w){ w.style.display=on?'':'none'; w._sync() });
    if(navs[0]){
      var top=rail.offsetTop+14, h=rail.clientHeight-48;
      navs.forEach(function(w){ w.style.top=top+'px'; w.style.height=h+'px' });
    }
  };
  rail.addEventListener('scroll',sync); addEventListener('resize',sync); setTimeout(sync,80);
  if(window.lucide) lucide.createIcons();
}
