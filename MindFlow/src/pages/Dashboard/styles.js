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
`;

const moveGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%; 
  }
`;

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
  background-color: #ffffffff;
  border-bottom: none;
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
  
  background-color: #5a52d9;
  border: solid 2px #5a52d9;
  border-radius: 100%;
  padding: 10px 16px;
  cursor: pointer;
  
  transition: border-color 0.3s ease, transform 0.2s ease; 
  &:hover {
    border-style: inset;
    border-color: #60227cff; 
    transform: scale(1.15); 
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
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
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
    background-color: #f0f0f0;
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