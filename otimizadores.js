const calculoTempo = require('./calculoTempo');

// OTIMIZADOR MÉTODO 1
function otimizarMetodo1(instancia, tarefas){
  // DEFINE A RESPOSTA INICIAL, CONTENDO: RESULTADO DO KTNS E A INSTÂNCIA
  let resposta1 = {
      ktns: []
  }
  // PERCORRE POR CADA MÁQUINA RESOLVENDO O KTNS
  for(let i = 0; i < tarefas.length; i++){
      const parametrosEntrada = {
          tarefas: tarefas[i],
      };
      // ADICIONA O RESULTADO DO KTNS DE CADA MÁQUINA NA RESPOSTA
      resposta1.ktns.push(calculoTempo(instancia,parametrosEntrada.tarefas));
  }

  // DEFINE A RESPOSTA INTERMEDIÁRIA, CONTENDO: RESULTADO DO KTNS E A INSTÂNCIA
  let resposta2 = {
      ktns: []
  }
  // VERIFICA QUAL ITEM DEVE SER MOVIMENTADO;
  let itemParaMovimentar = retornaQuemDeveMovimentar(instancia,resposta1);
  // ENCONTRA A MÁQUINA MAIS LENTA
  let max = 0;
  let indiceMax;
  for(let i = 0; i < resposta1.ktns.length; i++){
    if(resposta1.ktns[i].tempoTotal > max){
      max = resposta1.ktns[i].tempoTotal;
      indiceMax = i;
    }
  }
  // ENCONTRA A MÁQUINA MAIS RÁPIDA
  let min = resposta1.ktns[0].tempoTotal;
  let indiceMin = 0;
  for(let i = 0; i < resposta1.ktns.length; i++){
    if(resposta1.ktns[i].tempoTotal < min){
      min = resposta1.ktns[i].tempoTotal;
      indiceMin = i;
    }
  }
  // REALIZA A PRIMEIRA TROCA
  efetuaTroca(tarefas[indiceMin],tarefas[indiceMax],itemParaMovimentar);    
  // RODA O KTNS NOVAMENTE COM AS TAREFAS ALTERADAS
  for(let i = 0; i < tarefas.length; i++){
      const parametrosEntrada = {
          tarefas: tarefas[i],
      };
      // ADICIONA O RESULTADO DO KTNS DE CADA MÁQUINA NA RESPOSTA
      resposta2.ktns.push(calculoTempo(instancia,parametrosEntrada.tarefas));
  }
  // VERIFICA QUAL ITEM DEVE SER MOVIMENTADO;
  itemParaMovimentar = retornaQuemDeveMovimentar(instancia,resposta2);
  // ENCONTRA A MÁQUINA MAIS LENTA
  let max2 = 0;
  let indiceMax2;
  for(let i = 0; i < resposta2.ktns.length; i++){
    if(resposta2.ktns[i].tempoTotal > max2){
      max2 = resposta2.ktns[i].tempoTotal;
      indiceMax2 = i;
    }
  }
  // ENCONTRA A MÁQUINA MAIS RÁPIDA
  let min2 = resposta2.ktns[0].tempoTotal;
  let indiceMin2 = 0;
  for(let i = 0; i < resposta2.ktns.length; i++){
    if(resposta2.ktns[i].tempoTotal < min2){
      min2 = resposta2.ktns[i].tempoTotal;
      indiceMin2 = i;
    }
  }      
  // REALIZA A SEGUNDA TROCA
  efetuaTroca(tarefas[indiceMax2],tarefas[indiceMin2],itemParaMovimentar);     
  // DEFINE A RESPOSTA FINAL, CONTENDO: RESULTADO DO KTNS E A INSTÂNCIA
  let resposta3 = {
      ktns: [],
      instancia: instancia
  }
  // RODA O KTNS NOVAMENTE COM AS TAREFAS ALTERADAS
  for(let i = 0; i < tarefas.length; i++){
      const parametrosEntrada = {
          tarefas: tarefas[i],
      };
      // ADICIONA O RESULTADO DO KTNS DE CADA MÁQUINA NA RESPOSTA
      resposta3.ktns.push(calculoTempo(instancia,parametrosEntrada.tarefas));
  }
  return resposta3;

}

// OTIMIZADOR MÉTODO 2
function otimizarMetodo2(instancia, tarefas){
  // DEFINE A RESPOSTA INICIAL, CONTENDO: RESULTADO DO KTNS E A INSTÂNCIA
  let resposta1 = {
      ktns: []
  }
  // PERCORRE POR CADA MÁQUINA RESOLVENDO O KTNS
  for(let i = 0; i < tarefas.length; i++){
      const parametrosEntrada = {
          tarefas: tarefas[i],
      };
      // ADICIONA O RESULTADO DO KTNS DE CADA MÁQUINA NA RESPOSTA
      resposta1.ktns.push(calculoTempo(instancia,parametrosEntrada.tarefas));
  }
  // DEFINE A RESPOSTA INTERMEDIÁRIA, CONTENDO: RESULTADO DO KTNS E A INSTÂNCIA
  let resposta2 = {
      ktns: []
  }
  // VERIFICA QUAL ITEM DEVE SER MOVIMENTADO;
  let itemParaMovimentar = retornaQuemDeveMovimentar(instancia,resposta1);
  // ENCONTRA A MÁQUINA MAIS LENTA
  let max = 0;
  let indiceMax;
  for(let i = 0; i < resposta1.ktns.length; i++){
    if(resposta1.ktns[i].tempoTotal > max){
      max = resposta1.ktns[i].tempoTotal;
      indiceMax = i;
    }
  }
  // ENCONTRA A MÁQUINA MAIS RÁPIDA
  let min = resposta1.ktns[0].tempoTotal;
  let indiceMin = 0;
  for(let i = 0; i < resposta1.ktns.length; i++){
    if(resposta1.ktns[i].tempoTotal < min){
      min = resposta1.ktns[i].tempoTotal;
      indiceMin = i;
    }
  }
  // REALIZA A PRIMEIRA TROCA
  efetuaTroca(tarefas[indiceMin],tarefas[indiceMax],itemParaMovimentar);    
  // RODA O KTNS NOVAMENTE COM AS TAREFAS ALTERADAS
  for(let i = 0; i < tarefas.length; i++){
      const parametrosEntrada = {
          tarefas: tarefas[i],
      };
      // ADICIONA O RESULTADO DO KTNS DE CADA MÁQUINA NA RESPOSTA
      resposta2.ktns.push(calculoTempo(instancia,parametrosEntrada.tarefas));
  }
  return resposta2;
}

