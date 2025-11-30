import React, { useState } from 'react';
import { openExpedient, closeExpedient, isExpedientOpen } from '../services/TicketService';

// Removida a prop className desnecessária, usando a classe exp-control diretamente.
const ExpedientControl = ({ onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(isExpedientOpen());

    const handleToggleExpedient = () => {
        let newStatus;
        if (isOpen) {
            newStatus = closeExpedient();
            alert('Expediente Encerrado. Senhas não atendidas foram descartadas.');
        } else {
            newStatus = openExpedient();
            alert('Expediente Aberto. Boas-vindas!');
        }
        setIsOpen(newStatus);
        onStatusChange(newStatus);
    };

    const statusClass = isOpen ? 'status-open' : 'status-closed';
    // Nova classe de botão no CSS: btn-exp + btn-exp-open/close
    const buttonClass = isOpen ? 'btn-exp-close' : 'btn-exp-open';

    return (
        <div className="exp-control">
            <h4 className="exp-header">Controle de Expediente:</h4>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <span className={`exp-status ${statusClass}`}>
                    Status: {isOpen ? 'ABERTO' : 'FECHADO'}
                </span>
                <button 
                    className={`btn-exp ${buttonClass}`}
                    onClick={handleToggleExpedient}
                >
                    {isOpen ? 'Fechar' : 'Abrir Expediente'}
                </button>
            </div>
        </div>
    );
};

export default ExpedientControl;