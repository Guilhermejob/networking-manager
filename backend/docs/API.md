# API — Networking Manager

Esta documentação descreve os endpoints da API presente no projeto backend.

Base URL (desenvolvimento):
- http://localhost:3000

Autenticação administrativa:
- Algumas rotas requerem a chave administrativa enviada no header `x-admin-key` com o valor configurado em `ADMIN_KEY`.
- Exemplo de header: `x-admin-key: <ADMIN_KEY>`

Observações:
- Erros retornam, em geral, JSON com uma propriedade `message` ou `error`.
- Códigos de status seguem as respostas observadas nos controllers (201 para criação, 200 para sucesso padrão, 400 para requisições inválidas, 403 para acesso negado, 404 para não encontrado, 500 para erro interno).

---

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
