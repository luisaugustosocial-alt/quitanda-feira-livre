# Quitanda Feira Livre

Site para a unidade de Santa Maria da Vitória/BA com catálogo, carrinho, cadastro/login por usuário, pedidos com pagamento na entrega, acompanhamento e painel administrativo.

## 1. Firebase

1. Crie um projeto no Firebase.
2. Em **Authentication > Sign-in method**, ative **E-mail/senha**.
3. Crie o **Firestore Database**.
4. Cadastre um Web App e copie as configurações para um arquivo `.env` baseado em `.env.example`.
5. **Não é necessário ativar Firebase Storage.** As imagens dos produtos ficam no Cloudinary e o Firestore salva apenas a URL da imagem.

## 2. Imagens gratuitas com Cloudinary

1. Crie uma conta no Cloudinary.
2. Copie o **Cloud name** para `VITE_CLOUDINARY_CLOUD_NAME`.
3. No painel do Cloudinary, crie um **Upload Preset** para upload direto pelo navegador e marque-o como **Unsigned**.
4. Copie o nome do preset para `VITE_CLOUDINARY_UPLOAD_PRESET`.
5. Para reduzir abuso, limite no preset os formatos permitidos e o tamanho máximo dos arquivos.

O administrador seleciona a imagem no painel. O site envia a foto ao Cloudinary e grava somente a `secure_url` no documento do produto no Firestore.

> O projeto não usa nem precisa de `VITE_FIREBASE_STORAGE_BUCKET`.

## 3. Instalar

```bash
npm install
npm run dev
```

## 4. Publicar regras do Firebase

Instale a Firebase CLI, faça login e vincule o projeto:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes
```

## 5. Criar o administrador

Primeiro faça um cadastro normal pelo site. Depois, no **Firebase Console > Firestore > users > documento do seu UID**, altere:

```text
role: customer
```

para:

```text
role: admin
```

Saia e entre novamente no site. O menu Admin aparecerá.

## 6. Como funciona o usuário e o e-mail

O cliente escolhe, por exemplo, `luis`. Na interface ele entra como:

`userquitanda@luis`

Internamente o Firebase Authentication usa um e-mail técnico como `luis@clientes.quitandafeiralivre.app`. O e-mail real e telefone informados no cadastro ficam no perfil do cliente no Firestore.

## 7. Pagamento

O site não cobra online. O cliente escolhe:

- Dinheiro na entrega
- PIX na entrega
- Cartão na entrega

O método fica salvo no pedido para a equipe da loja preparar a entrega.

## 8. Status disponíveis

- Pedido recebido
- Aguardando confirmação
- Em separação
- Saiu para entrega
- Concluído
- Cancelado

## 9. Vercel

Suba os arquivos para o GitHub, importe o repositório na Vercel e configure as variáveis do `.env` em **Settings > Environment Variables**. O `vercel.json` já está preparado para React Router.

## Segurança importante

Não use regras abertas (`allow read, write: if true`) para dados privados. O projeto inclui regras que separam cliente e administrador. Clientes só acessam o próprio perfil/pedidos; administração controla produtos e pedidos.

O preset unsigned do Cloudinary fica visível no frontend. Isso é esperado para upload direto no navegador; configure restrições de formato/tamanho no preset e, para um projeto de maior escala, prefira upload assinado por backend.

## 10. Termos de Uso e Política de Privacidade

O projeto inclui as rotas públicas:

- `/termos` — Termos de Uso
- `/privacidade` — Política de Privacidade/LGPD

No cadastro, o usuário precisa marcar o aceite antes de criar a conta. O documento `users/{uid}` registra em `legalAcceptance` as versões dos textos e a data/hora do aceite.

As versões ficam em `src/legal.js`. Se os textos forem alterados de forma relevante, atualize `TERMS_VERSION` e/ou `PRIVACY_VERSION`.

**Antes da publicação**, substitua todos os campos `[PREENCHER]` pelos dados reais da Quitanda Feira Livre: responsável/razão social, CNPJ ou CPF responsável, endereço comercial e canal oficial de contato/privacidade.

Os textos são um modelo técnico inicial e devem refletir a operação real da empresa.
