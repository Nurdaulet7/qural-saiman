/* QURAL-SAIMAN — виджет обратного звонка.
   requestCallback(phone) — заявка уходит в WhatsApp менеджера.
   Когда появится бэкенд/Binotel — заменить тело на fetch('/api/callback', {method:'POST', body:{phone}}). */
(function(){
  var MANAGER='77057802074';
  var requestCallback = function(phone){
    return new Promise(function(resolve){
      var msg='Заявка на обратный звонок\nТелефон: '+phone+'\nСтраница: '+location.pathname.replace(/^\//,'');
      try{ window.open('https://wa.me/'+MANAGER+'?text='+encodeURIComponent(msg),'_blank','noopener') }catch(e){}
      setTimeout(resolve, 400);
    });
  };
  window.QSCallback = { request: requestCallback };

  var esc=function(s){ return String(s||'').replace(/[&<>]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c] }) };
  var icons=function(){ if(window.lucide) lucide.createIcons() };

  /* рабочие часы: Пн-Пт 08:00–20:00, Сб-Вс 08:00–17:00 */
  var isWorkingHours=function(){
    var d=new Date(), day=d.getDay(), h=d.getHours()+d.getMinutes()/60;
    var end = (day===0||day===6) ? 17 : 20;
    return h>=8 && h<end;
  };

  var rawDigits=function(v){ var d=v.replace(/\D/g,''); if(d.length===11 && (d[0]==='7'||d[0]==='8')) d=d.slice(1); return d.slice(0,10) };
  var groupDigits=function(d){
    var out='';
    if(d.length) out+=d.slice(0,3);
    if(d.length>3) out+=' '+d.slice(3,6);
    if(d.length>6) out+=' '+d.slice(6,8);
    if(d.length>8) out+=' '+d.slice(8,10);
    return out;
  };
  var isValidPhone=function(input){ return rawDigits(input.dataset.raw||'').length===10 };
  var wireInput=function(input){
    input.dataset.raw='';
    input.addEventListener('input', function(){
      input.dataset.raw=rawDigits(input.value);
      input.value=groupDigits(input.dataset.raw);
      input.setSelectionRange(input.value.length,input.value.length);
    });
  };

  /* ---- переиспользуемая форма (для попапа и для блока на контактах) ---- */
  var formHTML = function(idPrefix){
    return '<form class="cbform" id="'+idPrefix+'Form">'+
      '<div class="cbfield"><i data-lucide="phone"></i><span class="cbprefix">+7</span><input type="tel" inputmode="tel" placeholder="700 123 45 67" id="'+idPrefix+'Phone" required></div>'+
      '<button type="submit" class="cbsend" id="'+idPrefix+'Send" aria-label="Перезвоните мне"><i data-lucide="phone-outgoing" class="cbicn"></i><i data-lucide="loader-2" class="cbspin"></i></button>'+
    '</form>'+
    '<p class="cberr" id="'+idPrefix+'Err" hidden>Проверьте номер — нужно 10 цифр после +7</p>'+
    '<div class="cbok" id="'+idPrefix+'Ok" hidden><span class="cbring"><svg viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="16"></circle><circle class="fg" id="'+idPrefix+'Ring" cx="18" cy="18" r="16"></circle></svg><b id="'+idPrefix+'Sec">30</b></span><span id="'+idPrefix+'OkTxt">Перезвоним вам совсем скоро</span></div>';
  };

  var wireForm = function(idPrefix){
    var form=document.getElementById(idPrefix+'Form'), input=document.getElementById(idPrefix+'Phone'),
        btn=document.getElementById(idPrefix+'Send'), ok=document.getElementById(idPrefix+'Ok'),
        okTxt=document.getElementById(idPrefix+'OkTxt'), err=document.getElementById(idPrefix+'Err');
    if(!form) return;
    wireInput(input);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      err.hidden=true;
      if(!isValidPhone(input)){ err.hidden=false; input.focus(); return }
      var phone='+7 '+groupDigits(input.dataset.raw);
      btn.disabled=true; btn.classList.add('loading');
      QSCallback.request(phone).then(function(){
        form.hidden=true; ok.hidden=false;
        var ring=document.getElementById(idPrefix+'Ring'), sec=document.getElementById(idPrefix+'Sec'), okTxt2=document.getElementById(idPrefix+'OkTxt');
        var total=30000, start=performance.now(), circ=2*Math.PI*16;
        ring.style.strokeDasharray=circ;
        var tick=function(now){
          var left=Math.max(0,total-(now-start)), s=left/1000;
          sec.textContent=s.toFixed(1);
          ring.style.strokeDashoffset=circ*(1-left/total);
          if(left>0) requestAnimationFrame(tick);
          else { sec.textContent='0.0'; okTxt2.textContent='Перезваниваем — возьмите трубку' }
        };
        requestAnimationFrame(tick);
        icons();
      });
    });
  };

  /* ---- попап: раз в сессию, через 25 сек или при уходе с экрана ---- */
  var openPopup = function(force){
    var ex=document.querySelector('.cbpopup');
    if(ex){ ex.classList.add('show'); return }
    sessionStorage.setItem('qs_cb_seen','1');
    var wrap=document.createElement('div');
    wrap.className='cbpopup';
    wrap.innerHTML='<div class="cbcard">'+
      '<button type="button" class="cbx" aria-label="Закрыть"><i data-lucide="x"></i></button>'+
      '<span class="cbicon"><i data-lucide="phone-call"></i></span>'+
      '<b>Перезвоним за 30 секунд</b>'+
      '<p>Оставьте номер — наш менеджер свяжется с вами почти сразу</p>'+
      formHTML('cbpop')+
    '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function(){ wrap.classList.add('show') });
    wrap.querySelector('.cbx').addEventListener('click', function(){ wrap.classList.remove('show'); setTimeout(function(){ wrap.remove() },250) });
    wireForm('cbpop');
    icons();
  };
  window.QSCallback.open = openPopup;

  var initPopup = function(){
    if(sessionStorage.getItem('qs_cb_seen')) return;
    if(!isWorkingHours()) return;
    var shown=false;
    var open=function(){
      if(shown) return; shown=true;
      openPopup();
    };
    var t=setTimeout(open,30000);
    document.addEventListener('mouseleave', function(e){ if(e.clientY<10) open() });
    addEventListener('pagehide', function(){ clearTimeout(t) });
  };

  document.addEventListener('DOMContentLoaded', function(){
    initPopup();
    var slot=document.getElementById('callbackSlot');
    if(slot){ slot.innerHTML=formHTML('cbinl'); wireForm('cbinl'); icons(); }
  });
})();
