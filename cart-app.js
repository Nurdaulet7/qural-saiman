/* QURAL-SAIMAN — корзина, вариант 2 (бланк заявки) */
(function(){
  var QS=window.QS, C=window.QSCart;
  if(!QS||!C) return;
  var icons=function(){ if(window.lucide) lucide.createIcons() };
  var $=function(id){ return document.getElementById(id) };

  var MON=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var WD=['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

  var plural=function(n,a,b,c){ var x=n%10,y=n%100; return y>10&&y<20?c : x===1?a : (x>1&&x<5?b:c) };
  var fixCfg=function(s){
    if(!s) return s;
    return s.replace(/(\d+)\s*трап\S*/g, function(m,n){ return n+' '+plural(+n,'трап','трапа','трапов') });
  };
  var dayWord=function(n){ return plural(n,'сутки','суток','суток') };
  /* Ходовые сроки — единый список для общего контроля и для строк корзины.
     Всё остальное вводится числом в поле «Сколько суток». */
  var PRESET_DAYS=[1,3,6,7,30];
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
            '<i data-lucide="calendar-days"></i>'+
            '<i class="src">'+(own?'Свой срок':'Как в корзине')+'</i>'+
            days+' '+dayWord(days)+
            (free>0?' <em>+'+free+' в подарок</em>':'')+
            '<i data-lucide="chevron-down" class="cv"></i></button>'+
        '</div>'+
        '<div class="sright">'+
          '<span class="ssum">'+(sum==null?'—':pre+fmt(sum))+'</span>'+
          '<div class="srow-acts">'+
            '<div class="stepper"><button type="button" data-dec aria-label="Меньше">−</button><b>'+it.qty+'</b>'+
              '<button type="button" data-inc aria-label="Больше">+</button></div>'+
            '<button class="srow-del" type="button" data-del title="Убрать из корзины" aria-label="Убрать из корзины"><i data-lucide="trash-2"></i></button>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="sterm-panel">'+
        /* Сроки словами — число без единицы клиенту не читается */
        '<div class="stp-quick">'+
          PRESET_DAYS.map(function(p){
            var lb=p===7?'неделя':p===30?'месяц':p+' '+dayWord(p);
            /* Сроки с подарочными сутками помечаем — иначе выгода видна только после выбора */
            var gift=C.freeDays(p,t.power);
            return '<button type="button" class="'+(gift>0?'gift':'')+(days===p?' on':'')+'" data-sdays="'+p+'">'+
              lb+(gift>0?'<em>+'+gift+' в подарок</em>':'')+'</button>';
          }).join('')+
        '</div>'+
        '<div class="stp-one">'+
          '<label class="stp-lab" for="od'+it.id+'">Другой срок</label>'+
          '<div class="stp-box">'+
            '<button type="button" data-idays="-1"'+(days<=1?' disabled':'')+' aria-label="Меньше на сутки">−</button>'+
            '<input id="od'+it.id+'" type="number" min="1" max="90" inputmode="numeric" data-odays value="'+days+'" />'+
            '<button type="button" data-idays="1" aria-label="Больше на сутки">+</button>'+
          '</div>'+
        '</div>'+
        /* Одна строка расчёта заменяет пояснения на самих кнопках */
        '<div class="stp-calc">'+
          (price==null
            ? 'Цену уточним в переписке'
            : '<b>'+bill+' '+dayWord(bill)+'</b> × '+fmt(price)+
              (it.qty>1?' × '+it.qty+' шт':'')+' = <b>'+pre+fmt(price*bill*it.qty)+'</b>'+
              (free>0
                ? '<em>'+free+' '+dayWord(free)+' в подарок — экономия '+fmt(price*free*it.qty)+'</em>'
                : ''))+
        '</div>'+
        (own?'<button class="stp-same" type="button" data-same>Вернуть общий срок — '+st.days+' '+dayWord(st.days)+'</button>':'')+
      '</div>'+
      '</div>'+
    '</div>';
  };

  var waLink=function(){
    var st=C.read(), tt=C.totals(), vary=false;
    var num=function(n){ return Number(n).toLocaleString('ru-RU').replace(/,/g,' ') };
    var n=0;
    var blocks=st.items.map(function(i){
      var t=C.toolOf(i); if(!t) return '';
      var approx=(i.unitPrice==null && t.priceNote);
      if(approx) vary=true;
      var cat=(QS.catById(t.cat)||{}).name||'';
      var dd=C.itemDays(i,st);
      var free=C.freeDays(dd,t.power), bill=dd-free;
      var price=i.unitPrice!=null?i.unitPrice:t.price;
      n++;
      /* Категория и модель в одной строке: раньше категория съедала лишнюю строку */
      var head=n+') '+(cat?cat+' — ':'')+t.name+(i.qty>1?', '+i.qty+' шт':'');
      var spec=i.cfgLabel?fixCfg(i.cfgLabel):(t.spec||'');
      var calc;
      if(price==null) calc=dd+' '+dayWord(dd)+' — цена по запросу';
      else{
        /* Умножаем на платные сутки — и пишем в строке именно их, иначе счёт
           на глаз не сходится. «от» ставим и у ставки: точное умножение
           с результатом «от» читается как ошибка. */
        var p=(approx?'от ':'')+num(price)+' ₸';
        calc=bill+' '+dayWord(bill)+' × '+p+(i.qty>1?' × '+i.qty+' шт':'')+
          ' = '+(approx?'от ':'')+num(price*bill*i.qty)+' ₸'+
          (approx?' (зависит от комплектации)':'');
      }
      /* Срок выдачи отдельной строкой: складу важны все сутки, кассе — только платные */
      var hand=free>0 ? '\n   Выдача на '+dd+' '+dayWord(dd)+', '+free+' в подарок' : '';
      return head+(spec?'\n   '+spec:'')+'\n   '+calc+hand;
    }).filter(Boolean);
    /* От первого лица: клиент сообщает свой выбор, а не читает памятку */
    var ship=st.ship==='delivery'
      ? 'Нужна доставка'
      : 'Заберу сам со склада';
    var msg='Здравствуйте! Хочу арендовать:\n\n'+blocks.join('\n\n')+
      '\n\nИтого: '+(tt.net?(vary?'от ':'')+fmt(tt.net):'по запросу')+
      '\n'+ship+
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

  var render=function(keepRows){
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
    var anyOwn=st.items.some(function(i){ return !!i.days });
    $('durLbl').textContent = one!==null ? one+' '+dayWord(one) : 'до '+maxD+' '+dayWord(maxD);
    $('rDays').textContent  = one!==null ? one+' '+dayWord(one) : 'разные сроки';
    $('mixNote').hidden=!anyOwn;
    $('durLab').textContent = anyOwn
      ? 'У части позиций свой срок — кнопка задаст всем один'
      : 'Применится ко всем позициям';
    $('durow').innerHTML=PRESET_DAYS.map(function(p){
      var lb=p===7?'неделя':p===30?'месяц':p+' '+dayWord(p);
      return '<button type="button" class="'+(one===p?'on':'')+'" data-p="'+p+'">'+lb+'</button>';
    }).join('');

    if(!keepRows) $('cartList').innerHTML=st.items.map(row).join('');

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
    else if(e.target.closest('[data-term]')){
      var was=open[id];
      open={};              /* открыта всегда одна строка */
      if(!was) open[id]=true;
    }
    else if(e.target.closest('[data-idays]')){
      var dl=+e.target.closest('[data-idays]').dataset.idays;
      C.setItemDays(id, Math.max(1, C.itemDays(it,st)+dl));
    }
    else if(e.target.closest('[data-sdays]')) C.setItemDays(id, +e.target.closest('[data-sdays]').dataset.sdays);
    else if(e.target.closest('[data-same]')) C.setItemDays(id,null);
    else return;
    render();
  });

  var MAX_DAYS=90;
  /* Клик в поле выделяет число: набор «10» заменяет прежнее значение, а не дописывает к нему */
  $('cartList').addEventListener('focus', function(e){
    var inp=e.target.closest && e.target.closest('[data-odays]');
    if(inp) setTimeout(function(){ try{ inp.select() }catch(err){} },0);
  }, true);

  /* Обновляет цифры строки, не пересобирая её — поле с курсором остаётся живым */
  var repaintRow=function(id){
    var st=C.read(), it=null;
    st.items.forEach(function(i){ if(i.id===id) it=i });
    var box=document.querySelector('.srow[data-id="'+id+'"]');
    if(!it || !box) return;
    var tmp=document.createElement('div');
    tmp.innerHTML=row(it);
    ['.smain','.stp-calc','.stp-quick'].forEach(function(sel){
      var from=tmp.querySelector(sel), to=box.querySelector(sel);
      if(from && to) to.innerHTML=from.innerHTML;
    });
    icons();
  };

  $('cartList').addEventListener('input', function(e){
    var inp=e.target.closest('[data-odays]'); if(!inp) return;
    var host=inp.closest('.srow'); if(!host) return;
    var v=parseInt(inp.value,10);
    if(!v || v<1) return;              /* пустое поле не трогаем — восстановим на blur */
    if(v>MAX_DAYS){ v=MAX_DAYS; inp.value=MAX_DAYS }
    var id=host.dataset.id;
    C.setItemDays(id, v);
    render(true);
    repaintRow(id);
  });
  /* Ушли из поля — приводим его к действующему сроку и пересобираем корзину целиком */
  $('cartList').addEventListener('blur', function(e){
    var inp=e.target.closest && e.target.closest('[data-odays]'); if(!inp) return;
    var host=inp.closest('.srow'); if(!host) return;
    var st=C.read(), it=null;
    st.items.forEach(function(i){ if(i.id===host.dataset.id) it=i });
    if(it) inp.value=C.itemDays(it,st);
    render();
  }, true);
  var applyAll=function(d){
    C.setDays(d);
    C.read().items.forEach(function(i){ C.setItemDays(i.id,null) });
  };
  /* Щелчок мимо строки — закрываем раскрытый срок */
  document.addEventListener('click', function(e){
    if(!Object.keys(open).length) return;
    if(e.target.closest('.srow')) return;
    open={}; render();
  });
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && Object.keys(open).length){ open={}; render() }
  });
  $('durow').addEventListener('click', function(e){
    var b=e.target.closest('[data-p]'); if(!b) return;
    applyAll(+b.dataset.p);
    render();
  });
  $('shipRow').addEventListener('click', function(e){
    var b=e.target.closest('[data-ship]'); if(!b) return;
    C.setShip(b.dataset.ship); render();
  });
  $('clearCart').addEventListener('click', function(){ if(confirm('Очистить заявку?')){ C.clear(); render() } });

  var bar=$('appbar');
  addEventListener('scroll', function(){ bar.classList.toggle('stuck', scrollY>4) }, {passive:true});

  render();
})();
