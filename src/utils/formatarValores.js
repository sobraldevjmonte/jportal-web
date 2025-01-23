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


function retornarDouble(numero){
  let valor = numero.replace(/[^0-9,]/g, '').replace(",", ".");
  return parseFloat(valor);
}

function formatarSemDecimaisEmilhares(numero) {
  // Remove casas decimais usando Math.floor
  let valorInteiro = Math.floor(numero);

  // Formata com pontos de milhares
  let valor = valorInteiro.toLocaleString("pt-BR", {
    useGrouping: true, // Garante a formatação com pontos de milhares
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return valor;
}



export { formatarMoeda, formatarMoedaComSimbolo, retornarDouble, formatarSemDecimaisEmilhares };
