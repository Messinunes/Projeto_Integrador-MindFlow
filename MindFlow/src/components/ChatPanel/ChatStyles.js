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
  border: 3px solid #3133B8; /* Cor azul - você pode alterar para qualquer cor */
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
  padding: 12px 16px; /* Reduzido padding */
  color: white;
  border-bottom: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: var(--blue_line);
  box-shadow: 0 2px 10px rgba(49, 51, 184, 0.2);
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 16px; /* Reduzido de 18px */
  font-weight: 500;
  color: black;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px; /* Reduzido de 24px */
  color: white;
  cursor: pointer;
  padding: 4px; /* Reduzido de 5px */
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    width: 30px;
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px; /* Reduzido de 16px */
  background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#f9fafb'};
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px; /* Reduzido de 6px */
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
  margin-bottom: 8px; /* Reduzido de 12px */

  .message-content {
    max-width: 75%; /* Aumentado ligeiramente para compensar o tamanho menor */
    background-color: ${props => props.$isMine ? "#3133B8" : "#e5e7eb"};
    color: ${props => props.$isMine ? "#fff" : "#000"};
    padding: 8px 12px; /* Reduzido de 10px 14px */
    border-radius: 16px; /* Reduzido de 18px */
    border-top-right-radius: ${props => props.$isMine ? "4px" : "16px"};
    border-top-left-radius: ${props => props.$isMine ? "16px" : "4px"};
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font-size: 14px; /* Garantir tamanho de fonte consistente */
  }
`;

export const TimeStamp = styled.div`
  font-size: 9px; /* Reduzido de 10px */
  color: ${props => props.$isMine ? "rgba(255, 255, 255, 0.7)" : "#6b7280"};
  margin-top: 2px; /* Reduzido de 4px */
  text-align: right;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px; /* Reduzido de 16px */
  background-color: ${props => props.$isDarkMode ? '#1e1e1e' : 'white'};
  border-top: 1px solid #e5e7eb;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 10px 14px; /* Reduzido de 12px 16px */
  border-radius: 20px; /* Reduzido de 24px */
  border: 1px solid #d1d5db;
  outline: none;
  font-family: inherit;
  font-size: 13px; /* Reduzido de 14px */
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
  width: 40px; /* Reduzido de 44px */
  height: 40px; /* Reduzido de 44px */
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px; /* Ajustado para o novo tamanho */

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