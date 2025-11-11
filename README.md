# 🏷️ Documento de Arquitetura — Plataforma de Gestão de Networking

## 1. Diagrama da Arquitetura

![alt text](<Diagrama da Arquitetura.png>)

**Descrição:**

* **Frontend (Next.js/React):** Interface para membros e administradores, com páginas públicas (intenção e cadastro) e áreas privadas (painel e administração).
* **Backend (Node.js/Express + Prisma):** Camada responsável por regras de negócio, persistência de dados e controle de fluxo entre os módulos.
* **Banco de Dados (PostgreSQL):** Armazena todas as entidades do sistema — membros, intenções, convites, indicações, reuniões, etc.
* **Autenticação:** Inicialmente simplificada (via variável de ambiente para admin), mas a arquitetura suporta JWT futuramente.
* **Deploy:** Pode ser hospedado no Vercel (frontend) e Railway/Render (backend e DB).

---

## 2. Modelo de Dados (completo)

### 🧩 Estrutura Principal (Membros e Admissão)

```prisma
model Intention {
  id          Int       @id @default(autoincrement())
  name        String
  email       String    @unique
  phone       String?
  message     String?
  createdAt   DateTime  @default(now())
  status      String    @default("pending") // pending | approved | rejected
  processedAt DateTime?
  processedBy String?

  invitations Invitation[]
}

model Invitation {
  id          Int       @id @default(autoincrement())
  token       String    @unique
  intentionId Int
  expiresAt   DateTime
  used        Boolean   @default(false)
  createdAt   DateTime  @default(now())

  intention   Intention @relation(fields: [intentionId], references: [id])
}

model Member {
  id          Int       @id @default(autoincrement())
  name        String
  email       String    @unique
  phone       String?
  company     String?
  position    String?
  joinedAt    DateTime  @default(now())
  active      Boolean   @default(true)
  
  indicationsSent     Indication[] @relation("SentIndications")
  indicationsReceived Indication[] @relation("ReceivedIndications")
  oneOnOnesSent       OneOnOne[]   @relation("SentOneOnOnes")
  oneOnOnesReceived   OneOnOne[]   @relation("ReceivedOneOnOnes")
  payments            Payment[]
}
```

---

### 💼 Geração de Negócios

```prisma
model Indication {
  id             Int       @id @default(autoincrement())
  fromMemberId   Int
  toMemberId     Int
  description    String
  status         String    @default("pending") // pending | in_progress | done
  createdAt      DateTime  @default(now())
  
  fromMember     Member    @relation("SentIndications", fields: [fromMemberId], references: [id])
  toMember       Member    @relation("ReceivedIndications", fields: [toMemberId], references: [id])
}

model Gratitude {
  id          Int       @id @default(autoincrement())
  fromMemberId Int
  toMemberId   Int
  message      String
  createdAt    DateTime  @default(now())

  fromMember   Member    @relation("SentGratitudes", fields: [fromMemberId], references: [id])
  toMember     Member    @relation("ReceivedGratitudes", fields: [toMemberId], references: [id])
}
```

---

### 📊 Reuniões e Performance

```prisma
model Meeting {
  id          Int       @id @default(autoincrement())
  title       String
  date        DateTime
  location    String?
  notes       String?
  createdAt   DateTime  @default(now())
  attendances Attendance[]
}

model Attendance {
  id          Int       @id @default(autoincrement())
  meetingId   Int
  memberId    Int
  present     Boolean   @default(false)

  meeting     Meeting   @relation(fields: [meetingId], references: [id])
  member      Member    @relation(fields: [memberId], references: [id])
}

model OneOnOne {
  id            Int       @id @default(autoincrement())
  fromMemberId  Int
  toMemberId    Int
  date          DateTime
  notes         String?

  fromMember    Member    @relation("SentOneOnOnes", fields: [fromMemberId], references: [id])
  toMember      Member    @relation("ReceivedOneOnOnes", fields: [toMemberId], references: [id])
}
```

