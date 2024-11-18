// Importando as dependências necessárias para o projeto
const express = require('express'); // Framework para criar o servidor
const mysql = require('mysql2'); // Biblioteca para conectar ao banco de dados MySQL
const bodyParser = require('body-parser'); // Middleware para processar dados JSON no corpo das requisições
const cors = require('cors'); // Middleware para permitir requisições de diferentes origens (Cross-Origin Resource Sharing)

const app = express(); // Inicializando o servidor Express
const port = 3000; // Definindo a porta que o servidor vai escutar

// Usando os middlewares
app.use(cors()); // Permite requisições de qualquer origem (útil para front-end e back-end separados)
app.use(bodyParser.json()); // Permite que o servidor entenda JSON no corpo das requisições

// Configuração de conexão ao banco de dados MySQL
const db = mysql.createConnection({
    host: '127.0.0.1', // Endereço do servidor MySQL (localhost)
    user: 'root', // Nome do usuário para autenticação no banco de dados
    password: '1234', // Senha do usuário (substitua pela sua senha real)
    database: 'pizzaria' // Nome do banco de dados (substitua pelo nome do seu banco)
});

// Tentativa de conexão com o banco de dados
db.connect((err) => {
    if (err) { // Se houver erro na conexão
        console.error('Erro ao conectar ao banco de dados:', err); // Exibe o erro no console
    } else {
        console.log('Conectado ao banco de dados MySQL'); // Caso a conexão seja bem-sucedida
    }
});

// Rota para obter todos os pedidos
app.get('/api/pedidos', (req, res) => {
    // Realizando a consulta SQL para buscar todos os pedidos na tabela 'pedidos'
    db.query('SELECT * FROM pedidos', (err, results) => {
        if (err) { // Se houver erro na consulta
            return res.status(500).json({ error: err.message }); // Retorna erro 500 com mensagem de erro
        }
        res.json(results); // Retorna os resultados (todos os pedidos) em formato JSON
    });
});

// Rota para criar um novo pedido
app.post('/api/pedidos', (req, res) => {
    // Obtendo os dados do pedido enviados no corpo da requisição
    const { borda, tamanho, sabor1, sabor2, bebida, total } = req.body;

    // Comando SQL para inserir o novo pedido na tabela 'pedidos'
    const sql = 'INSERT INTO pedidos (borda, tamanho, sabor1, sabor2, bebida, total) VALUES (?, ?, ?, ?, ?, ?)';
    
    // Executando a consulta SQL de inserção
    db.query(sql, [borda, tamanho, sabor1, sabor2, bebida, total], (err, result) => {
        if (err) { // Se ocorrer erro na inserção
            return res.status(500).json({ error: err.message }); // Retorna erro 500 com mensagem
        }
        // Retorna os dados do pedido inserido com o ID gerado automaticamente
        res.json({ id: result.insertId, borda, tamanho, sabor1, sabor2, bebida, total });
    });
});

// Rota para atualizar um pedido existente
app.put('/api/pedidos/:id', (req, res) => {
    // Obtendo o ID do pedido a ser atualizado da URL e os dados do pedido do corpo da requisição
    const { id } = req.params;
    const { borda, tamanho, sabor1, sabor2, bebida, total } = req.body;

    // Comando SQL para atualizar os dados do pedido com o ID especificado
    const sql = 'UPDATE pedidos SET borda = ?, tamanho = ?, sabor1 = ?, sabor2 = ?, bebida = ?, total = ? WHERE id = ?';
    
    // Executando a consulta SQL de atualização
    db.query(sql, [borda, tamanho, sabor1, sabor2, bebida, total, id], (err, result) => {
        if (err) { // Se houver erro na atualização
            return res.status(500).json({ error: err.message }); // Retorna erro 500 com a mensagem
        }
        res.json({ message: 'Pedido atualizado com sucesso' }); // Retorna mensagem de sucesso
    });
});

// Rota para excluir um pedido
app.delete('/api/pedidos/:id', (req, res) => {
    // Obtendo o ID do pedido a ser excluído da URL
    const { id } = req.params;

    // Comando SQL para excluir o pedido com o ID especificado
    const sql = 'DELETE FROM pedidos WHERE id = ?';
    
    // Executando a consulta SQL de exclusão
    db.query(sql, [id], (err, result) => {
        if (err) { // Se ocorrer erro na exclusão
            return res.status(500).json({ error: err.message }); // Retorna erro 500 com mensagem
        }
        res.json({ message: 'Pedido excluído com sucesso' }); // Retorna mensagem de sucesso
    });
});

// Inicializando o servidor na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`); // Exibe uma mensagem no console indicando que o servidor está ativo
});