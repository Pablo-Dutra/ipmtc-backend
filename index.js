// IMPORTA BANCO DE DADOS
const executaSQL = require('./executaSQL');

// VARIÁVEIS DE AMBIENTE
const dotenv = require('dotenv');

// IMPORTA FRAMEWORK EXPRESS PARA NODE JS;
const express = require('express');  
const app = express();  

// UTILIZAR O PADRÃO JSON NO EXPRESS;
app.use( express.json() );

// UTILIZAR O CORS;  
const cors = require('cors'); 
app.use( cors() );  

dotenv.config();
const fs = require('fs'); 

// IMPORTA FUNÇÕES
const calculoTempo = require('./calculoTempo');
const comparador = require('./comparador');
const distribuiTarefas = require('./distribuiTarefas');
const resolveProblema = require('./resolveProblema');
const { otimizarMetodo1, otimizarMetodo2 } = require('./otimizadores');

// INICIAR O SERVIDOR
app.listen(process.env.PORTA, process.env.IP);
console.log('API está rodando no endereço http://' + process.env.IP + ':' + process.env.PORTA + '/');

// ROTA TAREFAS
app.post("/distribuiTarefas", async (req, res) => {
    try {
        const qtdMaquinas = req.body.qtdMaquinas;
        const tarefas = req.body.tarefas;
        const resposta = distribuiTarefas(qtdMaquinas, tarefas);
        res.send( { TAREFAS: resposta } );
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// ROTA KTNS
app.post("/ktns", async (req, res) => {
    try {
        const instancia = {
            tempoProcessamentoTarefa: req.body.tempoProcessamentoTarefa,
            matrizFerramentas: req.body.matrizFerramentas,
            tamanhoMagazine: req.body.tamanhoMagazine,
            tempoTrocaFerramenta: req.body.tempoTrocaFerramenta
        };
        const tarefas = req.body.tarefas;
        const resposta = calculoTempo(instancia,tarefas);
        res.send( { KTNS: resposta } );
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// BUSCA O MELHOR RESULTADO DA LITERATURA PARA AS INSTANCIAS CONHECIDAS
app.post('/instancias', (req, res) => {
    const Instancia = req.body.Instancia.substring(0,300);
    const Maquinas = req.body.Maquinas.substring(0,300);
    const Tarefas = req.body.Tarefas.substring(0,300);
    const Ferramentas = req.body.Ferramentas.substring(0,300);
    const Magazine = req.body.Magazine.substring(0,300);
    const query = `SELECT * FROM resultados 
    WHERE 
        Instancia = ? 
        AND Maquinas = ? 
        AND Tarefas = ? 
        AND Ferramentas = ? 
        AND Magazine = ? 
    ORDER BY Makespan ASC LIMIT 1`;    
    const values = [Instancia, Maquinas, Tarefas, Ferramentas, Magazine];
    executaSQL(query, values, res);    
});


// ROTA RESOLVE PROBLEMA
app.post("/resolveProblema", async (req, res) => {
    try {
        // MOSTRA INFORMAÇÕES NO CONSOLE
        const debug = true;

        // RECEBE A INSTANCIA COMO PARÂMETRO DE ENTRADA
        const instancia = req.body.parametrosEntrada;
        // RESOLVE O PROBLEMA UTILIZANDO DISTRIBUIÇÃO DE TAREFAS, DEPOIS O KTNS
        let resposta = resolveProblema(instancia);

        // ARMAZENA AS TAREFAS DISTRIBUÍDAS EM UMA VARIÁVEL
        let tarefas = [];
        for(let i = 0; i < resposta.ktns.length; i++){ 
            tarefas.push(resposta.ktns[i].tarefas); 
        }
        if(debug){
            console.log('RESPOSTAS SEM OTIMIZAÇÃO');
            for(let i = 0; i < resposta.ktns.length; i++){
                    console.log('Tempo:',resposta.ktns[i].tempoTotal);
                    console.log(resposta.ktns[i].tarefas);    
            }
        }

        // LIGA OS OTIMIZADORES;
        let otimizacaoLigada = true;
        if(otimizacaoLigada){

            // FICA NESTE LOOP RAIZ ENQUANTO AO MENOS UM MÉTODO FOR UTILIZADO
            let loopRaiz = true;
            while(loopRaiz){

                // MÉTODO 01 DE OTIMIZAÇÃO
                let loop1 = true;
                let count1 = 0;
                while(loop1){
                    const backup = JSON.parse(JSON.stringify(resposta));
                    const respostaOtimizacao1 = otimizarMetodo1(instancia,tarefas);
                    if(comparador(backup,respostaOtimizacao1)){
                        if(debug){
                            console.log('RESPOSTAS OTIMIZAÇÃO: ',count1);
                            for(let i = 0; i < respostaOtimizacao1.ktns.length; i++){
                                console.log('Tempo:',respostaOtimizacao1.ktns[i].tempoTotal);
                                console.log(respostaOtimizacao1.ktns[i].tarefas);
                            }    
                        }                   
                        resposta = respostaOtimizacao1;
                        tarefas.length = 0;                
                        for(let i = 0; i < respostaOtimizacao1.ktns.length; i++){ 
                            tarefas.push(respostaOtimizacao1.ktns[i].tarefas); 
                        }
                    }else{
                        if(debug){
                            console.log('FIM DA OTIMIZAÇÃO #1 COM: ',count1,' LOOPS');
                        }                        
                        resposta = backup;
                        loop1 = false;
                    }
                    count1++;
                }

                // MÉTODO 02 DE OTIMIZAÇÃO
                let loop2 = true;
                let count2 = 0;
                while(loop2){
                    const backup = JSON.parse(JSON.stringify(resposta));
                    const respostaOtimizacao2 = otimizarMetodo2(instancia,tarefas);
                    if(comparador(backup,respostaOtimizacao2)){
                        if(debug){
                            console.log('RESPOSTAS OTIMIZAÇÃO: ',count2);
                            for(let i = 0; i < respostaOtimizacao2.ktns.length; i++){
                                console.log('Tempo:',respostaOtimizacao2.ktns[i].tempoTotal);
                                console.log(respostaOtimizacao2.ktns[i].tarefas);
                            }    
                        }
                        resposta = respostaOtimizacao2; 
                        tarefas.length = 0;                                                       
                        for(let i = 0; i < respostaOtimizacao2.ktns.length; i++){ 
                            tarefas.push(respostaOtimizacao2.ktns[i].tarefas); 
                        }
                    }else{
                        if(debug){
                            console.log('FIM DA OTIMIZAÇÃO #2 COM: ',count2,' LOOPS');
                        }
                        resposta = backup;
                        loop2 = false;
                    }
                    count2++;
                }

                // VERIFICA SE CONTINUA NO LOOPING RAIZ
                if((count1 == 1) && (count2 == 1)){
                    if(debug){
                        console.log('Saindo do loop raiz...');
                    }                    
                    loopRaiz = false;
                }else{
                    if(debug){                    
                        console.log('Permanece no loop raiz...');
                    }
                    loopRaiz = true;
                }

            }
                        
        }


        // PREPARA O RESULTADO A SER RETORNADO
        const respostaPadronizada = [];
        for(let i = 0; i < resposta.ktns.length; i++){
            respostaPadronizada[i] = (resposta.ktns[i].qtdTrocas + ' ' + resposta.ktns[i].tempoTotal + ' ' + resposta.ktns[i].tarefas);
        }                
        // RETORNA AO FRONTEND
        res.send(respostaPadronizada);
    } catch (error) {
        // TRATAMENTO DE ERROS
        console.log(error);
        res.sendStatus(500);
    }
});

// ROTA PARA TER ACESSO AOS DOWNLOADS
app.get('/download', (req, res) => {    
    const fileName = req.query.file;
    const filePath = 'files/' + fileName;
    res.setHeader('Content-Type', '*');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
});