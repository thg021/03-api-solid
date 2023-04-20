# App 

Gympass sytle app

## RFs 
funcionalidades da aplicação
- [ ] deve ser possivel se cadastrar
- [ ] deve ser possivel se autenticar 
- [ ] deve ser possivel obter o perfil de um usuario logado.
- [ ] deve ser possivel obter o numero de checkings realizados pelo usuario logado. 
- [ ] deve ser possivel o usuario obter seu historio de checkings 
- [ ] deve ser possivel o usuario buscas academias proximas
- [ ] deve ser possivel o usuario buscas academias pelo nome
- [ ] deve ser possivel o usuario fazer checking em uma academia 
- [ ] deve ser possivel validar o checking de um usuario
- [ ] deve ser possivel cadastrar uma academia

## RN
caminhos que a aplicação pode tomar
- [ ] o usuario nao deve poder se cadastrar com um email duplicado
- [ ] o usuario nao pode fazer dois checking no mesmo dia
- [ ] o usuario nao pode fazer checking se nao tiver perto (100m) da academia
- [ ] o cheching so pode ser validado ate 20 minutos apos criado
- [ ] o checking so pode ser validado por adm
- [ ] a academia so pode ser cadastrada por adm 

## RNFs
quais tecnologias vamos usar
- [ ] a senha do usuario precisa esta criptografada
- [ ] ps dados da aplicação precisam estar persistidos no postgres
- [ ] dados paginas ate 20 itens
- [ ] o usuario deve ser identificados por um JWT 


# Ambiente 

[x] - instalação basica para iniciarmos o projeto. 

```bash
npm init -y
```

[x] - Instalar as dependencias em Desenvolvimento
    - typescript
    - @types/node
    - tsx -> suporte para node entender typescript
    - tsup -> para auxiliar no build

```bash
npm install -D typescript @types/node tsx tsup
```

[x] - Para iniciar o`tsconfig.json`

```bash
npx tsc --init
```

[x] - alterar o target: `es2020` no arquivo `tsconfig.json`

[x] - Instalar o `fastify`

```bash
npm install fastify
```

---

[x] - Criar pastas:
    src 
        app.ts
        server.ts

[x] - No arquivo `app.ts` importar o fastify e export uma variavel `app`

```typescript
import fastify from "fastify"

export const app = fastify()
``` 

[x] - No arquivo `server.ts` teremos que ter a seguinte estrutura:

```typescript
import { app } from './app'

app.listen({
    host: '0.0.0.0', // Esta linha irá facilitar quando um front for se conectar com o backend
    port: 3000
}).then(() => {
  console.log('🚀 HTTP Server Running!')
})
```

[x] - Criar arquivo `.gitignore`
```
node_modules
build
```

[x] - Adicionar os `scripts` no `package.json`

```json 
"scripts": {
    "start:dev": "tsx watch src/server.ts",
    "start": "node build/server.js",
    "build": "tsup src --out-dir build"
  },
```

# Usando versões exatas do NPM

[x] - configurar o npm `.npmrc`

```
save-exact=true
```
servirá para automatizar as atualizações futuras do projeto 

Execute o npm install e verifique se o package.json tirou o simbolo `^` 


# Carregando variáveis ambiente

[x] - incluir no `.gitignore` o `.env`
[x] - criar um arquivo `.env.exemple` de exemplo

```bash
NODE_ENV=dev
```

[x] - instalar o `zod`, `dotenv`
[x] - criar arquivo `src/env/index.ts`

O zod servirá para validarmos as informações. No caso iremos validar as informações das variaveis de ambiente. 

```typescript
import 'dotenv/config'
import { z } from 'zod'

// Precisamos de um schema
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333) //coerce server para ser tanto string ou number. Alguns ambiente setam a variavel PORT como string
})

// vamos validar. Caso de erro. O zod lança um exceção. safeParse é resposanvel por isso 
const _env = envSchema.safeParse(process.env)
// Fazemos esta validação para termos um erro "personalizado" para nao usar o throw do zod generico. 
if (_env.success === false) {
    //format ajuda a deixar um pouco mais facil o retorno
  console.error('❌ Invalid environment variables', _env.error.format())
    //Isso daqui derruba a nossa aplicação. 
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
```

[x] - substituir a porta no `src/server.ts` para usar o env.PORT e importar no arquivo. 

```
  port: env.PORT,
```

# Configurando ESLint

[x] - criar arquivo `.eslintignore`

```bash
node_modules
build
```

[x] - criar arquivo `.eslintrc.json`

```json
{
  "extends": [
    "@rocketseat/eslint-config/node"
  ]
}
```

[x] - Instalar as dependencias: `@rocketseat/eslint-config` e `eslint` em desenvolvimento

`npx eslint --init` caso voce queira uma configurações propria sua. 

E validar se tudo deu certo. 

# Criando aliases de importação

Este passo é apenas para facilitar os imports no typescript. No `tsconfig.json`vamos adicionar o seguinte:

```json 
  "baseUrl": "./",                                     /* Specify the base directory to resolve non-relative module names. */
    "paths": {
      "@/*": ["./src/*"]
    },     
```

Ou seja. Os meus paths vao começar com o `@`.

---

# Fundamentos do Prisma ORM

## Prisma: Configurando extensão no VSCode

1. Instale a extensão [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) no seu Visual Studio Code.
2. Abra a Paleta de Comandos:
    1. Se estiver no Windows ou Linux: `CTRL + SHIFT + P`
    2. Se estiver no macOS: `CMD + SHIFT + P`
3. Abra as configurações em JSON buscando por: 
    1. Se o seu VSCode estiver em português: `Abrir as Configurações do usuário (JSON)`
    2. Se o seu VSCode estiver em inglês: `Open User Settings (JSON)`
4. Adicione dentro do JSON o código abaixo:

```json
"[prisma]": {
  "editor.defaultFormatter": "Prisma.prisma",
  "editor.formatOnSave": true
},
```

[ ] - instalar o `prisma`  em desenvolvimento
este é apenas um interface de linha de comando 
agora ele valida iniciar e criar `prisma/schema.prisma`

```bash 
npx prisma init
```

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
  @@map("users") 
}
```

**@@map vai trocar o nome da tabela.**

[ ] - instalar o `@prisma/client`
[ ] - adicionar no `src/app.ts` as configurações do prisma apenas para validação

```typescript 
import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Diego Fernandes',
    email: 'diego@rocketsaeet.com.br',
  },
})

// ORM - Object Relational Mapper
```