import styled, { keyframes,css } from 'styled-components';

// 1. Contêiner Principal da Coluna (Request 1 e 3)

export const ColumnContainer = styled.div`

    margin: 8px;

    border: 2px solid #4914daff;

    border-radius: 8px;

    width: 300px; /* Largura fixa para cada coluna */

    background-color: #3133B8; /* Cor de fundo da coluna (Request 3) */

    display: flex;

    padding-right: 3%;
    align-items: center;

    flex-direction: column;

    max-height: 80vh;

    /* Adiciona a barra de rolagem vertical APENAS se necessário */
    overflow-y: auto;

    /* Esconde qualquer rolagem horizontal */
    overflow-x: hidden;


    ${props => props.$isDraggingOver && css`

        /* Feedback visual quando algo está sendo arrastado sobre a coluna */

        background-color: #e3f2fd;
        border-style: dashed;

    `}



   

`;



// 2. Título da Coluna

export const Title = styled.h3`

    padding: 8px;
    margin-right: -35px !important;   
    margin: 0;
    width: 100%;    
    font-size: 1.5em;

    color: #ffffffff;

    border-bottom: 2px solid lightgrey;

    text-align: center;
    ${props => props.$isDraggingOver && css`

        color: #3133B8;
        border-bottom: 2px dashed #3133B8;

    `}
`;



// 3. Lista de Tarefas (Onde os cards caem)

// O padding e o min-height garantem que os cards caibam e o droppable tenha altura (Request 1)

export const TaskList = styled.div`

    padding: 8px;

    transition: background-color 0.2s ease;

    flex-grow: 1; /* Garante que a lista preencha o espaço restante na coluna */

    min-height: 100px; /* Garante que a área de drop seja visível */



    /* Garante que o item sendo arrastado não fique cortado */

    & > * {

        margin-bottom: 8px;

    }

`;