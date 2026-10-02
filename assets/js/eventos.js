/*
 * EVENTOS — lê a planilha (ou data/eventos.csv) e monta:
 *  - a agenda de próximos eventos e o portfólio (eventos.html)
 *  - os destaques da página inicial (index.html)
 *  - a página de cada evento (evento.html?id=...)
 * Um evento passa sozinho de "Próximo" para "Realizado" quando a data final passa.
 */
(function () {
  var C = window.JUNTOS || {};
  var LOCAL_CSV = 'data/eventos.csv';
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var MES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  /* ---------- Leitura do CSV ---------- */
  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    text = text.replace(/^﻿/, '');
    for (var i = 0; i < text.length; i++) {
      var c = text[i], n = text[i + 1];
      if (q) {
        if (c === '"' && n === '"') { cell += '"'; i++; }
        else if (c === '"') { q = false; }
        else { cell += c; }
      } else {
        if (c === '"') q = true;
        else if (c === ',') { row.push(cell); cell = ''; }
        else if (c === '\n' || c === '\r') {
          if (c === '\r' && n === '\n') i++;
          row.push(cell); rows.push(row); row = []; cell = '';
        } else cell += c;
      }
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    var head = (rows.shift() || []).map(function (h) { return h.trim().toLowerCase(); });
    return rows.filter(function (r) { return r.some(function (v) { return v.trim() !== ''; }); })
      .map(function (r) {
        var o = {};
        head.forEach(function (h, i) { o[h] = (r[i] || '').trim(); });
        return o;
      });
  }

  // Aceita 25/07/2025, 25/7/2025 ou 2025-07-25
  function parseDate(s) {
    if (!s) return null;
    var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    return null;
  }

  function dataExtenso(a, b) {
    if (!a) return '';
    if (!b || +a === +b) return a.getDate() + ' de ' + MESES[a.getMonth()] + ' de ' + a.getFullYear();
    if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear())
      return pad(a.getDate()) + (b.getDate() - a.getDate() === 1 ? ' e ' : ' a ') + pad(b.getDate()) + ' de ' + MESES[a.getMonth()] + ' de ' + a.getFullYear();
    if (a.getFullYear() === b.getFullYear())
      return a.getDate() + ' de ' + MESES[a.getMonth()] + ' a ' + b.getDate() + ' de ' + MESES[b.getMonth()] + ' de ' + a.getFullYear();
    return a.getDate() + '/' + (a.getMonth() + 1) + '/' + a.getFullYear() + ' a ' + b.getDate() + '/' + (b.getMonth() + 1) + '/' + b.getFullYear();
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Converte links do Google Drive em links de imagem
  function img(url) {
    if (!url) return '';
    var m = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) || url.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([^&#]+)/);
    if (m) return 'https://lh3.googleusercontent.com/d/' + m[1] + '=w1600';
    return url;
  }
  function lista(s) {
    return (s || '').split(/[\n\r]+|\s*;\s*|\s+(?=https?:)|,\s*(?=https?:|assets\/)/)
      .map(function (x) { return x.trim(); }).filter(Boolean).map(img);
  }
  function sim(v) { return /^(sim|s|x|yes|true|1)$/i.test((v || '').trim()); }
  function esc(s) {
    return (s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function br(s) { return esc(s).replace(/\n/g, '<br>'); }
  function slug(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function normalizar(r) {
    var ini = parseDate(r.data_inicio), fim = parseDate(r.data_fim) || ini;
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var fotos = lista(r.fotos);
    return {
      id: r.id || slug(r.nome),
      nome: r.nome,
      titulo: r.titulo_completo || r.nome,
      realizacao: r.realizacao,
      tipo: r.tipo || 'Evento',
      ini: ini, fim: fim,
      quando: dataExtenso(ini, fim),
      programacao: r.programacao,
      local: r.local, cidade: r.cidade,
      descricao: r.descricao,
      fizemos: r.o_que_fizemos,
      logo: img(r.logo),
      capa: img(r.capa) || fotos[0] || '',
      fotos: fotos,
      inscricao: r.link_inscricao,
      depoimento: r.depoimento, autor: r.depoimento_autor,
      destaque: sim(r.destaque),
      proximo: fim ? fim >= hoje : false
    };
  }

  var cache = null;
  function carregar() {
    if (cache) return cache;
    var get = function (u) {
      return fetch(u, { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      });
    };
    var fonte = C.planilhaEventosCSV ? get(C.planilhaEventosCSV).catch(function (e) {
      console.warn('Planilha indisponível, usando arquivo local.', e);
      return get(LOCAL_CSV);
    }) : get(LOCAL_CSV);
    cache = fonte.then(parseCSV).then(function (rows) {
      return rows.filter(function (r) { return r.nome && (!r.publicar || sim(r.publicar)); }).map(normalizar);
    });
    return cache;
  }

  /* ---------- Componentes ---------- */
  var ICO_CAL = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>';
  var ICO_PIN = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

  function card(e) {
    var ph = e.capa
      ? '<div class="ph" style="background-image:url(\'' + esc(e.capa) + '\')">'
      : '<div class="ph"><div class="logo-only">' + (e.logo ? '<img src="' + esc(e.logo) + '" alt="' + esc(e.nome) + '" loading="lazy">' : '') + '</div>';
    return '<a class="ev rv" href="evento.html?id=' + encodeURIComponent(e.id) + '">' + ph +
      (e.proximo ? '<span class="badge">Próximo</span>' : '') + '</div>' +
      '<div class="bd"><span class="tag">' + esc(e.tipo) + '</span>' +
      '<h3>' + esc(e.nome) + '</h3>' +
      (e.quando ? '<div class="meta">' + ICO_CAL + '<span>' + esc(e.quando) + '</span></div>' : '') +
      (e.cidade ? '<div class="meta">' + ICO_PIN + '<span>' + esc(e.cidade) + '</span></div>' : '') +
      '<span class="more">' + (e.proximo ? 'Ver detalhes' : 'Ver o evento') + '</span></div></a>';
  }

  function agendaItem(e) {
    var dt = e.ini ? '<div class="dt"><b>' + pad(e.ini.getDate()) + '</b><span>' + MES_CURTO[e.ini.getMonth()] + ' ' + e.ini.getFullYear() + '</span></div>' : '<div class="dt"><b>—</b></div>';
    return '<div class="ag rv">' + dt +
      '<div><h3>' + esc(e.nome) + '</h3>' +
      '<div class="meta">' + esc(e.quando) + (e.local ? ' · ' + esc(e.local) : '') + (e.cidade ? ' · ' + esc(e.cidade) : '') + '</div></div>' +
      '<div class="act" style="display:flex;gap:14px;align-items:center">' +
      (e.logo ? '<img class="lg" src="' + esc(e.logo) + '" alt="" loading="lazy">' : '') +
      (e.inscricao ? '<a class="btn lime" href="' + esc(e.inscricao) + '" target="_blank" rel="noopener">Inscrições</a>'
        : '<a class="btn ghost" href="evento.html?id=' + encodeURIComponent(e.id) + '">Detalhes</a>') +
      '</div></div>';
  }

  function revelar(root) {
    var els = (root || document).querySelectorAll('.rv:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  function erro(el) {
    el.innerHTML = '<div class="empty">Não foi possível carregar os eventos agora. Tente atualizar a página.</div>';
  }

  /* ---------- Página: eventos.html ---------- */
  function paginaEventos() {
    var ag = document.getElementById('agenda');
    var grid = document.getElementById('realizados');
    var fil = document.getElementById('filtros');
    if (!ag && !grid) return;
    carregar().then(function (lst) {
      var prox = lst.filter(function (e) { return e.proximo; }).sort(function (a, b) { return (a.ini || 0) - (b.ini || 0); });
      var feitos = lst.filter(function (e) { return !e.proximo; }).sort(function (a, b) { return (b.ini || 0) - (a.ini || 0); });
      if (ag) {
        ag.innerHTML = prox.length ? prox.map(agendaItem).join('')
          : '<div class="empty">Novas datas em breve. Quer organizar o seu evento? <a href="contato.html">Fale com a gente</a>.</div>';
      }
      if (grid) {
        var tipos = ['Todos'];
        var anos = [];
        feitos.forEach(function (e) {
          if (tipos.indexOf(e.tipo) < 0) tipos.push(e.tipo);
          if (e.ini && anos.indexOf(e.ini.getFullYear()) < 0) anos.push(e.ini.getFullYear());
        });
        var atual = { tipo: 'Todos', ano: null };
        function desenhar() {
          var l = feitos.filter(function (e) {
            return (atual.tipo === 'Todos' || e.tipo === atual.tipo) && (!atual.ano || (e.ini && e.ini.getFullYear() === atual.ano));
          });
          grid.innerHTML = l.length ? l.map(card).join('') : '<div class="empty">Nenhum evento neste filtro.</div>';
          revelar(grid);
        }
        if (fil) {
          fil.innerHTML = tipos.map(function (t) { return '<button type="button" data-t="' + esc(t) + '"' + (t === 'Todos' ? ' class="on"' : '') + '>' + esc(t) + '</button>'; }).join('') +
            anos.map(function (a) { return '<button type="button" data-a="' + a + '">' + a + '</button>'; }).join('');
          fil.addEventListener('click', function (ev) {
            var b = ev.target.closest('button'); if (!b) return;
            if (b.dataset.t) {
              atual.tipo = b.dataset.t; atual.ano = null;
              fil.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
            } else {
              var a = +b.dataset.a;
              atual.ano = atual.ano === a ? null : a;
              fil.querySelectorAll('button[data-a]').forEach(function (x) { x.classList.toggle('on', +x.dataset.a === atual.ano); });
            }
            desenhar();
          });
        }
        desenhar();
      }
      revelar();
    }).catch(function (e) { console.error(e); if (ag) erro(ag); if (grid) erro(grid); });
  }

  /* ---------- Página inicial: destaques ---------- */
  function destaquesHome() {
    var el = document.getElementById('destaques');
    if (!el) return;
    carregar().then(function (lst) {
      var feitos = lst.filter(function (e) { return !e.proximo && e.capa; });
      var d = feitos.filter(function (e) { return e.destaque; });
      if (d.length < 3) d = d.concat(feitos.filter(function (e) { return d.indexOf(e) < 0; }).sort(function (a, b) { return (b.ini || 0) - (a.ini || 0); }));
      el.innerHTML = d.slice(0, 3).map(card).join('');
      revelar(el);
      var p = document.getElementById('proximo-home');
      var prox = lst.filter(function (e) { return e.proximo; }).sort(function (a, b) { return (a.ini || 0) - (b.ini || 0); });
      if (p) {
        if (prox.length) {
          var e = prox[0];
          p.innerHTML = '<div class="stack"><div><span class="chip dark">Próximo evento</span>' +
            '<h3 style="margin:18px 0 6px;font-size:1.6rem">' + esc(e.nome) + '</h3>' +
            '<p style="margin:0">' + esc(e.quando) + (e.cidade ? '<br>' + esc(e.cidade) : '') + '</p></div>' +
            '<a class="btn lime" href="' + (e.inscricao ? esc(e.inscricao) + '" target="_blank" rel="noopener' : 'evento.html?id=' + encodeURIComponent(e.id)) + '">' +
            (e.inscricao ? 'Inscrições' : 'Ver evento') + ' <span class="arr">→</span></a></div>';
        }
      }
    }).catch(function (e) { console.error(e); erro(el); });
  }

  /* ---------- Página do evento ---------- */
  function paginaEvento() {
    var root = document.getElementById('evento');
    if (!root) return;
    var id = new URLSearchParams(location.search).get('id');
    carregar().then(function (lst) {
      var e = lst.filter(function (x) { return x.id === id; })[0];
      if (!e) {
        root.innerHTML = '<div class="wrap section"><div class="b"><h2>Evento não encontrado</h2><p>Veja todos os eventos na nossa agenda e portfólio.</p><a class="btn" href="eventos.html">Ver eventos <span class="arr">→</span></a></div></div>';
        var h = document.getElementById('ev-hero'); if (h) h.remove();
        return;
      }
      document.title = e.nome + ' | JUNTOS Produções & Eventos';
      var md = document.querySelector('meta[name="description"]');
      if (md && e.descricao) md.setAttribute('content', e.descricao);
      var hero = document.getElementById('ev-hero');
      if (hero) {
        hero.querySelector('h1').textContent = e.nome;
        hero.querySelector('p').textContent = e.titulo !== e.nome ? e.titulo : (e.descricao || '');
        var cov = hero.querySelector('.ev-cover');
        if (cov) {
          var src = e.capa || e.logo;
          if (src) { cov.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(e.nome) + '"' + (e.capa ? '' : ' style="object-fit:contain;padding:30px;background:#fff"') + '>'; }
          else { cov.remove(); }
        }
        hero.querySelector('.crumb-ev').textContent = e.nome;
      }
      var info = '<aside class="ev-info">' +
        (e.logo ? '<div class="lgo"><img src="' + esc(e.logo) + '" alt="Logo ' + esc(e.nome) + '"></div>' : '') + '<dl>' +
        (e.quando ? '<dt>Data</dt><dd>' + esc(e.quando) + '</dd>' : '') +
        (e.local ? '<dt>Local</dt><dd>' + esc(e.local) + (e.cidade ? '<br>' + esc(e.cidade) : '') + '</dd>' : (e.cidade ? '<dt>Cidade</dt><dd>' + esc(e.cidade) + '</dd>' : '')) +
        (e.realizacao ? '<dt>Realização</dt><dd>' + esc(e.realizacao) + '</dd>' : '') +
        '<dt>Tipo</dt><dd>' + esc(e.tipo) + '</dd></dl>' +
        (e.inscricao && e.proximo ? '<p style="margin:22px 0 0"><a class="btn lime" href="' + esc(e.inscricao) + '" target="_blank" rel="noopener">Fazer inscrição</a></p>' : '') +
        '</aside>';
      var corpo = '<div class="ev-body">' +
        '<span class="chip">' + (e.proximo ? 'Próximo evento' : 'Evento realizado') + '</span>' +
        
        (e.descricao ? '<p class="lead" style="margin-top:18px;color:var(--dk);font-size:1.2rem">' + br(e.descricao) + '</p>' : '') +
        (e.programacao ? '<h3 style="margin-top:26px">Programação</h3><p>' + br(e.programacao) + '</p>' : '') +
        (e.fizemos ? '<h3 style="margin-top:26px">O que a JUNTOS fez</h3><p>' + br(e.fizemos) + '</p>' : '') +
        (e.depoimento ? '<blockquote class="quote">“' + br(e.depoimento) + '”' + (e.autor ? '<cite>— ' + esc(e.autor) + '</cite>' : '') + '</blockquote>' : '') +
        '</div>';
      var gal = e.fotos.length ? '<h3 style="margin-top:40px">Galeria</h3><div class="gallery">' +
        e.fotos.map(function (f, i) { return '<a href="' + esc(f) + '" data-i="' + i + '"><img src="' + esc(f) + '" alt="' + esc(e.nome) + ' — foto ' + (i + 1) + '" loading="lazy"></a>'; }).join('') + '</div>' : '';
      root.innerHTML = '<section class="section tight"><div class="wrap"><div class="ev-head">' + corpo + info + '</div>' + gal +
        '<div style="margin-top:32px" class="btns"><a class="btn ghost" href="eventos.html">← Todos os eventos</a><a class="btn" href="contato.html">' + (e.proximo ? 'Fale com a gente' : 'Quero um evento assim') + ' <span class="arr">→</span></a></div></div></section>';
      lightbox(root, e.fotos);
    }).catch(function (err) { console.error(err); erro(root); });
  }

  function lightbox(root, fotos) {
    if (!fotos.length) return;
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = '<button class="x" aria-label="Fechar">×</button><button class="p" aria-label="Anterior">‹</button><img alt=""><button class="n" aria-label="Próxima">›</button>';
    document.body.appendChild(lb);
    var i = 0, im = lb.querySelector('img');
    function show(k) { i = (k + fotos.length) % fotos.length; im.src = fotos[i]; lb.classList.add('open'); }
    root.querySelectorAll('.gallery a').forEach(function (a) {
      a.addEventListener('click', function (ev) { ev.preventDefault(); show(+a.dataset.i); });
    });
    lb.querySelector('.x').onclick = function () { lb.classList.remove('open'); };
    lb.querySelector('.p').onclick = function () { show(i - 1); };
    lb.querySelector('.n').onclick = function () { show(i + 1); };
    lb.addEventListener('click', function (ev) { if (ev.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', function (ev) {
      if (!lb.classList.contains('open')) return;
      if (ev.key === 'Escape') lb.classList.remove('open');
      if (ev.key === 'ArrowLeft') show(i - 1);
      if (ev.key === 'ArrowRight') show(i + 1);
    });
  }

  /* ---------- Home: reel horizontal ---------- */
  function reelHome() {
    var el = document.getElementById('reel');
    if (!el) return;
    carregar().then(function (lst) {
      var l = lst.slice().sort(function (a, b) { return (b.ini || 0) - (a.ini || 0); });
      // próximos primeiro, depois realizados com foto, depois o resto
      l = l.filter(function (e) { return e.proximo; }).concat(l.filter(function (e) { return !e.proximo && e.capa; }), l.filter(function (e) { return !e.proximo && !e.capa; }));
      el.innerHTML = l.map(function (e) {
        var foto = e.capa || e.logo;
        return '<a class="rcard' + (e.capa ? '' : ' logo-c') + '" href="evento.html?id=' + encodeURIComponent(e.id) + '">' +
          (foto ? '<img src="' + esc(foto) + '" alt="' + esc(e.nome) + '" loading="lazy" draggable="false">' : '') +
          '<span class="yr">' + (e.proximo ? 'Em breve' : (e.ini ? e.ini.getFullYear() : '')) + '</span><span class="go">→</span>' +
          '<div class="tx"><div class="tp">' + esc(e.tipo) + '</div>' +
          '<h3>' + esc(e.nome) + '</h3><div class="dt">' + esc(e.quando) + (e.cidade ? ' · ' + esc(e.cidade) : '') + '</div></div></a>';
      }).join('') + '<a class="rcard all" href="eventos.html"><h3>Ver todos os eventos</h3><span class="go">→</span></a>';
      controlesReel(el);
    }).catch(function (e) { console.error(e); erro(el); });
  }

  function controlesReel(el) {
    var bar = document.querySelector('.reel-bar i');
    var passo = function () { var c = el.querySelector('.rcard'); return c ? c.getBoundingClientRect().width + 18 : 400; };
    document.querySelectorAll('[data-reel]').forEach(function (b) {
      b.addEventListener('click', function () { el.scrollBy({ left: passo() * (+b.dataset.reel), behavior: 'smooth' }); });
    });
    var upd = function () {
      if (!bar) return;
      var max = el.scrollWidth - el.clientWidth;
      var vis = el.clientWidth / el.scrollWidth;
      bar.style.width = Math.max(vis, max ? (el.scrollLeft / max) : 1) * 100 + '%';
    };
    el.addEventListener('scroll', upd, { passive: true }); upd();
    // arrastar com o mouse
    var down = false, x0 = 0, s0 = 0, moved = false;
    el.addEventListener('mousedown', function (ev) { down = true; moved = false; x0 = ev.pageX; s0 = el.scrollLeft; });
    window.addEventListener('mousemove', function (ev) {
      if (!down) return;
      var dx = ev.pageX - x0;
      if (Math.abs(dx) > 5) { moved = true; el.classList.add('drag'); }
      el.scrollLeft = s0 - dx;
    });
    window.addEventListener('mouseup', function () { down = false; setTimeout(function () { el.classList.remove('drag'); }, 0); });
    el.addEventListener('click', function (ev) { if (moved) { ev.preventDefault(); moved = false; } }, true);
  }

  reelHome();
  paginaEventos();
  destaquesHome();
  paginaEvento();
})();
