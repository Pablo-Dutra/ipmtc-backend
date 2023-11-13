function KTNS(instancia,tarefas) {

    const matrizFerramentas = instancia.matrizFerramentas;
    const tamanhoMagazine = instancia.tamanhoMagazine;
    const tempoProcessamentoTarefa = instancia.tempoProcessamentoTarefa;
    const tempoTrocaFerramenta = instancia.tempoTrocaFerramenta;

    // FLAG PARA LIGAR/DESLIGAR OS RESULTADOS NO CONSOLE
    const debug = false;

    // CRIA O ARRAY COM OS TEMPOS DAS TAREFAS E TROCAS
    let temporizador = [];

    // CRIA A MATRIZ DE FERRAMENTAS POR TAREFA PARA FUTURAS COMPARAÇÕES
    let matrizComparativa = [];

    if(debug){
        console.log('\nMATRIZ DE FERRAMENTAS NO KTNS');
        console.log('Cada coluna representa uma tarefa, sendo que onde tem 1 significa que aquela ferramenta está alocada no magazine durante a execução da tarefa.');
        console.table(matrizFerramentas);
    }
    
    // DEFINE A QUANTIDADE DE FERRAMENTAS DISPONÍVEIS;
    const qtdFerramentas = matrizFerramentas.length;

    // DEFINE carregadas COMO UM ARRAY DO TAMANHO DA QUANTIDADE DE FERRAMENTAS, COM TODOS CAMPOS PREENCHIDOS COMO ZERO. À MEDIDA QUE VÃO SENDO CARREGADAS, VÃO SENDO PREENCHIDAS COM 1;
    const carregadas = new Array(qtdFerramentas).fill(0);
  
    // DEFINE magazine PARA CARREGAR COM A MATRIZ DE ENTRADA;
    const magazine = [];
    // QUANTIDADE DE FERRAMENTAS NO MAGAZINE
    let qtdFerramentasNoMagazine = 0;
    // PERCORRE A PRIMEIRA COLUNA DA MATRIZ DE FERRAMENTAS
    for (let j = 0; j < qtdFerramentas; j++) {
      // CARREGA AS FERRAMENTAS DA PRIMEIRA TAREFA  
      carregadas[j] = matrizFerramentas[j][tarefas[0]];
      // VERIFICA SE A FERRAMENTA É UTILIZADA NA TAREFA, SE SIM, INCREMENTA QTDFERRAMENTASNOMAGAZINE
      if(matrizFerramentas[j][tarefas[0]] === 1){ qtdFerramentasNoMagazine++; } 
      const magazineRow = [];
      // PERCORRE A LINHA DAS TAREFAS
      for (let i = 0; i < tarefas.length; i++) {
        magazineRow.push(matrizFerramentas[j][tarefas[i]]);
      }
      magazine.push(magazineRow);
    }

    // MATRIZ ONDE SERÃO ARMAZENADAS AS FERRAMENTAS PRIORITÁRIAS
    const prioridades = [];
    // PERCORRE A MATRIZ NA VERTICAL
    for (let i = 0; i < qtdFerramentas; ++i) {
      // PERCORRE A MATRIZ NA HORIZONTAL  
      const prioridadesRow = [];
      for (let j = 0; j < tarefas.length; ++j) {
        // VERIFICA SE A FERRAMENTA SERÁ USADA NESTA POSIÇÃO;
        if (magazine[i][j] === 1) {
          // SE SIM, PRIORIDADE 0;
          prioridadesRow.push(0);
        } else {
          // SE NÃO, MARCA QUE NÃO SERÁ USADA NESTA POSIÇÃO VERIFICA NAS PRÓXIMAS TAREFAS;  
          let proxima = 0;
          let usoDetectado = false;
          for (let k = j + 1; k < tarefas.length; ++k) {
            ++proxima;
            if (magazine[i][k] === 1) {
              usoDetectado = true;
              break;
            }
          }
          // VERIFICA SE SERÁ USADA
          if (usoDetectado) {
            // SE FOR USADA, MARQUE QUANDO SERÁ USADA;
            prioridadesRow.push(proxima);
          } else {
            // SE NÃO FOR USADA MAIS, MARQUE COMO -1;
            prioridadesRow.push(-1);
          }
        }
      }
      prioridades.push(prioridadesRow);
    }
  
    if(debug){    
        console.log('\nMATRIZ DE PRIORIDADES DAS FERRAMENTAS:');
        console.log('Os números de 0 a n representam quão distante a ferramenta está de seu uso, quanto menor o número, mais imediato seu uso. Já -1 simboliza que a ferramenta não será mais utilizada.');
        console.table(prioridades);
    }
  
    if(debug){ console.log('\n================ EXECUTANDO TAREFA # 1 ================\n'); }
    let carregadasNaPrimeira = [];

    // ADICIONA NO ARRAY O TEMPO DA TAREFA INICIAL
    temporizador.push(tempoProcessamentoTarefa[tarefas[0]]);

    // CARREGANDO AS FERRAMENTAS DA PRIMEIRA TAREFA
    for (let j = 0; j < qtdFerramentas; j++) {
      carregadasNaPrimeira.push(carregadas[j]);
    }
    if(debug){
        console.log("\nTabela com ferramentas carregadas no magazine agora: ");
        console.table(carregadasNaPrimeira);
    }
    matrizComparativa.push(carregadasNaPrimeira);

    // CALCULA AS TROCAS
    let trocas = 0;

    // PERCORRE A QUANTIDADE DE TAREFAS A SEREM REALIZADAS
    for (let i = 1; i < tarefas.length; ++i) {        
      if(debug){console.log('\n================ EXECUTANDO A',i+1,'ª TAREFA ================\n'); }
      let trocasNestaTarefa = 0;

      // CARREGANDO AS FERRAMENTAS DA TAREFA CORRENTE
      for (let j = 0; j < qtdFerramentas; ++j) {
        if (magazine[j][i] === 1 && carregadas[j] === 0) {
          carregadas[j] = 1;
          if(debug){ console.log('Carregou a ferramenta:',j); }
          ++qtdFerramentasNoMagazine;
        }
      }

      // ENQUANTO A QTD DE FERRAMENTAS NO MAGAZINE FOR MAIOR QUE O TAMANHO DO MAGAZINE, VAI REMOVENDO AS FERRAMENTAS MAIS LONGES
      while (qtdFerramentasNoMagazine > tamanhoMagazine) {
        let maior = 0;
        let pMaior = -1;

        for(let j = 0; j < qtdFerramentas; ++j) {
          if(magazine[j][i] !== 1) {
            if (carregadas[j] === 1 && prioridades[j][i] === -1) {
              pMaior = j;
              break;
            } else {
              if(prioridades[j][i] > maior && carregadas[j] === 1) {
                maior = prioridades[j][i];
                pMaior = j;
              }
            }
          }
        }
        carregadas[pMaior] = 0;
        if(debug){ console.log("Retirou a ferramenta:",pMaior); }
        --qtdFerramentasNoMagazine;
        ++trocas;
        ++trocasNestaTarefa;
      }

      // EXIBE INFORMAÇÕES
      if(debug){
        console.log(trocas,"trocas já realizadas até agora..");        
        console.log("\nTabela com ferramentas carregadas no magazine agora: ");
        console.table(carregadas);
      }
      matrizComparativa.push(carregadas);
      // ADICIONA AO ARRAY O TEMPO GASTO COM AS TROCAS
      temporizador.push((trocasNestaTarefa * tempoTrocaFerramenta) * -1);
      // ADICIONA AO ARRAY O TEMPO GASTO COM ESTA TAREFA
      temporizador.push(tempoProcessamentoTarefa[tarefas[i]]);
    }

    const resposta = {
      trocas: trocas,
      temporizador: temporizador,
      matrizComparativa: matrizComparativa,
    };
    return resposta;
  }

  module.exports = KTNS;