const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const multer = require('multer'); 
const path = require('path');
const http = require('http'); 
const { Server } = require('socket.io'); 

const app = express();

// ------------------------------
// VARIAVEIS DE AMBIENTE CRUCIAIS
// ------------------------------

// 1. Porta: Usa a porta fornecida pelo Railway (PORT) ou a 3001 localmente.
const PORT = process.env.PORT || 3001; 
const httpServer = http.createServer(app);

// 2. URLs de Acesso: Railway injetará estas URLs.
// O CLIENT_URL é para o CORS/Socket.io (URL do seu Front-end).
const CLIENT_URL = process.env.CLIENT_URL || `http://localhost:5173`; 
// O SERVER_BASE_URL é a URL pública do seu próprio servidor (para uploads).
const SERVER_BASE_URL = process.env.SERVER_URL || `http://localhost:${PORT}`; 

// --- Configuração do Socket.io ---
const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL, // Agora usa a variável de ambiente
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// --- Configuração do Multer para upload de arquivos ---
// NOTA: O Railway não mantém arquivos persistentes no Free Plan.
// Se precisar de persistência, considere um serviço de armazenamento como S3 ou Cloudinary.
const uploadsDir = path.join(__dirname, 'uploads/');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- Middlewares ---
app.use(cors({
    origin: CLIENT_URL, // Agora usa a variável de ambiente
    credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use((req, res, next) => {
    next();
});

// --- Conexão MySQL (USANDO VARIÁVEIS DE AMBIENTE DO RAILWAY) ---
// Se você mapeou DB_* para MYSQL_* no painel, use DB_*. Caso contrário, use MYSQL_*.
const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,    
  password: process.env.DB_PASSWORD,    
  database: process.env.DB_DATABASE, 
  // Configuração SSL para hosts remotos (importante!)
  ssl: process.env.DB_SSL ? { rejectUnauthorized: true } : false 
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erro conectando ao MySQL:', err.code, err.message);
    return;
  }
  console.log('✅ Conectado ao MySQL!');
});


// ------------------------------
// Funções de conversão (SEM ALTERAÇÃO)
// ------------------------------

const converterTarefa = (tarefaDB) => ({
  id: `task-${tarefaDB.id}`,
  name: tarefaDB.titulo,
  description: tarefaDB.descricao,
  dueDate: tarefaDB.data_vencimento,
  priority: tarefaDB.prioridade,
  sprintId: tarefaDB.sprint_id ? `sprint-${tarefaDB.sprint_id}` : null,
  status: tarefaDB.status,
  usuarioId: tarefaDB.usuario_id
});

const converterParaMySQL = (tarefaReact, usuario_id = 1) => ({
  titulo: tarefaReact.name,
  descricao: tarefaReact.description,
  prioridade: tarefaReact.priority,
  data_vencimento: tarefaReact.dueDate,
  status: tarefaReact.status,
  sprint_id: tarefaReact.sprintId ? parseInt(tarefaReact.sprintId.replace('sprint-', '')) : null,
  usuario_id: usuario_id
});

// ------------------------------
// ROTAS DE AUTENTICAÇÃO (SEM ALTERAÇÃO E OMITIDAS PARA CONCISÃO)
// ------------------------------

// POST /register
app.post('/register', (req, res) => { /* ... código de registro ... */ });

// POST /login
app.post('/login', (req, res) => { /* ... código de login ... */ });

// POST /upload-avatar
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const { userId } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
    
    const query = 'UPDATE usuario SET avatar = ? WHERE id = ?';

    db.query(query, [filePath, userId], (err, results) => {
        if (err) {
            console.error('❌ Erro atualizando avatar no banco:', err);
            return res.status(500).json({ error: 'Erro interno ao salvar o avatar.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        
        // Usa a URL pública do servidor para o Front-end acessar a imagem
        const fullUrl = `${SERVER_BASE_URL}${filePath}`; 

        console.log(`✅ Avatar do usuário ${userId} atualizado: ${filePath}`);
        res.status(200).json({ 
            message: 'Avatar atualizado com sucesso!',
            avatarUrl: fullUrl 
        });
    });
});

// ------------------------------
// ROTAS DE TAREFAS (CRUD) E SPRINT (OMITIDAS PARA CONCISÃO)
// ------------------------------

// ... Código das rotas CRUD de Tarefas e Sprint permanece o mesmo

// ------------------------------
// ROTAS DE CHAT 
// ------------------------------

// GET /api/messages/:userId - Buscar histórico de chat
app.get('/api/messages/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = 'SELECT id, sender_type, content, file_path, sender_name, created_at FROM messages WHERE user_id = ? ORDER BY created_at ASC';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar mensagens:', err);
            return res.status(500).json({ message: 'Erro ao buscar mensagens.' });
        }
        
        const messagesWithFullUrl = results.map(msg => ({
            ...msg,
            // Usa a URL pública do servidor
            file_path: msg.file_path ? `${SERVER_BASE_URL}${msg.file_path}` : null, 
        }));
        
        res.status(200).json(messagesWithFullUrl);
    });
});

// POST /api/messages - Enviar mensagem (incluindo IA ou upload)
app.post('/api/messages', upload.single('file'), (req, res) => {
    const { user_id, sender_type, content, sender_name } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = parseInt(user_id);

    if (!userId || !sender_type || !content) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const sql = 'INSERT INTO messages (user_id, sender_type, content, file_path, sender_name) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, sender_type, content, file_path, sender_name], (err, result) => {
        if (err) {
            console.error('❌ Erro ao inserir mensagem:', err);
            return res.status(500).json({ message: 'Erro ao enviar mensagem.' });
        }

        const newMessage = {
            id: result.insertId,
            user_id: userId,
            sender_type,
            content,
            // Usa a URL pública do servidor
            file_path: file_path ? `${SERVER_BASE_URL}${file_path}` : null, 
            sender_name,
            created_at: new Date().toISOString(),
        };

        io.to(`chat-${userId}`).emit('message:new', newMessage);

        res.status(201).json({ message: 'Mensagem enviada com sucesso!', message: newMessage });
    });
});


// ------------------------------
// SOCKET.IO (COMUNICAÇÃO EM TEMPO REAL) E SPRINT (OMITIDOS PARA CONCISÃO)
// ------------------------------

// ... Código dos eventos Socket.io e rotas Sprint permanecem o mesmo

// ------------------------------
// INICIALIZAÇÃO DO SERVIDOR (DEVE SER O ÚLTIMO PASSO)
// ------------------------------

httpServer.listen(PORT, () => { 
  console.log(`🚀 Servidor rodando na porta: ${PORT}`);
});