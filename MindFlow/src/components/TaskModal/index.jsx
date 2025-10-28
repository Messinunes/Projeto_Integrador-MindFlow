// src/components/TaskModal/index.jsx

import React, { useState } from 'react';
import { 
    
    ModalOverlay, 
    ModalContent, 
    CloseButton, 
    ModalTitle,
    
    
    FormGroup,
    FormLabel, 
    FormInput, 
    FormTextarea, 
    SaveButton, 
    
    
    PriorityOptions,
    PriorityButton 

} from './styles.js'; 


function TaskModal({ onClose, onSave }) { 
    
    
    const [taskData, setTaskData] = useState({
        name: '',
        description: '', 
        dueDate: '',     
        priority: 'medium' 
    });

    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setTaskData(prevData => ({
            ...prevData,
            
            [id]: value 
        }));
    };
    
    
    const handlePriorityChange = (level) => {
        setTaskData(prevData => ({
            ...prevData,
            priority: level
        }));
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        
        if (!taskData.name || !taskData.dueDate) {
            alert("Por favor, preencha o nome e a data de entrega.");
            return;
        }

        
        onSave(taskData); 
        onClose(); 
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <ModalTitle>Adicionar Nova Tarefa</ModalTitle>
                
                <form onSubmit={handleSubmit}>
                    
                    <FormGroup>
                        <FormLabel htmlFor="name">Nome da Tarefa</FormLabel>
                        
                        <FormInput id="name" type="text" placeholder="Título" 
                            value={taskData.name}
                            onChange={handleChange}
                            required 
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <FormLabel htmlFor="description">Descrição da Tarefa</FormLabel>
                        
                        <FormInput id="description" type="text" placeholder="Descrição"
                            value={taskData.description}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <FormLabel htmlFor="dueDate">Data de Entrega</FormLabel>
                        
                        <FormInput id='dueDate' type="date" placeholder='Data' 
                            value={taskData.dueDate}
                            onChange={handleChange}
                            required 
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="priority">Prioridade</FormLabel>
                        
                        <PriorityOptions>
                            
                            <PriorityButton 
                                $level="low" 
                                $isActive={taskData.priority === 'low'}
                                onClick={() => handlePriorityChange('low')}
                            >
                                Baixa
                            </PriorityButton>
                            
                            <PriorityButton 
                                $level="medium" 
                                $isActive={taskData.priority === 'medium'}
                                onClick={() => handlePriorityChange('medium')}
                            >
                                Média
                            </PriorityButton>
                            
                            <PriorityButton 
                                $level="high" 
                                $isActive={taskData.priority === 'high'}
                                onClick={() => handlePriorityChange('high')}
                            >
                                Alta
                            </PriorityButton>
                        </PriorityOptions>
                    </FormGroup>
                    
                    
                    <button type="submit">Salvar Tarefa</button> 
                </form>

            </ModalContent>
        </ModalOverlay>
    );
}

export default TaskModal;