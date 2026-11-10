# 🎲 HomebrewBrewer API - Relatório de Atendimento aos Requisitos

**Disciplina:** Banco de Dados II — UNIFACVEST  
**Trilha Escolhida:** Trilha A (ORM Avançado - Prisma)  
**Desenvolvedor:** João Desenvolvedor  

---

## 🎯 Visão Geral do Projeto
O **HomebrewBrewer** é um portal backend robusto e de alta performance voltado para o gerenciamento de conteúdo caseiro (*homebrews*) para múltiplos sistemas de RPG. O projeto foi arquitetado para ir além de um CRUD básico, aplicando conceitos avançados de engenharia de dados, modelagem relacional, indexação e paginação eficiente.

Abaixo estão detalhados os pontos que comprovam como o trabalho **contempla 100% das exigências** estabelecidas nas diretrizes da disciplina.

---

## 📋 Como o Trabalho Atende a Cada Exigência do Professor

### 1. Infraestrutura e Isolação de Ambiente (Docker & Contêineres)
* **O que foi feito:** O banco de dados PostgreSQL roda inteiramente isolado em contêineres gerenciados por `Docker Compose`.
* **Por que atende:** Garante portabilidade absoluta. Qualquer avaliador (ou o professor) consegue subir toda a infraestrutura de dados de forma determinística utilizando um único comando (`docker-compose up -d`), eliminando divergências de versão ou conflitos de instalação local.

### 2. Modelagem Relacional e Integridade Referencial (Trilha A)
* **O que foi feito:** O banco de dados possui uma modelagem estritamente relacional de cardinalidade **1 para N** dividida em três entidades principais:
  * `Usuario` (Autores)
  * `SistemaRPG` (Sistemas como D&D 5e, Tormenta20, Pathfinder, etc.)
  * `Homebrew` (Conteúdos criados, vinculados obrigatoriamente a um autor e a um sistema através de Chaves Estrangeiras com restrições de integridade `Foreign Key Constraints`).
* **Por que atende:** Cumpre rigorosamente os critérios da Trilha A, garantindo que o banco de dados mantenha consistência transacional e rejeite inserções órfãs ou inválidas.

### 3. Mapeamento Objeto-Relacional (ORM Avançado) e Migrações
* **O que foi feito:** Utilização avançada do **Prisma ORM**, gerencido através de migrações versionadas (`prisma/migrations`) e consultas relacionais complexas utilizando o operador `include` para unir tabelas em uma única árvore de objetos legível.
* **Por que atende:** Abstrai a camada de banco de dados com segurança contra *SQL Injection* e garante o versionamento histórico do esquema do banco via código.

### 4. Otimização de Consultas, Indexação e Performance (Busca e Paginação)
* **O que foi feito:** 
  * **Índices de Banco (`@@index`):** Aplicação de índices estruturados nas colunas mais buscadas (`titulo`, `sistemaId`, `tipo`) para assegurar consultas ultrarrápidas.
  * **Paginação no Servidor (*Server-Side Pagination*):** Implementação de lotes controlados (`skip` e `take`) para trafegar dados com alta eficiência.
  * **Massa de Dados Simulada (Seed de 200 Registros):** Um script de seed automatizado (`src/seed.js`) popula o banco com 5 sistemas de RPG reais e 200 homebrews distribuídos, provando a resiliência e a velocidade do sistema sob carga real.
* **Por que atende:** Responde diretamente à exigência de **desempenho nas consultas**, demonstrando que o backend lida perfeitamente com grandes volumes de dados sem gargalos na interface.

### 5. Interface Funcional (MVP de Validação)
* **O que foi feito:** Embora o foco principal seja o backend (conforme as regras da disciplina), foi integrada uma interface web leve em HTML5/Tailwind consumindo a API em tempo real. Ela oferece:
  * Listagem paginada e dinâmica.
  * Filtros reativos por texto e por sistema (com 5 opções de RPG).
  * CRUD completo (Criar, Listar, Atualizar e Deletar) validando o funcionamento prático das chaves estrangeiras e do ORM.

---

## 🚀 Como Executar o Projeto em 4 Passos
1. Subir o Banco de Dados: `docker-compose up -d`
2. Instalar dependências: `npm install`
3. Popular a massa de dados (200 registros): `npm run seed`
4. Iniciar a API e o Portal: `npm run start` (Acessar `http://localhost:3000`)