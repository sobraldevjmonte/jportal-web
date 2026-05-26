// /src/utils/formatarValores.js

/**
 * Formata números para o padrão brasileiro de milhares SEM casas decimais.
 * Exemplo: 99999.00 -> 99.999
 */
function formatarSemDecimaisEmilhares(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) return "0";

  // Usamos Math.round para arredondar para o inteiro mais próximo antes de formatar
  let valorInteiro = Math.round(numero);

  return valorInteiro.toLocaleString("pt-BR", {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function formatarMoedaComSimbolo(numero) {
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function formatarMoeda(numero) {
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function retornarDouble(numero) {
  if (typeof numero !== 'string') return numero;
  let valor = numero.replace(/[^0-9,]/g, '').replace(",", ".");
  return parseFloat(valor);
}

export { 
    formatarMoeda, 
    formatarMoedaComSimbolo, 
    retornarDouble, 
    formatarSemDecimaisEmilhares 
};