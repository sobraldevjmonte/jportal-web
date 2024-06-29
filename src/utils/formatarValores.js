const numero = 4676679.33;

function formatarMoedaComSimbolo(numero) {
  let valor = numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return valor;
}

function formatarMoeda(numero) {
  let valor = numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return valor;
}


export { formatarMoeda, formatarMoedaComSimbolo }