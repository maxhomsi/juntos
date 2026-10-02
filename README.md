# JUNTOS Produções & Eventos — site

Site institucional da JUNTOS Produções & Eventos (Rio de Janeiro). HTML, CSS e JavaScript puros,
sem etapa de build — pronto para o GitHub Pages.

## Páginas

| Arquivo | Página |
| --- | --- |
| `index.html` | Início |
| `quem-somos.html` | Quem somos (história e as três sócias) |
| `o-que-fazemos.html` | Tipos de evento e diferenciais |
| `como-trabalhamos.html` | Pré-evento, durante e pós-evento |
| `eventos.html` | Agenda de próximos eventos + portfólio com filtros |
| `evento.html?id=…` | Página de cada evento (galeria, programação, depoimento) |
| `contato.html` | Formulário de orçamento (abre o WhatsApp com a mensagem pronta) e contatos |
| `politica-de-privacidade.html` | Aviso de privacidade (LGPD) |
| `404.html` | Página não encontrada |

## Estrutura

```
assets/css/style.css     estilos
assets/js/config.js      WhatsApp, e-mail, redes e link da planilha  ← editar aqui
assets/js/main.js        menu, WhatsApp, formulário, animações
assets/js/eventos.js     lê a planilha e monta agenda/portfólio/páginas de evento
assets/img/eventos/      fotos dos congressos (extraídas da apresentação institucional)
assets/img/equipe/       fotos das sócias
data/eventos.csv         eventos de reserva (usados se a planilha não estiver ligada)
docs/                    como atualizar os eventos + planilha modelo
scripts/                 utilitários
```

## Eventos via Google Sheets

Veja **[docs/COMO-ATUALIZAR-EVENTOS.md](docs/COMO-ATUALIZAR-EVENTOS.md)**.

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

(Abrir o `index.html` direto pelo Finder não carrega os eventos, porque o navegador bloqueia a leitura do CSV via `file://`.)

## Publicar no GitHub Pages

1. *Settings → Pages → Build and deployment → Deploy from a branch → `main` / root*.
2. O site fica em `https://maxhomsi.github.io/juntos/` para aprovação.

## Antes de apontar o domínio juntoseventos.com.br

Algumas imagens (logos, fotos das sócias, logos de clientes e de eventos, selo Cadastur) ainda
são carregadas do site antigo em WordPress. Quando o domínio sair do WordPress esses links
quebram. Antes de trocar o DNS:

```bash
python3 scripts/baixar-imagens-wordpress.py
```

O script baixa as imagens para `assets/img/wp/` e troca os links nos arquivos. Depois:
adicionar o arquivo `CNAME` com `juntoseventos.com.br`, configurar o domínio em *Settings → Pages*
e apontar o DNS para o GitHub Pages.
