import React, { useEffect, useState } from 'react';
import { getLastCalledTickets } from '../services/TicketService';

const Painel = ({ lastTicketUpdate }) => {
    const [lastCalled, setLastCalled] = useState(getLastCalledTickets());

    useEffect(() => {
        setLastCalled(getLastCalledTickets());
        
        const intervalId = setInterval(() => {
            setLastCalled(getLastCalledTickets());
        }, 5000); 

        return () => clearInterval(intervalId);
    }, [lastTicketUpdate]); 

    return (
        <div className="card-container painel-container">
            <h1 className="painel-header">Painel de Chamadas</h1>
            <p className="painel-sub-header">Últimas 5 Senhas Chamadas</p>
            
            <div className="current-call">
                {lastCalled.length > 0 ? (
                    <>
                        <div className="current-number">{lastCalled[0].number}</div>
                        <div className="current-guiche">Dirija-se ao Guichê {lastCalled[0].servedByGuiche}</div>
                    </>
                ) : (
                    <div className="no-call">Aguardando a primeira chamada.</div>
                )}
            </div>

            <div className="painel-history">
                <h3>Histórico</h3>
                {lastCalled.slice(1).map((ticket, index) => (
                    <div key={index} className="history-item">
                        <span className="history-number">{ticket.number}</span>
                        <span className="history-guiche">Guichê {ticket.servedByGuiche}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Painel;