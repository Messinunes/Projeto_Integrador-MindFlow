import styled from 'styled-components';

export const ChatPanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const ChatPanelContainer = styled.div`
  position: fixed;
  top: 50%;
  right: 20px;
  height: 60vh;
  width: 380px;
  background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#ffffff'};
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translate(${props => props.$isOpen ? '0' : '100%'}, -50%);
  transition: transform 0.3s ease-in-out;
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* Linha colorida ao redor de toda a box */
  border: 3px solid #3133B8;
`;

export const ChatPanelContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#f9fafb'};
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: white;
  border-bottom: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1.8px solid #3133B8;
  box-shadow: 0 2px 10px rgba(49, 51, 184, 0.2);
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: black;
  display: flex;
  text-align: center;
  align-items: center;
  & img {
    border-radius: 100%;
    width: 20%;
    height: auto;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  transition: transform 2s ease; /* Transição suave para a rotação */
  transform-origin: center center;

  :hover {
  transform: rotate(180deg);
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.7));
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#f9fafb'};
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const MessageBubble = styled.div`
  display: flex;
  justify-content: ${props => props.$isMine ? "flex-end" : "flex-start"};
  margin-bottom: 8px;

  .message-content {
    max-width: 75%;
    border: ${props => {
      if (props.$isMine) return "3px solid #3133B8"; // Azul para mensagens do usuário
      if (props.$isAI) return "3px solid #3133B8"; // Verde para mensagens da IA
      if (props.$isTyping) return "#F3F4F6"; // Cinza claro para "digitando"
      return "#E5E7EB"; // Cinza para outras mensagens
    }};
    color: ${props => {
      if (props.$isMine || props.$isAI) return "#black";
      if (props.$isTyping) return "#6B7280";
      return "#000000";
    }};
    padding: 8px 12px;
    border-radius: 16px;
    border-top-right-radius: ${props => props.$isMine ? "4px" : "16px"};
    border-top-left-radius: ${props => props.$isMine ? "16px" : "4px"};
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    position: relative;
  }
`;

export const TimeStamp = styled.div`
  font-size: 9px;
  color: ${props => props.$isMine ? "#6b7280" : "#6b7280"};
  margin-top: 2px;
  text-align: ${props => props.$isMine ? "right" : "left"};
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  background-color: ${props => props.$isDarkMode ? '#1e1e1e' : 'white'};
  border-top: 1px solid #e5e7eb;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 20px;
  border: 1px solid #d1d5db;
  outline: none;
  font-family: inherit;
  font-size: 13px;
  background-color: ${props => props.$isDarkMode ? '#3a3a3a' : '#f9fafb'};
  color: ${props => props.$isDarkMode ? 'white' : 'black'};

  &:focus {
    border-color: #3133B8;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const SendButton = styled.button`
  background-color: #3133B8;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background-color: #3133B8;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Img_Enviar = styled.img`
  width: 16px;
  height: 16px;
`;

