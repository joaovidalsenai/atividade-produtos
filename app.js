import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database/db.js';
import Produto from './models/produto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

try {
  await db.sync();
  console.log('Tabela Produtos sincronizada com o banco.');
} catch (error) {
  console.error('Erro ao sincronizar tabela:', error);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.render('listarProdutos', { produtos: produtos });
  } catch (error) {
    console.log(error);
    res.send('Erro ao buscar produtos.');
  }
});

app.get('/produtos/novo', (req, res) => {
  res.render('novoProduto');
});

app.post('/produtos/salvar', async (req, res) => {
  try {
    const { nome, descricao, quantidade, valor, data } = req.body; 
   
    await Produto.create({
      nome,
      descricao,
      quantidade,
      valor,
      data: data || null
    });

    res.redirect('/produtos');

  } catch (error) {
    console.log(error);
    res.send('Erro ao cadastrar produto.');
  }
});

app.get('/produtos/editar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const produto = await Produto.findByPk(id);

    if (!produto) {
      res.send('Produto não encontrado!');
      return;
    }

    res.render('editarProduto', { produto: produto });

  } catch (error) {
    console.log(error);
    res.send('Erro ao carregar página de edição.');
  }
});

app.post('/produtos/atualizar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { nome, descricao, quantidade, valor, data } = req.body;

    await Produto.update({
      nome,
      descricao,
      quantidade,
      valor,
      data: data || null
    }, {
      where: {
        id: id
      }
    });

    res.redirect('/produtos');

  } catch (error)
 {
    console.log(error);
    res.send('Erro ao atualizar produto.');
  }
});

app.get('/', (req, res) => {
  res.redirect('/produtos');
});

app.post('/produtos/deletar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Produto.destroy({
      where: {
        id: id
      }
    });

    res.redirect('/produtos');

  } catch (error) {
    console.log(error);
    res.send('Erro ao deletar produto.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});