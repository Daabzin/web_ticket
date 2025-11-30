import React, { useState, useEffect } from 'react';
import { issueTicket } from '../services/TicketService';

const Totem = ({ onNewTicket, isExpedientOpen }) => {
    const [message, setMessage] = useState('Selecione o tipo de senha.');

    useEffect(() => {
        if (!isExpedientOpen) {
            setMessage('Expediente FECHADO. Não é possível emitir novas senhas.');
        } else {
            setMessage('Selecione o tipo de senha.');
        }
    }, [isExpedientOpen]);

    const handleIssueTicket = (type) => {
        if (!isExpedientOpen) {
            setMessage('Operação negada: O expediente está fechado.');
            return;
        }

        try {
            const ticket = issueTicket(type);
            
            if (ticket) {
                setMessage(`Senha emitida! Seu número é: ${ticket.number}. Aguarde no painel.`);
                onNewTicket(ticket); 
            } else {
                setMessage('Houve um problema. Por favor, tente novamente (descarte AC - 5%).'); 
            }
        } catch (error) {
            setMessage(`ERRO: ${error.message}`);
        }

        setTimeout(() => setMessage(isExpedientOpen ? 'Selecione o tipo de senha.' : 'Expediente FECHADO.'), 10000);
    };

    return (
        <div className="card-container totem-container">
            <h1 className="totem-header">Totem de Emissão de Senhas (AC)</h1>
            <p className="totem-message">{message}</p>
            <div className="totem-btn-group">
                <button 
                    className="btn-base totem-button btn-sp" 
                    onClick={() => handleIssueTicket('SP')}
                    disabled={!isExpedientOpen}
                >
                    Senha Prioritária (SP)
                </button>
                <button 
                    className="btn-base totem-button btn-sg" 
                    onClick={() => handleIssueTicket('SG')}
                    disabled={!isExpedientOpen}
                >
                    Senha Geral (SG)
                </button>
                <button 
                    className="btn-base totem-button btn-se" 
                    onClick={() => handleIssueTicket('SE')}
                    disabled={!isExpedientOpen}
                >
                    Retirada de Exames (SE)
                </button>
            </div>
        </div>
    );
};

export default Totem;