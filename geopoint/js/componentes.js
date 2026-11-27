function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function criarBotao(texto, acao, variante = "primario") {
  const botao = criarElemento("button", `botao botao-${variante}`, texto);
  botao.type = "button";
  if (acao) botao.addEventListener("click", acao);
  return botao;
}

function criarLinkBotao(texto, href, variante = "secundario") {
  const link = criarElemento("a", `botao botao-${variante}`, texto);
  link.href = href;
  return link;
}

function criarMensagem(texto, tipo = "info") {
  const mensagem = criarElemento("p", `mensagem mensagem-${tipo}`, texto);
  mensagem.setAttribute("role", tipo === "erro" ? "alert" : "status");
  return mensagem;
}

function criarNavbar(paginaAtual) {
  const barra = criarElemento("div", "navbar-conteudo");
  barra.appendChild(criarElemento("span", "navbar-marca", "GeoPoint"));

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Menu principal");
  const links = [
    { texto: "Pontos", href: "index.html", pagina: "lista" },
    { texto: "Novo ponto", href: "formulario.html", pagina: "novo" },
  ];
  links.forEach((item) => {
    const link = criarElemento("a", "navbar-link", item.texto);
    link.href = item.href;
    if (item.pagina === paginaAtual) link.setAttribute("aria-current", "page");
    nav.appendChild(link);
  });
  barra.appendChild(nav);
  return barra;
}

function criarCampoTexto({ id, rotulo, valor = "", multilinha = false, modo = "text" }) {
  const envoltorio = criarElemento("div", "campo");
  const label = criarElemento("label", "campo-rotulo", rotulo);
  label.htmlFor = id;

  const entrada = document.createElement(multilinha ? "textarea" : "input");
  entrada.id = id;
  entrada.name = id;
  entrada.className = "campo-entrada";
  if (multilinha) {
    entrada.rows = 4;
  } else {
    entrada.type = "text";
    entrada.inputMode = modo;
  }
  entrada.value = valor;

  envoltorio.append(label, entrada);
  return { envoltorio, entrada };
}

function criarFiltroPontos(aoDigitar) {
  const { envoltorio, entrada } = criarCampoTexto({
    id: "filtro",
    rotulo: "Filtrar por nome ou descrição",
  });
  entrada.type = "search";
  entrada.addEventListener("input", () => aoDigitar(entrada.value));
  return envoltorio;
}

function criarCelula(texto, rotulo) {
  const celula = criarElemento("td", "", texto);
  celula.setAttribute("data-label", rotulo);
  return celula;
}

function criarLinhaPonto(ponto, aoExcluir) {
  const linha = document.createElement("tr");
  const idSeguro = encodeURIComponent(ponto.id);

  const celulaNome = criarCelula("", "Nome");
  const linkNome = criarElemento("a", "link-nome", ponto.name);
  linkNome.href = `ponto.html?id=${idSeguro}`;
  celulaNome.appendChild(linkNome);

  const celulaAcoes = criarCelula("", "Ações");
  const grupoAcoes = criarElemento("div", "acoes");
  grupoAcoes.append(
    criarLinkBotao("Ver", `ponto.html?id=${idSeguro}`, "secundario"),
    criarLinkBotao("Editar", `formulario.html?id=${idSeguro}`, "secundario"),
    criarBotao("Excluir", () => aoExcluir(ponto), "perigo")
  );
  celulaAcoes.appendChild(grupoAcoes);

  linha.append(
    celulaNome,
    criarCelula(ponto.description || "—", "Descrição"),
    criarCelula(ponto.latitude, "Latitude"),
    criarCelula(ponto.longitude, "Longitude"),
    celulaAcoes
  );
  return linha;
}

function criarTabelaPontos(pontos, aoExcluir) {
  const tabela = criarElemento("table", "tabela");

  const cabecalho = document.createElement("thead");
  const linhaCabecalho = document.createElement("tr");
  ["Nome", "Descrição", "Latitude", "Longitude", "Ações"].forEach((titulo) => {
    linhaCabecalho.appendChild(criarElemento("th", "", titulo));
  });
  cabecalho.appendChild(linhaCabecalho);

  const corpo = document.createElement("tbody");
  pontos.forEach((ponto) => corpo.appendChild(criarLinhaPonto(ponto, aoExcluir)));

  tabela.append(cabecalho, corpo);
  return tabela;
}

// formulário
function criarFormPonto(pontoInicial, textoBotao, aoSalvar) {
  const form = criarElemento("form", "formulario");
  form.noValidate = true;

  const nome = criarCampoTexto({ id: "name", rotulo: "Nome", valor: pontoInicial.name });
  const descricao = criarCampoTexto({
    id: "description",
    rotulo: "Descrição (opcional)",
    valor: pontoInicial.description || "",
    multilinha: true,
  });
  const latitude = criarCampoTexto({
    id: "latitude",
    rotulo: "Latitude (-90 a 90)",
    valor: String(pontoInicial.latitude),
    modo: "decimal",
  });
  const longitude = criarCampoTexto({
    id: "longitude",
    rotulo: "Longitude (-180 a 180)",
    valor: String(pontoInicial.longitude),
    modo: "decimal",
  });

  const areaMensagem = criarElemento("div", "area-mensagem");
  const botaoSalvar = criarBotao(textoBotao, null, "primario");
  botaoSalvar.type = "submit";

  form.append(
    nome.envoltorio,
    descricao.envoltorio,
    latitude.envoltorio,
    longitude.envoltorio,
    areaMensagem,
    botaoSalvar
  );

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = {
      name: nome.entrada.value.trim(),
      description: descricao.entrada.value.trim(),
      latitude: converterNumero(latitude.entrada.value),
      longitude: converterNumero(longitude.entrada.value),
    };

    const erroValidacao = validarPonto(dados);
    if (erroValidacao) {
      areaMensagem.replaceChildren(criarMensagem(erroValidacao, "erro"));
      return;
    }

    areaMensagem.replaceChildren();
    botaoSalvar.disabled = true; // evita cadastro duplicado
    botaoSalvar.textContent = "Salvando...";
    try {
      await aoSalvar(dados);
    } catch (erro) {
      areaMensagem.replaceChildren(
        criarMensagem("Não foi possível salvar o ponto. Verifique a API e tente de novo.", "erro")
      );
      botaoSalvar.disabled = false;
      botaoSalvar.textContent = textoBotao;
    }
  });

  return form;
}
