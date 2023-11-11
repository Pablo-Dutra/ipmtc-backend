const mysql = require('mysql2');
function executarSQL(query, values, res){
    // CONFIGURA A CONEXÃO
    const connection = mysql.createConnection({
      host     : process.env.HOST,
      port     : process.env.PORTA,
      user     : process.env.USUARIO,
      password : process.env.PASSWORD,
      database : process.env.DATABASE,
    });

    // EXECUTA A QUERY
    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao executar a consulta:', error);
            res.status(500).send('Erro interno do servidor');
        }else{
            res.status(200).json({RESPOSTA: results}); 
        }
    });
}
module.exports = executarSQL;