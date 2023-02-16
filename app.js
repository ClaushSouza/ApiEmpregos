const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Listagem de todas as vagas abertas - emprego, estágio ou freelancer
app.get('/vagas', async (req, res) => {
  try {
      const conn = await pool.getConnection();
      const [rows, fields] = await conn.query('SELECT * FROM vagas WHERE encerrada = 0');
      conn.release();
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar vagas');
  }
});

// Listagem das vagas abertas
app.get('/vagas/abertas', async (req, res) => {
  try {
      const conn = await pool.getConnection();
      const [rows, fields] = await conn.query('SELECT * FROM vagas WHERE encerrada = 0');
      conn.release();
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar vagas');
  }
});

// Listagem das vagas encerradas
app.get('/vagas/encerradas', async (req, res) => {
  try {
      const conn = await pool.getConnection();
      const [rows, fields] = await conn.query('SELECT * FROM vagas WHERE encerrada = 1');
      conn.release();
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar vagas');
  }
});

// Cadastrar novas oportunidades de emprego, estágio ou freelancer
app.post('/vagas', async (req, res) => {
  try {
      const { titulo, descricao, tipo, localizacao } = req.body;
      const conn = await pool.getConnection();
      const query = 'INSERT INTO vagas (titulo, descricao, tipo, localizacao) VALUES (?, ?, ?, ?)';
      const values = [titulo, descricao, tipo, localizacao];
      const [result] = await conn.query(query, values);
      conn.release();
      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao cadastrar vaga');
  }
});

// Excluir vagas - emprego, estágio ou freelancer
app.delete('/vagas/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const conn = await pool.getConnection();
      const query = 'DELETE FROM vagas WHERE id = ?';
      const [result] = await conn.query(query, id);
      conn.release();
      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao excluir vaga');
  }
});

// Alterar informações de vagas
app.put('/vagas/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { titulo, descricao, tipo, localizacao, encerrada } = req.body;
      const conn = await pool.getConnection();
      const query = 'UPDATE vagas SET titulo = ?, descricao = ?, tipo = ?, localizacao = ?, encerrada = ? WHERE id = ?';
      const values = [titulo, descricao, tipo, localizacao, encerrada, id];
      const [result] = await conn.query(query, values);
      conn.release();
      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao atualizar vaga');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}.`);
});
