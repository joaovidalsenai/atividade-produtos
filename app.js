import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database/db.js';
import Produto from './models/produto.js';

// Configurações para resolver __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Sincroniza o modelo com o banco de dados
try {
  await db.sync();
  console.log('Tabela Produtos sincronizada com o banco.');
} catch (error) {
  console.error('Erro ao sincronizar tabela:', error);
}

// Configura o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para ler dados de formulário (POST)
app.use(express.urlencoded({ extended: true }));

// --- ROTAS ---

// Rota principal: Listar Produtos
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
    // Adicionado 'nome' na desestruturação
    const { nome, descricao, quantidade, valor, data } = req.body; 
    
    // Cria o novo produto no banco
    await Produto.create({
      nome, // Adicionado aqui
      descricao,
      quantidade,
      valor,
      data: data || null
    });

    // Ao cadastrar, retorna para a página de listar produtos
    res.redirect('/produtos');

  } catch (error) {
    console.log(error);
    res.send('Erro ao cadastrar produto.');
  }
});

app.get('/produtos/editar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Busca o produto pelo ID (Primary Key)
    const produto = await Produto.findByPk(id);

    if (!produto) {
      res.send('Produto não encontrado!');
      return;
    }

    // Renderiza a nova view de edição, passando os dados do produto
    res.render('editarProduto', { produto: produto });

  } catch (error) {
    console.log(error);
    res.send('Erro ao carregar página de edição.');
  }
});

// Rota para PROCESSAR a atualização (recebe o POST do formulário de edição)
app.post('/produtos/atualizar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Pega os novos dados do corpo da requisição
    const { nome, descricao, quantidade, valor, data } = req.body;

    // Atualiza o produto no banco de dados
    await Produto.update({
      nome,
      descricao,
      quantidade,
      valor,
      data: data || null // Garante que data vazia seja salva como NULL
    }, {
      where: {
        id: id // Onde o ID for igual ao ID da URL
      }
    });

    // Redireciona de volta para a lista de produtos
    res.redirect('/produtos');

  } catch (error)
 {
    console.log(error);
    res.send('Erro ao atualizar produto.');
  }
});

// Redireciona a raiz '/' para '/produtos'
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