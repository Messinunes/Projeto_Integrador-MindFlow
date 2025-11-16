import React, { useState, useEffect } from 'react';
// Importações de Componentes
import ChatPanel from '../../components/ChatPanel/ChatPanel.jsx';
import TaskModal from '../../components/TaskModal/index.jsx';
import ColunaTask from '../../components/ColumnTask';
import SprintModal from '../../components/SprintModal';
import StatusChart from '../../components/StatusChart';
import BurndownChart from '../../components/BurndownChart';
import PriorityMatrixChart from '../../components/PriorityMatrixChart';
import genericAvatar from '../../assets/Generic_avatar.png';
// Importação do Drag and Drop
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Importações de Estilos e Assets
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
    TaskListContainer,
    SprintList,
    SprintItem,
    PanelContainer,
    ChartWrapper,
    ChartArea,
    ArrowButton,
    BacklogContainer,
    TaskList,
    TaskHeader,
    TaskRow,
    TaskName,
    TaskPriority,
    ActionButton,
    TaskSprintSelect,
    SettingsPanelContainer,
    SettingsHeader,
    CloseButton,
    ProfileInfo,
    SettingsList,
    SettingsItem,
    FloatingButtonsContainer,
    FloatingButton,
    LogoutLink,
    StyledCalendarContainer,
    ChartGridWrapper,
    ArrowButton as ChartGridArrowButton
} from './styles.js';

// 🌟 CORREÇÃO 1: Caminho de importação corrigido para o seu serviço de API
import { tarefasService } from '../services/tarefasAPI';

// Importações para o Calendário
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addDays } from 'date-fns';

import logoMindFlow from '../../assets/logo_navbar.png';
import IconNotes from '../../assets/nota_2.png';
import IconCalendar from '../../assets/calendario_1.png';
import IconDashboard from '../../assets/painel-do-painel_1.png';
import IconList from '../../assets/lista_1.png';
import IconExit from '../../assets/sair-alt_1.png';

// Configuração do Localizer do Calendário
const locales = {
    'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
    getDay,
    locales,
});

// --- DADOS INICIAIS (Mantidos para o estado inicial) ---
const today = new Date();
const initialSprints = {
    'sprint-1': {
        id: 'sprint-1',
        name: 'Sprint 1 - Kickoff',
        startDate: today.toISOString().split('T')[0],
        endDate: addDays(today, 13).toISOString().split('T')[0],
        goal: 'Concluir a base do Dashboard e o Kanban',
    },
};

const initialData = {
    columns: {
        'column-to-do': {
            id: 'column-to-do',
            title: 'A Fazer (Backlog)',
            taskIds: ['task-1', 'task-2', 'task-3'],
        },
        'column-in-progress': {
            id: 'column-in-progress',
            title: 'Em Andamento',
            taskIds: [],
        },
        'column-done': {
            id: 'column-done',
            title: 'Finalizado',
            taskIds: [],
        },
    },
    tasks: {
        'task-1': {
            id: 'task-1',
            name: 'Comprar Material',
            description: 'Papel e canetas para o projeto.',
            dueDate: '2025-11-05',
            priority: 'medium',
            sprintId: 'sprint-1',
        },
        'task-2': {
            id: 'task-2',
            name: 'Reunião com Cliente',
            description: 'Apresentar o protótipo V2.',
            dueDate: '2025-10-30',
            priority: 'high',
            sprintId: 'sprint-1',
        },
        'task-3': {
            id: 'task-3',
            name: 'Definir Estrutura de Rotas',
            description: 'Backlog para o próximo ciclo.',
            dueDate: '2025-11-20',
            priority: 'low',
            sprintId: null,
        },
    },
    columnOrder: ['column-to-do', 'column-in-progress', 'column-done'],
};

// --- CONFIGURAÇÃO DO CARROSSEL DE CHARTS ---
const CHART_COMPONENTS = {
    'Burndown Chart': BurndownChart,
    'Status Overview': StatusChart,
    'Priority Matrix': PriorityMatrixChart,
};
const CHART_TITLES = Object.keys(CHART_COMPONENTS);

// --- FUNÇÃO DE CONTRASTE (necessária para o calendário) ---
const getContrastTextColor = (hexcolor) => {
    const hex = hexcolor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 186 ? 'black' : 'white';
};

