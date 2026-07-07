
  (function(){
    var els = document.querySelectorAll('.reveal, .reveal-group');
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el){ observer.observe(el); });
  })();

  // Header стискається при скролі
  (function(){
    var header = document.querySelector('header');
    if(!header) return;
    var onScroll = function(){
      if(window.scrollY > 24){ header.classList.add('is-scrolled'); }
      else{ header.classList.remove('is-scrolled'); }
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  })();

  // Цифри статистики "рахуються" вгору при появі hero
  (function(){
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nums = document.querySelectorAll('.stat-num');
    if(reduceMotion || !nums.length) return;
    nums.forEach(function(el){
      var full = el.textContent;
      var match = full.match(/^(\d+)/);
      if(!match) return;
      var target = parseInt(match[1], 10);
      var suffixEl = el.querySelector('.accent');
      var suffix = suffixEl ? suffixEl.outerHTML : '';
      var duration = 900;
      var start = null;
      function step(ts){
        if(start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var current = Math.round(progress * target);
        el.innerHTML = current + suffix;
        if(progress < 1){ requestAnimationFrame(step); }
      }
      el.innerHTML = '0' + suffix;
      setTimeout(function(){ requestAnimationFrame(step); }, 500);
    });
  })();

// Honeypot anti-spam: перевірка форм заявки перед відправкою
(function(){
  var forms = document.querySelectorAll('.lead-form');
  forms.forEach(function(form){
    var submitBtn = form.querySelector('button[type="button"]');
    if(!submitBtn) return;
    submitBtn.addEventListener('click', function(){
      var honeypot = form.querySelector('.hp-field');
      if(honeypot && honeypot.value.trim() !== ''){
        // Поле заповнене — це бот. Мовчки ігноруємо, боту показуємо "успіх",
        // щоб він не намагався обійти захист інакше.
        console.log('Заявку відхилено (honeypot).');
        return;
      }
      // TODO: тут буде реальна відправка на /api/send-lead (Vercel Function -> Telegram)
      // після налаштування у Кроці 4 (Vercel + Telegram)
      alert('Дякуємо! Заявку прийнято. Наразі це демо-повідомлення — реальна відправка підключається на наступному кроці.');
    });
  });
})();
