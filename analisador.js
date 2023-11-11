const fs = require("fs");
const path = require("path");
const mysql = require('mysql2');

// CONFIGURA A CONEXÃO
const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'ipmtc',
  password : '4268@fJfe#f4e',
  database : 'ipmtc',
});

// IMPORTA FUNÇÕES
const comparador = require("./comparador");
const resolveProblema = require("./resolveProblema");
const { otimizarMetodo1, otimizarMetodo2 } = require("./otimizadores");
const { performance } = require('perf_hooks');


async function resultadosEmMassa(diretorio,destino) {
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

            // AQUI PRA BAIXO FOI COPIADO TODO O MÉTODO DE RESOLUÇÃO
            try {
              // INICIALIZA O TEMPORIZADOR
              const inicio = performance.now();

              // RESOLVE O PROBLEMA UTILIZANDO DISTRIBUIÇÃO DE TAREFAS, DEPOIS O KTNS
              let resposta = resolveProblema(instancia);

              // ARMAZENA AS TAREFAS DISTRIBUÍDAS EM UMA VARIÁVEL
              const tarefas = [];
              for (let i = 0; i < resposta.ktns.length; i++) {
                tarefas.push(resposta.ktns[i].tarefas);
              }

              // LIGA OS OTIMIZADORES;
              let otimizacaoLigada = true;
              if (otimizacaoLigada) {
                // FICA NESTE LOOP RAIZ ENQUANTO AO MENOS UM MÉTODO FOR UTILIZADO
                let loopRaiz = true;
                while (loopRaiz) {
                  // MÉTODO 01 DE OTIMIZAÇÃO
                  let loop1 = true;
                  let count1 = 0;
                  while (loop1) {
                    const backup = JSON.parse(JSON.stringify(resposta));
                    const respostaOtimizacao1 = otimizarMetodo1(
                      instancia,
                      tarefas
                    );
                    if (comparador(backup, respostaOtimizacao1)) {
                      resposta = respostaOtimizacao1;
                      tarefas.length = 0;  
                      for (
                        let i = 0;
                        i < respostaOtimizacao1.ktns.length;
                        i++
                      ) {
                        tarefas.push(respostaOtimizacao1.ktns[i].tarefas);
                      }
                    } else {
                      resposta = backup;
                      loop1 = false;
                    }
                    count1++;
                  }

                  // MÉTODO 02 DE OTIMIZAÇÃO
                  let loop2 = true;
                  let count2 = 0;
                  while (loop2) {
                    const backup = JSON.parse(JSON.stringify(resposta));
                    const respostaOtimizacao2 = otimizarMetodo2(
                      instancia,
                      tarefas
                    );
                    if (comparador(backup, respostaOtimizacao2)) {
                      resposta = respostaOtimizacao2;
                      tarefas.length = 0;  
                      for (
                        let i = 0;
                        i < respostaOtimizacao2.ktns.length;
                        i++
                      ) {
                        tarefas.push(respostaOtimizacao2.ktns[i].tarefas);
                      }
                    } else {
                      resposta = backup;
                      loop2 = false;
                    }
                    count2++;
                  }

                  // VERIFICA SE CONTINUA NO LOOPING RAIZ
                  if (count1 == 1 && count2 == 1) {
                    loopRaiz = false;
                  } else {
                    loopRaiz = true;
                  }
                }
              }
              const fim = performance.now();
              const tempoGasto = fim - inicio;
              // PREPARA O RESULTADO A SER RETORNADO
              let makespan = 0;
              for (let i = 0; i < resposta.ktns.length; i++) {
                if (resposta.ktns[i].tempoTotal > makespan) {
                  makespan = resposta.ktns[i].tempoTotal;
                }
              }
              const dataAtual = new Date();
              const horarioAtual = dataAtual.toISOString();   

              let arquivoDesmembrado = arquivo.split('_');
              const Instancia = arquivoDesmembrado[0].substring(0,300);
              const Maquinas = arquivoDesmembrado[1].slice(2).substring(0,300);
              const Tarefas = arquivoDesmembrado[2].slice(2).substring(0,300);
              const Ferramentas = arquivoDesmembrado[3].slice(2).substring(0,300);
              const Magazine = arquivoDesmembrado[4].slice(2).substring(0,300);
              const query = `SELECT * FROM resultados 
              WHERE 
                  Instancia = ? 
                  AND Maquinas = ? 
                  AND Tarefas = ? 
                  AND Ferramentas = ? 
                  AND Magazine = ? 
              ORDER BY Makespan ASC LIMIT 1`;    
              const values = [Instancia, Maquinas, Tarefas, Ferramentas, Magazine];

              let makespanBanco = 0;
              
              // EXECUTA A QUERY
              connection.query(query, values, (error, results) => {
                if (error) {
                  console.error('Erro ao executar a consulta:', error);
                } else {
                  makespanBanco = results[0].Makespan;
                  
                  // 100 x ( ( SOLUCAO - ESTADOARTE) / ESTADOARTE)
                  let gap = ( ((makespan - makespanBanco) / makespanBanco) * 100).toFixed(2);
                  // MOSTRA O RESULTADO FINAL
                  let resultado = '"' + horarioAtual + '";"' + arquivo + '";"' + makespan + '";"' + makespanBanco + '";"' + gap + '";"' + tempoGasto.toFixed(3) + '"';

                  fs.appendFile(destino, resultado + '\n', (err) => {
                    if (err) {
                      console.error('Erro ao escrever no arquivo: ' + err);
                    }
                  });
                }
              });
              return;

            } catch (error) {
              // TRATAMENTO DE ERROS
              console.log(error);
            }
          });
        }
      });
    });
  });
}
// DEFINE O DIRETÓRIO ONDE ESTÃO AS INSTÂNCIAS E PARA ONDE VÃO
resultadosEmMassa("./instancias/todas","./instancias/Resultados/resultado.csv");