// VERIFICA QUAL TAREFA DEVE SER MOVIMENTADA
function retornaQuemDeveMovimentar(instancia,resposta) {
    // 1. Verifico qual máquina tem o menor tempo de processamento;
    const itemComMenorTempoTotal = resposta.ktns.reduce((anterior, atual) => { return atual.tempoTotal < anterior.tempoTotal ? atual : anterior; });
    const maquinaMaisRapida = [itemComMenorTempoTotal];
    // 2. Verifico qual a situação do magazine da última tarefa desta máquina;
    const ultimaTarefaMagazineMaisRapido = maquinaMaisRapida[0].matrizComparativa[(maquinaMaisRapida[0].matrizComparativa.length - 1)];
    // 3. Verifico qual máquina tem o maior tempo de processamento;
    const itemComMaiorTempoTotal = resposta.ktns.reduce((anterior, atual) => { return atual.tempoTotal > anterior.tempoTotal ? atual : anterior; });
    const maquinaMaisLenta = [itemComMaiorTempoTotal];
    // 4. Filtrar a matriz de ferramentas apenas com as tarefas da máquina mais lenta
    const matrizFerramentasSelecionadas = extrairPosicoes(instancia.matrizFerramentas, maquinaMaisLenta[0].tarefas);    
    // 5. Transpor o resultado da matriz encontrada
    const matrizFerramentasSelecionadasTransposta = transporMatriz(matrizFerramentasSelecionadas);
    // 6. Verifica qual tarefa da máquina mais lenta precisa das ferramentas mais parecidas com as ferramentas do último magazine da máquina mais rápida
    const maisProximo = compararFerramentasDasMaquinas(matrizFerramentasSelecionadasTransposta, ultimaTarefaMagazineMaisRapido);
    const posicaoEncontrada = encontrarPosicaoDaMatriz(transporMatriz(instancia.matrizFerramentas), maisProximo);
    return posicaoEncontrada;
}

// EFETUA A TROCA DO NÚMERO ENTRE OS ARRAYS
function efetuaTroca(array1, array2, numero) {
  let numeroIndex;
  numeroIndex = array1.indexOf(numero);
  if (numeroIndex === -1) {
    numeroIndex = array2.indexOf(numero);
    array2.splice(numeroIndex, 1);
    array1.push(numero);  
  }else{
    array1.splice(numeroIndex, 1);
    array2.push(numero);  
  }
}
  
// FUNÇÃO QUE COMPARA UM ARRAY MODELO COM VÁRIOS OUTROS ARRAYS
function compararFerramentasDasMaquinas(arrays, modelo) {
    let melhorArray = null;
    let maxPontuacao = -1; 
    for (const array of arrays) {
      let pontuacao = 0;  
      for (let i = 0; i < modelo.length; i++) {
        if (array[i] === 1 && modelo[i] === 1) {
          pontuacao++;
        }
      }  
      if (pontuacao > maxPontuacao) {
        maxPontuacao = pontuacao;
        melhorArray = array.slice();
      }
    }
    return melhorArray;
}
// FUNÇÃO QUE TRANSPOE UMA MATRIZ
function transporMatriz(matriz) {
    const linhas = matriz.length;
    const colunas = matriz[0].length;
    const matrizTransposta = Array.from({ length: colunas }, () => Array(linhas));
    for (let i = 0; i < linhas; i++) {
      for (let j = 0; j < colunas; j++) {
        matrizTransposta[j][i] = matriz[i][j];
      }
    }  
    return matrizTransposta;
}
// FUNÇÃO QUE EXTRAI APENAS OS ARRAYS SELECIONADOS DA MATRIZ
function extrairPosicoes(matriz, posicoes) {
    return matriz.map(subarray => posicoes.map(posicao => subarray[posicao]));
}

// FUNÇÃO QUE ENCONTRA A POSIÇÃO DO ARRAY DENTRO DA MATRIZ
function encontrarPosicaoDaMatriz(matriz, arrayReferencia) {
    for (let i = 0; i < matriz.length; i++) {
      const subarray = matriz[i];  
      if (arraysIguais(subarray, arrayReferencia)) {
        return i;
      }
    }
    return -1;
}
// FUNÇÃO QUE VERIFICA SE OS ARRAYS SÃO IGUAIS 
function arraysIguais(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
}

module.exports = {
  retornaQuemDeveMovimentar, 
  efetuaTroca,
  otimizarMetodo1,
  otimizarMetodo2,
};