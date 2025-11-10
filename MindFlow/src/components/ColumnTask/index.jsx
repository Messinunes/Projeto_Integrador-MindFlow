import React from 'react';
// Lembre-se de usar o import corrigido!
import { Droppable } from '@hello-pangea/dnd'; 

import TaskItem from '../TaskItem';
import { 
    ColumnContainer, 
    Title, 
    TaskList 
} from './styles';

/**
 * Componente que renderiza uma Coluna no Quadro Kanban (A Fazer, Em Andamento, Finalizado).
 * @param {object} column - O objeto da coluna (id, title, taskIds).
 * @param {array} tasks - O array de objetos de tarefa que pertencem a esta coluna.
 */
function ColunaTask({ column, tasks, onTaskClick }) {
    return (
        // 1. Envolvemos a coluna com o Droppable
        <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
                <ColumnContainer 
                    ref={provided.innerRef} // Linka o elemento DOM para o D&D
                    {...provided.droppableProps} // Props necessárias (como IDs)
                    $isDraggingOver={snapshot.isDraggingOver} // Para estilização
                >
                    <Title $isDraggingOver={snapshot.isDraggingOver}>{column.title}</Title>
                    
                    <TaskList>
                        {/* 2. Mapeia e renderiza as tarefas */}
                        {tasks.map((task, index) => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                index={index} 
                                onTaskClick={onTaskClick}
                            />
                        ))}
                        
                        {/* 3. Placeholder que expande a área de soltura */}
                        {provided.placeholder}
                        
                    </TaskList>
                    
                </ColumnContainer>
            )}
        </Droppable>
    );
}

export default ColunaTask;