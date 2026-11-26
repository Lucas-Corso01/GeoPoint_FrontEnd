// Com ?id=... é edição (PUT); sem id é cadastro (POST).
const idPonto = new URLSearchParams(location.search).get("id");
const areaFormulario = document.getElementById("area-formulario");
const titulo = document.getElementById("titulo");

const pontoVazio = { name: "", description: "", latitude: "", longitude: "" };

function montarFormulario(ponto) {
  const textoBotao = idPonto ? "Salvar alterações" : "Cadastrar";
  const form = criarFormPonto(ponto, textoBotao, async (dados) => {
    if (idPonto) {
      await atualizarPonto(idPonto, dados);
    } else {
      await criarPonto(dados);
    }
    window.location.href = "index.html";
  });
  areaFormulario.replaceChildren(form);
}

async function iniciar() {
  document.getElementById("navbar").appendChild(criarNavbar(idPonto ? "" : "novo"));

  if (!idPonto) {
    montarFormulario(pontoVazio);
    return;
  }

  titulo.textContent = "Editar ponto";
  document.title = "Editar ponto · GeoPoint";
  areaFormulario.replaceChildren(criarMensagem("Carregando..."));
  try {
    montarFormulario(await buscarPonto(idPonto));
  } catch (erro) {
    areaFormulario.replaceChildren(
      criarMensagem("Não foi possível carregar o ponto para edição.", "erro"),
      criarLinkBotao("Voltar para a lista", "index.html")
    );
  }
}

iniciar();
