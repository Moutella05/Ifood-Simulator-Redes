# Ifood Simulator Redes

Um simulador educacional de pedido iFood com foco em redes e protocolos.
O projeto combina um frontend em React + Vite com um backend WebSocket para simular o rastreamento de pedidos.

## Estrutura do projeto

- `frontend/` - aplicação React com interface de login, seleção de restaurantes, carrinho e acompanhamento do pedido.
- `backend/` - servidor Node.js WebSocket que envia atualizações de fase de entrega.
- `frontend/src/data/Usuarios.json` - base de usuários para validação de login.
- `frontend/src/page/Login.tsx` - validação de login com `zod` e exibição de erro HTTP 403 no terminal de logs.
- `frontend/src/page/Acompanhamento.tsx` - acompanhamento do pedido com fases simuladas e barra de progresso.

## Como executar

### 1. Instalar dependências

No root do repositório:

```bash
npm install
```

No frontend:

```bash
cd frontend
npm install
```

No backend:

```bash
cd backend
npm install
```

### 2. Iniciar o backend WebSocket

No diretório `backend`:

```bash
cd backend
npm run start
```

O servidor WebSocket será iniciado em `ws://localhost:8080`.

### 3. Iniciar o frontend

No diretório `frontend`:

```bash
cd frontend
npm run dev
```

### 4. Uso básico

1. Abra a aplicação frontend no navegador.
2. Faça login usando um usuário válido de `frontend/src/data/Usuarios.json`.
3. Adicione o pedido no carrinho e confirme para acessar a tela de acompanhamento.
4. Acompanhe as fases do pedido na barra de rastreamento.

## Senhas de exemplo

Exemplos atuais em `frontend/src/data/Usuarios.json`:

- `usuario`: `aluno`, `senha`: `senha123`
- `usuario`: `professor`, `senha`: `ifood2026`

## O que está sendo simulado

- Autenticação de login com validação `zod`.
- Exibição de log 403 quando o login falha.
- Simulação de rede/terminal na tela de login.
- Rastreamento de pedido com fases:
  - Pedido aceito
  - Preparando
  - A caminho
  - Chegando
  - Entregue

## Observações

- Se o WebSocket não estiver disponível, a página de acompanhamento usa uma simulação local para continuar o rastreamento.
- A navegação atual do app segue as rotas:
  - `/` — login
  - `/restaurante` — restaurantes
  - `/carrinho` — carrinho
  - `/acompanhamento` — rastreamento do pedido
