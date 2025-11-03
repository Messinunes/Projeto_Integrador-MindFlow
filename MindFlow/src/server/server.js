const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuração genérica do MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "usuario",
    password: "senha",
    database: "chat_app"
});

// Conectar ao banco
db.connect(err => {
    if (err) throw err;
    console.log("Conectado ao MySQL!");
});

// Middleware para servir arquivos estáticos
app.use(express.static("public"));

// Rota para buscar histórico de um usuário
app.get("/history/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query(
        "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC",
        [userId],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        }
    );
});

// Socket.io
io.on("connection", socket => {
    console.log("Usuário conectado: " + socket.id);

    // Receber mensagem
    socket.on("sendMessage", ({ userId, message }) => {
        // Salvar no banco
        db.query(
            "INSERT INTO messages (user_id, message) VALUES (?, ?)",
            [userId, message],
            (err, result) => {
                if (err) return console.log(err);
                // Enviar a todos os clientes conectados
                io.emit("receiveMessage", { userId, message, id: result.insertId });
            }
        );
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado: " + socket.id);
    });
});

// Iniciar servidor
server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
