import React, { useState } from 'react';
import { 
    ModalOverlay, 
    ModalContent, 
    CloseButton, 
    ModalTitle,
    FormGroup,
    FormLabel, 
    FormInput, 
    SaveButton, 
    // Se você tiver um componente para o botão de deletar (como PriorityButton), importe-o
} from './styles'; // Ajuste o caminho se necessário


function SprintModal({ onClose, onSave, onDelete, sprintData }) { 
    
    // Determina se estamos editando ou criando
    const isEditing = !!sprintData;

    // Inicialização do estado
    const [currentSprintData, setCurrentSprintData] = useState({
        ...(sprintData || {}),
        id: sprintData?.id, 
        name: sprintData?.name || '',
        startDate: sprintData?.startDate || '',
        endDate: sprintData?.endDate || '', 
        color: sprintData?.color || '#F0F0F0', 
    });
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setCurrentSprintData(prevData => ({
            ...prevData,
            [id]: value, 
        }));
    };
    
    const handleDelete = () => {
        if (window.confirm(`Tem certeza que deseja deletar a sprint "${currentSprintData.name}"? As tarefas nela serão movidas para o Backlog.`)) {
            onDelete(currentSprintData.id);
            onClose(); 
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!currentSprintData.name || !currentSprintData.startDate || !currentSprintData.endDate) {
            alert("🛑 Por favor, preencha todos os campos da Sprint.");
            return;
        }

        // --- VALIDAÇÕES DE DATA APERFEIÇOADAS E CORRIGIDAS ---
        
        // 1. Criação das datas com correção de FUSO HORÁRIO ('T12:00:00')
        // Isso garante que a data seja interpretada localmente, resolvendo o problema de "salto" de dia.
        const start = new Date(currentSprintData.startDate + 'T12:00:00');
        const end = new Date(currentSprintData.endDate + 'T12:00:00');
        
        const today = new Date();
        
        // 2. Normalização de Datas para o início do dia (00:00:00)
        // ESSENCIAL para a comparação de "passado" ser precisa.
        today.setHours(0, 0, 0, 0); 
        start.setHours(0, 0, 0, 0); // <-- Adicionado: Normaliza a data de início

        // 3. Validação de Datas Válidas
        if (isNaN(start) || isNaN(end)) {
            alert("🛑 As datas fornecidas são inválidas.");
            return;
        }

        // 4. Data de Início vs. Data de Término
        if (start > end) {
            alert("🛑 A data de início não pode ser posterior à data de término.");
            return;
        }

        // 5. Data de Início no Passado (CORRIGIDO)
        // Se a data de início é ESTREITAMENTE menor (<) que o início de hoje (today), então é passado.
        // Se for HOJE, ambas (start e today) terão o mesmo timestamp (00:00:00) e a condição será falsa (permitindo a criação).
        if (!isEditing && start < today) {
             alert("🛑 A data de início não pode ser no passado para uma nova Sprint.");
             return;
        }
        // ----------------------------------------------------

        // Chama a função onSave
        onSave(currentSprintData); 
        onClose(); 
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <ModalTitle>{isEditing ? 'Editar Sprint' : 'Adicionar Nova Sprint'}</ModalTitle>
                
                <form onSubmit={handleSubmit}>
                    
                    <FormGroup>
                        <FormLabel htmlFor="name">Nome da Sprint</FormLabel>
                        <FormInput id="name" type="text" placeholder="Ex: Sprint 1 - Core Features" 
                            value={currentSprintData.name}
                            onChange={handleChange}
                            required 
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <FormLabel htmlFor="startDate">Data de Início</FormLabel>
                        <FormInput id='startDate' type="date"
                            value={currentSprintData.startDate}
                            onChange={handleChange}
                            required 
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="endDate">Data de Término</FormLabel>
                        <FormInput id='endDate' type="date"
                            value={currentSprintData.endDate}
                            onChange={handleChange}
                            required 
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="color">Cor da Sprint</FormLabel>
                        <FormInput id='color' type="color"
                            value={currentSprintData.color}
                            onChange={handleChange}
                            style={{ height: '40px', width: '100px', padding: '5px', cursor: 'pointer' }}
                        />
                    </FormGroup>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                        <SaveButton type="submit" style={{ flexGrow: 1 }}>
                            {isEditing ? 'Salvar Edição' : 'Criar Sprint'}
                        </SaveButton>

                        {isEditing && (
                            <SaveButton 
                                type="button" 
                                onClick={handleDelete} 
                                style={{ 
                                    flexGrow: 0, 
                                    backgroundColor: '#ff4d4f', 
                                    width: '100px' 
                                }}
                            >
                                Deletar
                            </SaveButton>
                        )}
                    </div> 
                </form>

            </ModalContent>
        </ModalOverlay>
    );
}

export default SprintModal;