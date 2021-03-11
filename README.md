# node-api-typescript
#Banco: MongoDb, banco não relacional. Utilizado pq sua integração é simples, e mais facil de escalar horizontalmente, mais facil do que os relacionais. Se essa api fosse pra produção teria muito processamento de dados e teria que escalar bastante, no relacional seria mais custoso pq não daria para separar os dados, ja o não relacional os dados não são relacionados diretamente.

#Não é utilizado o mongoDb diretamente, é utilizado biblioteca chamada mongose, uma odm que vai pegar os dados do banco que vem em um formato bson e transformar em objetos javascript.
