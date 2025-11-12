import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Cores que representam o status das tarefas (Backlog, In Progress, Done)
const COLORS = {
    'column-to-do': '#FF8042',        // Laranja (A Fazer / Backlog)
    'column-in-progress': '#FFBB28',  // Amarelo (Em Andamento)
    'column-done': '#00C49F',         // Verde (Finalizado)
};

const StatusChart = ({ data }) => {
    // 1. Processar os dados do Kanban para o formato do Recharts
    const processedData = data.columnOrder.map(columnId => {
        const column = data.columns[columnId];
        return {
            name: column.title,
            value: column.taskIds.length,
            color: COLORS[columnId]
        };
    }).filter(item => item.value > 0); // Remove colunas vazias do gráfico
    
    // Se não houver tarefas, mostramos uma mensagem
    if (processedData.length === 0) {
        return <p style={{ color: '#aaa' }}>Nenhuma tarefa encontrada para gerar o Gráfico de Status.</p>;
    }

    // Função para renderizar o label da Pie Chart com a porcentagem
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={processedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel} // Exibe o label customizado com porcentagem
                >
                    {processedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value, name) => [`${value} tarefas`, name]} 
                    labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default StatusChart;