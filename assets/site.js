/* Ветеринар на связи: шапка, меню, появление, превью направлений, отзывы, галерея, форма. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  var hdr = document.querySelector('.hdr');
  var onScroll = function () { if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', function () {
    var open = !doc.classList.contains('menu-open');
    doc.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.mnav a').forEach(function (a) {
    a.addEventListener('click', function () { doc.classList.remove('menu-open'); });
  });

  /* появление */
  var els = document.querySelectorAll('[data-reveal], .img-reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  /* лёгкий параллакс */
  var par = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (par.length && !reduce) {
    var tick = false;
    var upd = function () {
      var vh = innerHeight;
      par.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / (vh + r.height);
        el.style.transform = 'translate3d(0,' + (p * -8).toFixed(2) + '%,0)';
      });
      tick = false;
    };
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* направления: фото справа за строкой */
  var list = document.querySelector('.dir-list'), prev = document.querySelector('.dir-prev');
  if (list && prev && fine) {
    var imgs = prev.querySelectorAll('img'), ty = 0, cy = 0, raf = 0;
    var loop = function () { cy += (ty - cy) * .12; prev.style.transform = 'translate3d(0,' + cy.toFixed(1) + 'px,0)'; raf = Math.abs(ty - cy) > .5 ? requestAnimationFrame(loop) : 0; };
    list.querySelectorAll('.dir-row').forEach(function (row, i) {
      row.addEventListener('mouseenter', function () {
        imgs.forEach(function (im, j) { if (j === i && im.dataset.src) { im.src = im.dataset.src; im.removeAttribute('data-src'); } im.classList.toggle('on', j === i); });
        prev.classList.add('on');
      });
      row.addEventListener('mousemove', function (e) {
        var b = list.getBoundingClientRect();
        ty = Math.max(-prev.offsetHeight * .2, Math.min(e.clientY - b.top - prev.offsetHeight / 2, b.height - prev.offsetHeight * .8));
        if (reduce) prev.style.transform = 'translate3d(0,' + ty + 'px,0)'; else if (!raf) raf = requestAnimationFrame(loop);
      });
    });
    list.addEventListener('mouseleave', function () { prev.classList.remove('on'); });
  }

  /* отзывы: один крупно, медленная смена */
  var rev = document.querySelector('.rev-stage');
  if (rev) {
    var items = rev.querySelectorAll('.rev-item'), cur = 0, timer = 0;
    var count = document.querySelector('.rev-count');
    var show = function (i) {
      cur = (i + items.length) % items.length;
      items.forEach(function (it, j) { it.classList.toggle('on', j === cur); it.setAttribute('aria-hidden', String(j !== cur)); });
      if (count) count.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
    };
    var auto = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur + 1); }, 9000); };
    var p = document.querySelector('.rev-prev'), n = document.querySelector('.rev-next');
    if (p) p.addEventListener('click', function () { show(cur - 1); auto(); });
    if (n) n.addEventListener('click', function () { show(cur + 1); auto(); });
    show(0); auto();
  }

  /* галерея */
  var figs = [].slice.call(document.querySelectorAll('.gal figure[data-full]'));
  if (figs.length) {
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Просмотр фото');
    lb.innerHTML = '<div class="lb-bar"><span class="lb-c"></span><button type="button" class="lb-x">Закрыть</button></div><div class="lb-stage"><img alt=""></div><div class="lb-bar"><button type="button" class="lb-p">← Назад</button><button type="button" class="lb-n">Вперёд →</button></div>';
    document.body.appendChild(lb);
    var li = lb.querySelector('img'), k = 0;
    var go = function (i) { k = (i + figs.length) % figs.length; li.src = figs[k].dataset.full; li.alt = figs[k].querySelector('img').alt; lb.querySelector('.lb-c').textContent = (k + 1) + ' / ' + figs.length; };
    var close = function () { lb.classList.remove('open'); document.body.style.overflow = ''; };
    figs.forEach(function (f, i) {
      f.tabIndex = 0; f.setAttribute('role', 'button');
      f.addEventListener('click', function () { go(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; });
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter') f.click(); });
    });
    lb.querySelector('.lb-x').onclick = close;
    lb.querySelector('.lb-p').onclick = function () { go(k - 1); };
    lb.querySelector('.lb-n').onclick = function () { go(k + 1); };
    addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') go(k - 1); if (e.key === 'ArrowRight') go(k + 1); });
  }

  /* оглавление */
  var toc = document.querySelectorAll('.toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {}; toc.forEach(function (a) { map[a.hash.slice(1)] = a; });
    var tio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { toc.forEach(function (a) { a.classList.remove('on'); }); if (map[e.target.id]) map[e.target.id].classList.add('on'); } });
    }, { rootMargin: '-15% 0px -75% 0px' });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) tio.observe(h); });
  }

  /* форма записи: send.php на боевом хостинге, иначе сразу в CMS */
  document.querySelectorAll('form[data-book]').forEach(function (form) {
    var note = form.querySelector('.form-note');
    var say = function (m, ok) { note.textContent = m; note.className = 'form-note ' + (ok ? 'ok' : 'err'); };
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (form.website.value) return;
      var name = form.name.value.trim(), phone = form.phone.value.trim();
      if (!name || phone.replace(/\D/g, '').length < 10) { say('Укажите имя и телефон полностью.', false); return; }
      if (!form.consent.checked) { say('Подтвердите согласие на обработку данных.', false); return; }
      var btn = form.querySelector('[type=submit]'); btn.disabled = true;
      var ok = false;
      try {
        var r = await fetch(form.dataset.php, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, phone: phone, message: '', website: '' }) });
        ok = r.ok;
      } catch (e1) {}
      if (!ok) {
        try {
          var r2 = await fetch('https://deltamoscow.ru/cms/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { site: 'vetnas', name: name, phone: phone, comment: '', consent: true, source: 'site-form', status: 'new' } }) });
          ok = r2.ok;
        } catch (e2) {}
      }
      btn.disabled = false;
      if (ok) { form.reset(); say('Спасибо! Администратор свяжется с вами и уточнит удобное время.', true); }
      else say('Не удалось отправить. Позвоните: +7 (495) 144-48-03 — мы на связи 24/7.', false);
    });
  });
})();
