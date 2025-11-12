import React, { useState, useEffect } from 'react'; // Adicionado useEffect
// Importações de Componentes
import ChatPanel from '../../components/ChatPanel/ChatPanel.jsx';
import TaskModal from '../../components/TaskModal/index.jsx';
import ColunaTask from '../../components/ColumnTask';
import SprintModal from '../../components/SprintModal';
import StatusChart from '../../components/StatusChart'; // NOVO: Chart Real
import BurndownChart from '../../components/BurndownChart'; // NOVO: Chart Real
import PriorityMatrixChart from '../../components/PriorityMatrixChart'; // NOVO: Chart Real

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
    // Estilos do Painel
    PanelContainer,
    ChartWrapper,
    ChartArea,
    MainChartRowWrapper,
    // Estilos do Backlog
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
} from './styles.js';

// Importações para o Calendário
// Importações para o Calendário
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'; // <-- MUDANÇA 1
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR'; // Isso já estava correto
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addDays } from 'date-fns';

// --- MUDANÇA 2: Configuração do dateFnsLocalizer ---
const locales = {
    'pt-BR': ptBR, // Passa o locale português
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { locale: ptBR }), // 0 = Domingo
    getDay,
    locales,
    locale: 'pt-BR',
});
// ----------------------------------------------------
import logoMindFlow from '../../assets/logo_navbar.png';
import genericAvatar from '../../assets/Generic_avatar.png';
import IconNotes from '../../assets/nota_2.png';
import IconCalendar from '../../assets/calendario_1.png';
import IconDashboard from '../../assets/painel-do-painel_1.png';

import IconList from '../../assets/lista_1.png';
import IconExit from '../../assets/sair-alt_1.png';

// --- DADOS INICIAIS (MANTIDOS) ---
const getContrastTextColor = (hexcolor) => {
    // Remove o '#' se estiver presente
    const hex = hexcolor.replace('#', '');

    // Converte para RGB (extrai os componentes R, G, B)
    // Se o formato for #rgb, ele duplica (ex: #f00 -> #ff0000)
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calcula a Luminância (Brilho Relativo) usando a fórmula
    // recomendada pela W3C para percepção humana de cores.
    // O valor 128 é um bom limite (meio termo entre 0 e 255).
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    // Se a luminância for > 186 (um limite um pouco mais alto para garantir texto escuro),
    // a cor de fundo é considerada CLARA, então o texto deve ser PRETO.
    // Caso contrário, a cor de fundo é ESCURA, e o texto deve ser BRANCO.
    // Usaremos 186 como um bom limiar (o padrão costuma ser 128, mas 186 melhora o contraste com tons médios).
    return luminance > 186 ? 'black' : 'white';
};

const today = new Date();
const initialSprints = {

};

