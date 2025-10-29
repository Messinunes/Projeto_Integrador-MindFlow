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
    PriorityButton,
} from './styles.js';


function TaskModal({ onClose, onSave, onDelete, sprints, taskData }) {

    const isEditing = !!taskData;
    
    // As variáveis de estado 'name' e 'description' redundantes foram removidas.

    // 💡 INICIALIZAÇÃO DE ESTADO CORRIGIDA E MAIS ROBUSTA
    // Garante que todos os campos tenham valores padrão e que o ID só exista
    // em modo de edição, resolvendo o problema de ID=undefined que vinha do modal.
    const [currentTaskData, setCurrentTaskData] = useState(() => {
        const baseData = {
            name: taskData?.name || '',
            description: taskData?.description || '',
            dueDate: taskData?.dueDate || '',
            priority: taskData?.priority || 'medium',
            sprintId: taskData?.sprintId || null,
        };

        // Inclua o ID e STATUS SOMENTE se estiver editando.
        if (taskData && taskData.id) {
            baseData.id = taskData.id;
            baseData.status = taskData.status; 
        }

        return baseData;
    });


    const handleChange = (e) => {
        const { id, value } = e.target;

        // Lógica de tratamento do sprintId: Converte "null" string em null real
        const finalValue = id === 'sprintId' && value === 'null' ? null : value;

        setCurrentTaskData(prevData => ({
            ...prevData,
            [id]: finalValue,
        }));
    };


    const handlePriorityChange = (level) => {
        setCurrentTaskData(prevData => ({
            ...prevData,
            priority: level
        }));
    };

    const handleDelete = () => {
        if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
            onDelete(currentTaskData.id);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Usando currentTaskData para validação
        if (!currentTaskData.name || !currentTaskData.dueDate) {
            alert("Por favor, preencha o nome e a data de entrega.");
            return;
        }

        // Garante que o ID não seja enviado para a função onSave se for uma nova tarefa
        const payload = { ...currentTaskData };
        if (!isEditing) {
            delete payload.id;
        }

        onSave(payload);
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <ModalTitle>{isEditing ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</ModalTitle>

                <form onSubmit={handleSubmit}>

                    <FormGroup>
                        <FormLabel htmlFor="name">Nome da Tarefa</FormLabel>
                        <FormInput id="name" type="text" placeholder="Título"
                            value={currentTaskData.name}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="description">Descrição da Tarefa</FormLabel>
                        <FormTextarea id="description" type="text" placeholder="Descrição"
                            value={currentTaskData.description}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="dueDate">Data de Entrega</FormLabel>
                        <FormInput id='dueDate' type="date" placeholder='Data'
                            value={currentTaskData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    {/* GRUPO DE PRIORIDADE */}
                    <FormGroup>
                        <FormLabel htmlFor="priority">Prioridade</FormLabel>
                        <PriorityOptions>
                            <PriorityButton
                                $level="low"
                                $isActive={currentTaskData.priority === 'low'}
                                onClick={() => handlePriorityChange('low')}
                                type="button" // <-- CORREÇÃO: Impede submissão do formulário
                            >
                                Baixa
                            </PriorityButton>
                            <PriorityButton
                                $level="medium"
                                $isActive={currentTaskData.priority === 'medium'}
                                onClick={() => handlePriorityChange('medium')}
                                type="button" // <-- CORREÇÃO
                            >
                                Média
                            </PriorityButton>
                            <PriorityButton
                                $level="high"
                                $isActive={currentTaskData.priority === 'high'}
                                onClick={() => handlePriorityChange('high')}
                                type="button" // <-- CORREÇÃO
                            >
                                Alta
                            </PriorityButton>
                        </PriorityOptions>
                    </FormGroup>

                    {/* CAMPO: SELEÇÃO DE SPRINT */}
                    <FormGroup>
                        <FormLabel htmlFor="sprintId">Associar à Sprint</FormLabel>
                        <select
                            id="sprintId"
                            value={currentTaskData.sprintId === null ? 'null' : currentTaskData.sprintId}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box'
                            }}
                        >
                            {/* Opção padrão para tarefas no Backlog */}
                            <option value="null">Nenhuma (Backlog)</option>

                            {/* Mapeia as Sprints disponíveis */}
                            {sprints && sprints.map(sprint => (
                                <option key={sprint.id} value={sprint.id}>
                                    {sprint.name} ({sprint.startDate} a {sprint.endDate})
                                </option>
                            ))}
                        </select>
                    </FormGroup>


                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <SaveButton type="submit">
                            {isEditing ? 'Salvar Edição' : 'Adicionar Tarefa'}
                        </SaveButton>

                        {/* Botão de Deletar SÓ aparece em modo de edição */}
                        {isEditing && (
                            <PriorityButton
                                onClick={handleDelete}
                                $level="high"
                                type="button" // <-- CORREÇÃO
                                style={{ backgroundColor: '#ff4d4f', color: 'white', width: '30%', marginLeft: '5px' }}
                            >
                                Deletar
                            </PriorityButton>
                        )}
                    </div>
                </form>

            </ModalContent>
        </ModalOverlay>
    );
}

export default TaskModal;