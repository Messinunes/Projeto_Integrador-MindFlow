import styled, {keyframes, css } from 'styled-components';


export const HomeBody = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden; 
`;

export const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr; 
  grid-template-rows: 70px 1fr;   
  height: 100%;
  width: 100%;
  background-color: ${props => getThemeColors(props.$isDarkMode).background}; 
    color: ${props => getThemeColors(props.$isDarkMode).text};
    transition: background-color 0.3s, color 0.3s;
`;

const moveGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%; 
  }
`;

// Função para retornar as cores baseadas no tema
const getThemeColors = (isDark) => ({
    // Cores Principais
    primary: isDark ? '#8a78ff' : '#5a52d9',
    
    // Fundo
    background: isDark ? '#121212' : '#f0f2f5',   // Fundo da Tela
    sidebarBg: isDark ? '#1e1e1e' : '#ffffff',   // Fundo da Sidebar e Painel
    contentBg: isDark ? '#2c2c2c' : '#ffffff',   // Fundo das Áreas de Conteúdo
    
    // Texto
    text: isDark ? '#ffffff' : '#333333',
    textSecondary: isDark ? '#bbbbbb' : '#666666',
    
    // Borda/Separador
    border: isDark ? '#333333' : '#e0e0e0',
});

export const AnimatedBorder = styled.div`
  
  position: absolute;
  bottom: 0; 
  left: 0;
  width: 100%; 
  height: 5px; 
    
  background: linear-gradient(
    to right,
    #fefeffff,
    #000000ff, 
    #5a52d9,
    #fefeffff 
  );
  
  background-size: 200% 50%; 
  animation: ${moveGradient} 4s linear infinite alternate;
`;

export const TopBar = styled.header`
  grid-column: 1 / 3; 
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: ${props => getThemeColors(props.$isDarkMode).sidebarBg};
  border-bottom: none;
  transition: background-color 0.3s, border-color 0.3s;
  position: relative;
`;

export const Logo = styled.img`
  height: 140px;
  width: auto;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

export const AddButton = styled.button`
  color: white;
  background-color: #5a52d9;
  border: solid 2px #5a52d9;
  border-radius: 100%;
  padding: 10px 16px;
  cursor: pointer;
  
  transition: border-color 0.3s ease, transform 0.2s ease; 
  &:hover {
    border-style: inset;
    border-color: #60227cff; 
    
  }
`;

export const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

export const Sidebar = styled.nav`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  background-color: ${props => getThemeColors(props.$isDarkMode).sidebarBg};
  border-right: 1px solid ${props => getThemeColors(props.$isDarkMode).border};
  transition: background-color 0.3s, border-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  gap: 25px;
`;

export const SidebarLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px; 
  
  img {
    width: 25px; 
    height: 25px;
  }
  
  background-color: transparent;
  
  ${props => props.$isActive && css`
    background-color: #e6eefe; 
    border: 1px solid #b3c5ff; 
  `}

  &:hover {
        background-color: ${props => props.$isDarkMode ? '#3a3a3a' : '#f0f0ff'};
        color: ${props => getThemeColors(props.$isDarkMode).primary};
    }
`;

export const ContentArea = styled.main`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  padding: 24px;
  overflow-y: auto; 
`;

export const DashboardContainer = styled.div`
  /* Estilos específicos para o container azul das tarefas, se for a seção ativa */
`;

export const SectionTask = styled.section`
    display: flex;
    align-items: center;
    gap: 16px;

    & h2 {
    font-family: "Geist", sans-serif;
    font-size: 2.5em;
    font-weight: 100;
    color: #28209bff;
    }
`;

// src/pages/Dashboard/styles.js

// ... (seus outros exports, como TopBar, Sidebar, etc.) ...

// Estilo para o contêiner que envolve todos os cartões de tarefas
export const TaskListContainer = styled.div`
    /* Garante que o contêiner das colunas comece abaixo do cabeçalho */
    
    
    /* Layout horizontal das colunas */
    display: flex;
    flex-direction: row; 
    align-items: flex-start; 
    gap: 15px; 
    
    overflow-x: auto; 
      overflow-y: hidden;
    flex-wrap: nowrap;
    
    /* Adiciona padding lateral para que as colunas não se sobreponham ao botão flutuante */
    padding-left: 10px; /* Deve ser igual ou maior que a largura do AddButton */
    padding-bottom: 20px; 
`;

export const KanbanHeader = styled.div`
    display: flex;
    align-items: center;
    /* Ajuste de margem se necessário */
    margin-bottom: 20px; 
    
    h2 { /* Estilo para o título do Quadro Kanban */
        margin-left: 20px;
        font-size: 24px;
        color: #333;
    }
`;

export const SprintList = styled.div`
    position: absolute; /* Ou ajuste a posição conforme o layout desejado */
    top: 100px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    background-color: #f7f7f7;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 50; /* Garante que fique acima da área de conteúdo, mas abaixo do modal */
`;

export const SprintItem = styled.div`
    padding: 8px 12px;
    background-color: #5a52d9;
    color: white;
    border-radius: 6px;
    font-size: 0.85em;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s, transform 0.1s;
    white-space: nowrap;

    &:hover {
        background-color: #4841b5;
        transform: translateY(-1px);
    }
`;  

// --- NOVOS ESTILOS PARA O PAINEL DE CONTROLE (Panel) ---

export const PanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    height: 100%; /* Ocupa a altura total da ContentArea */
`;

export const ChartWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 800px; /* Limita a largura do gráfico */
    margin: 30px 0;
