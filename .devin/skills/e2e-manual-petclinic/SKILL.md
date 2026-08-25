---
name: e2e-manual-petclinic
description: |
  Use esta skill quando for necessário validar manualmente, pelo navegador, que o PetClinic Angular está funcionando integrado ao backend REST — por exemplo para comprovar que uma mudança não quebrou a aplicação, gravar evidência de um fluxo funcionando, ou investigar um bug de UI. Cobre a ordem de inicialização dos serviços, as URLs reais, o fluxo mínimo de verificação e as armadilhas conhecidas da UI. Para apenas instalar, compilar ou rodar testes automatizados, use a skill `run-petclinic-angular`.
---

# Teste E2E manual do PetClinic (Angular + REST)

Guia para agentes de IA validarem a integração frontend ↔ backend pelo navegador.
Comandos de setup/build/test estão em `run-petclinic-angular` (frontend) e `run-petclinic-rest` (backend).

## 1. Subir os serviços na ordem certa

O backend **precisa** estar no ar antes do frontend, senão as telas carregam vazias.

```bash
# 1) Backend (repo spring-petclinic-rest)
./mvnw spring-boot:run
curl -s http://localhost:9966/petclinic/actuator/health   # espera {"status":"UP"}

# 2) Frontend (repo spring-petclinic-angular)
nvm use 24 && npm start
```

O backend sobe com H2 em memória e dados de exemplo (10 owners, 6 vets, 6 pet types), então
**não é preciso criar massa de dados** nem fazer login: a autenticação vem desabilitada
(`petclinic.security.enable=false`).

Cada reinício do backend zera o banco — dados criados em uma rodada de teste não sobrevivem.

## 2. URLs

O app usa `base href` **`/petclinic/`**. As URLs reais são:

| Tela | URL |
|--|--|
| Welcome | `http://localhost:4200/petclinic/welcome` |
| Owners | `http://localhost:4200/petclinic/owners` |
| Detalhe do owner | `http://localhost:4200/petclinic/owners/:id` |
| Adicionar pet | `http://localhost:4200/petclinic/owners/:id/pets/add` |
| Adicionar visita | `http://localhost:4200/petclinic/pets/:petId/visits/add` |
| Veterinários | `http://localhost:4200/petclinic/vets` |

Abrir `http://localhost:4200/owners` (sem `/petclinic/`) **não funciona**.

A API correspondente fica em `http://localhost:9966/petclinic/api/...` e pode ser usada com `curl`
para confirmar que o que a UI mostra realmente veio/foi para o backend.

## 3. Fluxo mínimo que comprova a integração

1. **Owners** — a lista deve trazer os owners de exemplo vindos de `GET /api/owners`.
2. **Add Owner** — todos os 5 campos são obrigatórios; o botão de salvar só habilita com o
   formulário válido. Após salvar, o novo owner aparece na listagem.
3. **Find Owner** — buscar pelo sobrenome recém-criado deve retornar apenas aquele owner
   (prova a persistência no backend, não só o estado local).
4. **Add New Pet** — pelo detalhe do owner; o pet passa a aparecer junto do owner.
5. **Add Visit** — pelo pet; a visita passa a aparecer no detalhe do owner.
6. **Vets** — a lista de veterinários com especialidades deve carregar.
7. **Console do navegador** — nenhum erro não tratado e nenhuma requisição falha durante o fluxo.

Confirme a persistência com um `curl` no final, por exemplo:

```bash
curl -s http://localhost:9966/petclinic/api/owners/11
```

## 4. Armadilhas conhecidas da UI

- **Datepicker obrigatório**: nos formulários de Pet e de Visit, a data precisa ser escolhida pelo
  datepicker (ícone de calendário). Digitar a data como texto mantém o campo inválido
  ("Birth date is required") e o botão de salvar desabilitado.
- **Telas em branco por change detection**: componentes que atribuem dados dentro de `subscribe()`
  sem `async` pipe e sem `ChangeDetectorRef.markForCheck()` podem renderizar campos vazios mesmo com
  a API retornando 200 e sem erro no console. Sintoma típico: os dados aparecem só depois de uma
  interação (clique, seleção) que força um ciclo de detecção. Se encontrar uma tela assim, confirme
  pela API que o dado existe antes de concluir que o backend está quebrado — o padrão de correção
  usado no repositório é:

  ```ts
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  this.service.get(...).pipe(
    finalize(() => this.changeDetectorRef.markForCheck())
  ).subscribe(data => this.data = data, error => this.errorMessage = error as any);
  ```

## 5. Evidência

Ao validar uma mudança, registre gravação de tela e/ou screenshots do fluxo acima (antes/depois
quando for correção de bug) e anexe o resultado ao PR, junto com o resultado de `npm run lint` e
`npm run test:ci`.
