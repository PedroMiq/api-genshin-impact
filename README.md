# 🎮 API Genshin Impact - Projeto Final (Node.js + SQLite)

**Aluno:** Pedro  
**Curso:** Engenharia de Software - Centro Universitário Filadélfia (UniFil)  
**Professor:** Tiago

## 🚀 Sobre o Projeto
Esta é uma API RESTful completa desenvolvida para gerenciar personagens e artefatos do jogo Genshin Impact. O projeto atende a todos os requisitos da disciplina, utilizando banco de dados relacional (SQLite) e garantindo a segurança das operações com Autenticação JWT.

## 🛠️ Tecnologias e Requisitos Atendidos

* **Node.js + Express:** Estrutura base da API.
* **SQLite:** Banco de dados relacional, inicializado automaticamente com 20 registros reais.
* **Relacionamentos (JOINs):** Tabela de `personagens` vinculada com a tabela de `artefatos` (1:N).
* **Consultas Avançadas:** Implementação de Paginação (`limit`, `page`) e Filtros por `elemento` na rota GET.
* **Autenticação (JWT):** Rota de `POST /personagens` protegida por token de acesso.
* **Validações e Erros:** Status codes adequados (200, 201, 401, 500) e tratamento de exceções.

## 📦 Como rodar o projeto localmente

1. Faça o clone deste repositório ou baixe os arquivos.
2. Abra o terminal na pasta do projeto e digite `npm install` para baixar as dependências.
3. Digite `node index.js` para ligar a API (o banco de dados será criado e populado automaticamente).

## 🔑 Exemplo de Uso (Autenticação)

Para testar as rotas protegidas:
1. Faça um POST em `/login` com usuário `pedro` e senha `123456`.
2. Use o Token retornado no cabeçalho `Authorization: Bearer <TOKEN>` para cadastrar novos personagens.