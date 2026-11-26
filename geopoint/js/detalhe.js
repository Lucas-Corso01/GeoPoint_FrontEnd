const idDetalhe = new URLSearchParams(location.search).get("id");
const areaDetalhe = document.getElementById("area-detalhe");

function criarItemDetalhe(rotulo, valor) {
  const item = criarElemento("div", "detalhe-item");
  item.append(criarElemento("dt", "", rotulo), criarElemento("dd", "", valor));
  return item;
}

// Mapa do OpenStreetMap com o marcador do ponto (como na tela interna do Figma).
function criarMapa(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const margem = 0.005;
  const caixa = [lng - margem, lat - margem, lng + margem, lat + margem].join(",");

  const mapa = criarElemento("iframe", "mapa");
  mapa.title = "Localização do ponto no mapa";
  mapa.loading = "lazy";
  mapa.src =
    `https://www.openstreetmap.org/export/embed.html?bbox=${caixa}&layer=mapnik&marker=${lat},${lng}`;
  return mapa;
}

async function excluirDoDetalhe(ponto) {
  if (!confirm(`Excluir o ponto "${ponto.name}"?`)) return;
  try {
    await excluirPonto(ponto.id);
    window.location.href = "index.html";
  } catch (erro) {
    alert("Não foi possível excluir o ponto. Tente novamente.");
  }
}

function desenharDetalhe(ponto) {
  const lista = criarElemento("dl", "detalhe");
  lista.append(
    criarItemDetalhe("Nome", ponto.name),
    criarItemDetalhe("Descrição", ponto.description || "—"),
    criarItemDetalhe("Latitude", ponto.latitude),
    criarItemDetalhe("Longitude", ponto.longitude),
    criarItemDetalhe("ID", ponto.id)
  );

  const acoes = criarElemento("div", "acoes-detalhe");
  acoes.append(
    criarLinkBotao("Editar", `formulario.html?id=${encodeURIComponent(ponto.id)}`, "primario"),
    criarBotao("Excluir", () => excluirDoDetalhe(ponto), "perigo"),
    criarLinkBotao("Voltar", "index.html", "secundario")
  );

  areaDetalhe.replaceChildren(criarMapa(ponto.latitude, ponto.longitude), lista, acoes);
}

async function iniciar() {
  document.getElementById("navbar").appendChild(criarNavbar(""));

  if (!idDetalhe) {
    areaDetalhe.replaceChildren(
      criarMensagem("Nenhum ponto foi informado.", "erro"),
      criarLinkBotao("Voltar para a lista", "index.html")
    );
    return;
  }

  areaDetalhe.replaceChildren(criarMensagem("Carregando..."));
  try {
    desenharDetalhe(await buscarPonto(idDetalhe));
  } catch (erro) {
    areaDetalhe.replaceChildren(
      criarMensagem("Ponto não encontrado ou API indisponível.", "erro"),
      criarLinkBotao("Voltar para a lista", "index.html")
    );
  }
}

iniciar();
