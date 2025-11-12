import React from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import { differenceInDays, addDays, format } from 'date-fns';

const BurndownChart = ({ data, sprints }) => {
    
    // 🛑 1. TRATAMENTO DE ERRO: Verifica se as props básicas estão disponíveis
    if (!sprints || Object.keys(sprints).length === 0) {
        return <p style={{ color: '#aaa', textAlign: 'center' }}>⚠️ Nenhuma informação de Sprints disponível.</p>;
    }
    if (!data || !data.tasks) {
        return <p style={{ color: '#aaa', textAlign: 'center' }}>⚠️ Dados de tarefas (data.tasks) indisponíveis.</p>;
    }

    // 2. Encontrar a Sprint Ativa (vamos usar a primeira sprint como exemplo)
    const activeSprintId = Object.keys(sprints)[0];
    const activeSprint = sprints[activeSprintId];

    if (!activeSprint) {
        return <p style={{ color: '#aaa', textAlign: 'center' }}>⚠️ Nenhuma Sprint ativa para gerar o Burndown Chart.</p>;
    }

    // 3. Definir Datas e Trabalho Total
    const startDate = new Date(activeSprint.startDate);
    const endDate = new Date(activeSprint.endDate);
    
    // Total de dias da Sprint (incluindo início e fim)
    const totalDays = differenceInDays(endDate, startDate) + 1;

    // Total de tarefas que pertencem à sprint
    const sprintTaskIds = Object.values(data.tasks)
        .filter(task => task.sprintId === activeSprintId)
        .map(task => task.id);
        
    const totalWork = sprintTaskIds.length;

    // 🛑 4. TRATAMENTO DE ERRO: Nenhuma tarefa na sprint
    if (totalWork === 0) {
        return <p style={{ color: '#aaa', textAlign: 'center' }}>📊 Não há tarefas associadas à Sprint Ativa. Adicione tarefas para visualizar o Burndown.</p>;
    }
    
    // Variáveis auxiliares para as contagens ATUAIS
    // Usando operadores de coalescência nula (?? {}) e checagem de existência:
    const doneCount = Object.keys(data.columns?.['column-done']?.taskIds ?? {})
        .filter(taskId => sprintTaskIds.includes(taskId)).length;
    
    const remainingCount = Object.keys(data.columns?.['column-to-do']?.taskIds ?? {})
        .filter(taskId => sprintTaskIds.includes(taskId)).length + 
        Object.keys(data.columns?.['column-in-progress']?.taskIds ?? {})
        .filter(taskId => sprintTaskIds.includes(taskId)).length;
    
    const chartData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < totalDays; i++) {
        const date = addDays(startDate, i);
        const dateString = format(date, 'dd/MM');

        // LINHA IDEAL:
        // Correção para evitar divisão por zero, caso haja apenas 1 dia
        const idealRemaining = totalWork - (totalWork / (totalDays - 1 > 0 ? totalDays - 1 : 1)) * i; 
        const ideal = Math.max(0, idealRemaining);

        // LINHA REAL: (Lógica simplificada para a demonstração do gráfico)
        let real = totalWork;
        
        if (i === 0) {
            real = totalWork;
        } else if (differenceInDays(date, today) === 0) {
            real = remainingCount; 
        } else if (date < today) {
             // Simulação de queima de trabalho para dias passados
            const daysPassed = differenceInDays(date, startDate);
            const workBurned = totalWork - remainingCount;
            const avgBurnRate = workBurned / (differenceInDays(today, startDate) || 1);
            
            real = totalWork - (avgBurnRate * daysPassed);
            real = Math.max(real, remainingCount); // Não pode ser menor que o restante atual
        } else {
            // Dias futuros: mostra o trabalho restante atual
            real = remainingCount;
        }
        
        chartData.push({
            name: dateString,
            Ideal: Math.ceil(ideal),
            Real: Math.ceil(real),
        });
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                // AJUSTE 1: Aumentar a margem esquerda (left) para acomodar o rótulo do eixo Y
                margin={{ top: 20, right: 30, left: 40, bottom: 0 }} 
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                
                {/* AJUSTE 2: Rotação e posicionamento para evitar sobreposição no eixo X */}
                <XAxis 
                    dataKey="name" 
                    interval="preserveStartEnd" // Tenta manter as pontas
                    tick={{ angle: -45, textAnchor: 'end', fontSize: 10 }} // Rotação e tamanho da fonte
                    height={60} // Aumenta a altura do eixo para acomodar a rotação
                />
                
                {/* AJUSTE 3: Ajuste do label do eixo Y para evitar corte */}
                <YAxis 
                    label={{ 
                        value: 'Tarefas Restantes', 
                        angle: -90, 
                        position: 'left', // Posição `left` é melhor que `insideLeft` aqui
                        dx: -0 // Deslocamento horizontal para afastar o rótulo da borda
                    }} 
                    domain={[0, totalWork]}
                    tickCount={6} // Define o número de ticks para melhorar a leitura
                />
                
                <Tooltip />
                <Legend />
                
                <Line 
                    type="linear" 
                    dataKey="Ideal" 
                    stroke="#5a52d9" 
                    strokeDasharray="5 5"
                    activeDot={{ r: 5 }} // Pontos menores
                    dot={false}
                />
                
                <Line 
                    type="monotone" 
                    dataKey="Real" 
                    stroke="#FF0000"
                    strokeWidth={2}
                    activeDot={{ r: 5 }} // Pontos menores
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BurndownChart;