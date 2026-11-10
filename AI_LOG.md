# AI_LOG.md - Registro de Interações com IA

Este documento registra o apoio da Inteligência Artificial como copiloto técnico no desenvolvimento do MVP **HomebrewBrewer** (Trilha A - ORM Avançado).

---

### Bloco 0: Concepção, Modelagem e Definição da Arquitetura Base

* **Solicitação 0:**
> *"Preciso definir a estrutura base do meu projeto backend para a disciplina de Banco de Dados II (Trilha A - ORM Avançado). Quero construir uma API voltada para gerenciamento de conteúdo de RPG (*HomebrewBrewer*), utilizando **Node.js, Express, Prisma ORM e PostgreSQL**, garantindo modelagem relacional estricta (1 para N), isolamento de ambiente via Docker e um MVP funcional."*


* **Resultado Obtido:**
* Definição do escopo das entidades principais (`Usuario`, `SistemaRPG`, `Homebrew`) com chaves estrangeiras e integridade referencial rigorosa.
* Configuração inicial do ambiente conteinerizado com Docker Compose para o PostgreSQL.
* Estruturação inicial do esquema do banco de dados no Prisma e setup do servidor Express conectado à camada ORM.

---

# 🤖 AI Logs & Prompt Engineering History

**Projeto:** HomelinBrewer API

**Objetivo:** Evolução de um MVP básico de CRUD para um Portal de Alta Performance com Paginação, Filtros Relacionais, Trilha de Auditoria Transacional e Interface Moderna.

---

### Bloco 1: Correção de Conexão e Integridade (Fundação)

* **Solicitação 1:**
> *"O meu terminal retornou um erro `Foreign Key constraint failed on the field: Homebrew_sistemaId_fkey` ao tentar cadastrar. Meu frontend envia ID 1, mas o banco parece estar com outro ID por causa dos seeds anteriores. Como resolver isso de forma segura no backend?"*


* **Resultado Obtido:** Lógica de validação prévia no Express/Prisma para verificar a existência de chaves estrangeiras antes de cometer a inserção no banco.

---

### Bloco 2: Arquitetura de Performance e Massa de Dados (Escalabilidade)

* **Solicitação 2:**
> *"Quero transformar meu projeto em um portal de alta performance. Quero que a seeder crie 5 sistemas diferentes, e que a listagem embaixo seja extremamente eficiente, com filtros e paginação no servidor (Server-Side Pagination), para que eu possa gerenciar cerca de 200 homebrews. Arquiteture como isso pode ficar e me passe o código."*


* **Resultado Obtido:** Inclusão de índices de busca (`@@index`) no Prisma, paginação controlada por lotes (`skip`/`take`), e script de seed automatizado gerando massa de dados realista.

---

### Bloco 3: Funcionalidade de Edição (CRUD Completo)

* **Solicitação 3:**
> *"Antes disso, quero poder atualizar uma homebrew de escolha. Me passe o passo a passo dessa implementação e atualize a interface."*


* **Resultado Obtido:** Rota de atualização `PUT` no backend e adaptação do modal frontend para servir tanto para criação quanto para edição dinâmica de registros.

---

### Bloco 4: Trilha de Auditoria Transacional (Governança de Dados)

* **Solicitação 4:**
> *"Para mostrar as atualizações via Prisma, me faça um novo arquivo contendo alterações para que qualquer mudança no sistema eu tenha um log contendo a ação feita, a homebrew de quem foi apagada, a data, e o JSON da requisição guardado."*


* **Resultado Obtido:** Criação da tabela relacional `LogAuditoria` via Migration do Prisma, interceptadores de salvamento de log para `CREATE`, `UPDATE` e `DELETE`, e interface web com painel flutuante de inspeção de payloads em formato JSON.

---

### Bloco 5: Escalabilidade e Paginação de Logs (Infinite/Load More)

* **Solicitação 5:**
> *"A visualização dos meus logs mostra tudo de uma vez. Quero um 'carregar mais 20', com os logs mais novos aparecendo primeiro, indo até os mais antigos."*


* **Resultado Obtido:** Ajuste da rota de logs com ordenação descendente (`createdAt: 'desc'`) e paginação baseada em cliques no botão de expansão de lotes no modal.

---

### Bloco 6: Carga Real e Filtros Avançados (Maturidade do Sistema)

* **Solicitação 6:**
> *"Quero atualizar a minha seeder para ter ao menos 41 logs registrados e 300 homebrews aleatórias. E quero adicionar também, aos filtros, um filtro por autor."*


* **Resultado Obtido:** Expansão da massa de dados para 300 itens e 45 logs retroativos na seeder, e implementação do multi-filtro reativo por Sistema e por Autor simultaneamente na API e na interface.