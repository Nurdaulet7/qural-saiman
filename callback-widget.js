/* QURAL-SAIMAN — виджет обратного звонка.
   Дизайн наш, звонок — Binotel GetCall: их скрипт грузится скрытым, а заявка
   уходит через его форму, которую мы заполняем программно. */
(function(){
  /* Экземпляр виджета лежит в BinotelGetCall под своим id — ищем по методу */
  var getWidget=function(){
    var B=window.BinotelGetCall;
    if(!B) return null;
    for(var k in B){ if(B[k] && typeof B[k].openPassiveForm==='function') return B[k] }
    return null;
  };
  var waitWidget=function(){
    return new Promise(function(resolve){
      var w=getWidget();
      if(w) return resolve(w);
      var t0=Date.now();
      var iv=setInterval(function(){
        var w2=getWidget();
        if(w2 || Date.now()-t0>6000){ clearInterval(iv); resolve(w2) }
      },150);
    });
  };
  /* Их кнопку прячем сразу, как только скрипт поднимется */
  waitWidget().then(function(W){ if(W && W.hidePhoneButton) try{ W.hidePhoneButton() }catch(e){} });

  /* Считаем обращения к серверу Binotel. Класс их блока — ненадёжный признак:
     заявка может уйти, а разметка не измениться. Счётчик врать не может. */
  var sentCount=0;
  (function watchNetwork(){
    var isB=function(u){ return typeof u==='string' && u.indexOf('binotel')>-1 };
    var xo=XMLHttpRequest.prototype.open, xs=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open=function(m,u){ if(isB(u)) this.__bnt=1; return xo.apply(this,arguments) };
    XMLHttpRequest.prototype.send=function(){ if(this.__bnt) sentCount++; return xs.apply(this,arguments) };
    if(window.fetch){
      var f=window.fetch;
      window.fetch=function(u){ if(isB((u&&u.url)||u)) sentCount++; return f.apply(this,arguments) };
    }
    /* JSONP: они грузят ответ через script-тег */
    try{
      new MutationObserver(function(muts){
        muts.forEach(function(m){
          [].forEach.call(m.addedNodes,function(n){
            if(n.tagName==='SCRIPT' && isB(n.src)) sentCount++;
          });
        });
      }).observe(document.documentElement,{childList:true,subtree:true});
    }catch(e){}
  })();

  /* digits — ровно 10 цифр без кода страны, столько ждёт поле Binotel */
  var busy=false, lastSent=0;
  var requestCallback=function(digits){
    /* Двойная отправка = два звонка оператору: держим замок и паузу между заявками */
    if(busy) return Promise.reject(new Error('busy'));
    try{ lastSent=Math.max(lastSent, +(sessionStorage.getItem('qs_cb_sent')||0)) }catch(e){}
    if(Date.now()-lastSent < 60000) return Promise.reject(new Error('cooldown'));
    busy=true;
    return waitWidget().then(function(W){
      if(!W) throw new Error('binotel-offline');
      W.openPassiveForm();
      return new Promise(function(resolve,reject){
        var t0=Date.now();
        var iv=setInterval(function(){
          var inp=document.getElementById('bingc-passive-get-phone-form-input');
          var btn=document.querySelector('.bingc-passive-phone-form-button');
          if(inp && btn){
            clearInterval(iv);
            var base=sentCount;
            inp.value=digits;
            /* только input: keyup и change у них сами запускают отправку */
            inp.dispatchEvent(new Event('input',{bubbles:true}));
            setTimeout(function(){
              /* ушло от input само — не жмём кнопку, иначе будет вторая заявка */
              if(sentCount===base) btn.click();
              lastSent=Date.now();
              try{ sessionStorage.setItem('qs_cb_sent', String(lastSent)) }catch(e){}
              /* Форму не закрываем: она скрыта, а обрыв на полпути может
                 оборвать их запрос. Ждём, пока заявка точно уйдёт. */
              setTimeout(resolve,1200);
            },500);
          } else if(Date.now()-t0>5000){ clearInterval(iv); reject(new Error('binotel-form')) }
        },120);
      });
    }).then(function(v){ busy=false; return v }, function(e){ busy=false; throw e });
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
    '<div class="cbok" id="'+idPrefix+'Ok" hidden>'+
      '<span class="cbring"><svg viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="16"></circle><circle class="fg" id="'+idPrefix+'Ring" cx="18" cy="18" r="16"></circle></svg><b id="'+idPrefix+'Sec">30</b></span>'+
      '<strong id="'+idPrefix+'OkTxt">Перезвоним вам совсем скоро</strong>'+
      '<span class="cbnum" id="'+idPrefix+'Num"></span>'+
    '</div>';
  };

  var wireForm = function(idPrefix){
    var form=document.getElementById(idPrefix+'Form'), input=document.getElementById(idPrefix+'Phone'),
        btn=document.getElementById(idPrefix+'Send'), ok=document.getElementById(idPrefix+'Ok'),
        okTxt=document.getElementById(idPrefix+'OkTxt'), err=document.getElementById(idPrefix+'Err');
    if(!form) return;
    /* Заголовок и подзаголовок живут только в попапе; в блоке на контактах их нет */
    var hideCardIntro=function(){
      var card=form.closest('.cbcard');
      if(!card) return;
      [card.querySelector('.cbicon'), card.querySelector(':scope>b'), card.querySelector(':scope>p')]
        .forEach(function(n){ if(n) n.hidden=true });
    };
    wireInput(input);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      err.hidden=true;
      if(!isValidPhone(input)){ err.hidden=false; err.textContent='Проверьте номер — нужно 10 цифр после +7'; input.focus(); return }
      btn.disabled=true; btn.classList.add('loading');
      QSCallback.request(input.dataset.raw).then(function(){
        form.hidden=true; ok.hidden=false; hideCardIntro();
        var num=document.getElementById(idPrefix+'Num');
        if(num) num.textContent='+7 '+groupDigits(input.dataset.raw);
        var ring=document.getElementById(idPrefix+'Ring'), sec=document.getElementById(idPrefix+'Sec'), okTxt2=document.getElementById(idPrefix+'OkTxt');
        var total=30000, start=performance.now(), circ=2*Math.PI*16;
        ring.style.strokeDasharray=circ;
        var tick=function(now){
          var left=Math.max(0,total-(now-start)), s=left/1000;
          sec.textContent=Math.ceil(s);
          ring.style.strokeDashoffset=circ*(1-left/total);
          if(left>0) requestAnimationFrame(tick);
          else {
            sec.textContent='';
            /* Замыкаем кольцо: иначе дуга уходит в ноль и вокруг трубки пусто */
            ring.style.strokeDashoffset=0;
            ok.classList.add('calling');
            okTxt2.textContent='Перезваниваем — возьмите трубку';
          }
        };
        requestAnimationFrame(tick);
        icons();
      }).catch(function(err){
        /* Повторная отправка — тихо показываем, что заявка уже ушла */
        if(err && (err.message==='busy' || err.message==='cooldown')){
          form.hidden=true; ok.hidden=false; hideCardIntro();
          ok.classList.add('calling');
          var s2=document.getElementById(idPrefix+'Sec');
          if(s2) s2.textContent='';
          var r2=document.getElementById(idPrefix+'Ring');
          if(r2){ r2.style.strokeDasharray=2*Math.PI*16; r2.style.strokeDashoffset=0 }
          document.getElementById(idPrefix+'OkTxt').textContent='Заявка уже принята — ожидайте звонка';
          var n2=document.getElementById(idPrefix+'Num');
          if(n2) n2.textContent='+7 '+groupDigits(input.dataset.raw);
          return;
        }
        /* Виджет не поднялся — не молчим, а даём позвонить самому */
        btn.disabled=false; btn.classList.remove('loading');
        err_show();
      });
      function err_show(){
        err.hidden=false;
        err.innerHTML='Не удалось отправить заявку. Позвоните нам: <a href="tel:+77057802074">+7 705 780 2074</a>';
      }
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
