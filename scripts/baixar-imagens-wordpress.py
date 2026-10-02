#!/usr/bin/env python3
"""
Baixa as imagens que hoje são carregadas direto do site antigo (WordPress)
e troca os links para cópias locais em assets/img/wp/.

RODE ISTO ANTES de apontar o domínio juntoseventos.com.br para o site novo:
quando o WordPress sair do ar, os links wp-content/uploads param de funcionar.

Uso (na pasta do projeto):
    python3 scripts/baixar-imagens-wordpress.py
"""
import os
import re
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, 'assets', 'img', 'wp')
PADRAO = re.compile(r'https://juntoseventos\.com\.br/wp-content/uploads/[^\s"\'()<>,]+')
ARQUIVOS = [f for f in os.listdir(RAIZ) if f.endswith('.html')] + ['data/eventos.csv', 'docs/planilha-modelo.csv']

os.makedirs(DESTINO, exist_ok=True)
urls = set()
for nome in ARQUIVOS:
    caminho = os.path.join(RAIZ, nome)
    if os.path.exists(caminho):
        urls.update(PADRAO.findall(open(caminho, encoding='utf-8').read()))

mapa = {}
for url in sorted(urls):
    local = 'assets/img/wp/' + url.split('/uploads/')[1].replace('/', '-')
    alvo = os.path.join(RAIZ, local)
    if not os.path.exists(alvo):
        print('baixando', url)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as r, open(alvo, 'wb') as f:
            f.write(r.read())
    mapa[url] = local

for nome in ARQUIVOS:
    caminho = os.path.join(RAIZ, nome)
    if not os.path.exists(caminho):
        continue
    txt = open(caminho, encoding='utf-8').read()
    novo = txt
    for url, local in mapa.items():
        novo = novo.replace(url, local)
    if novo != txt:
        open(caminho, 'w', encoding='utf-8').write(novo)
        print('atualizado', nome)

print(f'Pronto: {len(mapa)} imagens copiadas para assets/img/wp/')
print('Atenção: se a planilha do Google também usa links wp-content, troque-os na planilha.')
