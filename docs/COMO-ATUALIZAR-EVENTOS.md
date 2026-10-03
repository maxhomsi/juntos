# Como atualizar os eventos do site

Os eventos do site (agenda, portfólio, destaques da página inicial e a página de cada
evento) vêm de **uma planilha do Google**. Quem edita a planilha atualiza o site — sem
programador e sem mexer em código.

**Planilha oficial:** [Site JUNTOS — eventos](https://docs.google.com/spreadsheets/d/1tvpv1apbH7-ppWns-V4LF7piVK3uudMRn7zYGS0-OwM/edit) (aba `eventos`).
Ela já está ligada ao site em `assets/js/config.js` e precisa ficar compartilhada como
"Qualquer pessoa com o link: Leitor". As datas vão no formato `dd/mm/aaaa`.

## Como funciona

```
Planilha Google  ──(link de leitor)  ──▶  site lê ao abrir a página  ──▶  agenda + portfólio
```

- Cada **linha** da planilha é um evento.
- O site separa sozinho **Próximos eventos** e **Eventos realizados** pela data final:
  passou a data, o evento sai da agenda e entra no portfólio, com a etiqueta "Evento realizado".
- Cada evento ganha uma página própria: `evento.html?id=<id do evento>`.
- As mudanças aparecem em **poucos minutos** (o tempo que o Google leva para atualizar a versão publicada).
- Se a planilha estiver fora do ar ou com o link errado, o site usa o arquivo de reserva
  `data/eventos.csv`, para nunca ficar vazio.

## Colunas da planilha

| Coluna | O que colocar | Exemplo |
| --- | --- | --- |
| `id` | Nome curto, sem espaço nem acento. Vira o endereço da página. **Não mude depois de publicado.** | `cobti-2025` |
| `publicar` | `sim` para aparecer no site. Vazio ou `não` esconde o evento. | `sim` |
| `destaque` | `sim` para aparecer na página inicial (até 3). | `sim` |
| `nome` | Nome curto do evento (obrigatório). | `COBTI 2025` |
| `titulo_completo` | Nome oficial completo. | `Congresso de Ortobiológicos e Terapias Injetáveis` |
| `realizacao` | Quem realiza. | `SBOT-RJ` |
| `tipo` | Usado nos filtros do portfólio. Mantenha sempre a mesma grafia. | `Congresso`, `Corporativo`, `Social` |
| `data_inicio` | Data no formato dia/mês/ano. | `25/07/2025` |
| `data_fim` | Último dia (se for um dia só, repita a data). | `26/07/2025` |
| `programacao` | Texto livre; use Alt+Enter para quebrar linha. | `Dia 24 - Cursos` ↵ `Dias 25 e 26 - Congresso` |
| `local` | Local e endereço. | `Hotel Rio Othon Palace — Copacabana` |
| `cidade` | Cidade - UF. | `Rio de Janeiro - RJ` |
| `descricao` | Uma ou duas frases sobre o evento. | |
| `o_que_fizemos` | O que a JUNTOS fez (secretaria, inscrições, patrocínio…). Ótimo para vender! | |
| `logo` | Link da imagem do logo do evento. | |
| `capa` | Link da foto de capa. Vazio = usa a primeira foto; sem fotos = mostra o logo. | |
| `fotos` | Links das fotos, **um por linha** (Alt+Enter) ou separados por `;`. | |
| `link_inscricao` | Link da página de inscrição (aparece como botão nos próximos eventos). | |
| `depoimento` | Frase de um cliente sobre o evento. | |
| `depoimento_autor` | Quem disse. | `Dra. Fulana, presidente do congresso` |

## Fotos

As fotos precisam ter um **link público**. Opções, da melhor para a mais simples:

1. **Pasta do site (recomendado):** enviar as fotos para o Max colocar em
   `assets/img/eventos/<id>/` — mais rápido para carregar e não quebra.
2. **Google Drive:** subir a foto, clicar em *Compartilhar → Qualquer pessoa com o link* e colar
   o link na planilha. O site converte o link do Drive automaticamente.
   Use fotos com até ~2 MB para não deixar a página lenta.

## Configuração inicial (uma vez só — Max)

1. Criar a planilha no Google Drive da JUNTOS e importar `docs/planilha-modelo.csv`
   (*Arquivo → Importar → Upload*), numa aba chamada `eventos`.
2. *Arquivo → Compartilhar → Publicar na Web* → escolher a aba `eventos` e o formato
   **Valores separados por vírgula (.csv)** → **Publicar**.
3. Copiar o link gerado e colar em `assets/js/config.js`, no campo `planilhaEventosCSV`.
4. Dar acesso de edição à planilha só para as sócias. Publicar na Web **não** permite que
   outras pessoas editem — apenas leiam os dados que já estão no site.
5. Dica: na coluna `publicar` e `tipo`, usar *Dados → Validação de dados → Lista suspensa*
   para evitar erros de digitação; na coluna de datas, formatar como *Data*.

## Por que Google Sheets?

| Opção | Prós | Contras |
| --- | --- | --- |
| **Google Sheets** (escolhida) | Grátis, as sócias já sabem usar, edita no celular, histórico de versões | Páginas de evento montadas no navegador (o Google indexa, mas um pouco pior) |
| Painel de administração (Decap CMS) | Tela de edição bonita, sobe fotos direto | Precisa de login do GitHub e configuração extra; mais uma ferramenta para aprender |
| WordPress | Painel completo | Hospedagem paga, atualizações e plugins para manter |

**Melhoria futura (opcional):** uma automação do GitHub pode ler a planilha uma vez por hora e
gerar páginas estáticas de cada evento, melhorando ainda mais o SEO — sem mudar nada para as sócias.
