const calculoTempo = require('./calculoTempo');
const distribuiTarefas = require('./distribuiTarefas');

function resolveProblema(instancia) {
    // DISTRIBUI AS TAREFAS SEM LEVAR EM CONSIDERAÇÃO O TEMPO GASTO NAS TROCAS
    const respostaDivisaoTarefas = distribuiTarefas(instancia.quantidadeMaquinas, instancia.tempoProcessamentoTarefa);

    // CRIA O OBJETO QUE SERÁ RETORNADO
    let resposta = { 
        //distribuicaoTarefas: respostaDivisaoTarefas,
        ktns: [],
    };
   
    // CRIA O OBJETOS TEMPORÁRIOS QUE VAI RECEBER AS TAREFAS
    let tempTarefas = [[]];
   
    // PERCORRE PELAS MÁQUINAS
    for(let i = 0; i < instancia.quantidadeMaquinas; i ++ ){
        tempTarefas[i] = [];
        for(let j = 0; j < respostaDivisaoTarefas.alocacaoMaquina[i].length; j++){
            // ARMAZENA A TAREFA
            tempTarefas[i][j] = [];
            tempTarefas[i][j].push(respostaDivisaoTarefas.alocacaoMaquina[i][j].Tarefa);    
        }
        // FORMATA O ARRAY
        tempTarefas[i] = tempTarefas[i].reduce((acumulador, atual) => { return acumulador.concat(atual); }, []);
        // CRIA A ENTRADA DO SERVIÇO KTNS
        const tarefas = tempTarefas[i];
        // CHAMA O SERVIÇO KTNS
        const respostaKtns = calculoTempo(instancia,tarefas);
        // ADICIONA CADA RESULTADO DO KTNS AO OBJETO DE RESPOSTA
        resposta.ktns.push(respostaKtns);
    }
    return resposta;
}

module.exports = resolveProblema;