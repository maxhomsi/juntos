/* Comportamentos gerais do site */
(function () {
  var C = window.JUNTOS || {};

  // Menu mobile
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('nav.main');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Links de WhatsApp
  window.waLink = function (msg) {
    return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg || C.whatsappMsg || '');
  };
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = window.waLink(a.getAttribute('data-wa') || C.whatsappMsg);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Facebook: só aparece se configurado
  document.querySelectorAll('[data-facebook]').forEach(function (a) {
    if (C.facebook) { a.href = C.facebook; } else { a.remove(); }
  });

  // Ano no rodapé
  document.querySelectorAll('[data-ano]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Animação de entrada
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Cabeçalho: muda de estilo ao rolar (home)
  if (document.body.classList.contains('home')) {
    var onScroll = function () {
      document.body.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Palavras que giram no hero
  document.querySelectorAll('.rot').forEach(function (rot) {
    var spans = rot.querySelectorAll('span');
    if (spans.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = 0;
    setInterval(function () {
      var cur = spans[i];
      cur.classList.remove('on'); cur.classList.add('out');
      setTimeout(function () { cur.classList.remove('out'); }, 500);
      i = (i + 1) % spans.length;
      spans[i].classList.add('on');
    }, 2200);
  });

  // Contadores animados
  var cnt = document.querySelectorAll('[data-count]');
  if (cnt.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        co.unobserve(x.target);
        var el = x.target, to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null;
        var step = function (t) {
          if (!t0) t0 = t;
          var k = Math.min((t - t0) / 1400, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    cnt.forEach(function (el) { co.observe(el); });
  }

  // Formulário de orçamento → WhatsApp
  var form = document.getElementById('form-orcamento');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var f = new FormData(form);
      var linhas = [
        'Olá! Vim pelo site e quero um orçamento.',
        '',
        '*Nome:* ' + f.get('nome'),
        '*Empresa/Instituição:* ' + (f.get('empresa') || '-'),
        '*E-mail:* ' + f.get('email'),
        '*Telefone:* ' + (f.get('telefone') || '-'),
        '*Tipo de evento:* ' + f.get('tipo'),
        '*Data prevista:* ' + (f.get('data') || '-'),
        '*Nº de participantes:* ' + (f.get('participantes') || '-'),
        '*Cidade:* ' + (f.get('cidade') || '-'),
        '',
        f.get('mensagem') || ''
      ];
      window.open(window.waLink(linhas.join('\n')), '_blank', 'noopener');
      var ok = document.getElementById('form-ok');
      if (ok) ok.hidden = false;
    });
  }
})();
