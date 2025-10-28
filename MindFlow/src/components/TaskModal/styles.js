import styled, { css } from 'styled-components';

// ==========================================================
// 1. ESTILOS DO MODAL E OVERLAY
// ==========================================================

export const ModalOverlay = styled.div`
  
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; 
  
  
  background-color: rgba(0, 0, 0, 0.6); 
  
  
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 450px; 
  position: relative;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;

  &:hover {
    color: #555;
  }
`;

export const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
`;

// ==========================================================
// 2. ESTILOS DO FORMULÁRIO E INPUTS
// ==========================================================

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #5a52d9; 
    outline: none;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  resize: vertical; 

  &:focus {
    border-color: #5a52d9; 
    outline: none;
  }
`;

export const SaveButton = styled.button`
  
  background-color: #5a52d9; 
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 15px;

  &:hover {
    background-color: #4b45b5; 
  }
`;

// ==========================================================
// 3. ESTILOS DE PRIORIDADE 
// ==========================================================


const getPriorityColors = (level) => {
  switch (level) {
    case 'low':
      return { background: '#D9F7BE', text: '#52C41A', border: '#B7EB8F' }; 
    case 'medium':
      return { background: '#FFF7AE', text: '#FAAD14', border: '#FFE58F' }; 
    case 'high':
      return { background: '#FFDAD8', text: '#F5222D', border: '#FFA39E' }; 
    default:
      return { background: '#E6F7FF', text: '#1890FF', border: '#BAE7FF' };
  }
};

export const PriorityOptions = styled.div`
  display: flex;
  gap: 10px; 
  margin-top: 5px;
`;

export const PriorityButton = styled.button`
  
  ${(props) => {
    const colors = getPriorityColors(props.$level);
    return css`
      background-color: ${colors.background};
      color: ${colors.text};
      border: 1px solid ${colors.border};
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      
      
      opacity: 0.6;

      
      &:hover {
        opacity: 0.8;
      }

      
      ${props.$isActive && css`
        opacity: 1; 
        box-shadow: 0 0 0 2px ${colors.text}; 
        transform: translateY(-1px);
      `}
    `;
  }}
`;