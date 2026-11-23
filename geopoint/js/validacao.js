
function converterNumero(texto) {
  const limpo = texto.trim().replace(",", ".");
  if (limpo === "") {
    return NaN;
  }
  return Number(limpo);
}

function validarPonto(ponto) {
  if (!ponto.name) {
    return "Informe o nome do ponto.";
  }
  if (ponto.name.length > 100) {
    return "O nome pode ter no máximo 100 caracteres.";
  }
  if (ponto.description.length > 255) {
    return "A descrição pode ter no máximo 255 caracteres.";
  }
  if (Number.isNaN(ponto.latitude) || ponto.latitude < -90 || ponto.latitude > 90) {
    return "A latitude deve ser um número entre -90 e 90.";
  }
  if (Number.isNaN(ponto.longitude) || ponto.longitude < -180 || ponto.longitude > 180) {
    return "A longitude deve ser um número entre -180 e 180.";
  }
  return null;
}
