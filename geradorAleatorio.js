const fs = require("fs");
const path = require("path");

// IMPORTA FUNÇÕES
const calculoTempo = require('./calculoTempo');

async function resultadosEmMassa(diretorio,destino) {

  // FLAG PARA DEPURAÇÃO  
  const debug = false;

  fs.readdir(diretorio, (err, arquivos) => {
    // TRATAMENTO DE EVENTUAIS ERROS
    if (err) {
      console.error("Erro ao ler o diretório:", err);
      return;
    }

    // PERCORRE CADA ARQUIVO ENCONTRADO NO DIRETÓRIO
    arquivos.forEach((arquivo) => {
      const caminhoArquivo = path.join(diretorio, arquivo);

      fs.stat(caminhoArquivo, (err, stats) => {
        if (err) {
          console.error("Erro ao verificar o arquivo:", arquivo, err);
          return;
        }

        // VERIFICA SE O ARQUIVO NÃO É DIRETÓRIO
        if (!stats.isDirectory()) {
          fs.readFile(caminhoArquivo, "utf8", (err, conteudo) => {
            if (err) {
              console.error("Erro ao ler o arquivo:", arquivo, err);
              return;
            }
            if(arquivo == 'resultado.csv'){
                if(debug){
                    console.log('ignorando o arquivo de resultados...');
                }                
            }else{
                const linesComEspacos = conteudo.split("\n");
                const lines = linesComEspacos
                  .map((line) => line.replace(/\s+$/, ""))
                  .filter((line) => line.trim() !== "");
                const [
                  quantidadeMaquinas,
                  quantidadeTarefas,
                  quantidadeFerramentas,
                  tamanhoMagazine,
                ] = lines[0].split(" ").map(Number);
                const matrizFerramentas = [];
                for (let i = 3; i < lines.length; i++) {
                  const row = lines[i].split(" ").map(Number);
                  matrizFerramentas.push(row);
                }
                let instancia = {
                  tempoProcessamentoTarefa: lines[2].split(" ").map(Number),
                  tempoTrocaFerramenta: parseInt(lines[1]),
                  matrizFerramentas: matrizFerramentas,
                  tamanhoMagazine: tamanhoMagazine,
                  quantidadeMaquinas: quantidadeMaquinas,
                  quantidadeTarefas: quantidadeTarefas,
                  quantidadeFerramentas: quantidadeFerramentas,
                };
    
                // MÉTODO DE SOLUÇÕES ALEATÓRIAS
                try {   
                    // EXECUTE ESTE MÉTODO PARA TODAS AS INSTÂNCIAS, 10 VEZES. 
                    let media = 0;
                    let melhorResultado = 0;
                    for(let j = 0; j < 10; j++){

                        // ORDENE AS TAREFAS DE FORMA ALEATÓRIA 
                        let tempoProcessamentoTarefa = instancia.tempoProcessamentoTarefa;  
                        let tempoProcessamentoTarefaEmbaralhado = tempoProcessamentoTarefa.sort(comparaAleatoria);
                        
                        // ATRIBUA ÀS MÁQUINAS UTILIZANDO PROCESSAMENTO DE LISTA, A PRÓXIMA TAREFA VAI PARA A MÁQUINA COM O MENOR TEMPO DE PROCESSAMENTO.                 
                        const resultado = distribuirTarefas(tempoProcessamentoTarefaEmbaralhado, instancia.quantidadeMaquinas);
                        let makespan = 0;
                        for(let i = 0; i < instancia.quantidadeMaquinas; i++){
                            if(debug){
                                console.log('Máquina:',i);
                                console.log('Executando as tarefas:',resultado[i]);
                            }
                            const respostaKtns = calculoTempo(instancia,resultado[i]);
                            if(debug){
                                console.log('KTNS - Tempo total: ',respostaKtns.tempoTotal);
                            }

                            if(respostaKtns.tempoTotal > makespan){
                                makespan = respostaKtns.tempoTotal;
                            }                        
                        }
                        if(debug){
                            console.log('Instância: ', arquivo, ' rodada: ', j , ' makespan: ', makespan);
                        }

                        if(j == 0){
                            melhorResultado = makespan;
                        }else{
                            if(makespan < melhorResultado){
                                melhorResultado = makespan;
                            }
                        }
                        media = media + makespan;
                    }
                    media = (media / 10);
                    const dataAtual = new Date();
                    const horarioAtual = dataAtual.toISOString();   

                    const linha = '"' + horarioAtual + '";"' + arquivo + '";"' + media + '";"' + melhorResultado + '"';
                    fs.appendFile(destino, linha + '\n', (err) => {
                        if (err) {
                            console.error('Erro ao escrever no arquivo: ' + err);
                        }
                    });    
                } catch (error) {
                  // TRATAMENTO DE ERROS
                  console.log(error);
                }
            }
          });
        }
      });
    });
  });
}
// DEFINE O DIRETÓRIO ONDE ESTÃO AS INSTÂNCIAS E PARA ONDE VÃO
resultadosEmMassa("./instancias","./resultados/resultadoHeuristicaAleatoria.csv");


function distribuirTarefas(tarefas, numeroDeMaquinas) {
    // INICIALIZAR AS MÁQUINAS COM TEMPO DE PROCESSAMENTO ACUMULADO IGUAL A ZERO
    const maquinas = Array.from({ length: numeroDeMaquinas }, () => ({ tempoAcumulado: 0, tarefas: [] }));
    // ITERAR SOBRE AS TAREFAS E DISTRIBUÍ-LAS PARA AS MÁQUINAS
    tarefas.forEach((tempo, indice) => {
        // ENCONTRAR A MÁQUINA COM O MENOR TEMPO DE PROCESSAMENTO ACUMULADO
        const maquinaMenorTempo = maquinas.reduce((menor, atual) => (atual.tempoAcumulado < menor.tempoAcumulado ? atual : menor), maquinas[0]);
        // ATRIBUIR A TAREFA À MÁQUINA ENCONTRADA
        maquinaMenorTempo.tarefas.push({ indice, tempo });
        maquinaMenorTempo.tempoAcumulado += tempo;
    });
    return maquinas.map(maquina => maquina.tarefas.map(tarefa => tarefa.indice));
}

// FUNÇÃO DE COMPARAÇÃO ALEATÓRIA PARA USAR COM A FUNÇÃO SORT
function comparaAleatoria() {
    return Math.random() - 0.5;
}