// --- COMPONENTES DE SEÇÃO ---
const ComponentIA = () => <div><h2>Conteúdo: Inteligência Artificial</h2></div>;
const ComponentChat = () => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: '20px'
    }}>
        <h2>Chat</h2>
        <p>Use o botão flutuante no canto inferior direito para abrir o chat</p>
        <button 
            onClick={toggleChat}
            style={{
                padding: '10px 20px',
                backgroundColor: '#5a52d9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
            }}
        >
            Abrir Chat
        </button>
    </div>
);

// --- COMPONENTE DASHBOARD PRINCIPAL ---
function Dashboard({ navigateTo }) {
    // ESTADOS
    const [kanbanData, setKanbanData] = useState(initialData);
    const [sprints, setSprints] = useState(initialSprints);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('tasks');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [sprintToEdit, setSprintToEdit] = useState(null);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(genericAvatar);
    const [userName, setUserName] = useState("");
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeSprintFilter, setActiveSprintFilter] = useState('all'); 
    const [searchTerm, setSearchTerm] = useState(''); 

    const taskToEdit = editingTaskId ? kanbanData.tasks[editingTaskId] : null;

    // Lógica de ativação de Sprint
    const [currentActiveSprintId, setCurrentActiveSprintId] = useState(null);
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        let activeId = null;
        Object.values(sprints).forEach(sprint => {
            const startDate = new Date(sprint.startDate + 'T12:00:00');
            const endDate = new Date(sprint.endDate + 'T12:00:00');

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            const startTimestamp = startDate.getTime();
            const endTimestamp = endDate.getTime();

            if (todayTimestamp >= startTimestamp && todayTimestamp <= endTimestamp) {
                activeId = sprint.id;
            }
        });
        setCurrentActiveSprintId(activeId);
    }, [sprints]);
    
    // FUNÇÕES DE CARREGAMENTO
    const loadUserAvatar = () => {
        const userData = localStorage.getItem('userData');
        const savedAvatar = localStorage.getItem('userAvatar');
        
        if (userData) {
            const user = JSON.parse(userData);
            setUserName(user.nome);
        }
        
        if (savedAvatar && savedAvatar.startsWith('http')) {
            setAvatarUrl(savedAvatar);
            console.log('✅ Avatar carregado:', savedAvatar);
        } else {
            setAvatarUrl(genericAvatar);
            console.log('✅ Usando avatar genérico');
        }
    };

    const carregarTarefasDoBanco = async () => {
        try {
            console.log('🔄 Carregando tarefas do banco...');
            
            const tarefasAPI = await tarefasService.getTarefas();
            
            // Converter para seu formato interno do Kanban
            const tasksObject = {};
            const columnTaskIds = {
                'column-to-do': [],
                'column-in-progress': [], 
                'column-done': []
            };
            
            tarefasAPI.forEach(task => {
                tasksObject[task.id] = task;
                const statusMap = {
                    'to-do': 'column-to-do',
                    'in-progress': 'column-in-progress',
                    'done': 'column-done'
                };
                columnTaskIds[statusMap[task.status] || 'column-to-do'].push(task.id);
            });
            
            setKanbanData(prevData => ({
                ...prevData,
                tasks: tasksObject,
                columns: {
                    ...prevData.columns,
                    'column-to-do': { ...prevData.columns['column-to-do'], taskIds: columnTaskIds['column-to-do'] },
                    'column-in-progress': { ...prevData.columns['column-in-progress'], taskIds: columnTaskIds['column-in-progress'] },
                    'column-done': { ...prevData.columns['column-done'], taskIds: columnTaskIds['column-done'] }
                }
            }));
            
            console.log('✅ Kanban atualizado com', tarefasAPI.length, 'tarefas');
            
        } catch (error) {
            console.error('❌ Erro carregando tarefas:', error);
        }
    };

    useEffect(() => {
        loadUserAvatar();
        carregarTarefasDoBanco();
    }, []);

    // FUNÇÕES DE CONTROLE
    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
    };

    const toggleSettingsPanel = () => {
        setIsSettingsPanelOpen(prev => !prev);
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const openModal = (taskId = null) => {
        setEditingTaskId(taskId);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTaskId(null);
    }

    const handleNavClick = (section) => {
        if (section === 'exit') {
            handleLogout();
        } else {
            setActiveSection(section);
        }
    };

    // FUNÇÕES DE SPRINTS
    const handleOpenSprintModal = (sprint = null) => {
        setSprintToEdit(sprint);
        setIsSprintModalOpen(true);
    };

    const handleCloseSprintModal = () => {
        setIsSprintModalOpen(false);
        setSprintToEdit(null);
    };

    const handleSaveSprint = (sprintData) => {
        // Lógica de validação de data (mantida a correção robusta)
        const sprintStart = new Date(sprintData.startDate + 'T12:00:00');
        const newEndDate = new Date(sprintData.endDate + 'T12:00:00');

        const sprintStartNormalized = sprintStart.setHours(0, 0, 0, 0);
        const endTimestampNormalized = newEndDate.setHours(0, 0, 0, 0);
        const todayTimestampNormalized = new Date().setHours(0, 0, 0, 0);

        if (!sprintData.id && sprintStartNormalized < todayTimestampNormalized) {
            alert("A data de início não pode ser anterior a hoje para uma nova Sprint.");
            return;
        }

        if (endTimestampNormalized < sprintStartNormalized) {
            alert("A data de término não pode ser anterior à data de início.");
            return;
        }
        
        // Persistência
        setSprints(prevSprints => {
            if (sprintData.id) {
                return { ...prevSprints, [sprintData.id]: sprintData };
            }
            const newSprintId = `sprint-${Date.now()}`;
            return { ...prevSprints, [newSprintId]: { ...sprintData, id: newSprintId } };
        });
        handleCloseSprintModal();
    };

    const handleQuickAssignToSprint = (taskId, newSprintId) => {
        setKanbanData(prevData => ({
            ...prevData,
            tasks: {
                ...prevData.tasks,
                [taskId]: {
                    ...prevData.tasks[taskId],
                    sprintId: newSprintId === 'null' ? null : newSprintId,
                }
            }
        }));
    };

    const handleDeleteSprint = (sprintId) => {
        setSprints(prevSprints => {
            const { [sprintId]: deletedSprint, ...newSprints } = prevSprints;
            return newSprints;
        });

        setKanbanData(prevData => ({
            ...prevData,
            tasks: Object.values(prevData.tasks).reduce((acc, task) => {
                acc[task.id] = (task.sprintId === sprintId) ? { ...task, sprintId: null } : task;
                return acc;
            }, {}),
        }));

        handleCloseSprintModal();
    };

    // FUNÇÕES DE TAREFAS (COM API CALLS - CORRIGIDA)
    const handleAddTask = async (newTaskData) => {
        try {
            console.log('🔄 Criando nova tarefa...');
            
            // 🔑 1. OBTÉM O ID DO USUÁRIO LOGADO DO localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            const usuarioId = userData ? userData.id : null; 
            
            if (!usuarioId) {
                alert('Erro: Usuário não logado. Por favor, faça login novamente.');
                return; 
            }
            
            // 🔑 2. INJETA O ID DO USUÁRIO E STATUS NOS DADOS ENVIADOS
            const taskComStatus = { 
                ...newTaskData,
                status: 'to-do',
                usuarioId: usuarioId // Adiciona o ID do usuário para o backend
            };

            const novaTarefa = await tarefasService.createTarefa(taskComStatus);
            
            // Atualização do estado local
            setKanbanData(prevData => {
                const newTasks = { ...prevData.tasks, [novaTarefa.id]: novaTarefa };
                const toDoColumn = prevData.columns['column-to-do'];
                const newToDoTaskIds = [...toDoColumn.taskIds, novaTarefa.id];
                const newToDoColumn = { ...toDoColumn, taskIds: newToDoTaskIds };
                return { ...prevData, tasks: newTasks, columns: { ...prevData.columns, 'column-to-do': newToDoColumn } };
            });
            
            closeModal();
            console.log('✅ Tarefa criada com sucesso:', novaTarefa.name);
        } catch (error) {
            console.error('❌ Erro criando tarefa:', error);
            alert('Erro ao criar tarefa. Tente novamente.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await tarefasService.deleteTarefa(taskId);
            
            // Atualização do estado local
            setKanbanData(prevData => {
                const newTasks = { ...prevData.tasks };
                delete newTasks[taskId];
                const newColumns = { ...prevData.columns };
                Object.keys(newColumns).forEach(columnId => {
                    newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(id => id !== taskId);
                });
                return { ...prevData, tasks: newTasks, columns: newColumns };
            });
            
            closeModal();
        } catch (error) {
            console.error('❌ Erro excluindo tarefa:', error);
            alert('Erro ao excluir tarefa. Tente novamente.');
        }
    };

    const handleEditTask = async (editedTaskData) => {
        try {
            await tarefasService.updateTarefa(editedTaskData.id, editedTaskData);
            
            // Se o status da tarefa mudou, precisamos mover o ID para a coluna correta
            const oldStatus = kanbanData.tasks[editedTaskData.id]?.status;
            const newStatus = editedTaskData.status;

            setKanbanData(prevData => {
                let newColumns = { ...prevData.columns };
                const newTasks = { ...prevData.tasks, [editedTaskData.id]: editedTaskData };

                if (oldStatus !== newStatus) {
                    const oldColumnId = `column-${oldStatus}`;
                    const newColumnId = `column-${newStatus}`;

                    // 1. Remove da coluna antiga
                    if (newColumns[oldColumnId]) {
                        newColumns[oldColumnId].taskIds = newColumns[oldColumnId].taskIds.filter(id => id !== editedTaskData.id);
                    }
                    // 2. Adiciona à nova coluna (ao final)
                    if (newColumns[newColumnId]) {
                         newColumns[newColumnId].taskIds = [...newColumns[newColumnId].taskIds, editedTaskData.id];
                    }
                }
                
                return { ...prevData, tasks: newTasks, columns: newColumns };
            });
            
            closeModal();
        } catch (error) {
            console.error('❌ Erro editando tarefa:', error);
            alert('Erro ao atualizar tarefa. Tente novamente.');
        }
    };
        
    // FUNÇÃO DE LOGOUT
    const handleLogout = () => {
        console.log('Usuário deslogando e voltando para a Home...');
        localStorage.removeItem('userData');
        localStorage.removeItem('userAvatar');
        navigateTo('home');
    };

    // LÓGICA DE DRAG AND DROP (COM SALVAGUARDA)
    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // SALVAGUARDA CONTRA FILTRO
        if (activeSprintFilter !== 'all') {
            alert("A movimentação (D&D) é desativada quando um filtro de sprint está ativo.");
            return;
        }

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const startColumn = kanbanData.columns[source.droppableId];
        const finishColumn = kanbanData.columns[destination.droppableId];

        // 1. Mover DENTRO da mesma coluna
        if (startColumn === finishColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            setKanbanData(prevData => ({
                ...prevData,
                columns: {
                    ...prevData.columns,
                    [startColumn.id]: { ...startColumn, taskIds: newTaskIds },
                },
            }));
            return;
        }

        // 2. Mover ENTRE colunas
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);

        // Determinar novo status
        const statusMap = {
            'column-to-do': 'to-do',
            'column-in-progress': 'in-progress',
            'column-done': 'done'
        };
        const newStatus = statusMap[finishColumn.id];

        // Atualizar no banco (apenas o status)
        try {
            const taskToUpdate = kanbanData.tasks[draggableId];
            await tarefasService.updateTarefa(draggableId, { ...taskToUpdate, status: newStatus });
        } catch (error) {
             console.error("Erro ao atualizar status da tarefa no banco:", error);
             alert("Atenção: A tarefa foi movida localmente, mas houve um erro ao salvar o novo status no banco.");
        }


        // Atualização do estado local
        setKanbanData(prevData => ({
            ...prevData,
            columns: {
                ...prevData.columns,
                [startColumn.id]: { ...startColumn, taskIds: startTaskIds },
                [finishColumn.id]: { ...finishColumn, taskIds: finishTaskIds },
            },
            tasks: {
                ...prevData.tasks,
                [draggableId]: {
                    ...prevData.tasks[draggableId],
                    status: newStatus
                }
            }
        }));
    };

    const onBacklogDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // SALVAGUARDA CONTRA BUSCA
        if (searchTerm.trim()) {
            alert("Não é possível reordenar tarefas enquanto a busca estiver ativa.");
            return;
        }

        if (!destination || destination.index === source.index) {
            return;
        }

        const columnToDo = kanbanData.columns['column-to-do'];
        const newTaskIds = Array.from(columnToDo.taskIds);

        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        setKanbanData(prevData => ({
            ...prevData,
            columns: {
                ...prevData.columns,
                'column-to-do': { ...columnToDo, taskIds: newTaskIds },
            },
        }));
    };

    // =========================================================================
    // 💡 COMPONENTES DE CONTEÚDO
    // =========================================================================

    // COMPONENTE: QUADRO KANBAN
    const ComponentTasks = () => {
        const getFilteredTasks = (taskIds) => {
            let tasks = taskIds.map(taskId => kanbanData.tasks[taskId]).filter(Boolean);
            
            if (activeSprintFilter === 'all') {
                return tasks;
            }

            if (activeSprintFilter === 'backlog') {
                return tasks.filter(task => !task.sprintId);
            }

            return tasks.filter(task => task.sprintId === activeSprintFilter);
        };
        
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <AddButton onClick={() => openModal(null)}><h2>+</h2></AddButton>
                    
                    {/* Seletor de Filtro de Sprint */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ color: '#3133B8' }}>Selecionar por Sprint:</h2>
                        <TaskSprintSelect 
                            value={activeSprintFilter}
                            onChange={(e) => setActiveSprintFilter(e.target.value)}
                        >
                            <option value="all">Todas as Sprints</option>
                            <option value="backlog">Sem Sprint</option>
                            {Object.values(sprints).map(sprint => (
                                <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                            ))}
                        </TaskSprintSelect>
                    </div>

                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <TaskListContainer>
                        {kanbanData.columnOrder.map((columnId) => {
                            const column = kanbanData.columns[columnId];
                            const rawTaskIds = column.taskIds;
                            const tasksToRender = getFilteredTasks(rawTaskIds);

                            return (
                                <ColunaTask
                                    key={column.id}
                                    column={{ ...column, title: `${column.title} (${tasksToRender.length})` }}
                                    onTaskClick={openModal}
                                    tasks={tasksToRender}
                                />
                            );
                        })}
                    </TaskListContainer>
                </DragDropContext>
            </>
        );
    };

    // COMPONENTE: CALENDÁRIO
    const ComponentCalendar = () => {
        const [currentDate, setCurrentDate] = useState(new Date());
        const [currentView, setCurrentView] = useState(Views.MONTH);

        const taskEvents = Object.values(kanbanData.tasks).map(task => {
            // 🌟 CORREÇÃO 2: Usa 'T12:00:00' para evitar bugs de fuso horário
            const eventDate = new Date(task.dueDate + 'T12:00:00'); 

            return {
                id: task.id,
                title: `[T] ${task.name}`,
                start: eventDate,
                end: eventDate,
                isSprint: false,
                priority: task.priority,
            };
        });

        const sprintEvents = Object.values(sprints).map(sprint => {
            // Aplica a correção de fuso horário também nas Sprints
            const startDate = new Date(sprint.startDate + 'T12:00:00');
            const endDate = new Date(sprint.endDate + 'T12:00:00');
            const adjustedEndDate = addDays(endDate, 1);

            return {
                id: sprint.id,
                title: `[S] ${sprint.name}`,
                start: startDate,
                end: adjustedEndDate,
                isSprint: true,
                color: '#5a52d9cc' 
            };
        });

        const allEvents = [...taskEvents, ...sprintEvents];

        return (
            <div style={{ height: '80vh', backgroundColor: 'white', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2>Planejamento de Sprints</h2>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <SprintList style={{
                            position: 'relative',
                            top: 'unset',
                            right: 'unset',
                            flexDirection: 'row',
                            padding: '0 5px'
                        }}>
                            {Object.values(sprints).map(sprint => (
                                <SprintItem
                                    key={sprint.id}
                                    onClick={() => handleOpenSprintModal(sprint)}
                                >
                                    {sprint.name}
                                </SprintItem>
                            ))}
                        </SprintList>
                        <AddButton
                            onClick={() => handleOpenSprintModal(null)}
                            style={{
                                borderRadius: '8px',
                                padding: '8px 15px',
                                backgroundColor: '#5a52d9',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            + Nova Sprint
                        </AddButton>
                    </div>
                </div>

                <Calendar
                    localizer={localizer}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    date={currentDate}
                    view={currentView}
                    onNavigate={(newDate) => setCurrentDate(newDate)}
                    onView={(newView) => setCurrentView(newView)}
                    messages={{
                        next: "Próximo", previous: "Anterior", today: "Hoje",
                        month: "Mês", week: "Semana", day: "Dia",
                    }}
                    eventPropGetter={(event) => {
                        const style = {};
                        if (event.isSprint) {
                            style.backgroundColor = '#5a52d9cc'; style.color = 'white'; style.border = '1px solid #5a52d9';
                        } else {
                            const colors = {
                                high: { backgroundColor: '#FFDAD8', color: '#F5222D', borderColor: '#FFA39E' },
                                medium: { backgroundColor: '#FFF7AE', color: '#FAAD14', borderColor: '#FFE58F' },
                                low: { backgroundColor: '#D9F7BE', color: '#52C41A', borderColor: '#B7EB8F' },
                            };
                            Object.assign(style, colors[event.priority] || {});
                        }
                        return { style };
                    }}
                />
            </div>
        );
    };

    // COMPONENTE: PAINEL DE CONTROLE
    const ComponentPanel = () => {
        const [currentChartIndex, setCurrentChartIndex] = useState(0);

        const handleNext = () => {
            setCurrentChartIndex(prev => (prev + 1) % CHART_TITLES.length);
        };

        const handlePrev = () => {
            setCurrentChartIndex(prev => (prev - 1 + CHART_TITLES.length) % CHART_TITLES.length);
        };

        const CurrentChartTitle = CHART_TITLES[currentChartIndex];
        const CurrentChartComponent = CHART_COMPONENTS[CurrentChartTitle];

        return (
            <PanelContainer>
                <h2>{CurrentChartTitle}</h2>
                <ChartWrapper>
                    <ArrowButton onClick={handlePrev}>{"<"}</ArrowButton>
                    <ChartArea>
                        <CurrentChartComponent
                            data={kanbanData}
                            sprints={sprints}
                        />
                    </ChartArea>
                    <ArrowButton onClick={handleNext}>{">"}</ArrowButton>
                </ChartWrapper>
            </PanelContainer>
        );
    };

    // COMPONENTE: BACKLOG
    const ComponentList = () => {
        const backlogTaskIds = kanbanData.columns['column-to-do'].taskIds;
        const backlogTasks = backlogTaskIds.map(taskId => kanbanData.tasks[taskId]).filter(task => task && task.id);

        return (
            <BacklogContainer>
                <h2>Backlog do Projeto ({backlogTasks.length} Tarefas a Fazer)</h2>
                <DragDropContext onDragEnd={onBacklogDragEnd}>
                    <TaskList>
                        <TaskHeader>
                            <div>Ordem</div>
                            <div>Nome da Tarefa</div>
                            <div>Sprint</div>
                            <div>Prioridade</div>
                            <div>Vencimento</div>
                            <div>Ações</div>
                        </TaskHeader>
                        <Droppable droppableId="backlog-list-area">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {backlogTasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided, snapshot) => (
                                                <TaskRow
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    $isDragging={snapshot.isDragging}
                                                >
                                                    <div style={{ fontWeight: 'bold' }}>{index + 1}</div>
                                                    <TaskName>{task.name}</TaskName>
                                                    <TaskSprintSelect
                                                        value={task.sprintId || 'null'}
                                                        onChange={(e) => handleQuickAssignToSprint(task.id, e.target.value)}
                                                    >  
                                                        <option key="backlog-option" value="null">Global (Backlog)</option>
                                                        {Object.values(sprints).map(sprint => (
                                                            <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                                                        ))}
                                                    </TaskSprintSelect>
                                                    <TaskPriority priority={task.priority}>{task.priority || 'N/A'}</TaskPriority>
                                                    <div>{task.dueDate}</div>
                                                    <ActionButton onClick={() => openModal(task.id)}>Editar</ActionButton>
                                                </TaskRow>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        {backlogTasks.length === 0 && (
                            <p style={{ marginTop: '20px', color: '#666', textAlign: 'center' }}>O Backlog (A Fazer) está vazio!</p>
                        )}
                    </TaskList>
                </DragDropContext>
            </BacklogContainer>
        );
    };

    // MODAL DE UPLOAD DE AVATAR
    const AvatarUploadModal = ({ onClose }) => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        const [selectedFile, setSelectedFile] = useState(null);
        const [previewUrl, setPreviewUrl] = useState(avatarUrl || genericAvatar);
        const [uploading, setUploading] = useState(false);

        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (file) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewUrl(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };

        const handleUpload = async () => {
            if (!selectedFile) {
                alert("Por favor, selecione uma imagem primeiro.");
                return;
            }

            if (!userData || !userData.id) {
                alert("Erro: usuário não identificado.");
                return;
            }

            setUploading(true);

            try {
                const formData = new FormData();
                formData.append('avatar', selectedFile);
                formData.append('userId', userData.id);

                console.log('📤 Enviando upload para usuário:', userData.id);
                
                const response = await fetch('http://localhost:3001/upload-avatar', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    const newAvatarUrl = data.avatarUrl;
                    setAvatarUrl(newAvatarUrl);
                    localStorage.setItem('userAvatar', newAvatarUrl);
                    
                    const updatedUserData = { ...userData, avatar: newAvatarUrl };
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));
                    
                    console.log('✅ Avatar atualizado:', newAvatarUrl);
                    alert("✅ Foto alterada com sucesso!");
                    onClose();
                } else {
                    console.error('❌ Erro no upload:', data.error);
                    alert("❌ Erro ao fazer upload: " + data.error);
                }
            } catch (error) {
                console.error('💥 Erro de conexão:', error);
                alert("❌ Erro de conexão ao fazer upload.");
            } finally {
                setUploading(false);
            }
        };

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    width: '400px',
                    textAlign: 'center'
                }}>
                    <h3>Alterar Foto do Perfil</h3>
                    
                    {/* PREVIEW DA IMAGEM */}
                    <div style={{ margin: '20px 0' }}>
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #ddd'
                            }}
                        />
                    </div>
                    
                    {/* INPUT DE ARQUIVO */}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ 
                            margin: '10px 0',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            width: '100%'
                        }}
                        disabled={uploading}
                    />
                    
                    {/* BOTÕES DE AÇÃO */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <button 
                            onClick={handleUpload}
                            disabled={uploading || !selectedFile}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: (uploading || !selectedFile) ? '#ccc' : '#5a52d9',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: (uploading || !selectedFile) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {uploading ? '📤 Enviando...' : '✅ Confirmar'}
                        </button>
                        <button 
                            onClick={onClose}
                            disabled={uploading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#ccc',
                                color: 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: uploading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            ❌ Cancelar
                        </button>
                    </div>
                    
                    {/* MENSAGEM DE STATUS */}
                    {!selectedFile && (
                        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
                            ⚠️ Selecione uma imagem para upload
                        </p>
                    )}
                </div>
            </div>
        );
    };

    // MODAL DE NOTIFICAÇÕES
    const NotificationModal = () => {
        const [notificationSettings, setNotificationSettings] = useState({
            email: true,
            system: true,
            taskReminders: true,
            sprintAlerts: false
        });

        const handleToggle = (setting) => {
            setNotificationSettings(prev => ({
                ...prev,
                [setting]: !prev[setting]
            }));
        };

        const handleSave = () => {
            alert('Configurações de notificação salvas!');
            setIsNotificationModalOpen(false);
        };

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    width: '400px',
                    maxWidth: '90vw'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>🔔 Notificações</h3>
                    <div style={{ marginBottom: '20px' }}>
                        {[
                            { key: 'email', label: '📧 Notificações por Email' },
                            { key: 'system', label: '💻 Notificações no Sistema' },
                            { key: 'taskReminders', label: '⏰ Lembretes de Tarefas' },
                            { key: 'sprintAlerts', label: '🚀 Notificações de Sprint' }
                        ].map(item => (
                            <div key={item.key} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 0',
                                borderBottom: '1px solid #eee'
                            }}>
                                <span>{item.label}</span>
                                <input 
                                    type="checkbox"
                                    checked={notificationSettings[item.key]}
                                    onChange={() => handleToggle(item.key)}
                                    style={{ transform: 'scale(1.2)' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={handleSave}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#5a52d9',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Salvar
                        </button>
                        <button 
                            onClick={() => setIsNotificationModalOpen(false)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ccc',
                                color: '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // PAINEL DE CONFIGURAÇÕES
    const UserSettingsPanel = () => {
        const [userData, setUserData] = useState({ id: 123, nome: "Usuário" });
        
        useEffect(() => {
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                setUserData(JSON.parse(savedUserData));
            }
        }, []);

        const settingsItems = [
            { name: "Ver Perfil", action: () => alert("Redirecionar para página de Perfil.") },
            { name: "Mudar Foto/Avatar", action: () => setIsAvatarModalOpen(true) },
            { 
                name: "Preferências de Notificação", 
                action: () => setIsNotificationModalOpen(true)
            },
            { 
                name: `Modo Escuro: ${isDarkMode ? 'Ativado' : 'Desativado'}`,
                action: toggleTheme 
            },
            { name: "Sair / Logout", action: handleLogout },
        ];

        return (
            <SettingsPanelContainer $isOpen={isSettingsPanelOpen} $isDarkMode={isDarkMode}>
                <SettingsHeader $isDarkMode={isDarkMode}>
                    <h3>Configurações de Usuário</h3>
                    <CloseButton onClick={toggleSettingsPanel} $isDarkMode={isDarkMode}>&times;</CloseButton>
                </SettingsHeader>
                <ProfileInfo $isDarkMode={isDarkMode}>
                    <Avatar src={avatarUrl} alt="Avatar" />
                    <p>{userData.nome}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>ID: {userData.id}</p>
                </ProfileInfo>
                <SettingsList>
                    {settingsItems.map(item => (
                        <SettingsItem key={item.name} onClick={item.action} $isDarkMode={isDarkMode}>
                            {item.name}
                        </SettingsItem>
                    ))}
                </SettingsList>
            </SettingsPanelContainer>
        );
    };

    // MAPEAMENTO DE COMPONENTES
    const componentMap = {
        tasks: ComponentTasks,
        calendar: ComponentCalendar,
        panel: ComponentPanel,
        list: ComponentList,
        ia: ComponentIA,
        chat: ComponentChat,
    };
    const CurrentComponent = componentMap[activeSection] || ComponentTasks;

    // RENDER PRINCIPAL
    return (
        <HomeBody>
            <LayoutContainer $isDarkMode={isDarkMode}>
                {/* TOP BAR ATUALIZADO COM NOME DO USUÁRIO */}
                <TopBar>
                    <Logo src={logoMindFlow} alt="MindFlow Logo" />
                    
                    {/* ÁREA DO USUÁRIO COM NOME E FOTO */}
                    <div 
                        onClick={toggleSettingsPanel}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderRadius: '8px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <span style={{
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '14px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            {userName}
                        </span>
                        <Avatar src={avatarUrl} alt="Perfil do Usuário" />
                    </div>
                    
                    <AnimatedBorder />
                </TopBar>

                {/* SIDEBAR */}
                <Sidebar>
                    <SidebarLink onClick={() => handleNavClick('tasks')} $isActive={activeSection === 'tasks'}><img src={IconNotes} alt="Tarefas" /></SidebarLink>
                    <SidebarLink onClick={() => handleNavClick('calendar')} $isActive={activeSection === 'calendar'}><img src={IconCalendar} alt="Calendário" /></SidebarLink>
                    <SidebarLink onClick={() => handleNavClick('panel')} $isActive={activeSection === 'panel'}><img src={IconDashboard} alt="Painel" /></SidebarLink>
                    <SidebarLink onClick={() => handleNavClick('list')} $isActive={activeSection === 'list'}><img src={IconList} alt="Lista / Backlog" /></SidebarLink>
                    <LogoutLink onClick={() => handleNavClick('exit')} $isActive={activeSection === 'exit'}><img src={IconExit} alt="Exit" /></LogoutLink>
                </Sidebar>

                {/* ÁREA DE CONTEÚDO */}
                <ContentArea>
                    <CurrentComponent />
                </ContentArea>

                {/* MODAIS */}
                {isModalOpen && (
                    <TaskModal
                        onClose={closeModal}
                        onSave={editingTaskId ? handleEditTask : handleAddTask}
                        onDelete={handleDeleteTask}
                        sprints={Object.values(sprints)}
                        taskData={taskToEdit}
                    />
                )}

                {isSprintModalOpen && (
                    <SprintModal
                        onClose={handleCloseSprintModal}
                        onSave={handleSaveSprint}
                        onDelete={handleDeleteSprint}
                        sprintData={sprintToEdit}
                    />
                )}

                {isAvatarModalOpen && <AvatarUploadModal onClose={() => setIsAvatarModalOpen(false)} />}

                {isNotificationModalOpen && <NotificationModal />}

                {/* BOTÕES FLUTUANTES */}
                <FloatingButtonsContainer>
                    <FloatingButton $type="chat" onClick={(toggleChat)}>
                        <img src="\src\assets\ia_clara.png" alt="" />
                    </FloatingButton>
                </FloatingButtonsContainer>
                
                <UserSettingsPanel />
                <ChatPanel 
                    open={isChatOpen} 
                    onClose={toggleChat} 
                    isDarkMode={isDarkMode} 
                />
            </LayoutContainer>
        </HomeBody>
    );
}

export default Dashboard;