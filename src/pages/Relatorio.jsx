import React from 'react';
import { getQueue, getTicketsServed } from '../services/TicketService';

const TICKET_TYPES = ['SP', 'SG', 'SE'];

const calculateTimeDiffInMinutes = (start, end) => {
    if (!start || !end) return 0;
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    return diffMs / (1000 * 60); 
};

const generateReportData = () => {
    const allTickets = getQueue();
    const servedTickets = getTicketsServed();

    const issuedCounts = { General: allTickets.length, SP: 0, SG: 0, SE: 0 };
    const servedCounts = { General: servedTickets.length, SP: 0, SG: 0, SE: 0 };
    const tmData = { SP: { total: 0, count: 0 }, SG: { total: 0, count: 0 }, SE: { total: 0, count: 0 } };

    allTickets.forEach(ticket => {
        issuedCounts[ticket.type]++;
        
        if (ticket.isServed) {
            servedCounts[ticket.type]++;

            const tm = calculateTimeDiffInMinutes(ticket.callTime, ticket.serveTime);
            if (TICKET_TYPES.includes(ticket.type)) {
                tmData[ticket.type].total += tm;
                tmData[ticket.type].count++;
            }
        }
    });

    const averageTM = {};
    TICKET_TYPES.forEach(type => {
        if (tmData[type].count > 0) {
            averageTM[type] = (tmData[type].total / tmData[type].count).toFixed(2); 
        } else {
            averageTM[type] = 'N/A';
        }
    });
    
    const detailedReport = allTickets.map(ticket => ({
        number: ticket.number,
        type: ticket.type,
        issueTime: new Date(ticket.issueTime).toLocaleTimeString('pt-BR'),
        issueDate: new Date(ticket.issueTime).toLocaleDateString('pt-BR'),
        callTime: ticket.callTime ? new Date(ticket.callTime).toLocaleTimeString('pt-BR') : '-',
        serveTime: ticket.serveTime ? new Date(ticket.serveTime).toLocaleTimeString('pt-BR') : '-',
        servedByGuiche: ticket.servedByGuiche || '-',
        status: ticket.isServed ? 'Atendido' : (ticket.isDiscarded ? 'Descartado (AC)' : 'Aguardando/Fila')
    }));

    return { issuedCounts, servedCounts, averageTM, detailedReport };
};


const Relatorio = () => {
    const { issuedCounts, servedCounts, averageTM, detailedReport } = generateReportData();

    return (
        <div className="card-container relatorio-container">
            <h1 className="relatorio-header">Relatórios Diário/Mensal de Atendimento</h1>
            <p className="relatorio-date-info">Dados desde o último reset da sequência diária.</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total de Senhas Emitidas</h3>
                    <p className="main-stat">{issuedCounts.General}</p>
                </div>
                <div className="stat-card">
                    <h3>Total de Senhas Atendidas</h3>
                    <p className="main-stat">{servedCounts.General}</p>
                </div>
            </div>
            
            <h2 className="section-header">Resumo por Prioridade</h2>
            
            <table className="relatorio-table">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Emitidas</th>
                        <th>Atendidas</th>
                        <th>TM Médio (min)</th>
                    </tr>
                </thead>
                <tbody>
                    {TICKET_TYPES.map(type => (
                        <tr key={type}>
                            <td>{type}</td>
                            <td>{issuedCounts[type]}</td>
                            <td>{servedCounts[type]}</td>
                            <td>{averageTM[type]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="section-header">Relatório Detalhado das Senhas</h2>
            
            <div className="table-detailed-scroll">
                <table className="table-detailed">
                    <thead>
                        <tr>
                            <th>Nº Senha</th>
                            <th>Tipo</th>
                            <th>Emissão (Hora)</th>
                            <th>Chamada (Hora)</th>
                            <th>Atendimento (Hora)</th>
                            <th>Guichê</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailedReport.map((ticket, index) => (
                            <tr key={index}>
                                <td>{ticket.number}</td>
                                <td>{ticket.type}</td>
                                <td>{ticket.issueTime}</td>
                                <td>{ticket.callTime}</td>
                                <td>{ticket.serveTime}</td>
                                <td>{ticket.servedByGuiche}</td>
                                <td>{ticket.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Relatorio;