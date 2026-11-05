// Warsaw Masonry Supply — shared site behaviors (plain script, no framework)
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Highlight the current page in the shared nav + drawer
  var page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav .navlink, .drawer a:not(.btn):not(.d-phone)').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Scroll reveals — never leave content stuck invisible
  var revealAll = function () { $$('.rv').forEach(function (n) { n.classList.add('in'); }); };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94) n.classList.add('in');
      else io.observe(n);
    });
    window.addEventListener('load', function () { setTimeout(revealAll, 1200); });
  } else {
    revealAll();
  }

  // Header scroll state
  var header = $('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile drawer
  var burger = $('[data-burger]');
  var drawer = $('[data-drawer]');
  if (burger && drawer) {
    var closeDrawer = function () { drawer.classList.remove('open'); document.body.style.overflow = ''; };
    burger.addEventListener('click', function () {
      var open = !drawer.classList.contains('open');
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a,[data-d-close]', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }

  // Lightbox gallery
  var lb = $('[data-lb]');
  if (lb) {
    var lbImg = $('[data-lb-img]', lb);
    var list = [], idx = 0;
    var show = function () { lbImg.src = list[idx]; };
    var open = function (arr, i) { list = arr; idx = i; show(); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
    var close = function () { lb.classList.remove('open'); document.body.style.overflow = ''; };
    var move = function (d) { if (!list.length) return; idx = (idx + d + list.length) % list.length; show(); };

    var groups = {};
    $$('[data-lb-item]').forEach(function (el) {
      var g = el.getAttribute('data-lb-group') || 'default';
      (groups[g] = groups[g] || []).push(el);
    });
    Object.keys(groups).forEach(function (g) {
      var items = groups[g];
      var srcs = items.map(function (el) { return el.getAttribute('data-src'); });
      items.forEach(function (el, i) { el.addEventListener('click', function () { open(srcs, i); }); });
    });
    var x = $('[data-lb-x]', lb); if (x) x.addEventListener('click', close);
    var prev = $('[data-lb-prev]', lb); if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); move(-1); });
    var next = $('[data-lb-next]', lb); if (next) next.addEventListener('click', function (e) { e.stopPropagation(); move(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
    });
  }

  // FAQ accordions — open/close by flipping aria-expanded on the .faq-q button
  $$('.faq-item').forEach(function (item) {
    var q = $('.faq-q', item);
    var a = $('.faq-answer', item);
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    });
  });

  // Quote form
  var form = $('[data-quote-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var box = form.closest('.form') || document;
      var ok = $('.form-ok', box);
      form.style.display = 'none';
      if (ok) ok.classList.add('show');
      var target = form.closest('.form') || form;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
    });
  }
})();
