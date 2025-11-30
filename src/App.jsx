import React, { useState, useEffect } from 'react';
import Totem from './pages/Totem';
import Painel from './pages/Painel';
import Atendente from './pages/Atendente';
import Relatorio from './pages/Relatorio';
import ExpedientControl from './components/ExpedientControl';
import { isExpedientOpen, resetAllData, checkAndManageExpedient } from './services/TicketService'; 


function App() {
    const [view, setView] = useState('Atendente'); 
    const [callUpdate, setCallUpdate] = useState(0); 
    const [expedientStatus, setExpedientStatus] = useState(isExpedientOpen()); 

    const handleUpdate = () => {
        setCallUpdate(prev => prev + 1);
    };

    const handleExpedientChange = (newStatus) => {
        setExpedientStatus(newStatus);
        handleUpdate(); 
    };

    useEffect(() => {
        checkAndManageExpedient(); 
        setExpedientStatus(isExpedientOpen());
        
        const interval = setInterval(() => {
            const statusChanged = checkAndManageExpedient();
            if (statusChanged) {
                setExpedientStatus(isExpedientOpen());
                handleUpdate();
            }
        }, 60000); 

        return () => clearInterval(interval);
    }, []); 

    const handleResetAll = () => {
        if (window.confirm('Tem certeza que deseja LIMPAR TODOS OS DADOS (fila, histórico e relatórios)? Esta ação é IRREVERSÍVEL.')) {
            resetAllData();
            setExpedientStatus(false); 
            handleUpdate(); 
            setView('Atendente'); 
            alert('Todos os dados foram resetados com sucesso. O sistema está pronto para um novo ciclo.');
        }
    };


    const renderView = () => {
        switch (view) {
            case 'Totem':
                return <Totem onNewTicket={handleUpdate} isExpedientOpen={expedientStatus} />; 
            case 'Atendente':
                return <Atendente onCallUpdate={handleUpdate} />;
            case 'Relatorio':
                return <Relatorio />;
            case 'Painel':
            default:
                return <Painel lastTicketUpdate={callUpdate} />;
        }
    };

    const getViewHeader = (currentView) => {
        switch (currentView) {
            case 'Atendente':
                return { title: 'Atendimento (AA)', subtitle: 'Controle de guichê e chamadas.' };
            case 'Painel':
                return { title: 'Painel de Chamadas (AC)', subtitle: 'Visualização da fila e chamadas atuais.' };
            case 'Totem':
                return { title: 'Totem de Senhas (AC)', subtitle: 'Emissão de novas senhas de serviço.' };
            case 'Relatorio':
                return { title: 'Relatórios', subtitle: 'Análise de performance e histórico de atendimentos.' };
            default:
                return { title: '', subtitle: '' };
        }
    };

    const header = getViewHeader(view);

    return (
        <div className="app-layout">
            
            {}
            <div className="sidebar">
                <div className="nav-top">
                    <div className="brand">
                         Sistema de Filas
                    </div>
                    
                    <div className="nav-menu">
                        <button 
                            className={`nav-item ${view === 'Atendente' ? 'active' : ''}`} 
                            onClick={() => setView('Atendente')}
                        >
                            <span>Atendente (AA)</span>
                        </button>
                        <button 
                            className={`nav-item ${view === 'Painel' ? 'active' : ''}`} 
                            onClick={() => setView('Painel')}
                        >
                            <span>Painel (AC)</span>
                        </button>
                        <button 
                            className={`nav-item ${view === 'Totem' ? 'active' : ''}`} 
                            onClick={() => setView('Totem')}
                        >
                            <span>Totem (AC)</span>
                        </button>
                        <button 
                            className={`nav-item ${view === 'Relatorio' ? 'active' : ''}`} 
                            onClick={() => setView('Relatorio')}
                        >
                            <span>Relatórios</span>
                        </button>
                    </div>
                </div>

                {}
                <div className="nav-bottom" style={{ padding: '20px 15px 15px', borderTop: '1px solid #333' }}>
                    <button 
                        className="btn-reset" 
                        onClick={handleResetAll}
                        style={{ backgroundColor: '#d32f2f', color: 'white', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                    >
                        Limpar Todos os Dados
                    </button>
                </div>
            </div>

            {}
            <div className="main-content">
                
                <div className="header-section">
                    <h1>{header.title}</h1>
                    <p>{header.subtitle}</p>
                </div>

                {}
                {view !== 'Relatorio' && (
                    <ExpedientControl 
                        onStatusChange={handleExpedientChange} 
                        currentStatus={expedientStatus}
                    />
                )}

                <div className="app-content">
                    {renderView()}
                </div>
            </div>
        </div>
    );
}

export default App;