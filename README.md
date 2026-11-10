# HomebrewBrewer 🎲⚔️

Portal para cadastro e gerenciamento de Homebrews (conteúdos caseiros para sistemas de RPG), desenvolvido como Trabalho Prático para a disciplina de **Banco de Dados II** (UNIFACVEST).

## 🚀 Tecnologias Utilizadas
- **Docker & Docker Compose** (Isolamento do PostgreSQL)[cite: 1, 5]
- **Node.js** (Ambiente de execução)[cite: 1]
- **Prisma ORM** (Trilha A - Mapeamento Objeto-Relacional e Migrações Avançadas)[cite: 1, 2, 5]
- **PostgreSQL** (Banco de dados relacional)[cite: 1, 5]

---

## ⚙️ Manual de Execução (Passo a Passo)

Certifique-se de ter o **Docker** e o **Node.js** instalados na sua máquina.

1. **Suba o banco de dados via Docker:**
   ```bash
   docker-compose up -d