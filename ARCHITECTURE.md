# 🏗️ Arquitetura da Plataforma de Networking Manager

Este documento descreve a arquitetura proposta para a plataforma de gestão de grupos de networking, cobrindo os principais módulos, estrutura de pastas, modelo de dados e comunicação entre as partes do sistema.

---

## 📂 Estrutura Geral do Projeto (Monorepo)

```bash
networking-manager/
├─ .git/
├─ ARCHITECTURE.md               # Documento de arquitetura (tarefa 1)
├─ README.md                     # Como rodar o projeto, variáveis de ambiente
├─ .env.example
├─ apps/
│  └─ web/                       # Next.js (frontend)
│     ├─ app/                    # (App Router) páginas + layouts
│     ├─ components/             # componentes React reutilizáveis
│     ├─ hooks/                  # hooks personalizados (useAuth, useFetch)
│     ├─ services/               # cliente HTTP para a API (axios/fetch wrappers)
│     ├─ pages/ (se usar pages router) or app/
│     ├─ public/
│     ├─ jest/                   # configuração de testes do frontend
│     └─ package.json
├─ backend/                       # Node.js + Express + TypeScript + Prisma
│  ├─ prisma/
│  │  └─ schema.prisma           # modelo de dados (Prisma)
│  ├─ src/
│  │  ├─ index.ts                # ponto de entrada (configura server)
│  │  ├─ server.ts               # cria e config do express
│  │  ├─ routes/
│  │  │  ├─ admission.routes.ts  # rotas do fluxo de admissão
│  │  │  ├─ members.routes.ts    # rotas de membros
│  │  │  └─ indications.routes.ts# rotas de indicações (opção A)
│  │  ├─ controllers/
│  │  ├─ services/               # regras de negócio (InvitationService, MemberService)
│  │  ├─ repositories/           # acesso a DB (Prisma client wrappers)
│  │  ├─ middlewares/
│  │  ├─ utils/
│  │  └─ tests/                  # testes Jest (unit + integration)
│  └─ package.json
└─ docs/
   └─ ...                       # qualquer documento extra
