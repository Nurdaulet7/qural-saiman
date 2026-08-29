/* QURAL-SAIMAN — корзина, вариант 2 (бланк заявки) */
(function(){
  var QS=window.QS, C=window.QSCart;
  if(!QS||!C) return;
  var icons=function(){ if(window.lucide) lucide.createIcons() };
  var $=function(id){ return document.getElementById(id) };
  var PRESETS=[1,3,7,30];
  var MON=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var WD=['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

  var plural=function(n,a,b,c){ var x=n%10,y=n%100; return y>10&&y<20?c : x===1?a : (x>1&&x<5?b:c) };
  var fixCfg=function(s){
    if(!s) return s;
    return s.replace(/(\d+)\s*трап\S*/g, function(m,n){ return n+' '+plural(+n,'трап','трапа','трапов') });
  };
  var dayWord=function(n){ return plural(n,'сутки','суток','суток') };
  var fmt=function(n){ return Number(n).toLocaleString('ru-RU').replace(/,/g,' ')+' ₸' };
  var shift=function(from,days){ var d=new Date(from); d.setDate(d.getDate()+days); return d };

  var open={};
  var row=function(it){
    var t=C.toolOf(it); if(!t) return '';
    var tid=it.toolId||it.id;
    var price=it.unitPrice!=null?it.unitPrice:t.price;
    var st=C.read(), days=C.itemDays(it,st), own=!!it.days;
    var free=C.freeDays(days,t.power), bill=days-free;
    var pre=(it.unitPrice==null && t.priceNote)?'от ':'';
    var sum=price==null ? null : price*bill*it.qty;
    return '<div class="srow'+(open[it.id]?' open':'')+'" data-id="'+it.id+'">'+
      '<div class="smain">'+
        '<a class="sim" href="product.html?id='+tid+'">'+
          (QS.hasPhoto(tid) ? '<img src="'+QS.photo(tid)+'" alt="" loading="lazy" />' : '<span class="noph"></span>')+'</a>'+
        '<div class="stx"><b>'+t.name+(it.cfgLabel?' <em class="scfg">· '+fixCfg(it.cfgLabel)+'</em>':'')+'</b>'+
          '<span>'+(price==null?'цена по запросу':pre+fmt(price)+' / сутки')+'</span>'+
          '<button class="sterm'+(own?' own':'')+'" type="button" data-term>'+
            '<i data-lucide="calendar-days"></i>'+days+' '+dayWord(days)+
            (free>0?' <em>+'+free+' в подарок</em>':'')+
            '<i data-lucide="chevron-down" class="cv"></i></button>'+
        '</div>'+
        '<div class="sright">'+
          '<span class="ssum">'+(sum==null?'—':pre+fmt(sum))+'</span>'+
          '<div class="stepper"><button type="button" data-dec aria-label="Меньше">−</button><b>'+it.qty+'</b>'+
            '<button type="button" data-inc aria-label="Больше">+</button></div>'+
        '</div>'+
      '</div>'+
      '<div class="sterm-panel">'+
        '<div class="stp-row">'+
          '<button class="stp-step" type="button" data-idays="-1">−</button>'+
          '<span class="stp-val"><b>'+days+'</b> '+dayWord(days)+'</span>'+
          '<button class="stp-step" type="button" data-idays="1">+</button>'+
          '<button class="stp-del" type="button" data-del title="Убрать"><i data-lucide="trash-2"></i></button>'+
        '</div>'+
        (own?'<div class="stp-foot"><button type="button" data-same>как у всех — '+st.days+' '+dayWord(st.days)+'</button></div>':'')+
      '</div>'+
    '</div>';
  };

  var waLink=function(){
    var st=C.read(), tt=C.totals(), vary=false;
    var num=function(n){ return Number(n).toLocaleString('ru-RU').replace(/,/g,' ') };
    var blocks=st.items.map(function(i){
      var t=C.toolOf(i); if(!t) return '';
      if(i.unitPrice==null && t.priceNote) vary=true;
      var cat=(QS.catById(t.cat)||{}).name||'';
      var dd=C.itemDays(i,st);
      var free=C.freeDays(dd,t.power), bill=dd-free;
      var price=i.unitPrice!=null?i.unitPrice:t.price;
      /* строка 2: модель · характеристика/комплектация · количество */
      var det=[t.name];
      var extra=i.cfgLabel?fixCfg(i.cfgLabel):(t.spec||'');
      if(extra) det.push(extra);
      if(i.qty>1) det.push(i.qty+' шт');
      /* строка 3: срок × цена = сумма */
      var calc;
      if(price==null) calc=dd+' '+dayWord(dd)+' · цена по запросу';
      else{
        var pre=(i.unitPrice==null && t.priceNote)?'от ':'';
        calc=dd+' '+dayWord(dd)+' × '+pre+num(price)+' ₸'+
          (i.qty>1?' × '+i.qty+' шт':'')+
          ' = '+pre+num(price*bill*i.qty)+' ₸'+
          (free>0?' ('+free+' '+dayWord(free)+' в подарок)':'');
      }
      return '▸ '+(cat||'Инструмент')+'\n  '+det.join(' · ')+'\n  '+calc;
    }).filter(Boolean);
    var ship=st.ship==='delivery'
      ? 'Доставка (стоимость рассчитает менеджер)'
      : 'Самовывоз со склада — ул. Мустафы Шокая, 9а';
    var msg='Здравствуйте! Хочу арендовать:\n\n'+blocks.join('\n\n')+
      '\n\nИтого: '+(tt.net?(vary?'от ':'')+fmt(tt.net):'по запросу')+
      '\nПолучение: '+ship+
      '\nДату выдачи согласуем'+
      (vary?'\n(цена зависит от высоты/комплектации — уточните)':'')+
      (tt.onRequest?'\n(часть позиций — по запросу)':'');
    return 'https://wa.me/77057802074?text='+encodeURIComponent(msg);
  };

  var renderFav=function(){
    var F=window.QSFav; if(!F) return;
    var list=F.read(), st=C.read();
    var inCart={}; st.items.forEach(function(i){ inCart[i.toolId||i.id]=1 });
    $('favSec').hidden=!list.length;
    syncMore(list.length);
    $('favCnt').textContent=list.length ? list.length+' '+plural(list.length,'позиция','позиции','позиций') : '';
    $('favRail').innerHTML=list.map(function(id){
      var t=C.byId(id); if(!t) return '';
      var pre=t.priceNote?'от ':'';
      return '<div class="favcard" data-fid="'+id+'">'+
        '<a class="fph" href="product.html?id='+id+'">'+
          (QS.hasPhoto(id) ? '<img src="'+QS.photo(id)+'" alt="" loading="lazy" />' : '<span class="noph"></span>')+'</a>'+
        '<div class="fbody">'+
          '<a class="fnm" href="product.html?id='+id+'">'+t.name+'</a>'+
          '<span class="fpr">'+(t.price==null?'цена по запросу':'<b>'+pre+fmt(t.price)+'</b> / сутки')+'</span>'+
        '</div>'+
        '<div class="facts">'+
          '<button class="funfav" type="button" data-unfav aria-label="Убрать из избранного"><i data-lucide="heart"></i></button>'+
          '<button class="fadd'+(inCart[id]?' in':'')+'" type="button" data-fadd aria-label="'+(inCart[id]?'Уже в заявке':'Добавить в заявку')+'">'+
            '<i data-lucide="'+(inCart[id]?'check':'plus')+'"></i></button>'+
        '</div></div>';
    }).join('');
    icons();
  };

  var render=function(){
    var st=C.read(), has=st.items.length>0;
    $('cartEmpty').hidden=has; $('cartMain').hidden=!has; $('actBar').hidden=!has;
    C.syncBadge();
    var n=st.items.reduce(function(s,i){ return s+i.qty },0);
    $('cnt').textContent=has?n+' '+plural(n,'позиция','позиции','позиций'):'';
    if(!has){ renderFav(); icons(); return; }

    var eff=st.items.map(function(i){ return C.itemDays(i,st) });
    var maxD=eff.reduce(function(m,d){ return Math.max(m,d) }, 1);
    var uniqD={}; eff.forEach(function(d){ uniqD[d]=1 });
    var one=Object.keys(uniqD).length===1 ? eff[0] : null;
    var anyOwn=one===null;
    $('durLbl').textContent = one!==null ? one+' '+dayWord(one) : 'до '+maxD+' '+dayWord(maxD);
    $('rDays').textContent  = one!==null ? one+' '+dayWord(one) : 'разные сроки';
    $('mixNote').hidden=!anyOwn;
    $('durLab').textContent = anyOwn ? 'Задать всем позициям' : 'Срок для всей заявки';

    $('durNum').textContent = one!==null ? one : '—';
    $('durow').innerHTML=PRESETS.map(function(p){
      var lb=p===1?'сутки':p===7?'неделя':p===30?'месяц':p+' суток';
      return '<button type="button" class="'+(one===p?'on':'')+'" data-p="'+p+'">'+lb+'</button>';
    }).join('');

    $('cartList').innerHTML=st.items.map(row).join('');

    var tt=C.totals();
    var vary=st.items.some(function(i){ var t=C.toolOf(i); return t && i.unitPrice==null && t.priceNote });
    var pre=vary?'от ':'';
    $('sumGross').textContent=tt.gross?pre+fmt(tt.gross):'—';
    $('sumGiftLine').hidden=!(tt.gift>0);
    $('sumGift').textContent='−'+fmt(tt.gift);
    $('sumTotal').textContent=tt.net?pre+fmt(tt.net):'по запросу';
    $('barTotal').textContent=tt.net?pre+fmt(tt.net):'цена по запросу';
    var isDl=st.ship==='delivery';
    $('shipRow').querySelectorAll('[data-ship]').forEach(function(b){ b.classList.toggle('on', b.dataset.ship===st.ship) });
    $('rShipLbl').textContent=isDl?'Доставка':'Самовывоз';
    $('rShipVal').textContent=isDl?'по расчёту':'бесплатно';
    $('rNote').textContent=isDl
      ? 'Стоимость доставки зависит от расстояния от склада на ул. Мустафы Шокая, 9а — менеджер посчитает и подтвердит в WhatsApp.'
      : 'Забираете сами со склада на ул. Мустафы Шокая, 9а. Пн–Пт 08:00–20:00, Сб–Вс 08:00–17:00.';
    $('waOrder').href=waLink();

    var pb=$('promoBar');
    var anyPromo=st.items.some(function(i){ var t=C.toolOf(i); return t&&QS.isPromoPower(t.power) && C.itemDays(i,st)<6 });
    var next=6-(st.days%6);
    if(anyOwn){ pb.hidden=true; }
    else if(anyPromo && st.days<6){
      pb.hidden=false;
      pb.querySelector('span').innerHTML='Ещё <b>'+(6-st.days)+' '+dayWord(6-st.days)+'</b> — и шестые сутки бесплатно';
    } else if(anyPromo && st.days%6!==0 && next<=2){
      pb.hidden=false;
      pb.querySelector('span').innerHTML='Ещё <b>'+next+' '+dayWord(next)+'</b> — и получите ещё сутки в подарок';
    } else pb.hidden=true;

    renderFav();
    icons();
  };

  var FKEY='qs_fav_open';
  var favOpen=false;
  try{ favOpen = localStorage.getItem(FKEY)==='1' }catch(e){}
  var syncMore=function(n){
    var s=$('favSec'), b=$('favToggle');
    var vis=matchMedia('(min-width:900px)').matches?6:3;
    s.classList.toggle('closed', !favOpen);
    b.hidden = n<=vis;
    b.textContent = favOpen ? 'Свернуть' : 'Показать ещё '+(n-vis);
  };
  $('favToggle').addEventListener('click', function(){
    favOpen=!favOpen;
    try{ localStorage.setItem(FKEY, favOpen?'1':'0') }catch(e){}
    syncMore(QSFav.read().length);
  });

  $('favRail').addEventListener('click', function(e){
    var card=e.target.closest('[data-fid]'); if(!card) return;
    var id=card.dataset.fid;
    if(e.target.closest('[data-unfav]')){ e.preventDefault(); QSFav.remove(id); render(); }
    else if(e.target.closest('[data-fadd]')){ e.preventDefault(); C.add(id,1); render(); }
  });

  $('cartList').addEventListener('click', function(e){
    var el=e.target.closest('.srow'); if(!el) return;
    var id=el.dataset.id, st=C.read(), it=null;
    st.items.forEach(function(i){ if(i.id===id) it=i });
    if(!it) return;
    if(e.target.closest('[data-inc]')) C.setQty(id,it.qty+1);
    else if(e.target.closest('[data-dec]')) C.setQty(id,it.qty-1);
    else if(e.target.closest('[data-del]')) C.remove(id);
    else if(e.target.closest('[data-term]')){ open[id]=!open[id]; }
    else if(e.target.closest('[data-idays]')){
      var dl=+e.target.closest('[data-idays]').dataset.idays;
      C.setItemDays(id, C.itemDays(it,st)+dl);
    }
    else if(e.target.closest('[data-same]')) C.setItemDays(id,null);
    else return;
    render();
  });
  var applyAll=function(d){
    C.setDays(d);
    C.read().items.forEach(function(i){ C.setItemDays(i.id,null) });
  };
  var durClick=function(e){
    var b=e.target.closest('[data-p]'), n=e.target.closest('[data-nudge]');
    var st=C.read();
    var eff=st.items.map(function(i){ return C.itemDays(i,st) });
    var uq={}; eff.forEach(function(d){ uq[d]=1 });
    var cur=Object.keys(uq).length===1 ? eff[0] : st.days;
    if(b) applyAll(+b.dataset.p);
    else if(n) applyAll(cur + (+n.dataset.nudge));
    else return;
    render();
  };
  $('durow').addEventListener('click', durClick);
  document.querySelector('.dunudge').addEventListener('click', durClick);
  $('shipRow').addEventListener('click', function(e){
    var b=e.target.closest('[data-ship]'); if(!b) return;
    C.setShip(b.dataset.ship); render();
  });
  $('clearCart').addEventListener('click', function(){ if(confirm('Очистить заявку?')){ C.clear(); render() } });

  var bar=$('appbar');
  addEventListener('scroll', function(){ bar.classList.toggle('stuck', scrollY>4) }, {passive:true});

  render();
})();
