/*
 * ASSISTENTE DO WHATSAPP — JUNTOS Produções & Eventos
 * Ao clicar no balão do WhatsApp abre um painel com perguntas frequentes
 * (menu) e uma busca por palavra-chave. Toda resposta oferece seguir a
 * conversa no WhatsApp com a mensagem já preenchida.
 *
 * Para editar respostas: altere a lista FAQ abaixo (título, palavras-chave e texto).
 */
(function () {
  var C = window.JUNTOS || {};
  var btn = document.querySelector('.wa-float');
  if (!btn) return;

  var FAQ = [
    { id: 'orcamento', menu: true, t: 'Quero um orçamento',
      k: 'orcamento orçamento preco preço valor valores custo custa quanto cotacao cotação proposta contratar contratacao investimento',
      a: 'Cada evento é único, então o orçamento é feito sob medida. Para agilizar, conte pra gente:<ul><li>tipo de evento</li><li>data prevista</li><li>número de participantes</li><li>cidade</li></ul>Você pode preencher o <a href="contato.html">formulário de orçamento</a> ou mandar direto no WhatsApp.',
      wa: 'Olá! Gostaria de um orçamento para um evento.' },
    { id: 'servicos', menu: true, t: 'Que tipos de evento vocês fazem?',
      k: 'tipos tipo evento eventos fazem faz organizam servicos serviços congresso congressos convencao convenção seminario seminário workshop treinamento lancamento lançamento premiacao premiação festa coquetel confraternizacao confraternização feira exposicao exposição curso corporativo social',
      a: 'Fazemos a produção completa de:<ul><li>Congressos e convenções</li><li>Eventos sociais e corporativos</li><li>Seminários, workshops e treinamentos</li><li>Lançamentos e premiações</li><li>Festas, coquetéis e confraternizações</li><li>Feiras e exposições</li><li>Cursos e grupos de trabalho</li></ul><a href="o-que-fazemos.html">Ver detalhes</a>' },
    { id: 'processo', menu: true, t: 'Como funciona o trabalho de vocês?',
      k: 'funciona trabalho trabalham etapas etapa processo metodo método passo passos planejamento cronograma pre pré durante pos pós',
      a: 'Estamos JUNTOS em todas as etapas:<ul><li><b>Pré-evento:</b> briefing, planejamento financeiro e cronograma, fornecedores, comunicação, inscrições, patrocínios e materiais de marketing.</li><li><b>Durante:</b> equipe presente da montagem à desmontagem, coordenação de fornecedores, secretaria e recepção.</li><li><b>Pós-evento:</b> relatórios (presença, engajamento, financeiro), cartas de agradecimento e reunião final.</li></ul><a href="como-trabalhamos.html">Ver o processo completo</a>' },
    { id: 'agenda', menu: true, t: 'Quais são os próximos eventos?',
      k: 'proximo próximo proximos próximos agenda calendario calendário quando data datas evento eventos programacao programação',
      dyn: 'agenda' },
    { id: 'inscricao', menu: true, t: 'Quero me inscrever em um evento',
      k: 'inscricao inscrição inscrever inscrevo participar participante ingresso ticket credenciamento certificado cadastro',
      a: 'As inscrições de cada evento ficam na página dele, na nossa <a href="eventos.html">agenda</a>. Quando um evento tem inscrições abertas, aparece o botão <b>Inscrições</b>. Ficou alguma dúvida sobre um evento específico? Fale com a gente no WhatsApp.',
      wa: 'Olá! Tenho uma dúvida sobre inscrição em um evento.' },
    { id: 'medicos', menu: false, t: 'Vocês organizam congressos médicos e científicos?',
      k: 'medico médico medicos médicos medicina cientifico científico sociedade associacao associação hospital saude saúde academico acadêmico',
      a: 'Sim! É uma das nossas especialidades. Já organizamos congressos como COBTI (SBOT-RJ), AlergoRio (ASBAI-RJ), Congresso Internacional da ABEAD, Congresso ABRAUHE, ENEO e Congresso de Farmácia Hospitalar do INCA, congressos da ASIME e o Congresso de Dermatologia do Instituto Azulay. <a href="eventos.html">Ver portfólio</a>' },
    { id: 'clientes', menu: false, t: 'Quais clientes vocês já atenderam?',
      k: 'clientes cliente portfolio portfólio atenderam atendidos experiencia experiência realizados referencias referências cases',
      a: 'Entre as instituições que confiaram na JUNTOS estão SBOT-RJ, ASBAI, ABEAD, INCA, ABRAUHE, ASIME, Instituto Azulay, UTCAL, ABETI e ASUETI. <a href="eventos.html">Veja os eventos realizados</a>' },
    { id: 'patrocinio', menu: false, t: 'Vocês ajudam com patrocínio?',
      k: 'patrocinio patrocínio patrocinador patrocinadores apoio institucional expositor expositores estande stand cota cotas',
      a: 'Sim. A captação de patrocínios e apoio institucional faz parte do nosso pré-evento, e cuidamos do relacionamento com patrocinadores e expositores. Se você é uma empresa interessada em patrocinar ou expor em um evento, fale com a gente.',
      wa: 'Olá! Tenho interesse em patrocínio/exposição em um evento.' },
    { id: 'online', menu: false, t: 'Vocês fazem eventos on-line?',
      k: 'online on-line virtual digital remoto transmissao transmissão live presencial',
      a: 'Sim, atuamos em eventos presenciais e on-line, com a mesma equipe e o mesmo cuidado.' },
    { id: 'local', menu: false, t: 'Vocês atendem fora do Rio?',
      k: 'onde cidade cidades rio janeiro sao são paulo outras estado brasil local atendem fora viajar',
      a: 'A JUNTOS é do Rio de Janeiro, onde realiza a maioria dos eventos, e também atua em outras cidades — o Congresso Mundial de Medicina Estética da ASIME, por exemplo, foi em São Paulo. Conte onde será o seu evento!',
      wa: 'Olá! Meu evento será em outra cidade. Vocês atendem?' },
    { id: 'socias', menu: false, t: 'Quem está à frente da JUNTOS?',
      k: 'quem socias sócias socia sócia equipe dona donas fundadoras alessandra michele renata time',
      a: 'A JUNTOS é formada por três sócias e amigas, unidas há mais de 15 anos: <b>Alessandra Rocha</b> (Comunicação Social e Marketing), <b>Michele Christinni</b> (Turismo e Administração Estratégica) e <b>Renata Cipriano</b> (backoffice, 20 anos de experiência). <a href="quem-somos.html">Conheça a equipe</a>' },
    { id: 'relatorios', menu: false, t: 'Vocês entregam relatórios depois do evento?',
      k: 'relatorio relatório relatorios relatórios resultado resultados pos pós depois final indicadores presenca presença financeiro engajamento',
      a: 'Sim. No pós-evento entregamos relatórios completos (presença, engajamento, financeiro e outros), enviamos as cartas de agradecimento e fazemos uma reunião final com aprendizados e próximos passos.' },
    { id: 'contato', menu: true, t: 'Telefone, e-mail e redes',
      k: 'contato telefone fone celular whatsapp zap email e-mail instagram facebook rede redes endereco endereço falar ligar',
      a: 'Fale com a gente:<ul><li>WhatsApp: (21) 95931-5714</li><li>E-mail: <a href="mailto:contato@juntoseventos.com.br">contato@juntoseventos.com.br</a></li><li>Instagram: <a href="https://www.instagram.com/juntoseventos/" target="_blank" rel="noopener">@juntoseventos</a></li></ul>Os contatos das sócias estão na página de <a href="contato.html">contato</a>.' },
    { id: 'fornecedor', menu: false, t: 'Quero ser fornecedor ou colaborador',
      k: 'fornecedor fornecedores parceiro parceria colaborador colaboradores trabalhar vaga vagas emprego curriculo currículo freelancer recepcionista',
      a: 'Que bom! Para cada evento contamos com colaboradores e fornecedores qualificados. Envie sua apresentação para <a href="mailto:contato@juntoseventos.com.br">contato@juntoseventos.com.br</a>.' },
    { id: 'horario', menu: false, t: 'Qual o horário de atendimento?',
      k: 'horario horário horarios horários funcionamento atendimento aberto abre fecha expediente responde resposta demora',
      a: 'Pode mandar sua mensagem a qualquer momento pelo WhatsApp (21) 95931-5714 ou pelo e-mail <a href="mailto:contato@juntoseventos.com.br">contato@juntoseventos.com.br</a> — nossa equipe responde assim que possível.' },
    { id: 'privacidade', menu: false, t: 'Como vocês tratam meus dados?',
      k: 'dados privacidade lgpd cookies seguranca segurança informacoes informações',
      a: 'Seguimos a LGPD e usamos seus dados só para retornar o contato. Leia a <a href="politica-de-privacidade.html">Política de Privacidade</a>.' }
  ];

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ');
  }
  var STOP = ' com como que qual quais voce voces para por pra uma umas uns meu minha meus minhas seu sua faz fazem faco tem tenho quero queria gostaria sobre evento eventos ola oi bom boa dia tarde noite isso esse essa este esta mais muito vcs '.split(' ');
  function palavras(s) { return norm(s).split(/\s+/).filter(function (w) { return w.length > 2 && STOP.indexOf(w) < 0; }); }
  FAQ.forEach(function (f) { f.kw = palavras(f.k + ' ' + f.t); });

  function buscar(q) {
    var ws = palavras(q);
    if (!ws.length) return [];
    return FAQ.map(function (f) {
      var s = 0;
      ws.forEach(function (w) {
        f.kw.forEach(function (k) {
          if (k === w) s += 3;
          else if (k.length > 4 && w.length > 4 && (k.indexOf(w) === 0 || w.indexOf(k) === 0)) s += 1;
        });
      });
      return { f: f, s: s };
    }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3).map(function (x) { return x.f; });
  }

  function wa(msg) { return window.waLink ? window.waLink(msg) : 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg); }

  // ---------- Painel ----------
  var root = document.createElement('div');
  root.className = 'jt-chat';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Atendimento JUNTOS');
  root.innerHTML =
    '<div class="jt-head"><div class="jt-av">J</div><div><b>JUNTOS · Atendimento</b><span>Respostas rápidas ou fale com a equipe</span></div>' +
    '<button class="jt-x" aria-label="Fechar">×</button></div>' +
    '<div class="jt-body" aria-live="polite"></div>' +
    '<form class="jt-form"><input type="text" placeholder="Digite sua dúvida… (ex.: orçamento)" aria-label="Digite sua dúvida" maxlength="140"><button type="submit" aria-label="Enviar">➤</button></form>' +
    '<a class="jt-wa" target="_blank" rel="noopener">' + (btn.innerHTML || '') + ' Continuar no WhatsApp</a>';
  document.body.appendChild(root);
  var body = root.querySelector('.jt-body');
  var waBtn = root.querySelector('.jt-wa');
  var input = root.querySelector('input');
  var ultimaMsg = C.whatsappMsg;
  waBtn.href = wa(ultimaMsg);

  function bolha(html, quem) {
    var d = document.createElement('div');
    d.className = 'jt-msg ' + (quem || 'bot');
    d.innerHTML = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }
  function chips(lista, extra) {
    var d = document.createElement('div');
    d.className = 'jt-chips';
    lista.forEach(function (f) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = f.t;
      b.onclick = function () { responder(f, true); };
      d.appendChild(b);
    });
    (extra || []).forEach(function (x) { d.appendChild(x); });
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
  function botaoMenu() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'alt'; b.textContent = '☰ Ver todas as opções';
    b.onclick = function () { bolha('Escolha um assunto:'); chips(FAQ); };
    return b;
  }
  function setWa(msg) { ultimaMsg = msg || C.whatsappMsg; waBtn.href = wa(ultimaMsg); }

  function agendaHtml() {
    if (!window.JUNTOS_EVENTOS) return Promise.resolve('Veja a <a href="eventos.html">agenda completa</a>.');
    return window.JUNTOS_EVENTOS().then(function (lst) {
      var p = lst.filter(function (e) { return e.proximo; }).sort(function (a, b) { return (a.ini || 0) - (b.ini || 0); });
      if (!p.length) return 'No momento estamos preparando as próximas datas. Veja o <a href="eventos.html">portfólio de eventos realizados</a>.';
      return 'Próximos eventos:<ul>' + p.slice(0, 4).map(function (e) {
        return '<li><a href="evento.html?id=' + encodeURIComponent(e.id) + '"><b>' + e.nome + '</b></a> — ' + e.quando + (e.cidade ? ' · ' + e.cidade : '') + '</li>';
      }).join('') + '</ul><a href="eventos.html">Ver agenda completa</a>';
    }).catch(function () { return 'Veja a <a href="eventos.html">agenda completa</a>.'; });
  }

  function responder(f, mostrarPergunta) {
    if (mostrarPergunta) bolha(f.t, 'me');
    var msg = f.wa || ('Olá! Vim pelo site e tenho uma dúvida: ' + f.t);
    setWa(msg);
    var fim = function (html) {
      bolha(html);
      var b = document.createElement('a');
      b.className = 'go'; b.href = wa(msg); b.target = '_blank'; b.rel = 'noopener'; b.textContent = 'Falar sobre isso no WhatsApp';
      chips([], [b, botaoMenu()]);
    };
    if (f.dyn === 'agenda') agendaHtml().then(fim); else fim(f.a);
  }

  var iniciado = false;
  function iniciar() {
    if (iniciado) return; iniciado = true;
    bolha('Olá! 👋 Somos a <b>JUNTOS Produções &amp; Eventos</b>. Como podemos ajudar? Escolha uma opção ou digite sua dúvida.');
    chips(FAQ.filter(function (f) { return f.menu; }), [botaoMenu()]);
    setTimeout(function () { body.scrollTop = 0; }, 0);
  }

  function abrir() { iniciar(); root.classList.add('open'); btn.classList.add('on'); btn.setAttribute('aria-expanded', 'true'); setTimeout(function () { if (window.innerWidth > 640) input.focus(); }, 200); }
  function fechar() { root.classList.remove('open'); btn.classList.remove('on'); btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (ev) { ev.preventDefault(); root.classList.contains('open') ? fechar() : abrir(); });
  root.querySelector('.jt-x').onclick = fechar;
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') fechar(); });

  root.querySelector('form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    bolha(q.replace(/[<>&]/g, ''), 'me');
    var r = buscar(q);
    if (r.length) {
      responder(r[0], false);
      if (r.length > 1) { bolha('Talvez também ajude:'); chips(r.slice(1)); }
      return;
    }
    var msg = 'Olá! Vim pelo site e tenho uma dúvida: ' + q;
    setWa(msg);
    bolha('Não encontrei uma resposta pronta para isso, mas a nossa equipe responde rapidinho! Toque abaixo para enviar sua pergunta no WhatsApp.');
    var b = document.createElement('a');
    b.className = 'go'; b.href = wa(msg); b.target = '_blank'; b.rel = 'noopener'; b.textContent = 'Enviar minha dúvida no WhatsApp';
    chips([], [b, botaoMenu()]);
  });
})();
