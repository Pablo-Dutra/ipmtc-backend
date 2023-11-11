const KTNS = require('./ktns');

function calculoTempo(instancia, tarefas) {
    // INICIALIZA O TEMPO DE PROCESSAMENTO EM ZERO
    let tempoTotalProcessamento = 0;

    // PERCORRE CADA TAREFA INCREMENTANDO NO TEMPO TOTAL O TEMPO DA TAREFA CORRENTE;
    for (let i = 0; i < tarefas.length ; i++) {
      tempoTotalProcessamento += instancia.tempoProcessamentoTarefa[tarefas[i]];
    }

    // CALCULA A QUANTIDADE DE TROCAS PELO KTNS;
    const qtdTrocas = KTNS(instancia,tarefas);
    const tempoTotalTrocas = qtdTrocas.trocas * instancia.tempoTrocaFerramenta;
    const tempoTotal = tempoTotalProcessamento + tempoTotalTrocas;
    const matrizComparativa = qtdTrocas.matrizComparativa;

    const resposta = {
        tempoTotalProcessamento: tempoTotalProcessamento,
        tempoTotalTrocas: tempoTotalTrocas,
        tempoTotal: tempoTotal,        
        qtdTrocas: qtdTrocas.trocas,
        matriz: qtdTrocas.temporizador,
        tarefas: tarefas,
        matrizComparativa: matrizComparativa,
    };
    return resposta;
  }

  module.exports = calculoTempo;