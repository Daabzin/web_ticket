# Lista de Tarefas (TODO)

## Implementação Pendente

* Implementar a checagem automática de horário (7h às 17h) para abertura e fechamento do expediente.
* Refinar a lógica de priorização em caso de filas vazias para garantir a aderência total ao ciclo.

## Melhorias de Qualidade e Usabilidade

* Adicionar alertas não-bloqueantes (toasts) em vez de `alert()` nativo.
* Refatorar o gerenciamento de estado global (atualmente via `TicketService` e `useState` no `App.jsx`).
* Melhorar a experiência do usuário (UI/UX) e a responsividade de todas as páginas.
* Incluir opção de exportação dos Relatórios Detalhados para CSV.