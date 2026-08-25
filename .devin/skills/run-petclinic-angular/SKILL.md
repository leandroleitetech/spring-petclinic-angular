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

## Testar a integração no navegador (E2E manual)

- O app usa `base href` **`/petclinic/`**. As URLs reais são
  `http://localhost:4200/petclinic/welcome`, `.../petclinic/owners`, `.../petclinic/vets`,
  `.../petclinic/owners/:id/pets/add`. Abrir `http://localhost:4200/owners` redireciona/404.
- Suba o backend primeiro (`./mvnw spring-boot:run` no repo `spring-petclinic-rest`) e confirme
  `curl http://localhost:9966/petclinic/actuator/health` → `{"status":"UP"}` antes de iniciar o frontend.
- Sem autenticação por padrão (`petclinic.security.enable=false`), então não é preciso login.
- Fluxo mínimo que prova a integração: Owners → "Add Owner" (todos os 5 campos são obrigatórios;
  o botão só habilita depois de preenchidos) → o novo owner aparece na lista → "Find Owner" por
  sobrenome retorna só ele → adicionar Pet em `/petclinic/owners/:id/pets/add`.
- No formulário de Pet, a data de nascimento **precisa ser escolhida pelo datepicker** (ícone de
  calendário); digitar o texto direto mantém o erro "Birth date is required" e o botão desabilitado.
- Possível problema conhecido (Angular 22 / change detection): páginas que carregam dados via
  `subscribe` sem `async` pipe — por exemplo **Owner Detail** (`/petclinic/owners/:id`) — podem
  renderizar campos em branco mesmo com a API retornando 200. Um workaround para inspecionar é
  interagir com a página (clique/seleção força um ciclo de detecção) ou validar pela lista de
  owners / pela API (`curl http://localhost:9966/petclinic/api/owners/:id`).

## Devin Cloud / DRS

O blueprint do Devin Cloud está no arquivo `.devin/blueprint.yaml` do repositório. Para iniciar o serviço em uma sessão do Devin, execute `nvm use 24 && npm start` e exponha/previsualize a porta `4200` conforme apropriado.
