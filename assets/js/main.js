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
