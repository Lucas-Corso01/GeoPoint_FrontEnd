
const URL_BASE_API = "https://geopoint-6x4u.onrender.com";
const URL_PONTOS = `${URL_BASE_API}/api/points`;

async function tratarResposta(resposta) {
  if (!resposta.ok) {
    throw new Error(`A API respondeu com erro ${resposta.status}`);
  }
  
  if (resposta.status === 204) {
    return null;
  }
  return resposta.json();
}

async function listarPontos() {
  return tratarResposta(await fetch(URL_PONTOS));
}

async function buscarPonto(id) {
  return tratarResposta(await fetch(`${URL_PONTOS}/${encodeURIComponent(id)}`));
}

async function criarPonto(ponto) {
  return tratarResposta(
    await fetch(URL_PONTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ponto),
    })
  );
}

async function atualizarPonto(id, ponto) {
  return tratarResposta(
    await fetch(`${URL_PONTOS}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ponto),
    })
  );
}

async function excluirPonto(id) {
  return tratarResposta(
    await fetch(`${URL_PONTOS}/${encodeURIComponent(id)}`, { method: "DELETE" })
  );
}
