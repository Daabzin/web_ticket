# web_ticket: Sistema de Controle de Atendimento

## Descrição do Projeto

Este projeto é um **Sistema de Controle de Filas (Sistema de Tickets)** que simula a gestão de atendimento em um laboratório médico, seguindo os requisitos de priorização, numeração e relatório.

O sistema opera com três interfaces: Totem (emissão de senhas), Painel (visualização de chamadas) e Atendente (controle de guichês).

---

## Tecnologias

* **Frontend:** **React** (JSX)
* **Persistência:** **LocalStorage** (Simulação do Agente Sistema - AS).

---

## Como Rodar o Projeto

### Pré-requisitos

* Node.js e npm (ou yarn) instalados.
### Instalação e Execução

1. Clone o repositório:
    ```bash
    git clone https://github.com/Daabzin/web_ticket.git
    cd web_ticket
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    ```
    O aplicativo será aberto em http://localhost:3000.

## Funcionalidades Chave Implementadas

* **Priorização:** Suporte a **SP**, **SG** e **SE**.
* **Controle de Fluxo:** Implementação da **Regra de Atendimento Alternado**: `[SP] -> [SE|SG]`.
* **Expediente:** Controle de abertura e **fechamento automático às 17:00h**.
* **Numeração:** Padrão diário **`YYMMDD-PPSQ`**.
* **Relatórios:** Cálculo de **Tempo Médio (TM)** e quantitativos de senhas.

---

## Membros do Grupo

* Allan Felipe Aguiar Araújo - 01731530
* Carlos Jeanison dos Santos Filho - 01734107
* Davi Lopes de Melo - 01730826
* João Henrique da Silva Lima - 01696493
* João Henrique Moura Freitas - 01722388