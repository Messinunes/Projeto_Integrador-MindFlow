import React, { useState } from 'react';
import TaskModal from '../../components/TaskModal/index.jsx'; 
import { 
  HomeBody, 
  LayoutContainer, 
  TopBar, 
  Logo, 
  Avatar, 
  Sidebar, 
  SidebarLink, 
  ContentArea,
  AnimatedBorder,
  SectionTask, 
  AddButton,
} from './styles.js';

import logoMindFlow from '../../assets/logo_navbar.png';
import genericAvatar from '../../assets/Generic_avatar.png';
import IconNotes from '../../assets/nota_2.png'; 
import IconCalendar from '../../assets/calendario_1.png';
import IconDashboard from '../../assets/painel-do-painel_1.png';
import IconIA from '../../assets/tecnologia-de-ia_1.png';
import IconChat from '../../assets/mensagens_1.png';
import IconList from '../../assets/lista_1.png';
import IconExit from '../../assets/sair-alt_1.png';
import IconAdd from '../../assets/mais_1.png'; 

const ComponentCalendar = () => <div><h2>Conteúdo: Calendário</h2></div>;
const ComponentList = () => <div><h2>Conteúdo: Lista</h2></div>;
const ComponentIA = () => <div><h2>Conteúdo: Inteligência Artificial</h2></div>;
const ComponentChat = () => <div><h2>Conteúdo: Chat / Mensagens</h2></div>;
const ComponentPanel = () => <div><h2>Conteúdo: Painel</h2></div>;
const ComponentExit = () => <div><h2>Sair</h2></div>; 


function Dashboard() {
  const [activeSection, setActiveSection] = useState('tasks');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [tasks, setTasks] = useState([]); 

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddTask = (taskData) => {
    const newTask = {
        id: Date.now(),
        ...taskData,
        isCompleted: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    console.log('✅ Nova Tarefa Adicionada:', newTask);
    closeModal();
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    closeModal(); 
  };
    
  const ComponentTasks = () => (
    <div>
      <SectionTask>
        
        <AddButton onClick={openModal}> 
          <img src={IconAdd} alt="Ícone Adicionar"/>
        </AddButton>
        <h2>Nova Tarefa</h2>
      </SectionTask>
      
      
      {tasks.length === 0 ? (
        <p>Nenhuma tarefa adicionada ainda.</p>
      ) : (
        tasks.map(task => (
          <div key={task.id}>
            <strong>{task.name}</strong> - Prioridade: {task.priority}
          </div>
        ))
      )}
      
    </div>
  );

  const componentMap = {
    tasks: ComponentTasks, 
    calendar: ComponentCalendar,
    list: ComponentList,
    ia: ComponentIA,
    chat: ComponentChat,
    panel: ComponentPanel,
    exit: ComponentExit,
  };

  const CurrentComponent = componentMap[activeSection] || ComponentTasks;
  
  // ESTRUTURA DO DASHBOARD
  return (
    <HomeBody>
      <LayoutContainer>
                
        <TopBar>
          <Logo src={logoMindFlow} alt="MindFlow Logo" />
          <Avatar src={genericAvatar} alt="Perfil do Usuário" />
          <AnimatedBorder />
        </TopBar>

        {/* NAVBAR LATERAL (SIDEBAR) */}
        <Sidebar>
            <SidebarLink onClick={() => handleNavClick('tasks')} $isActive={activeSection === 'tasks'}><img src={IconNotes} alt="Tarefas" /></SidebarLink>
            <SidebarLink onClick={() => handleNavClick('calendar')} $isActive={activeSection === 'calendar'}><img src={IconCalendar} alt="Calendário" /></SidebarLink>
            <SidebarLink onClick={() => handleNavClick('list')} $isActive={activeSection === 'list'}><img src={IconList} alt="Lista" /></SidebarLink>
            <SidebarLink onClick={() => handleNavClick('panel')} $isActive={activeSection === 'panel'}><img src={IconDashboard} alt="Painel" /></SidebarLink>
            <SidebarLink onClick={() => handleNavClick('chat')} $isActive={activeSection === 'chat'}><img src={IconChat} alt="Chat" /></SidebarLink>
            <SidebarLink onClick={() => handleNavClick('ia')} $isActive={activeSection === 'ia'}><img src={IconIA} alt="IA" /></SidebarLink>
            <SidebarLink onClick={() => handleNavClick('exit')} $isActive={activeSection === 'exit'}><img src={IconExit} alt="Exit" /></SidebarLink>
        </Sidebar>

        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        <ContentArea>
          <CurrentComponent /> 
        </ContentArea>

        {/* MODAL: Renderiza se isModalOpen for TRUE */}
        {isModalOpen && (
            <TaskModal 
                onClose={closeModal} 
                onSave={handleAddTask} 
            />
        )}
        
      </LayoutContainer>
    </HomeBody>
  );
}

export default Dashboard;