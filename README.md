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

#### Intention (POST /api/intentions)

```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "message": "Tenho interesse em participar do grupo."
}
```

#### Invitation (POST /api/invitations/:token/register)

```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "company": "Tech Group",
  "position": "Diretor Comercial"
}
```

#### Indication (POST /api/indications)

```json
{
  "fromMemberId": 1,
  "toMemberId": 2,
  "description": "Indicação de serviço de marketing digital."
}
```

---

## 5. Considerações Finais

* **Banco de dados:** PostgreSQL via Prisma ORM.
* **API RESTful** seguindo boas práticas REST e separação de camadas.
* **Frontend** baseado em Next.js com Server Actions e API Routes para simplificar integração.
* **Admin Access:** controlado por variável de ambiente `ADMIN_SECRET`.
* **Testes:** Jest + React Testing Library.
* **Deploy:** Vercel (frontend) + Railway (backend/db).