const initialData = {
    columns: {
        'column-to-do': {
            id: 'column-to-do',
            title: 'A Fazer',
            taskIds: [],
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

    columnOrder: ['column-to-do', 'column-in-progress', 'column-done'],
};

// --- CONFIGURAÇÃO DO CARROSSEL DE CHARTS ---

const CHART_COMPONENTS = {
    'Gráfico de Burndown': BurndownChart,
    'Visão Geral de Status': StatusChart,
    'Matriz de Prioridade': PriorityMatrixChart,
};
const CHART_TITLES = Object.keys(CHART_COMPONENTS);

// --- COMPONENTES DE SEÇÃO SIMPLES (MANTIDOS) ---
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

// Componente Sair foi ajustado para ser um elemento clicável, mas não
// é mais o componente principal de uma "seção".
const ComponentExit = ({ onLogout }) => (
    <div onClick={onLogout} style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Sair do Sistema</h3>
    </div>
);

// --- COMPONENTE DASHBOARD PRINCIPAL (FUNÇÕES E ESTADOS) ---

function Dashboard({ navigateTo }) { // <--- 🌟 CORREÇÃO 1: Desestruturar navigateTo
    // ESTADOS
    const [activeSprintFilter, setActiveSprintFilter] = useState('all');
    const [kanbanData, setKanbanData] = useState(initialData);
    const [sprints, setSprints] = useState(initialSprints);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('tasks');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [sprintToEdit, setSprintToEdit] = useState(null);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentActiveSprintId, setCurrentActiveSprintId] = useState(null);
    const taskToEdit = editingTaskId ? kanbanData.tasks[editingTaskId] : null;
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        // 1. Define o dia de HOJE (Timestamp de 00:00:00 de hoje)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        let activeId = null;

        Object.values(sprints).forEach(sprint => {

            // 2. Cria objetos Date para Início e Fim da sprint
            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);

            // 3. Zera o tempo para comparação precisa do DIA
            startDate.setHours(0, 0, 0, 0);

            // 4. Garante que a data final inclua o último dia inteiro (até 23:59:59.999)
            // Isso é crucial para incluir o último dia no intervalo.
            endDate.setHours(23, 59, 59, 999);

            // 5. Converte para timestamps
            const startTimestamp = startDate.getTime();
            const endTimestamp = endDate.getTime();

            // 6. Verifica se o dia de hoje está no intervalo
            if (todayTimestamp >= startTimestamp && todayTimestamp <= endTimestamp) {
                activeId = sprint.id;
            }
        });

        setCurrentActiveSprintId(activeId);

    }, [sprints]);

    //PARA ABRIR E FECHAR O CHAT
    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
    };

    const toggleSettingsPanel = () => {
        setIsSettingsPanelOpen(prev => !prev);
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // FUNÇÕES DE CONTROLE DE MODAL E NAVEGAÇÃO
    const openModal = (taskId = null) => {
        setEditingTaskId(taskId);
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTaskId(null);
    }
    const handleNavClick = (section) => {
        // Se for o clique em 'exit', chamamos o handleLogout, caso contrário, navegamos para a seção
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
        // --- PREPARAÇÃO DE DATAS ---

        // 1. Data de Início da Sprint (com correção de fuso horário)
        const sprintStart = new Date(sprintData.startDate + 'T12:00:00');
        // Para a comparação de timestamps do fim de data, precisamos também normalizar.
        const newEndDate = new Date(sprintData.endDate + 'T12:00:00');
        newEndDate.setHours(0, 0, 0, 0);
        const endTimestamp = newEndDate.getTime();

        // 2. Data de Hoje (Ponto de Referência)
        const today = new Date();

        // --- VALIDAÇÃO A: Data de Início não pode ser anterior a hoje (APENAS NOVAS SPRINTS) ---
        if (!sprintData.id) {

            let isPast = false;

            // Extrai componentes do Dia de Hoje
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDay = today.getDate();

            // Extrai componentes da Data de Início da Sprint
            const startYear = sprintStart.getFullYear();
            const startMonth = sprintStart.getMonth();
            const startDay = sprintStart.getDate();

            // Compara Ano
            if (startYear < todayYear) {
                isPast = true;
            }
            // Se Ano igual, Compara Mês
            else if (startYear === todayYear && startMonth < todayMonth) {
                isPast = true;
            }
            // Se Ano e Mês iguais, Compara Dia
            else if (startYear === todayYear && startMonth === todayMonth && startDay < todayDay) {
                isPast = true;
            }

            // Dispara o erro se for no passado
            if (isPast) {
                alert("A data de início não pode ser no passado para uma nova Sprint.");
                return;
            }
        }

        // --- VALIDAÇÃO B: A data de término deve ser igual ou depois da Data de Início ---
        // Usamos os Timestamps normalizados para essa validação, garantindo precisão:
        sprintStart.setHours(0, 0, 0, 0);
        if (endTimestamp < sprintStart.getTime()) {
            alert("A data de término não pode ser anterior à data de início.");
            return;
        }

        // --- LÓGICA DE PERSISTÊNCIA DE DADOS (Inalterada) ---
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
                    sprintId: newSprintId === 'null' ? null : newSprintId, // 'null' é para remover
                }
            }
        }));
    };

    const handleDeleteSprint = (sprintId) => {
        setSprints(prevSprints => {
            const { [sprintId]: deletedSprint, ...newSprints } = prevSprints;
            return newSprints;
        });

        setKanbanData(prevData => {
            // 1. Checagem de segurança: Certifica-se de que prevData.tasks é um objeto, 
            //    caso contrário, usa um objeto vazio {}.
            const safeTasks = prevData.tasks || {};

            // 2. Cria a nova lista de tarefas, removendo a referência à sprint excluída.
            const updatedTasks = Object.values(safeTasks).reduce((acc, task) => {
                // Se a tarefa pertencia à sprint excluída, define sprintId como null, senão mantém a tarefa.
                acc[task.id] = (task.sprintId === sprintId) ? { ...task, sprintId: null } : task;
                return acc;
            }, {});

            // 3. Retorna o novo estado
            return {
                ...prevData,
                tasks: updatedTasks,
            };
        });

        handleCloseSprintModal();
    };

    // FUNÇÕES DE TAREFAS (Simplificadas, mas funcionais)
    const handleAddTask = (newTaskData) => {
        // A chave newTaskId será a fonte da verdade para o ID.
        const newTaskId = `task-${Date.now()}`;

        setKanbanData(prevData => {
            // Objeto da nova tarefa: use o newTaskId gerado, espalhe o resto.
            const taskPayload = {
                id: newTaskId,
                ...newTaskData, // Isso não tem ID, então não sobrescreve.
                status: 'to-do'
            };

            const newTasks = {
                ...prevData.tasks,
                [newTaskId]: taskPayload // A chave é o newTaskId.
            };
            const toDoColumn = prevData.columns['column-to-do'];
            const newToDoTaskIds = [...toDoColumn.taskIds, newTaskId];
            const newToDoColumn = { ...toDoColumn, taskIds: newToDoTaskIds };
            console.log("Kanban Data APÓS adição:", newTasks[newTaskId]);
            return { ...prevData, tasks: newTasks, columns: { ...prevData.columns, 'column-to-do': newToDoColumn } };
        });
        closeModal();
    };

    const handleDeleteTask = (taskId) => {
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
    };

    const handleEditTask = (editedTaskData) => {
        setKanbanData(prevData => ({
            ...prevData,
            tasks: {
                ...prevData.tasks,
                [editedTaskData.id]: editedTaskData,
            }
        }));
        closeModal();
    };

    // --- FUNÇÃO DE LOGOUT CORRIGIDA ---
    const handleLogout = () => {
        // 1. (Opcional) Lógica de limpeza de token/estado de usuário aqui.
        console.log('Usuário deslogando e voltando para a Home...');

        // 2. Chama a navegação para a página 'home' através da prop 'navigateTo'.
        navigateTo('home'); // <-- ESSA FUNÇÃO AGORA ESTÁ DISPONÍVEL
    };

    // LÓGICA DE DRAG AND DROP (onDragEnd)
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const startColumn = kanbanData.columns[source.droppableId];
        const finishColumn = kanbanData.columns[destination.droppableId];

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

        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);

        setKanbanData(prevData => ({
            ...prevData,
            columns: {
                ...prevData.columns,
                [startColumn.id]: { ...startColumn, taskIds: startTaskIds },
                [finishColumn.id]: { ...finishColumn, taskIds: finishTaskIds },
            },
        }));
    };

    const onBacklogDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        // Como o Backlog não tem colunas, apenas reordenamos o array de IDs no 'column-to-do'
        // que, por padrão, é o nosso backlog principal.

        // NOTA: Se o Backlog deve incluir Em Andamento, precisaríamos de uma nova estrutura de ordem.
        // Por simplicidade, vamos usar o 'column-to-do' como proxy para a ordem do Backlog.

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

    // COMPONENTE: QUADRO KANBAN (tasks)
    // COMPONENTE: QUADRO KANBAN (tasks)
    const ComponentTasks = () => {
        // 1. Filtragem das Tarefas
        const getFilteredTasks = (taskIds) => {
            let tasks = taskIds.map(taskId => kanbanData.tasks[taskId]);

            if (activeSprintFilter === 'all') {
                // Se 'all', retorna todas.
                return tasks;
            }

            if (activeSprintFilter === 'backlog') {
                // Se 'backlog', retorna tarefas sem sprintId
                return tasks.filter(task => !task.sprintId);
            }

            // Se for um ID de sprint, filtra por ele
            return tasks.filter(task => task.sprintId === activeSprintFilter);
        };


        return (
            <>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                }}>
                    <AddButton onClick={() => openModal(null)}>
                        <h2>+</h2>
                    </AddButton>

                    {/* NOVO: Seletor de Filtro de Sprint */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                        <h2 style={{ color: '#3133B8', }}>Selecionar por Sprint:</h2>
                        <TaskSprintSelect style={{ backgroundColor: '#f7f9fc', border: '2px solid #3133B8', padding: '5px', borderRadius: '5px', }}
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
                    {/* FIM do Seletor de Filtro */}

                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <TaskListContainer>
                        {kanbanData.columnOrder.map((columnId) => {
                            const column = kanbanData.columns[columnId];

                            // 2. AQUI A MUDANÇA: Filtra as tarefas ANTES de passar
                            const rawTaskIds = column.taskIds;
                            const tasksInColumn = rawTaskIds
                                .map(taskId => kanbanData.tasks[taskId]) // Pega o objeto task
                                .filter(task => { // Aplica a lógica do filtro
                                    if (!task) return false;

                                    if (activeSprintFilter === 'backlog') {
                                        // Tarefas sem sprintId
                                        return !task.sprintId;
                                    }
                                    // Tarefas que pertencem à sprint selecionada
                                    return task.sprintId === activeSprintFilter;
                                });

                            // Para o ColunaTask, precisamos de um array de objetos task, não apenas IDs
                            // NOTE: O Drag and Drop só funciona corretamente se o array de taskIds da coluna
                            // for usado diretamente na ColunaTask. Se o filtro for aplicado DENTRO
                            // do ColunaTask, o D&D continua no array original.

                            // SOLUÇÃO: Passar APENAS as tarefas filtradas e o D&D precisa ser ajustado (ou limitado)
                            // Vamos simplificar o D&D nesta seção para funcionar com o filtro:

                            return (
                                <ColunaTask
                                    key={column.id}
                                    column={{ ...column, title: `${column.title} (${tasksInColumn.length})` }} // Contagem de Tarefas incluída!
                                    onTaskClick={openModal}
                                    // Passa o array de objetos Task filtrados:
                                    tasks={tasksInColumn}
                                // OBS: O Drag and Drop interno do ColunaTask agora deve usar
                                // os IDs das `tasksInColumn` e NÃO `column.taskIds`! 
                                // Você precisará adaptar o ColunaTask para usar o array de objetos.
                                />
                            );
                        })}
                    </TaskListContainer>
                </DragDropContext>
            </>
        );
    };

    // COMPONENTE: CALENDÁRIO / PLANEJAMENTO DE SPRINT (calendar)
    const ComponentCalendar = () => {
        const customFormats = {
            dayFormat: 'dd/MM',   // <-- BÔNUS: 'DD/MM' (moment) vira 'dd/MM' (date-fns)
        };
        const [currentDate, setCurrentDate] = useState(new Date());
        const [currentView, setCurrentView] = useState(Views.MONTH);

        // Checa se kanbanData.tasks está vazio (ou não existe)
        const hasTasks = kanbanData.tasks && Object.keys(kanbanData.tasks).length > 0;

        const taskEvents = hasTasks ?
            Object.values(kanbanData.tasks).map(task => {
                const eventDate = new Date(task.dueDate);
                eventDate.setDate(eventDate.getDate() + 1);

                return {
                    id: task.id,
                    title: `[T] ${task.name}`,
                    start: eventDate,
                    end: eventDate,
                    isSprint: false,
                    priority: task.priority,
                };
            })
            : [];

        const sprintEvents = Object.values(sprints).map(sprint => {
            // CORREÇÃO: Força o parse da data como fuso horário LOCAL no meio-dia.
            const startDate = new Date(sprint.startDate + 'T12:00:00');
            const endDate = new Date(sprint.endDate + 'T12:00:00');

            // NOTE: A biblioteca 'react-big-calendar' exige que a data final seja o dia seguinte
            // ao último dia para que a range de dias seja exibida corretamente.
            // Usaremos addDays(endDate, 1) para adicionar um dia
            const adjustedEndDate = addDays(endDate, 1);

            return {
                id: sprint.id,
                title: `[S] ${sprint.name}`,
                start: startDate, // Data de início correta
                end: adjustedEndDate, // Data de fim (último dia + 1) correta
                isSprint: true,
                color: sprint.color
            };
        });

        const allEvents = [...taskEvents, ...sprintEvents];

        return (
            <StyledCalendarContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid #3133B8', paddingBottom: '10px' }}>

                    <h2>Planejamento de Sprints</h2>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: '5px' }}>

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

                                    style={{
                                        // 1. Define a cor de fundo (com fallback)
                                        backgroundColor: sprint.color || '#F0F0F0',

                                        // 2. APLICA A COR DE TEXTO CALCULADA PARA CONTRASTE
                                        color: getContrastTextColor(sprint.color || '#F0F0F0'),

                                        border: `1px solid ${sprint.color || '#ccc'}`,
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        boxShadow: sprint.id === currentActiveSprintId
                                            ? '0 0 10px 2px rgba(90, 82, 217, 0.7)'
                                            : 'none',
                                        fontWeight: sprint.id === currentActiveSprintId
                                            ? 'bold'
                                            : 'normal',
                                    }}
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
                    culture='pt-BR'
                    localizer={localizer}
                    events={allEvents}
                    formats={customFormats}
                    startAccessor="start"
                    endAccessor="end"
                    date={currentDate}
                    view={currentView}
                    onNavigate={(newDate) => setCurrentDate(newDate)}
                    onView={(newView) => setCurrentView(newView)}
                    messages={{
                        next: "Próximo", previous: "Anterior", today: "Hoje",
                        month: "Mês", week: "Semana", day: "Dia", date: "Data", time: "Hora",
                        events: "Evento",
                    }}
                    eventPropGetter={(event) => {
                        const style = {};

                        // --- 2. CORREÇÃO APLICADA AQUI ---
                        if (event.isSprint) {
                            // Usa a cor do evento ou o default
                            const sprintColor = event.color || '#F0F0F0';

                            // **AQUI ESTÁ A MUDANÇA:** Calcula dinamicamente a cor do texto
                            const textColor = getContrastTextColor(sprintColor);

                            style.backgroundColor = sprintColor;
                            style.border = `1px solid ${sprintColor}`;
                            style.color = textColor; // Define a cor do texto para garantir contraste

                            if (event.id === currentActiveSprintId) {
                                // Se a Sprint estiver ativa, você pode querer forçar o estilo.
                                // Aqui, mantemos o contraste, mas podemos adicionar um destaque visual (ex: borda mais grossa).
                                style.border = `2px solid ${textColor}`;
                                // style.boxShadow = '0 0 5px rgba(0,0,0,0.5)'; // Exemplo de destaque
                            }

                        } else {
                            // Lógica das tarefas (permanece a mesma)
                            const colors = {
                                high: { backgroundColor: '#FFDAD8', color: '#F5222D', borderColor: '#FFA39E' },
                                medium: { backgroundColor: '#FFF7AE', color: '#FAAD14', borderColor: '#FFE58F' },
                                low: { backgroundColor: '#D9F7BE', color: '#52C41A', borderColor: '#B7EB8F' },
                            };
                            // Object.assign(style, colors[event.priority] || {});
                            // É melhor usar Spread Operator para clareza em React
                            Object.assign(style, colors[event.priority] || {});
                        }
                        return { style };
                    }}
                />
            </StyledCalendarContainer>
        );
    };

    // COMPONENTE: PAINEL DE CONTROLE (Panel) com Carrossel de Charts
    const ComponentPanel = () => {
    // 1. Defina os gráficos
    const mainChartTitle = 'Gráfico de Burndown';
    const secondaryChartTitles = ['Visão Geral de Status', 'Matriz de Prioridade'];

    const MainChartComponent = CHART_COMPONENTS[mainChartTitle];
    
    return (
        <PanelContainer>

            {/* --- 1. GRÁFICO PRINCIPAL (Linha Superior) --- */}
            {/* Usamos um ChartWrapper especial para o Burndown */}
            <MainChartRowWrapper> 
                <ChartWrapper key={mainChartTitle}>
                    <h3>{mainChartTitle}</h3>
                    <ChartArea> 
                        <MainChartComponent
                            data={kanbanData}
                            sprints={sprints}
                        />
                    </ChartArea>
                </ChartWrapper>
            </MainChartRowWrapper>

            {/* --- 2. GRÁFICOS SECUNDÁRIOS (Linha Inferior) --- */}
            {/* Usamos o ChartGridWrapper para os gráficos lado a lado */}
            <ChartGridWrapper> 
                {secondaryChartTitles.map((title) => {
                    const CurrentChartComponent = CHART_COMPONENTS[title];
                    
                    return (
                        <ChartWrapper key={title}>
                            <h3>{title}</h3>
                            <ChartArea> 
                                <CurrentChartComponent
                                    data={kanbanData}
                                    sprints={sprints}
                                />
                            </ChartArea>
                        </ChartWrapper>
                    );
                })}
            </ChartGridWrapper>
        </PanelContainer>
    );
};

    // NOVO COMPONENTE: BACKLOG (list)
    const ComponentList = () => {
        // 1. Lista de todas as tarefas A FAZER (ordem original do backlog)
        const backlogTaskIds = kanbanData.columns['column-to-do'].taskIds;
        let backlogTasks = backlogTaskIds
            .map(taskId => kanbanData.tasks[taskId])
            .filter(task => task && task.id);

        // 🌟 LÓGICA DE FILTRO POR BUSCA (searchTerm)
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        if (normalizedSearchTerm) {
            backlogTasks = backlogTasks.filter(task =>
                // Procura no nome da tarefa
                task.name.toLowerCase().includes(normalizedSearchTerm) ||
                // Procura na descrição da tarefa (se existir)
                (task.description && task.description.toLowerCase().includes(normalizedSearchTerm))
            );
        }
        // FIM DA LÓGICA DE FILTRO POR BUSCA

        return (
            <BacklogContainer style={{ border: '2px solid #3133B8', overflow: 'hidden' }}>
                <h2>Backlog do Projeto ({backlogTasks.length} Tarefas encontradas)</h2>

                {/* 🌟 NOVO: Campo de Busca */}
                <input
                    type="text"
                    placeholder="Buscar tarefas por nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '15px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        fontSize: '16px'
                    }}
                />

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

                        {/* Droppable: Toda a lista é uma zona de soltura */}
                        <Droppable droppableId="backlog-list-area">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {backlogTasks.map((task, index) => (
                                        // Draggable: Cada linha é arrastável
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

                                                    {/* Select de Sprint - Mantido */}
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
                            <p style={{ marginTop: '20px', color: '#666', textAlign: 'center' }}>
                                Nenhuma tarefa encontrada no Backlog {searchTerm && `com o termo "${searchTerm}"`}.
                            </p>
                        )}
                    </TaskList>
                </DragDropContext>
            </BacklogContainer>
        );
    };

    // REMOVIDO: ComponentExit da lista de seções principais,
    // pois ele é uma AÇÃO (Logout), não um conteúdo de página.
    // O ComponentExit continuará sendo usado dentro do painel de configurações.

    // =========================================================================
    // NOVO: PAINEL DE CONFIGURAÇÕES LATERAIS
    // =========================================================================

    const UserSettingsPanel = () => {
        // Coloque as configurações aqui
        const settingsItems = [
            { name: "Ver Perfil", action: () => alert("Redirecionar para página de Perfil.") },
            { name: "Mudar Foto/Avatar", action: () => alert("Abrir modal de upload.") },
            { name: "Preferências de Notificação", action: () => alert("Abrir submenu de notificações.") },
            {
                name: `Modo Escuro: ${isDarkMode ? 'Ativado' : 'Desativado'}`,
                action: toggleTheme
            },
            // Ação de Sair agora está aqui
            { name: "Sair / Logout", action: handleLogout }, // <--- Usa o handleLogout
        ];

        return (
            <SettingsPanelContainer $isOpen={isSettingsPanelOpen} $isDarkMode={isDarkMode}>
                <SettingsHeader $isDarkMode={isDarkMode}>
                    <h3>Configurações de Usuário</h3>
                    <CloseButton onClick={toggleSettingsPanel} $isDarkMode={isDarkMode}>&times;</CloseButton>
                </SettingsHeader>

                <ProfileInfo $isDarkMode={isDarkMode}>
                    <Avatar src={genericAvatar} alt="Avatar" />
                    <p>Usuário Ativo (ID: 123)</p>
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
    // FIM DO UserSettingsPanel

    // Mapeamento de Componentes para a navegação
    // REMOVIDO: 'exit: ComponentExit' pois a navegação é feita pelo handleNavClick
    const componentMap = {
        tasks: ComponentTasks,
        calendar: ComponentCalendar,
        panel: ComponentPanel,
        list: ComponentList, // <-- AGORA É O BACKLOG
        ia: ComponentIA,
        chat: ComponentChat,
    };
    const CurrentComponent = componentMap[activeSection] || ComponentTasks;

    // ESTRUTURA PRINCIPAL DO DASHBOARD
    return (
        <HomeBody>
            <LayoutContainer $isDarkMode={isDarkMode}>
                {/* TOP BAR */}
                <TopBar>
                    <Logo src={logoMindFlow} alt="MindFlow Logo" />
                    <Avatar src={genericAvatar} alt="Perfil do Usuário" onClick={toggleSettingsPanel} />
                    <AnimatedBorder />
                </TopBar>

                {/* SIDEBAR */}
                <Sidebar>
                    <SidebarLink onClick={() => handleNavClick('tasks')} $isActive={activeSection === 'tasks'}><img src={IconNotes} alt="Tarefas" /></SidebarLink>
                    <SidebarLink onClick={() => handleNavClick('calendar')} $isActive={activeSection === 'calendar'}><img src={IconCalendar} alt="Calendário" /></SidebarLink>
                    <SidebarLink onClick={() => handleNavClick('panel')} $isActive={activeSection === 'panel'}><img src={IconDashboard} alt="Painel" /></SidebarLink>
                    <SidebarLink onClick={() => handleNavClick('list')} $isActive={activeSection === 'list'}><img src={IconList} alt="Lista / Backlog" /></SidebarLink>
                    {/* 🌟 CORREÇÃO 3: Chama handleNavClick('exit') que, por sua vez, chama handleLogout() */}
                    <LogoutLink onClick={() => handleNavClick('exit')} $isActive={activeSection === 'exit'}><img src={IconExit} alt="Exit" /></LogoutLink>
                </Sidebar>

                {/* ÁREA DE CONTEÚDO */}
                <ContentArea>
                    <CurrentComponent />
                </ContentArea>

                {/* MODAL DE TAREFAS */}
                {isModalOpen && (
                    <TaskModal
                        onClose={closeModal}
                        onSave={editingTaskId ? handleEditTask : handleAddTask}
                        onDelete={handleDeleteTask}
                        sprints={Object.values(sprints)}
                        taskData={taskToEdit}
                    />
                )}

                {/* MODAL DE SPRINT */}
                {isSprintModalOpen && (
                    <SprintModal
                        onClose={handleCloseSprintModal}
                        onSave={handleSaveSprint}
                        onDelete={handleDeleteSprint}
                        sprintData={sprintToEdit}
                    />
                )}

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