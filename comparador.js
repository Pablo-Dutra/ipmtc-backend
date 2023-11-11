// FUNÇÃO QUE COMPARA DOIS RESULTADOS
function comparador(resposta1, resposta2) {
    // ENCONTRAR O MAKESPAN DO RESULTADO INICIAL
    let makespanInicial = 0;
    for(let i = 0; i < resposta1.ktns.length; i++){
        if(resposta1.ktns[i].tempoTotal > makespanInicial){
            makespanInicial = resposta1.ktns[i].tempoTotal;
        }
    }
    
    // ENCONTRAR O MAKESPAN DO RESULTADO FINAL
    let makespanFinal = 0;
    for(let i = 0; i < resposta2.ktns.length; i++){
        if(resposta2.ktns[i].tempoTotal > makespanFinal){
            makespanFinal = resposta2.ktns[i].tempoTotal;
        }
    }

    // VERIFICA SE O MAKESPAN MELHOU PARA RETORNAR O NOVO VALOR OU O ORIGINAL
    if(makespanFinal < makespanInicial){
        return true;
    }else{
        return false;
    }          
}

module.exports = comparador;