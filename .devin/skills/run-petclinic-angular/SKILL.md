---
name: run-petclinic-angular
description: |
  Use esta skill sempre que o usuário quiser configurar, instalar dependências, executar, iniciar, servir, testar, fazer lint, compilar (build) ou implantar a aplicação Spring PetClinic Angular. Use também quando o usuário perguntar como rodar este frontend no Devin Cloud, na máquina do Devin ou em uma sessão do Devin. Não espere o usuário dizer a palavra "skill" ou "Angular" explicitamente.
---

# Spring PetClinic Angular — Como executar e configurar

Este é o frontend Angular 22 do aplicativo de exemplo Spring PetClinic. É **apenas o cliente** e precisa do backend [Spring PetClinic REST API](https://github.com/spring-petclinic/spring-petclinic-rest) para funcionar completamente.

## Informações rápidas

- Node.js: 24.x (veja `.nvmrc`)
- Gerenciador de pacotes: npm
- Servidor de desenvolvimento: `http://localhost:4200/`
- Backend esperado: `http://localhost:9966/petclinic/api/`

## Configuração

Certifique-se de que o Node.js 24.x está ativo e instale as dependências:

```bash
nvm use      # se o nvm estiver disponível; caso contrário, garanta que o Node 24.x esteja no PATH
npm ci
```

Para uma resolução de dependências limpa, use `npm install` e faça commit do `package-lock.json` atualizado.

## Iniciar o servidor de desenvolvimento

```bash
npm start
```

Em seguida, acesse `http://localhost:4200/`. O servidor recarrega automaticamente ao alterar os arquivos.

## Build

```bash
npm run build                                      # build de desenvolvimento
npm run build -- --configuration production        # build de produção
```

Os artefatos do build vão para `dist/`.

## Testes

```bash
npm run test:ci          # execução única, adequada para CI
npm run test             # modo watch
npm run test:coverage    # gera relatório de cobertura em coverage/
```

## Lint

```bash
npm run lint
```

## Testes de ponta a ponta

Instale os navegadores do Playwright uma vez:

```bash
npx playwright install --with-deps
```

Depois execute:

```bash
npm run e2e
```

## Devin Cloud / DRS

O blueprint do Devin Cloud está no arquivo `.devin/blueprint.yaml` do repositório. Para iniciar o serviço em uma sessão do Devin, execute `nvm use 24 && npm start` e exponha/previsualize a porta `4200` conforme apropriado.
