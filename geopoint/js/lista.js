const areaFiltro = document.getElementById("area-filtro");
const areaTabela = document.getElementById("area-tabela");
let todosOsPontos = [];
let textoFiltro = "";

function filtrarPontos(pontos, texto) {
  const busca = texto.trim().toLowerCase();
  if (busca === "") return pontos;
  return pontos.filter(
    (ponto) =>
      ponto.name.toLowerCase().includes(busca) ||
      (ponto.description || "").toLowerCase().includes(busca)
  );
}

function desenharLista() {
  const filtrados = filtrarPontos(todosOsPontos, textoFiltro);
  if (filtrados.length === 0) {
    areaTabela.replaceChildren(criarMensagem("Nenhum ponto encontrado."));
    return;
  }
  areaTabela.replaceChildren(criarTabelaPontos(filtrados, excluirDaLista));
}

async function excluirDaLista(ponto) {
  if (!confirm(`Excluir o ponto "${ponto.name}"?`)) return;
  try {
    await excluirPonto(ponto.id);
    todosOsPontos = todosOsPontos.filter((item) => item.id !== ponto.id);
    desenharLista(); // atualiza sem recarregar a página
  } catch (erro) {
    alert("Não foi possível excluir o ponto. Tente novamente.");
  }
}

async function carregarPontos() {
  areaTabela.replaceChildren(criarMensagem("Carregando..."));
  try {
    todosOsPontos = await listarPontos();
    desenharLista();
  } catch (erro) {
    areaTabela.replaceChildren(
      criarMensagem("Não foi possível carregar os pontos. Verifique se a API está no ar.", "erro")
    );
  }
}

document.getElementById("navbar").appendChild(criarNavbar("lista"));
areaFiltro.appendChild(
  criarFiltroPontos((texto) => {
    textoFiltro = texto;
    desenharLista();
  })
);
carregarPontos();
