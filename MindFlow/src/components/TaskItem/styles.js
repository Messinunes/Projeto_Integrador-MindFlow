import styled, { css } from 'styled-components';

// Função para definir a cor da prioridade (as mesmas do Modal)
const getPriorityColors = (level) => {
  switch (level) {
    case 'low':
      return { background: '#0084FF', text: '#ffffffff', border: '#D9D9D9' }; // Verde claro
    case 'medium':
      return { background: '#FACC15', text: '#000000ff', border: '#D9D9D9' }; // Amarelo
    case 'high':
      return { background: '#FF0000', text: '#ffffffff', border: '#D9D9D9' }; // Vermelho claro
    default:
      return { background: '#F0F5FF', text: '#096DD9', border: '#BAE7FF' };
  }
};

export const TaskCard = styled.div`
  background-color: #ffffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
  margin-bottom: 15px;
  transition: transform 0.2s;
  
  /* Largura máxima que definimos anteriormente */
  width: 100%; 
  max-width: 450px; 

  /* 💡 MUDANÇA AQUI: Borda baseada na Prioridade */
  ${({ $priority }) => {
    const colors = getPriorityColors($priority);
    // Aplica uma borda esquerda mais grossa com a cor da prioridade
    return css`
      border-left: 5px solid ${colors.background}; 
      border-right: 2px solid ${colors.background};
      border-top: 2px solid ${colors.background};
      border-bottom: 2px solid ${colors.background};
    `;
  }}
  
  
  padding-left: 10px; 
  

  &:hover {
    transform: translateY(-2px);
    ${({ $priority }) => {
    const colors = getPriorityColors($priority);
    // Aplica uma borda esquerda mais grossa com a cor da prioridade
    return css`
      box-shadow: 0 6px 12px ${colors.background}; 
    `;
  }}
  }
`;

export const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #D9D9D9;
  word-break: break-word;

   img {
      width: 2em;
      height: 2em;
      cursor: pointer;
      }
`;

export const TaskTitle = styled.h4`
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 700;
  flex-grow: 1; /* Permite que o título ocupe o espaço */
`;

export const PriorityLabel = styled.span`
  /* Estilização baseada na prop $priority */
  ${({ $priority }) => {
    const colors = getPriorityColors($priority);
    return css`
      background-color: ${colors.background};
      color: ${colors.text};
      border: 1px solid ${colors.border};
      padding: 4px 8px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap; /* Impede quebra de linha */
      margin-left: 10px;
      width: 60%;
      text-align: center;
    `;
  }}
`;

export const TaskBody = styled.div`
  font-size: 14px;
  color: #667;
  word-break: break-word;
`;

export const TaskDetail = styled.p`
  margin: 5px 0;

  strong {
      color: #333;
      font-weight: 600;
      margin-right: 5px;
  }
`;

export const TaskTitleBody = styled.div`
  width: 100%;
  display: flex;
  align-items: center; /* Garante alinhamento vertical central para os filhos diretos */
  
  & > :first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;