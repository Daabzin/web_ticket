# web_ticket: Sistema de Controle de Atendimento

## Descrição do Projeto

Este projeto é um sistema de controle de filas (Sistema de Tickets) que simula a gestão de atendimento em um laboratório médico, seguindo os requisitos de priorização, numeração e relatório definidos em escopo.

O sistema opera com três interfaces principais: Totem (emissão de senhas), Painel (visualização de chamadas) e Painel do Atendente (controle de guichês e chamadas).

**Tecnologias:**

* **Frontend:** React (JSX)
* **Persistência:** LocalStorage (Simulação do Agente Sistema - AS)

## Como Rodar o Projeto

### Pré-requisitos

* Node.js e npm (ou yarn) instalados.

### Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Daabzin/web_ticket.git](https://github.com/Daabzin/web_ticket.git)
    cd web_ticket
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```
    O aplicativo será aberto em `http://localhost:3000`.

## Funcionalidades Chave

* **Priorização:** SP (Prioritária), SG (Geral), SE (Exames).
* **Controle de Fluxo:** Regra alternada de atendimento `[SP] -> [SE|SG]`.
* **Expediente:** Controle de abertura/fechamento com descarte de senhas pendentes.
* **Numeração:** Padrão diário `YYMMDD-PPSQ`.
* **Relatórios:** Cálculo de Tempo Médio (TM) e quantitativos de senhas emitidas e atendidas.
* **Reset de Dados:** Função para limpar todo o histórico e fila.

## Membros do Grupo

* [Allan Felipe Aguiar Araújo - 01731530]
* [Carlos Jeanison dos Santos Filho - 01734107]
* [Davi Lopes de Melo - 01730826]
* [João Henrique da Silva Lima - 01696493]
* [João Henrique Moura Freitas - 01722388]