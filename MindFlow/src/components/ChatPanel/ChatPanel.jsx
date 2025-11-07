import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  ChatPanelOverlay,
  ChatPanelContainer,
  ChatPanelContent,
  ChatHeader,
  HeaderTitle,
  CloseButton,
  MessagesContainer,
  MessageBubble,
  InputContainer,
  MessageInput,
  SendButton,
  TimeStamp,
  Img_Enviar
} from "./ChatStyles.js";

// A URL do servidor Socket.IO (pode ser removida se o chat for SÓ IA)
// MANTEMOS A LINHA DE CÓDIGO AQUI, MAS O CÓDIGO ABAIXO NÃO VAI MAIS EMITIR.
const socket = io("http://localhost:3001");

const ChatPanel = ({ open, onClose, isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const messagesEndRef = useRef(null);

  // A CHAVE E A URL DEVEM SER GERENCIADAS PELO SERVIDOR!
  // ...
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;


  // ⚠️ IMPORTANTE: Removemos os listeners de socket, pois o chat é agora LOCAL com a IA.
  // Se você quiser que o chat seja SOMENTE IA, mas ainda use o histórico do servidor,
  // mantenha APENAS o socket.on("chatHistory")

  useEffect(() => {
    if (open) {
      // socket.on("chatHistory", (msgs) => setMessages(msgs)); // Removido
      // socket.on("receiveMessage", (msg) => { ... }); // Removido

      return () => {
        // socket.off("chatHistory"); // Removido
        // socket.off("receiveMessage"); // Removido
      };
    }
  }, [open]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callGeminiAPI = async (userMessage) => {
    
    // Verificação da chave de API (MANTIDA)
    if (!GEMINI_API_KEY) {
        console.error("Erro de Configuração: VITE_GEMINI_API_KEY não está definida.");
        return "⚠️ Erro de Configuração: A chave de API não foi encontrada. Verifique seu arquivo .env e REINICIE o servidor.";
    }

    try {
      setIsAILoading(true);
      console.log("Enviando mensagem para Gemini:", userMessage);

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: userMessage },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ],
        }),
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro detalhado:", errorText);

        // Códigos de erro (MANTIDOS)
        if (response.status === 400) return "⚠️ Erro de requisição (400). Verifique se sua CHAVE DE API é válida e se a API Gemini está ativada no seu painel Google.";
        if (response.status === 404) return "⚠️ Modelo ou URL da API incorretos. Verifique o endpoint.";
        if (response.status === 429) return "⚠️ Limite de requisições excedido. Tente novamente mais tarde.";
        if (response.status === 403) return "⚠️ Acesso negado. Chave de API inválida ou sem permissão.";
        if (response.status >= 500) return "⚠️ Erro no servidor da IA. Tente novamente em alguns instantes.";

        throw new Error(`Erro ${response.status}: Não foi possível conectar com a IA`);
      }

      const data = await response.json();
      console.log("Resposta completa da API:", data);

      // Verificação de estrutura de resposta (MANTIDA)
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback?.blockReason) {
        return `⚠️ Sua mensagem foi bloqueada por conter conteúdo inadequado. Motivo: ${data.promptFeedback.blockReason}`;
      } else {
        console.error("Estrutura de resposta inesperada ou conteúdo vazio:", data);
        return "🤖 Olá! Recebi sua mensagem mas tive um problema técnico na resposta da IA. Pode reformular?";
      }
    } catch (error) {
      console.error("Erro ao chamar Gemini API:", error);
      if (error.message.includes("Failed to fetch")) {
        return "🌐 Erro de conexão. Verifique sua internet ou se o serviço da IA está online.";
      }
      return `❌ Erro: ${error.message}`;
    } finally {
      setIsAILoading(false);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "" || isAILoading) return;

    const userMessage = input.trim();
    const now = Date.now();

    // 1. Adiciona mensagem do usuário
    const userMsgObj = {
      id: socket.id,
      text: userMessage,
      time: now,
      type: "user",
    };

    // Adiciona mensagem do usuário localmente
    setMessages((prev) => [...prev, userMsgObj]);
    setInput("");

    // ⚠️ LINHA REMOVIDA: socket.emit("sendMessage", userMsgObj);
    // Não enviamos mais para o chat multiusuário, apenas para a IA.

    // 2. REMOVEMOS O BLOCO 'if (lowerMessage.startsWith("@ai") ...)'
    // e executamos a lógica da IA diretamente.

    // Adiciona mensagem de "digitando..."
    const typingMsg = {
      id: "ai",
      text: "🤖 AI está pensando...",
      time: now + 1,
      type: "ai_typing",
    };

    setMessages((prev) => [...prev, typingMsg]);

    // Chama a API do Gemini
    const aiResponse = await callGeminiAPI(userMessage); // <--- Passamos a mensagem inteira aqui
    
    const aiMsgTime = Date.now();
    
    // Remove a mensagem de "digitando" e adiciona a resposta
    setMessages((prev) => {
      // Filtra a mensagem de 'ai_typing'
      const filtered = prev.filter(
        (msg) => msg.type !== "ai_typing"
      );
      
      const aiMsgObj = {
        id: "ai",
        text: aiResponse,
        time: aiMsgTime,
        type: "ai",
      };
      
      return [...filtered, aiMsgObj];
    });

    // ⚠️ LINHA REMOVIDA: socket.emit("sendMessage", aiMsgObj);
    // Não enviamos a resposta da IA para outros usuários, pois é um chat local.
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isAILoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) return null;

  return (
    <>
      <ChatPanelOverlay onClick={onClose} />
      <ChatPanelContainer $isOpen={open} $isDarkMode={isDarkMode}>
        <ChatPanelContent $isDarkMode={isDarkMode}>
          <ChatHeader $isDarkMode={isDarkMode}>
            <HeaderTitle>Chat + AI</HeaderTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ChatHeader>

          <MessagesContainer $isDarkMode={isDarkMode}>
            {messages.map((msg, idx) => {
              const isMine = msg.id === socket.id;
              const isAI = msg.id === "ai";
              const isSystem = msg.type === "system";

              return (
                <MessageBubble
                  key={idx}
                  $isMine={isMine}
                  $isAI={isAI}
                  $isSystem={isSystem}
                  $isTyping={msg.type === "ai_typing"}
                  style={isSystem ? { textAlign: 'center', margin: '5px auto', padding: '5px 10px', maxWidth: '80%', backgroundColor: isDarkMode ? '#333' : '#eee', color: isDarkMode ? '#ccc' : '#666', borderRadius: '10px' } : {}}
                >
                  <div className="message-content">
                    {msg.type === "ai_typing" ? (
                      <div style={{ fontStyle: "italic", color: isDarkMode ? "#ccc" : "#666" }}>
                        {msg.text}
                      </div>
                    ) : (
                      <>
                        {msg.text}
                        {!isSystem && (
                            <TimeStamp $isMine={isMine} $isAI={isAI}>
                                {new Date(msg.time || Date.now()).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </TimeStamp>
                        )}
                      </>
                    )}
                  </div>
                </MessageBubble>
              );
            })}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer $isDarkMode={isDarkMode}>
            <MessageInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAILoading
                  ? "AI está processando..."
                  : "Converse com o Chat..." // Placeholder atualizado
              }
              $isDarkMode={isDarkMode}
              disabled={isAILoading}
            />
            <SendButton onClick={sendMessage} disabled={isAILoading || input.trim() === ""}>
              <Img_Enviar
                src="src/assets/enviar.png"
                alt="Enviar"
                style={{ opacity: isAILoading || input.trim() === "" ? 0.5 : 1, cursor: isAILoading || input.trim() === "" ? 'not-allowed' : 'pointer' }}
              />
            </SendButton>
          </InputContainer>

          {/* Instruções de uso - REMOVIDO OU ATUALIZADO */}
{/*           <div
            style={{
              padding: "8px 16px",
              fontSize: "12px",
              color: isDarkMode ? "#ccc" : "#666",
              borderTop: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
              textAlign: "center",
            }}
          >
          </div> */}
        </ChatPanelContent>
      </ChatPanelContainer>
    </>
  );
};

export default ChatPanel;
