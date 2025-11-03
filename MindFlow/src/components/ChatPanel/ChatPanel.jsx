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

const socket = io("http://localhost:3001");

const ChatPanel = ({ open, onClose, isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      socket.on("chatHistory", (msgs) => setMessages(msgs));
      socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));

      return () => {
        socket.off("chatHistory");
        socket.off("receiveMessage");
      };
    }
  }, [open]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    socket.emit("sendMessage", input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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
            <HeaderTitle>Chat</HeaderTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ChatHeader>
          
          <MessagesContainer $isDarkMode={isDarkMode}>
            {messages.map((msg, idx) => {
              const isMine = msg.id === socket.id;
              return (
                <MessageBubble key={idx} $isMine={isMine}>
                  <div className="message-content">
                    {msg.text}
                    <TimeStamp $isMine={isMine}>
                      {new Date(msg.time || Date.now()).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TimeStamp>
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
              placeholder="Digite uma mensagem..."
              $isDarkMode={isDarkMode}
            />
            <SendButton onClick={sendMessage}>
              <Img_Enviar src="src\assets\enviar.png" alt="Enviar" />
            </SendButton>
          </InputContainer>
        </ChatPanelContent>
      </ChatPanelContainer>
    </>
  );
};

export default ChatPanel;