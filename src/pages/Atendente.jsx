import React, { useState } from 'react';
import { 
    callNextTicket, 
    finishTicketService, 
    getTicketsInWaiting, 
    getTicketsBeingServed,
} from '../services/TicketService';

const GUICHES = ['Guichê 1', 'Guichê 2', 'Guichê 3', 'Guichê 4'];

const Atendente = ({ onCallUpdate }) => {
    const [updateKey, setUpdateKey] = useState(0); 
    const [guicheSelected, setGuicheSelected] = useState(GUICHES[0]);
    const [message, setMessage] = useState('');

    const ticketsBeingServed = getTicketsBeingServed();
    const ticketsInWaiting = getTicketsInWaiting();

    const forceUpdate = () => setUpdateKey(prev => prev + 1);

    const handleCallNext = () => {
        if (!guicheSelected) {
            setMessage('Selecione um guichê antes de chamar.');
            return;
        }

        const isGuicheBusy = ticketsBeingServed.some(t => t.servedByGuiche === guicheSelected);
        if (isGuicheBusy) {
            setMessage(`O ${guicheSelected} está ocupado. Finalize o atendimento atual primeiro.`);
            return;
        }

        const calledTicket = callNextTicket(guicheSelected);
        
        if (calledTicket) {
            setMessage(`Chamando ${calledTicket.number} para ${guicheSelected}!`);
            onCallUpdate(calledTicket); 
        } else {
            setMessage('Fila de atendimento vazia.');
        }
        
        forceUpdate();
    };

    const handleFinishService = (ticketNumber) => {
        const finishedTicket = finishTicketService(ticketNumber);
        if (finishedTicket) {
            setMessage(`Atendimento da senha ${finishedTicket.number} finalizado. Guichê liberado.`);
        } else {
            setMessage('Erro ao finalizar atendimento.');
        }
        forceUpdate();
    };

    return (
        <div className="card-container atendente-container">
            <h1 className="atendente-header">Painel do Atendente (AA)</h1>
            <p className="atendente-message">{message}</p>

            <div className="control-section">
                <h3>Guichê em Operação:</h3>
                <select 
                    className="atendente-select"
                    value={guicheSelected} 
                    onChange={(e) => setGuicheSelected(e.target.value)}
                >
                    {GUICHES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                
                <button 
                    className="btn-base btn-call" 
                    onClick={handleCallNext}
                >
                    Chamar Próxima Senha
                </button>
            </div>

            <div className="lists-container">
                <div className="atendente-list">
                    <h3>Clientes em Atendimento ({ticketsBeingServed.length})</h3>
                    {ticketsBeingServed.length === 0 ? (
                        <p>Nenhum guichê ocupado.</p>
                    ) : (
                        ticketsBeingServed.map(ticket => (
                            <div key={ticket.number} className="serving-item">
                                <span>{ticket.number} ({ticket.type}) no {ticket.servedByGuiche}</span>
                                <button 
                                    className="btn-base btn-finish"
                                    onClick={() => handleFinishService(ticket.number)}
                                >
                                    Finalizar
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="atendente-list">
                    <h3>Clientes Aguardando ({ticketsInWaiting.length})</h3>
                    {ticketsInWaiting.length === 0 ? (
                        <p>Fila de espera vazia.</p>
                    ) : (
                        ticketsInWaiting.map(ticket => (
                            <div key={ticket.number} className="waiting-item">
                                <span>{ticket.number} ({ticket.type})</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Atendente;