`;

export const ChartArea = styled.div`
    flex-grow: 1;
    height: 450px; /* Altura fixa para todos os gráficos */
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 36px;
    color: #5a52d9;
    cursor: pointer;
    padding: 10px;
    transition: transform 0.2s, color 0.2s;
    user-select: none; /* Evita seleção de texto ao clicar */
    
    &:hover {
        color: #4841b5;
        transform: scale(1.1);
    }
`;

// --- ESTILOS PARA O BACKLOG (ComponentList) ---

export const BacklogContainer = styled.div`
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    height: 100%;
    overflow-y: auto; 
    
    h2 {
        color: #333;
        margin-bottom: 20px;
        border-bottom: 2px solid #ddd;
        padding-bottom: 10px;
    }
`;

export const TaskList = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
`;

export const TaskHeader = styled.div`
    /* Ajuste as colunas para incluir a nova coluna "Ordem" */
    display: grid;
    grid-template-columns: 0.5fr 2.5fr 1.5fr 1fr 1.5fr 1fr; /* Ordem, Nome, Sprint, Prioridade, Vencimento, Ações */
    background-color: #5a52d9;
    color: white;
    padding: 12px 15px;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    text-transform: uppercase;
    font-size: 0.85em;
    cursor: grab; /* Indica que o header também pode ser o handle de arraste */
`;

export const TaskRow = styled.div`
    /* Ajuste as colunas para incluir a nova coluna "Ordem" */
    display: grid;
    grid-template-columns: 0.5fr 2.5fr 1.5fr 1fr 1.5fr 1fr;
    padding: 15px 15px;
    background-color: ${props => props.$isDragging ? '#e6f7ff' : 'white'}; /* Fundo claro ao arrastar */
    border-bottom: 1px solid #eee;
    align-items: center;
    font-size: 0.9em;
    cursor: grab; /* Adiciona cursor de arrastar */
    box-shadow: ${props => props.$isDragging ? '0 4px 10px rgba(0, 0, 0, 0.1)' : 'none'};

    &:last-child {
        border-bottom: none;
        border-radius: 0 0 5px 5px;
    }
    &:hover {
        background-color: #f0f0ff;
    }
`;

export const TaskName = styled.div`
    font-weight: 500;
    color: #333;
`;

// Estilo condicional para a prioridade
export const TaskPriority = styled.div`
    padding: 4px 8px;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
    font-size: 0.8em;
    width: fit-content;

    background-color: ${props => {
        switch (props.priority) {
            case 'high': return '#FFDAD8';
            case 'medium': return '#FFF7AE';
            case 'low': return '#D9F7BE';
            default: return '#eee';
        }
    }};
    color: ${props => {
        switch (props.priority) {
            case 'high': return '#F5222D';
            case 'medium': return '#FAAD14';
            case 'low': return '#52C41A';
            default: return '#666';
        }
    }};
`;

export const ActionButton = styled.button`
    padding: 6px 10px;
    background-color: #5a52d9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s;

    &:hover {
        background-color: #4841b5;
    }
`;

export const TaskSprintSelect = styled.select`
    padding: 6px 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    font-size: 0.9em;
    cursor: pointer;
    width: 95%; /* Garante que caiba bem no grid */
    transition: border-color 0.2s;

    &:hover {
        border-color: #5a52d9;
    }
`;

// =========================================================================
// 6. PAINEL DE CONFIGURAÇÕES DE USUÁRIO
// =========================================================================

export const SettingsPanelContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 300px; /* Largura do painel */
    height: 100vh;
    background-color: ${props => getThemeColors(props.$isDarkMode).sidebarBg};
    box-shadow: -4px 0 10px ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)'};
    z-index: 1000; /* Garante que fique acima de tudo */
    transition: transform 0.3s ease-in-out;

    /* Controle de visibilidade */
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    
    display: flex;
    flex-direction: column;

    h3 {
        color: ${props => getThemeColors(props.$isDarkMode).text};
        margin: 0;
    }
`;

export const SettingsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
    background-color: #f7f9fc;
    
    h3 {
        color: #333;
        margin: 0;
    }
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 30px;
    line-height: 1;
    cursor: pointer;
    color: #999;
    transition: color 0.2s;

    &:hover {
        color: #5a52d9;
    }
`;

export const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
    
    ${Avatar} { /* Reutiliza o estilo do Avatar, mas ajusta o tamanho se necessário */
        height: 80px;
        width: 80px;
        margin-bottom: 10px;
    }
    
    p {
        font-size: 0.9em;
        color: #666;
    }
`;

export const SettingsList = styled.div`
    flex-grow: 1;
    padding: 10px 0;
`;

export const SettingsItem = styled.div`
    padding: 15px 20px;
    cursor: pointer;
    color: ${props => getThemeColors(props.$isDarkMode).text};
    font-size: 1em;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.$isDarkMode ? '#3a3a3a' : '#f0f0ff'};
        color: ${props => getThemeColors(props.$isDarkMode).primary};
    }
`;

// =========================================================================
// BOTÕES FLUTUANTES
// =========================================================================

export const FloatingButtonsContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 999;
`;

export const FloatingButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 14px;
  
  /* Cor baseada no tipo de botão */
  background-color: ${props => props.$type === 'task' ? '#3133B8' : '#3133B8'};
  color: white;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    
    /* Efeito de brilho no hover */
    background-color: ${props => props.$type === 'task' ? '#3133B8' : '#3133B8'};
  }

  &:active {
    transform: translateY(-1px);
  }
`;

export const FloatingButtonIcon = styled.img`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 24px;
`;
