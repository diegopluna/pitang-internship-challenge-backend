<h1 align="center">Vacina Fácil API</h1>

<p align="center">
  <a href="https://github.com/diegopluna/pitang-internship-challeng-backend/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/diegopluna/pitang-internship-challenge-backend?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
</p>

<p align="center">
  <a href="#introdução"><strong>Introdução</strong></a> ·
  <a href="#pré-requisitos"><strong>Pré-requisitos</strong></a> ·
  <a href="#instalação"><strong>Instalação</strong></a> ·
  <a href="#tecnologias-utilizadas"><strong>Tecnologias Utilizadas</strong></a> ·
  <a href="#funcionalidades"><strong>Funcionalidades</strong></a> ·
  <a href="#documentação-da-api"><strong>Documentação da API</strong></a> ·
  <a href="#testes"><strong>Testes</strong></a> ·
  <a href="#scripts-disponíveis"><strong>Scripts Disponíveis</strong></a> ·
  <a href="#license"><strong>Licença</strong></a>
</p>
<br/>

## Introdução

Vacina Fácil: API para agendamento de vacinas COVID-19, desenvolvida para o desafio de estágio da Pitang. Oferece gerenciamento eficiente de agendamentos de vacinação.

## Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v20.14.0) - Ambiente de execução JavaScript
- [Docker](https://www.docker.com/) (v26.1.3) - Plataforma de containerização
- [Docker Compose](https://docs.docker.com/compose/) (v2.27.3) - Ferramenta para definir e executar aplicaçes Docker multi-container

## Instalação

### Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/diegopluna/pitang-internship-challenge-backend.git
```

2. Instale as dependências:

```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

4. Inicie o banco de dados PostgreSQL usando Docker:

```bash
docker compose up -d
```

5. Execute as migraçes do banco de dados:

```bash
npm run prisma:migrate
```

### Executando o servidor

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## Tecnologias Utilizadas

- [TypeScript](https://www.typescriptlang.org/) (v5.5.3) - Linguagem de programação
- [Fastify](https://fastify.dev/) (v4.28.1) - Framework
- [Prisma ORM](https://www.prisma.io/) (v5.16.1) - ORM
- [PostgreSQL](https://www.postgresql.org/) (via Docker) - Banco de dados
- [Vitest](https://vitest.dev/) (v1.6.0) - Testes
- [SuperTest](https://github.com/visionmedia/supertest) (v7.0.0) - Testes E2E
- [Scalar](https://scalar.com/) - UI para documentação da API

## Funcionalidades

- Criar agendamento de vacina - `POST /appointments`
- Listar agendamentos - `GET /appointments`
- Buscar agendamento por ID - `GET /appointments/:id`
- Atualizar dados do agendamento - `PUT /appointments/:id`
- Alternar o status de vacinação - `PATCH /appointments/:id/toggle-vaccinated`

## Documentação da API

A documentação da API está disponível através do Swagger UI. Após iniciar o servidor, acesse: `http://localhost:3000/docs`

## Testes

Para executar os testes:

```bash
npm run test
```

Para executar os testes com cobertura:

```bash
npm run test:coverage
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run build`: Compila o projeto
- `npm run start`: Inicia o servidor em modo de produção
- `npm run format`: Formata o código usando Prettier
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate`: Executa as migrações do banco de dados
- `npm run prisma:studio`: Abre o Prisma Studio para visualização do banco de dados
- `npm run test:create-prisma-environment`: Cria o ambiente de testes do Prisma
- `npm run test:install-prisma-environment`: Instala o ambiente de testes do Prisma
- `npm run pretest`: Executa os scripts de criação e instalação do ambiente de testes do Prisma
- `npm run test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo de observação
- `npm run test:coverage`: Executa os testes com relatório de cobertura
- `npm run test:ui`: Executa os testes com interface gráfica
- `npm run test:unit`: Executa os testes unitários
- `npm run test:e2e`: Executa os testes E2E

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.
