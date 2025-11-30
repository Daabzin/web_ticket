const format2Digits = (num) => String(num).padStart(2, '0');
const STORAGE_KEY = 'webTicketData';

const INITIAL_STATE = {
    queue: [], 
    sequenceCounters: { SP: 0, SG: 0, SE: 0 }, 
    lastCalledType: null, 
    lastCalledTickets: [],
    isExpedientOpen: false,
    lastUpdateDate: new Date().toISOString().slice(0, 10)
};

const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toISOString().slice(0, 10);
        
        if (data.lastUpdateDate === today) {
            return data;
        }
        
        return {
            ...INITIAL_STATE,
            queue: data.queue || [], 
            lastUpdateDate: today,
            isExpedientOpen: false, 
            sequenceCounters: { SP: 0, SG: 0, SE: 0 }
        };
    }
    
    return INITIAL_STATE;
};

let state = loadState();
saveState(); 

export const openExpedient = () => {
    state.isExpedientOpen = true;
    saveState();
    return state.isExpedientOpen;
};

export const closeExpedient = () => {
    state.queue = state.queue.map(ticket => {
        if (!ticket.callTime && !ticket.isServed && !ticket.isDiscarded) {
            return { ...ticket, isDiscarded: true };
        }
        return ticket;
    });
    
    state.isExpedientOpen = false;
    saveState();
    return state.isExpedientOpen;
};

export const isExpedientOpen = () => state.isExpedientOpen;


export const checkAndManageExpedient = () => {
    const now = new Date();
    const currentHour = now.getHours();
    let statusChanged = false;

    const today = now.toISOString().slice(0, 10);
    if (state.lastUpdateDate !== today) {
        state = loadState();
        statusChanged = true;
    }
    
    if (currentHour >= 7 && currentHour < 17 && !state.isExpedientOpen) {
        openExpedient(); 
        statusChanged = true;
    } 
    
    if (currentHour >= 17 && state.isExpedientOpen) {
        closeExpedient(); 
        statusChanged = true;
    }
    
    return statusChanged;
};


const generateTicketNumber = (type) => {
    const now = new Date();
    const YY = format2Digits(now.getFullYear() % 100);
    const MM = format2Digits(now.getMonth() + 1);
    const DD = format2Digits(now.getDate());

    state.sequenceCounters[type]++;
    const SQ = format2Digits(state.sequenceCounters[type]);

    return `${YY}${MM}${DD}-${type}${SQ}`;
};

export const issueTicket = (type) => {
    if (!state.isExpedientOpen) {
        throw new Error('O expediente está fechado. Não é possível emitir senhas.');
    }
    
    const ticketNumber = generateTicketNumber(type);
    
    const isDiscarded = Math.random() < 0.05;

    const newTicket = {
        number: ticketNumber,
        type: type,
        issueTime: new Date().toISOString(),
        callTime: null,
        serveTime: null,
        servedByGuiche: null,
        isServed: false,
        isDiscarded: isDiscarded, 
    };

    state.queue.push(newTicket);
    saveState();
    
    return isDiscarded ? null : newTicket;
};

export const getNextTicketToCall = () => {
    const availableQueue = state.queue.filter(t => !t.callTime && !t.isDiscarded);
    
    if (availableQueue.length === 0) {
        return null; 
    }

    const SP_Tickets = availableQueue.filter(t => t.type === 'SP');
    const SE_Tickets = availableQueue.filter(t => t.type === 'SE');
    const SG_Tickets = availableQueue.filter(t => t.type === 'SG');
    
    let nextTicket = null;
    let newLastCalledType = null;
    
    if (state.lastCalledType === 'SP') {
        if (SE_Tickets.length > 0) {
            nextTicket = SE_Tickets[0];
            newLastCalledType = 'SE';
        } else if (SG_Tickets.length > 0) {
            nextTicket = SG_Tickets[0];
            newLastCalledType = 'SG';
        }
    } else {
        if (SP_Tickets.length > 0) {
            nextTicket = SP_Tickets[0];
            newLastCalledType = 'SP';
        }
    }

    if (!nextTicket) {
        if (SP_Tickets.length > 0) {
            nextTicket = SP_Tickets[0];
            newLastCalledType = 'SP';
        } else if (SE_Tickets.length > 0) {
            nextTicket = SE_Tickets[0];
            newLastCalledType = 'SE';
        } else if (SG_Tickets.length > 0) {
            nextTicket = SG_Tickets[0];
            newLastCalledType = 'SG';
        }
    }
    
    if (nextTicket) {
        state.lastCalledType = newLastCalledType;
    }

    return nextTicket;
};


export const callNextTicket = (guiche) => {
    const nextTicket = getNextTicketToCall();
    
    if (!nextTicket) {
        return null; 
    }

    const now = new Date();
    const ticketIndex = state.queue.findIndex(t => t.number === nextTicket.number);
    
    if (ticketIndex !== -1) {
        state.queue[ticketIndex].callTime = now.toISOString();
        state.queue[ticketIndex].servedByGuiche = guiche;
        
        const calledTicket = state.queue[ticketIndex];
        state.lastCalledTickets = [calledTicket, ...state.lastCalledTickets].slice(0, 5);
        
        saveState();
        return calledTicket;
    }

    return null;
};

export const finishTicketService = (ticketNumber) => {
    const ticketIndex = state.queue.findIndex(t => t.number === ticketNumber);
    
    if (ticketIndex === -1 || state.queue[ticketIndex].isServed) {
        return null;
    }

    const ticket = state.queue[ticketIndex];
    let tmSeconds = 0;
    
    if (ticket.type === 'SP') {
        tmSeconds = (10 + Math.floor(Math.random() * 11)) * 60; 
    } else if (ticket.type === 'SG') {
        tmSeconds = (2 + Math.floor(Math.random() * 7)) * 60; 
    } else if (ticket.type === 'SE') {
        tmSeconds = Math.random() < 0.95 
            ? Math.floor(Math.random() * 60) 
            : 5 * 60; 
    }

    const callTime = new Date(ticket.callTime).getTime();
    const simulatedServeTime = new Date(callTime + tmSeconds * 1000).toISOString(); 
    
    ticket.serveTime = simulatedServeTime;
    ticket.isServed = true;

    saveState();
    return ticket;
};


export const getQueue = () => state.queue;
export const getLastCalledTickets = () => state.lastCalledTickets;
export const getTicketsInWaiting = () => state.queue.filter(t => t.callTime === null && !t.isDiscarded);
export const getTicketsBeingServed = () => state.queue.filter(t => t.callTime !== null && t.serveTime === null);
export const getTicketsServed = () => state.queue.filter(t => t.isServed);


export const resetAllData = () => {
    const lastUpdateDate = state.lastUpdateDate;
    
    state = { 
        ...INITIAL_STATE, 
        lastUpdateDate: lastUpdateDate,
        isExpedientOpen: false, 
        queue: [], 
    };

    saveState();
    return true; 
};