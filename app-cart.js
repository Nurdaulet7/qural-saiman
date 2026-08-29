/* QURAL-SAIMAN — корзина проката.
   Хранилище: localStorage['qs_cart_v1'] = { items:[{id,qty}], from:'YYYY-MM-DD', days:N }
   Цены и названия берутся из QS по id — данные всегда актуальны.
   Требует tools-data.js. */
(function(){
  var KEY='qs_cart_v1';
  var QS=window.QS||{};

  var todayIso=function(){ var d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10) };

  var byId=function(id){
    var all=(QS.tools||[]).concat(QS.dgu||[]);
    for(var i=0;i<all.length;i++){ if(all[i].id===id) return all[i] }
    return null;
  };

  var read=function(){
    var raw; try{ raw=JSON.parse(localStorage.getItem(KEY)) }catch(e){}
    var st={ items:[], from:todayIso(), days:1, ship:'pickup' };
    if(Array.isArray(raw)){ /* миграция со старого формата */
      raw.forEach(function(o){ if(o&&o.id) st.items.push({id:o.id, qty:o.quantity||o.qty||1}) });
      if(raw[0]&&raw[0].days) st.days=raw[0].days;
    } else if(raw&&typeof raw==='object'){
      if(Array.isArray(raw.items)) st.items=raw.items.filter(function(i){ return i&&i.id }).map(function(i){
        var o={id:i.id, toolId:i.toolId||i.id, qty:Math.max(1,i.qty|0||1)};
        if(i.days) o.days=Math.max(1,Math.min(90,i.days|0));
        if(i.unitPrice!=null) o.unitPrice=i.unitPrice;
        if(i.cfgLabel) o.cfgLabel=i.cfgLabel;
        return o;
      });
      if(raw.from) st.from=raw.from;
      if(raw.days) st.days=Math.max(1,Math.min(90,raw.days|0));
      if(raw.ship==='delivery'||raw.ship==='pickup') st.ship=raw.ship;
    }
    st.items=st.items.filter(function(i){ return !!byId(i.toolId||i.id) });
    return st;
  };

  var write=function(st){
    try{ localStorage.setItem(KEY, JSON.stringify(st)) }catch(e){}
    document.dispatchEvent(new CustomEvent('cart:change'));
    return st;
  };

  var count=function(){ return read().items.reduce(function(s,i){ return s+(i.qty||1) },0) };

  var add=function(id,qty){
    var st=read(), f=null;
    st.items.forEach(function(i){ if(i.id===id) f=i });
    if(f) f.qty+=(qty||1); else st.items.push({id:id, toolId:id, qty:qty||1});
    return write(st);
  };
  var addConfig=function(toolId,qty,unitPrice,cfgLabel){
    var st=read(), f=null;
    st.items.forEach(function(i){ if(i.toolId===toolId && i.cfgLabel===cfgLabel) f=i });
    if(f) f.qty+=(qty||1);
    else st.items.push({id:toolId+'#'+Math.random().toString(36).slice(2,8), toolId:toolId, qty:qty||1, unitPrice:unitPrice, cfgLabel:cfgLabel});
    return write(st);
  };
  var toolOf=function(i){ return byId(i.toolId||i.id) };
  var setQty=function(id,q){
    var st=read();
    if(q<=0) st.items=st.items.filter(function(i){ return i.id!==id });
    else st.items.forEach(function(i){ if(i.id===id) i.qty=Math.min(20,q) });
    return write(st);
  };
  var remove=function(id){ return setQty(id,0) };
  var setDays=function(d){ var st=read(); st.days=Math.max(1,Math.min(90,d|0)); return write(st) };
  var setShip=function(v){ var st=read(); st.ship=(v==='delivery'?'delivery':'pickup'); return write(st) };
  /* срок конкретной позиции; null — вернуть к общему */
  var setItemDays=function(id,d){
    var st=read();
    st.items.forEach(function(i){
      if(i.id!==id) return;
      if(d==null) delete i.days; else i.days=Math.max(1,Math.min(90,d|0));
    });
    return write(st);
  };
  var itemDays=function(i,st){ return i.days || (st||read()).days };
  var setFrom=function(v){ var st=read(); st.from=v||todayIso(); return write(st) };
  var clear=function(){ return write({items:[],from:todayIso(),days:1,ship:'pickup'}) };

  /* акция: каждые 6 суток — 1 бесплатно, для бензо/электро/аккум */
  var freeDays=function(days,power){ return (QS.isPromoPower&&QS.isPromoPower(power)) ? Math.floor(days/6) : 0 };
  var billDays=function(days,power){ return Math.max(1, days-freeDays(days,power)) };

  var totals=function(){
    var st=read(), gross=0, net=0;
    st.items.forEach(function(i){
      var t=toolOf(i); if(!t) return;
      var price=i.unitPrice!=null?i.unitPrice:t.price;
      if(price==null) return;
      var d=itemDays(i,st);
      gross += price*d*i.qty;
      net   += price*billDays(d,t.power)*i.qty;
    });
    var onRequest=st.items.some(function(i){ var t=toolOf(i); return t && i.unitPrice==null && t.price==null });
    return { gross:gross, net:net, gift:gross-net, onRequest:onRequest, days:st.days, from:st.from, ship:st.ship };
  };

  /* бейдж в таббаре — на любой странице приложения */
  var syncBadge=function(){
    var n=count();
    document.querySelectorAll('[data-cart-dot],#cartDot').forEach(function(el){
      el.textContent=n; el.classList.toggle('show', n>0);
    });
  };
  document.addEventListener('cart:change', syncBadge);
  addEventListener('storage', function(e){ if(e.key===KEY) syncBadge() });
  if(document.readyState!=='loading') syncBadge(); else document.addEventListener('DOMContentLoaded', syncBadge);

  /* ===== избранное ===== */
  var FKEY='qs_fav_v2';
  var favRead=function(){
    var r; try{ r=JSON.parse(localStorage.getItem(FKEY)) }catch(e){}
    if(!Array.isArray(r)) return [];
    return r.filter(function(id){ return typeof id==='string' && byId(id) });
  };
  var favWrite=function(list){
    try{ localStorage.setItem(FKEY, JSON.stringify(list)) }catch(e){}
    document.dispatchEvent(new CustomEvent('fav:change'));
    return list;
  };
  var favHas=function(id){ return favRead().indexOf(id)>=0 };
  var favToggle=function(id){
    var l=favRead(), i=l.indexOf(id);
    if(i>=0){ l.splice(i,1); favWrite(l); return false }
    l.unshift(id); favWrite(l); return true;
  };
  var favRemove=function(id){ return favWrite(favRead().filter(function(x){ return x!==id })) };
  var syncFav=function(){
    var l=favRead();
    document.querySelectorAll('[data-fav]').forEach(function(b){
      b.classList.toggle('on', l.indexOf(b.getAttribute('data-fav'))>=0);
    });
  };
  document.addEventListener('fav:change', syncFav);
  if(document.readyState!=='loading') syncFav(); else document.addEventListener('DOMContentLoaded', syncFav);
  window.QSFav={ read:favRead, has:favHas, toggle:favToggle, remove:favRemove, sync:syncFav };

  window.QSCart={ read:read, add:add, addConfig:addConfig, setQty:setQty, remove:remove, setDays:setDays, setShip:setShip, setFrom:setFrom,
                  setItemDays:setItemDays, itemDays:itemDays,
                  clear:clear, count:count, totals:totals, byId:byId, toolOf:toolOf, freeDays:freeDays, billDays:billDays,
                  todayIso:todayIso, syncBadge:syncBadge };
})();
