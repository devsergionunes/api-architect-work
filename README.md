# API Architect Work

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Introdução:

A ideia do projeto é criar api para uma plataforma de arquitetos, aonde os clientes possam solicitar orçamentos de projetos de arquitetura, e os arquitetos possam visualizar as solicitações e responder se aceitam ou não o projeto.

## Funcionalidades:

- Cadastro de usuário
- Cadastro de arquiteto
- Login de usuário e arquiteto
- Cadastro de solicitação
- Listagem de solicitações
- Atualização solicitação
- Exclusão solicitação
- Responder solicitação

## Tecnologias:

### Nest:

- [Nest](https://github.com/nestjs/nest).

### TypeScript:

- [TypeScript](https://www.typescriptlang.org/)

### TypeORM:

- [TypeORM](https://typeorm.io/)

### Swagger:

- [Swagger](https://swagger.io/)

### Passport:

- [Passport](http://www.passportjs.org/)

### Class Validator:

- [Class Validator](https://github.com/nestjs/class-validator)
<hr>

## BASE DE DADOS:

### [POSTGRESQL](https://www.postgresql.org/):

- [Documentação](https://www.postgresql.org/docs/)
- Estou usando uma imagem docker do postgres para rodar o banco de dados localmente. segue o link abaixo com o tutorial de como baixar a imagem docker do postgres.
- [Tutorial para download da imagem docker do postgres](https://felixgilioli.medium.com/como-rodar-um-banco-de-dados-postgres-com-docker-6aecf67995e1)

<hr>

## DOCUMENTAÇÃO:

- Estou usando o swagger para documentar a api.
- Rota para a documentação da api esta em `/swagger`

## INICIANDO O PROJETO:

### clone o projeto:

<pre>
  git clone https://github.com/devsergionunes/api-architect-work.git
</pre>

### Instalar dependencias:

<pre>
 npm install
</pre>

### Iniciar o banco de dados:

<pre>
 docker run -p 5432:5432 -e POSTGRES_PASSWORD=1234 postgres
</pre>

### Variaveis de ambiente (arquivo .env):

- Crie um arquivo .env na raiz do projeto e adicione as variaveis de ambiente.
- Você pode usar o arquivo .env.example como base. Veja o exemplo abaixo:
<pre>
API_PORT=3333

JWT_SECRET= 'minhachavesecreta'

DB_DATA_BASE= postgres
DB_USER= postgres
DB_PASSWORD= 1234
DB_HOST= localhost
DB_PORT= 5432

</pre>

### Iniciar o projeto:

<pre>
npm run start:dev
</pre>
