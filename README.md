# Equiply — Sistema de Gestão de Empréstimos de Equipamentos

Aplicação web para gerenciamento de equipamentos, colaboradores e empréstimos. O Equiply permite acompanhar a disponibilidade dos ativos, registrar empréstimos e controlar devoluções por meio de uma interface integrada a uma API REST.

## Acesse o projeto

- **Aplicação:** https://front-emprestimo-equipamento.vercel.app
- **API REST:** https://api-emprestimo-equipamentos.onrender.com
- **Documentação Swagger:** https://api-emprestimo-equipamentos.onrender.com/swagger-ui.html

## Sobre o projeto

O Equiply foi desenvolvido com o objetivo de facilitar o controle de equipamentos de uma organização, centralizando informações sobre os ativos, colaboradores responsáveis e movimentações de empréstimo.

O projeto possui frontend desenvolvido com Next.js e integração com backend Java/Spring Boot, utilizando uma API REST para consultar e realizar operações sobre os dados.

## Funcionalidades

### Equipamentos

- Listagem de equipamentos cadastrados na API.
- Busca por nome ou número de patrimônio.
- Filtro por disponibilidade.
- Cadastro de equipamentos.
- Edição de informações do equipamento.
- Exclusão de equipamentos, respeitando as regras de negócio da API.

### Colaboradores

- Listagem de colaboradores cadastrados.
- Cadastro de novos colaboradores.
- Validação de campos obrigatórios e formato de e-mail.
- Atualização automática da listagem após o cadastro.

### Empréstimos

- Listagem de empréstimos.
- Busca por colaborador, equipamento ou patrimônio.
- Filtro por situação do empréstimo.
- Cadastro de novos empréstimos.
- Registro de devolução.
- Consulta de empréstimos em atraso.

### Dashboard

- Visão geral dos indicadores de equipamentos e empréstimos.
- Resumo de empréstimos recentes.
- Inventário por categoria.

**Observação:** os dados apresentados no dashboard são fictícios e utilizados para demonstração. As telas de equipamentos, colaboradores e empréstimos consultam a API.

## Tecnologias utilizadas

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)

### Backend

- Java
- Spring Boot
- Spring Web
- API REST

### Ferramentas e serviços

- Git e GitHub
- Vercel — hospedagem do frontend
- Render — hospedagem do backend
- Swagger — documentação e testes dos endpoints

## Arquitetura

O projeto utiliza uma arquitetura separada entre frontend e backend.

```text
┌──────────────────────────────┐
│          FRONTEND            │
│                              │
│       Next.js + React        │
│         TypeScript           │
│                              │
│  Equipamentos                │
│  Colaboradores               │
│  Empréstimos                 │
└──────────────┬───────────────┘
               │
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│           BACKEND            │
│                              │
│       Java + Spring Boot     │
│                              │
│  Controllers                 │
│  Services                    │
│  Repositories                │
│  Regras de negócio           │
└──────────────────────────────┘
```

O frontend utiliza TanStack Query para gerenciamento das consultas e operações de escrita, incluindo atualização dos dados após mutations.

A comunicação entre frontend e backend é realizada por meio de requisições HTTP.

## Configuração do projeto

### Pré-requisitos

- Node.js
- npm
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/pamelaprpn/front-emprestimo-equipamento.git
```

### 2. Acesse a pasta

```bash
cd front-emprestimo-equipamento
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080

NEXT_PUBLIC_EQUIPMENT_SOURCE=api
NEXT_PUBLIC_COLLABORATOR_SOURCE=api
NEXT_PUBLIC_LOAN_SOURCE=api
```

As variáveis `*_SOURCE` permitem selecionar a origem dos dados de cada módulo:

- `api`: utiliza a API REST.
- `local`: utiliza os dados locais de demonstração.

Para utilizar a API em produção, configure `NEXT_PUBLIC_API_URL` com a URL base do backend.

### 5. Execute o frontend

```bash
npm run dev
```

A aplicação estará disponível em:

http://localhost:3000

**Importante:** para utilizar os dados da API localmente, o backend também precisa estar em execução.

## Build de produção

Para gerar a versão de produção do frontend:

```bash
npm run build
```

## Deploy

O frontend está publicado na Vercel, com integração ao repositório GitHub.

O backend está hospedado no Render.

A variável `NEXT_PUBLIC_API_URL` no ambiente de produção aponta para a URL pública do backend.

A API também precisa permitir a origem do frontend nas configurações de CORS.

## Estrutura do projeto

A aplicação utiliza organização por funcionalidades (*features*), separando os módulos e suas responsabilidades.

```text
src/
├── app/
├── components/
├── features/
│   ├── equipments/
│   ├── collaborators/
│   └── loans/
├── lib/
└── providers/
```

Cada funcionalidade possui componentes, serviços, hooks e adaptações de dados relacionados ao seu domínio.

## Próximas evoluções

- Integrar os indicadores do dashboard aos dados reais da API.
- Ampliar a cobertura de testes automatizados do frontend.
- Evoluir a experiência de gerenciamento de colaboradores.
- Aprimorar a documentação e a experiência de uso.

## Autora

Desenvolvido por **Pâmela Raiane Pereira Norberto**.

[GitHub](https://github.com/pamelaprpn)