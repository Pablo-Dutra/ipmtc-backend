function distribuiTarefas(maquinas, tarefas) {

    // CRIA O ARRAY DAS MÁQUINAS E SUAS RESPECTIVAS TAREFAS
    let tarefasNaMaquina = [];
    for (let i = 0; i < maquinas; i++) {
        tarefasNaMaquina[i] = [];
    }
  
    // ORDENA AS TAREFAS EM ORDEM DECRESCENTE DE TEMPO
    tarefas = tarefas.map((tempo, indice) => ({ indice, tempo }));
    tarefas.sort((a, b) => b.tempo - a.tempo);    
  
    // INICIALIZA UMA MATRIZ PARA RASTREAR O TEMPO DE CONCLUSÃO DE CADA MÁQUINA
    const tempoCompleto = new Array(maquinas).fill(0);

    // CRIA UMA MATRIZ PARA RASTREAR O TEMPO DE ALOCAÇÃO DE CADA MÁQUINA
    const locacao = new Array(maquinas).fill([]);
  
    for (let i = 0; i < tarefas.length; i++) {
      // ESTA LINHA CALCULA O ÍNDICE DA MÁQUINA QUE TEM O MENOR TEMPO DE CONCLUSÃO ATÉ O MOMENTO
      const indiceMaisAntigo = tempoCompleto.indexOf(Math.min(...tempoCompleto));
      tempoCompleto[indiceMaisAntigo] += tarefas[i].tempo;

      // REGISTRA A TAREFA ALOCADA À MÁQUINA, INCLUINDO O ÍNDICE ORIGINAL
      tarefasNaMaquina[indiceMaisAntigo].push({
          Tarefa: tarefas[i].indice,
          Tempo: tarefas[i].tempo
      });
      // REGISTRA O TEMPO DA TAREFA ALOCADA À MÁQUINA
      locacao[indiceMaisAntigo].push(tarefas[i].tempo);
    }
    return { 
        maiorTempo: Math.max(...tempoCompleto), 
        tempoCadaMaquina: tempoCompleto,
        alocacaoMaquina: tarefasNaMaquina 
    };
  }
  
module.exports = distribuiTarefas;