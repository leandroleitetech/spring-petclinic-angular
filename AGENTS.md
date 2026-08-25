# AGENTS.md — Spring PetClinic Angular

Guia para agentes de IA (Devin e similares) que trabalham neste repositório.

## Descrição do projeto

Frontend **Angular 22** do Spring PetClinic. É **apenas o cliente** (client only): para funcionar
completamente, requer o backend REST
[spring-petclinic-rest](https://github.com/leandroleitetech/spring-petclinic-rest) disponível em
`http://localhost:9966/petclinic/api/`.

- Servidor de desenvolvimento: `http://localhost:4200/`
- Backend esperado: `http://localhost:9966/petclinic/api/`

## Runtime

- Node.js **24.x** (ver `.nvmrc` e o campo `engines` do `package.json`)
- Gerenciador de pacotes: **npm**

## Comandos

Comandos oficiais, extraídos de `.devin/blueprint.yaml`,
`.devin/skills/run-petclinic-angular/SKILL.md` e `package.json`:

| Ação | Comando |
|--|--|
| Setup | `nvm use 24 && npm ci` |
| Iniciar dev server | `npm start` |
| Build (dev) | `npm run build` |
| Build (produção) | `npm run build -- --configuration production` |
| Testes unitários (CI) | `npm run test:ci` |
| Testes em modo watch | `npm run test` |
| Cobertura | `npm run test:coverage` |
| Lint | `npm run lint` |
| E2E (Playwright) | `npx playwright install --with-deps` e depois `npm run e2e` |

Os artefatos de build são gerados em `dist/`; o relatório de cobertura em `coverage/`.

## CONVENÇÕES E REGRAS

Regras de trabalho obrigatórias para agentes neste repositório.

### Skills

- As skills ficam em `.devin/skills/<nome>/SKILL.md`.
- Cada skill possui frontmatter YAML com os campos `name` e `description`.
- Exemplo existente neste repositório: `.devin/skills/run-petclinic-angular/SKILL.md`.
- **Antes de executar qualquer tarefa de setup, build, run, test ou lint, consulte a skill relevante**
  e siga os comandos documentados nela.

### Rules

- Por convenção, regras específicas do repositório devem ficar em `.devin/rules/`.
- Esse diretório ainda não existe neste repositório; caso venha a existir, todas as rules ali
  presentes devem ser lidas e seguidas.

### Blueprint do Devin Cloud

- O blueprint fica em `.devin/blueprint.yaml` e contém os passos de `initialize`, `maintenance` e o
  bloco `knowledge` com os comandos de setup, test, lint e startup.
- O agente deve seguir o blueprint como fonte oficial de configuração do ambiente.

### Testar antes de concluir

- Tudo que o agente fizer deve ser testado antes de ser considerado concluído.
- Rode o lint (`npm run lint`) e os testes (`npm run test:ci`) e garanta que **nada quebrou**
  (nenhuma regressão) antes de finalizar a tarefa ou abrir um PR.

### Não fazer push sem solicitação

- Não execute `git push` nem abra Pull Request sem solicitação explícita do usuário.

### Não alterar o que não foi pedido

- Limite as mudanças estritamente ao escopo solicitado.
- Não refatore, não reformate e não altere arquivos fora do pedido.

### Convenções gerais

- Mensagens de commit descritivas e objetivas.
- Respeite o estilo de código existente; o projeto usa **ESLint** (`npm run lint`,
  configuração em `eslint.config.js`).
- Documente no PR o resultado da validação de ambiente (lint e testes).
