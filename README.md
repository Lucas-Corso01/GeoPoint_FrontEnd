# Ponto a Ponto

Aplicação web para cadastrar, consultar, editar e excluir pontos geográficos. O front-end utiliza a API **GeoPoint** e exibe os locais em um mapa interativo.

## Integrantes

- Lucas Ribas Corso — RA: 1139917
- Gabriel Thomasio Bordignon — RA: _(preencher)_

## Funcionalidades

- Listar os pontos geográficos cadastrados na API.
- Filtrar a lista por nome ou descrição e ordenar por nome.
- Cadastrar pontos com nome, descrição e coordenadas.
- Consultar os detalhes de um ponto.
- Editar e excluir pontos.
- Visualizar no mapa os pontos recebidos da API.

## API utilizada

**URL base:** https://geopoint-6x4u.onrender.com

> A API está hospedada no Render. Na primeira requisição após um período sem uso, ela pode demorar alguns segundos para responder.

## Tecnologias

- HTML5
- CSS3
- JavaScript (puro)
- API GeoPoint (consumo via `fetch`)
- Biblioteca de mapas _(ex.: Leaflet + OpenStreetMap — ajuste conforme o que você usou)_

## Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/Lucas-Corso01/GeoPoint_FrontEnd.git
   ```
2. Entre na pasta do projeto:
   ```bash
   cd GeoPoint_FrontEnd
   ```
3. Abra o arquivo `index.html` no navegador, ou use a extensão **Live Server** no VS Code.

Não é necessário instalar dependências nem rodar um back-end local, pois a aplicação consome a API hospedada.

## Estrutura do projeto

```
GeoPoint_FrontEnd/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

_(Ajuste a estrutura conforme os arquivos do seu projeto.)_

## Disciplina

Trabalho G2 — Desenvolvimento Frontend — Atitus Educação.
