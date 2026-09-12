# Painel de Organogramas — GitHub Pages + Firestore

Este pacote contém uma versão revisada do painel de organogramas, adaptada
para rodar como um site estático no GitHub Pages, usando o Firebase
Firestore como banco de dados na nuvem.

## O que mudou em relação ao arquivo original

- **Sem organogramas de exemplo**: o painel abre vazio. Você cria os
  organogramas pela própria interface (botão "Novo Organograma" no painel
  inicial) ou importando um JSON.
- **Logos alteráveis por arquivo**: as duas logos do cabeçalho (dashboard e
  impressão) não estão mais embutidas no código. Elas são carregadas dos
  arquivos `logo-esquerda.png` e `logo-direita.png`, que ficam na raiz do
  repositório. Para trocar a marca, basta substituir esses dois arquivos —
  não é preciso mexer no HTML. Se um dos arquivos não existir, o espaço da
  logo simplesmente fica em branco (o painel não quebra).
- **Persistência em nuvem (Firestore)**: antes, tudo ficava só no
  `localStorage` do navegador (ou seja, só existia naquele computador/
  navegador específico). Agora cada organograma é salvo também na coleção
  `orgCharts` do Firestore, então o mesmo painel, aberto em qualquer
  computador, mostra os mesmos dados. O `localStorage` continua sendo usado
  como cache local: o painel abre instantaneamente com os últimos dados
  vistos e sincroniza com a nuvem em segundo plano. Se a internet cair ou o
  Firebase não estiver configurado, o painel continua funcionando apenas
  localmente.
- **PDF otimizado, revisado**: a divisão do organograma em várias páginas
  (quando ele não cabe inteiro em uma folha) foi corrigida e ganhou uma
  página extra de "guia de montagem", explicada mais abaixo.

## Arquivos deste pacote

| Arquivo | Para que serve |
|---|---|
| `index.html` | O painel em si — é o único arquivo que precisa ser publicado. |
| `logo-esquerda.png`, `logo-direita.png` | Logos exibidas no cabeçalho. Este pacote já vem com imagens de rascunho (placeholder) só para você confirmar que a troca de arquivo funciona — **substitua pelas logos reais** antes de usar de verdade (veja abaixo). |
| `config.js` | Configuração do Firebase já preenchida com o projeto `painel-organograma`. |
| `config.example.js` | Modelo em branco, útil se você reaproveitar este painel em outro projeto Firebase. |
| `firestore.rules` | Regras de segurança do banco de dados (leia a seção de segurança). |
| `.gitignore` | Arquivos que não devem ser versionados. |

## Passo a passo da implantação

### 1. Preparar o repositório no GitHub

1. Crie um repositório novo no GitHub (pode ser privado).
2. Envie todos os arquivos deste pacote para a raiz do repositório
   (`index.html`, `config.js`, `firestore.rules`, `.gitignore` etc.).
3. Este pacote já inclui `logo-esquerda.png` e `logo-direita.png` — mas são
   apenas imagens de rascunho (placeholder), para você confirmar que a troca
   funciona. Substitua os dois arquivos pelas logos reais, mantendo
   exatamente esses nomes:
   - `logo-esquerda.png`
   - `logo-direita.png`

   Dica: se sua instituição tiver só uma logo, use a mesma imagem nos dois
   arquivos, ou apague um dos dois (o espaço correspondente fica em branco).

### 2. Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em "Source", selecione a branch principal (`main`) e a pasta `/root`.
3. Salve. Em alguns minutos o GitHub mostra a URL pública do painel
   (algo como `https://seu-usuario.github.io/nome-do-repositorio/`).

### 3. Conferir o projeto Firebase

O `config.js` já vem preenchido com os dados do projeto `painel-organograma`
que você informou. Ainda assim, confira no [Firebase Console](https://console.firebase.google.com/):

1. Abra o projeto `painel-organograma`.
2. Vá em **Firestore Database** e, se ainda não existir, clique em
   **Criar banco de dados** (modo produção, região mais próxima do Brasil,
   por exemplo `southamerica-east1`).
3. Vá em **Firestore Database → Regras** e cole o conteúdo do arquivo
   `firestore.rules` deste pacote. Clique em **Publicar**.

### 4. Autorizar o domínio do GitHub Pages no Firebase

1. No Firebase Console, vá em **Authentication → Settings → Domínios
   autorizados** (mesmo sem usar login, essa lista também é checada pelo
   Firestore em alguns cenários) e/ou em **Configurações do projeto → Geral**.
2. Adicione o domínio do GitHub Pages, por exemplo:
   `seu-usuario.github.io`.

### 5. Testar

1. Abra a URL do GitHub Pages.
2. Crie um organograma de teste, adicione uma unidade.
3. Recarregue a página (ou abra em outro navegador/computador): o
   organograma deve continuar lá — isso confirma que a sincronização com o
   Firestore está funcionando.
4. Abra o Firebase Console → Firestore Database e confira se apareceu um
   documento na coleção `orgCharts`.

Se o organograma sumir ao recarregar ou aparecer um aviso de "sem conexão
com a nuvem", revise o `config.js` e as regras do Firestore (passo 3).

## Sobre a segurança dos dados

Este painel **não tem tela de login**. As regras em `firestore.rules`
liberam leitura e escrita para qualquer pessoa que tenha a URL do site. Isso
é razoável para uma ferramenta interna cujo link não é divulgado
publicamente, mas não impede que alguém com o link edite os dados. Se no
futuro for necessário restringir o acesso, o caminho é:

1. Ativar o **Firebase Authentication** (por exemplo, login por e-mail/senha
   ou conta Google institucional);
2. Trocar as condições `if true` em `firestore.rules` por
   `if request.auth != null`;
3. Adicionar uma tela de login simples ao `index.html`.

Essa mudança não foi feita agora para manter o painel simples de usar, mas
as regras já estão organizadas para facilitar essa evolução depois.

## Como funciona o novo PDF otimizado (organogramas grandes)

Quando o organograma é grande demais para caber em uma página com boa
legibilidade, o botão **PDF otimizado** divide o desenho em várias páginas,
com uma faixa de sobreposição entre elas (para nenhum cartão ficar cortado
na borda). Nesta revisão:

- **Corrigido**: uma linha de conexão só aparece em uma página se as duas
  caixas que ela liga também estiverem naquela página — antes, em alguns
  casos, uma linha podia aparecer "solta", sem uma das pontas.
- **Novo — página de guia de montagem**: quando o organograma sai em mais
  de uma página, a primeira folha impressa é um esquema simples mostrando
  quantas páginas existem e a posição (linha/coluna) de cada uma, numeradas
  na mesma ordem em que saem da impressora. Use esse esquema para saber
  como encaixar as folhas antes de recortar e colar/grampear.
- Cada página também traz no rodapé do cabeçalho o texto "Página X de Y —
  Linha R de N, Coluna C de M", a mesma numeração da guia de montagem.