---

### 💰 Financeiro

```prisma
model Payment {
  id          Int       @id @default(autoincrement())
  memberId    Int
  amount      Float
  dueDate     DateTime
  status      String    @default("pending") // pending | paid | overdue
  createdAt   DateTime  @default(now())

  member      Member    @relation(fields: [memberId], references: [id])
}
```

---

## 3. Estrutura de Componentes (Frontend)

```bash
src/
 ├─ app/
 │   ├─ page.tsx                # Home / landing
 │   ├─ intention/page.tsx      # Formulário de intenção
 │   ├─ register/[token]/page.tsx # Cadastro via convite
 │   ├─ admin/
 │   │   ├─ intentions/page.tsx # Lista e ações (aprovar/recusar)
 │   │   └─ dashboard/page.tsx  # Indicadores simples
 │   └─ dashboard/page.tsx      # Área do membro
 │
 ├─ components/
 │   ├─ forms/
 │   ├─ cards/
 │   ├─ modals/
 │   └─ layout/
 │
 ├─ lib/
 │   ├─ api.ts                  # Configuração axios/fetch
 │   ├─ auth.ts                 # Admin key check
 │   └─ utils.ts
 │
 ├─ styles/
 └─ types/
```

---

## 4. Definição da API (principais rotas)

### **Fluxo de Admissão**

| Método  | Rota                               | Descrição                          |
| ------- | ---------------------------------- | ---------------------------------- |
| `POST`  | `/api/intentions`                  | Cria nova intenção de participação |
| `GET`   | `/api/intentions`                  | Lista todas as intenções (admin)   |
| `PATCH` | `/api/intentions/:id/approve`      | Aprova e gera convite              |
| `PATCH` | `/api/intentions/:id/reject`       | Rejeita intenção                   |
| `POST`  | `/api/invitations/:token/register` | Finaliza cadastro de membro        |

---

### **Indicações (opcional implementado)**

| Método  | Rota                          | Descrição                               |
| ------- | ----------------------------- | --------------------------------------- |
| `POST`  | `/api/indications`            | Cria nova indicação                     |
| `GET`   | `/api/indications`            | Lista indicações (enviadas e recebidas) |
| `PATCH` | `/api/indications/:id/status` | Atualiza status da indicação            |

---

### **Schemas**

## Admission

### POST /intentions
- Descrição: Criar uma intenção de ingresso.
- Body (JSON):
  - name (string) — obrigatório
  - email (string) — obrigatório
  - phone (string) — opcional
  - message (string) — opcional
- Sucesso: 201 Created — retorna o objeto da intenção criada
- Erros: 400 quando campos obrigatórios faltam; 500 em erro interno

