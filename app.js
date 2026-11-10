(function(){
  var d=document;
  d.querySelectorAll('.rok').forEach(function(e){e.textContent=new Date().getFullYear();});

  // menu mobilne
  var b=d.querySelector('.burger'),n=d.getElementById('nav');
  function zamknij(){n.classList.remove('otw');b.setAttribute('aria-expanded','false');d.body.classList.remove('menu-otw');}
  if(b&&n){
    b.addEventListener('click',function(){var o=n.classList.toggle('otw');b.setAttribute('aria-expanded',o);d.body.classList.toggle('menu-otw',o);});
    n.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});
  }

  // aktywna pozycja menu
  var linki=[].slice.call(d.querySelectorAll('.nav>a[href^="#"]'));
  if(linki.length&&'IntersectionObserver' in window){
    var mapa={};linki.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)mapa[s.id]=a;});
    var io=new IntersectionObserver(function(w){w.forEach(function(x){
      var a=mapa[x.target.id];if(!a)return;
      if(x.isIntersecting){linki.forEach(function(l){l.classList.remove('akt');l.removeAttribute('aria-current');});a.classList.add('akt');a.setAttribute('aria-current','true');}
      else if(a.classList.contains('akt')&&x.boundingClientRect.top>0){a.classList.remove('akt');a.removeAttribute('aria-current');}
    });},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(mapa).forEach(function(id){io.observe(d.getElementById(id));});
  }

  // karuzele w kartach: palec (natywnie), mysz (przeciąganie), strzałki, klawiatura
  d.querySelectorAll('[data-kar]').forEach(function(k){
    var t=k.querySelector('.kar-tor'),licz=k.querySelector('.kar-licz'),prev=k.querySelector('.kar-prev'),next=k.querySelector('.kar-next');
    var ile=t.children.length;
    function idx(){return Math.round(t.scrollLeft/Math.max(1,t.clientWidth));}
    function stan(){var i=idx();if(licz)licz.textContent=(i+1)+' / '+ile;if(prev)prev.disabled=i<=0;if(next)next.disabled=i>=ile-1;}
    function idz(i){i=Math.max(0,Math.min(ile-1,i));t.scrollTo({left:i*t.clientWidth,behavior:'smooth'});}
    if(prev)prev.addEventListener('click',function(){idz(idx()-1);});
    if(next)next.addEventListener('click',function(){idz(idx()+1);});
    t.addEventListener('scroll',function(){window.requestAnimationFrame(stan);},{passive:true});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){idz(idx()+1);e.preventDefault();}if(e.key==='ArrowLeft'){idz(idx()-1);e.preventDefault();}});
    var x0=0,s0=0,wcisk=false,ruch=false;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||ile<2)return;wcisk=true;ruch=false;x0=e.clientX;s0=t.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!wcisk)return;var dx=e.clientX-x0;if(Math.abs(dx)>4){ruch=true;t.classList.add('ciag');}if(ruch)t.scrollLeft=s0-dx;});
    window.addEventListener('pointerup',function(){if(!wcisk)return;wcisk=false;if(ruch){var dx=t.scrollLeft-s0,i=Math.round(s0/t.clientWidth);if(Math.abs(dx)>t.clientWidth*.15)i+=dx>0?1:-1;t.classList.remove('ciag');idz(i);}});
    t.addEventListener('dragstart',function(e){e.preventDefault();});
    window.addEventListener('resize',stan);stan();
  });

  // wybór obiektu z karty -> formularz
  var sel=d.getElementById('f-obiekt');
  d.querySelectorAll('[data-obiekt]').forEach(function(a){a.addEventListener('click',function(){
    var v=a.getAttribute('data-obiekt');[].forEach.call(sel.options,function(o){if(o.text===v)sel.value=o.value;});
  });});

  // pasek akcji na telefonie po minięciu przycisku w hero
  var mob=d.getElementById('mob'),cta=d.querySelector('.hero-cta');
  if(mob&&cta&&'IntersectionObserver' in window){
    new IntersectionObserver(function(w){var widac=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;mob.classList.toggle('widac',widac);mob.setAttribute('aria-hidden',!widac);mob.querySelectorAll('a').forEach(function(a){a.tabIndex=widac?0:-1;});}).observe(cta);
  }

  // formularz pokazowy
  var f=d.getElementById('form');
  if(f){f.addEventListener('submit',function(e){e.preventDefault();d.getElementById('form-info').textContent='To podgląd strony. W wersji docelowej zapytanie trafi na wynajem@hosteldrzemka.pl.';});}
})();
