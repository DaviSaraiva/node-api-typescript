# node-api-typescript
Yarn start

# Banco
MongoDb, banco não relacional. Utilizado pq sua integração é simples, e mais facil de escalar horizontalmente, mais facil do que os relacionais. Se essa api fosse pra produção teria muito processamento de dados e teria que escalar bastante, no relacional seria mais custoso pq não daria para separar os dados, ja o não relacional os dados não são relacionados diretamente.
Não é utilizado o mongoDb diretamente, é utilizado biblioteca chamada mongose, uma odm que vai pegar os dados do banco que vem em um formato bson e transformar em objetos javascript.

#OvernightJS
OvernightJS é uma biblioteca simples para adicionar decoradores TypeScript para métodos destinados a chamar rotas Express. Ele também inclui um pacote para gerenciar json-web-tokens e imprimir logs.
Usado para definir uma rota base usando um decorador @Controller.
Usando para decoradores para converter métodos de classe em rotas expressas (@Get, @Put, @Post, @Delete etc).
Usado para gerenciamento Json-Web-Token.

Mais informaçções em https://www.npmjs.com/package/@overnightjs/core