Exemplo request:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "1199999-9999",
  "message": "Gostaria de participar"
}
```

---

### GET /intentions
- Descrição: Lista todas as intenções.
- Sucesso: 200 OK — retorna array de intenções
- Erros: 500 em erro interno

---

### GET /invitations/:token
- Descrição: Verifica um token de convite (pré-registro).
- Parâmetros de rota:
  - token (string)
- Sucesso: 200 OK — retorna resultado da verificação (objeto genérico)
- Erros: 400 quando o token é inválido ou ocorre erro

---

### POST /invitations/:token/complete
- Descrição: Completa o registro de um convite usando o token.
- Parâmetros de rota:
  - token (string)
- Body (JSON):
  - name (string)
  - email (string)
  - phone (string)
- Sucesso: 201 Created — retorna o membro criado
- Erros: 400 quando o token inválido ou campos inválidos

---

## Admin
(Rotas em `/admin`)

### POST /admin/login
- Descrição: Verifica uma chave administrativa enviada no body `{ key }`.
- Body (JSON): `{ "key": "<chave>" }`
- Sucesso: 200 — `{ message: 'Acesso concedido', isAdmin: true }` se a chave bater com `ADMIN_KEY`.
- Erros: 403 quando chave inválida; 500 se `ADMIN_KEY` não estiver configurada.

---

### GET /admin/intentions
- Descrição: Lista intenções (requere `x-admin-key`).
- Header: `x-admin-key: <ADMIN_KEY>`
- Sucesso: 200 — array de intenções
- Erros: 403 quando header inválido; 500 em erro interno

---

### POST /admin/intentions/:intentionId/approve
- Descrição: Aprova uma intenção (requere `x-admin-key`).
- Parâmetros de rota: `intentionId` (number)
- Sucesso: 200 — resultado da aprovação
- Erros: 403 quando header inválido; 500 em erro interno

---

## Members

### POST /members
- Descrição: Criar um membro
- Body: `{ name, email, phone }` (name e email obrigatórios)
- Sucesso: 201 — objeto do membro
- Erros: 400 quando campos obrigatórios ausentes; 500 em erro interno

### GET /members
- Descrição: Listar membros
- Sucesso: 200 — array de membros

### GET /members/:id
- Descrição: Buscar membro por id
- Sucesso: 200 — objeto do membro
- Erros: 500 em erro interno

### PUT /members/:id
- Descrição: Atualizar membro
- Body: `{ name?, email?, phone? }`
- Sucesso: 200 — membro atualizado

### DELETE /members/:id
- Descrição: Deletar membro
- Sucesso: 204 No Content

---

## Engagements

### POST /engagements
- Descrição: Criar um engagement
- Body: definida no serviço; geralmente objeto com campos do engagement
- Sucesso: 201 — objeto criado

### GET /engagements
- Descrição: Listar engagements
- Sucesso: 200 — array

### GET /engagements/:id
- Descrição: Buscar engagement por id
- Sucesso: 200 — objeto
- Erros: 404 se não encontrado

### PUT /engagements/:id
- Descrição: Atualizar engagement
- Sucesso: 200 — objeto atualizado

### DELETE /engagements/:id
- Descrição: Deletar engagement
- Sucesso: 204 No Content

---

## Indications

### POST /indications
- Descrição: Criar indicação
- Body: `{ title, description, fromId, toId }`
- Sucesso: 201 — indicação criada

### GET /indications
- Descrição: Listar todas as indicações
- Sucesso: 200 — array

### GET /indications/:id
- Descrição: Obter indicação por id
- Sucesso: 200 — indicação
- Erros: 404 se não encontrada

### PUT /indications/:id/status
- Descrição: Atualizar status de uma indicação
- Body: `{ status }`
- Sucesso: 200 — indicação atualizada

### DELETE /indications/:id
- Descrição: Remover indicação
- Sucesso: 204 No Content

---

## Payments

### POST /payments
- Descrição: Criar pagamento
- Body: `{ memberId, amount, dueDate }` (amount pode ser string/number)
- Sucesso: 201 — pagamento criado
- Observação: o controller converte `amount` para float e `dueDate` para Date

### GET /payments
- Descrição: Listar pagamentos
- Sucesso: 200 — array de pagamentos

### PUT /payments/:id/status
- Descrição: Atualizar status de pagamento
- Body: `{ status }`
- Sucesso: 200 — pagamento atualizado

### DELETE /payments/:id
- Descrição: Remover pagamento
- Sucesso: 204 No Content

---

## Notices

### GET /notices
- Descrição: Listar comunicados
- Sucesso: 200 — array de comunicados

### GET /notices/:id
- Descrição: Buscar comunicado por id
- Sucesso: 200 — comunicado
- Erros: 404 se não encontrado

### POST /notices
- Descrição: Criar comunicado (requer admin)
- Header: `x-admin-key: <ADMIN_KEY>`
- Body: `{ title, content, author }` (todos obrigatórios)
- Sucesso: 201 — comunicado criado

---

## Dashboard

### GET /dashboard
- Descrição: Retorna dados agregados para o dashboard
- Sucesso: 200 — objeto com dados do dashboard

---
