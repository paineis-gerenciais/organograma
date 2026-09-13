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
- **Data de última modificação**: cada card na tela inicial mostra quando o
  organograma foi editado pela última vez.
- **Relatório de consolidação**: ao consolidar uma comparação entre dois
  organogramas, um relatório com as diferenças aprovadas, ajustadas e
  rejeitadas fica disponível direto no card do organograma consolidado
  (botão "Relatório da consolidação"), com opção de baixar em **PDF**
  (cabeçalho compacto, com logos pequenas e o nome do organograma como
  título logo abaixo da linha "Comparação: ...", não mais repetido no topo)
  ou como página HTML.
- **Seleção de tamanho de papel no Imprimir/PDF (antigo "PDF otimizado")**:
  A4, A3, A2, A1, Carta e Ofício, com o cálculo de quantas folhas serão
  necessárias mostrado antes de gerar o PDF.
- **Fidelidade visual do Imprimir/PDF**: cada página é um recorte do próprio
  organograma renderizado na tela (não um redesenho compacto) — a posição,
  o tamanho e o estilo de cada caixa ficam idênticos aos da tela. Quando o
  organograma não cabe em uma única folha, ele sai em várias páginas com uma
  faixa de sobreposição entre elas, sem reorganizar nada.
- **Pastas na tela inicial**: dá para criar pastas para organizar os
  organogramas, mover organogramas entre pastas (seletor no rodapé de cada
  card) e navegar para dentro/fora de uma pasta.
- **Botão de excluir nas unidades padrão**: agora aparece ao lado do "+" ao
  passar o mouse, igual já acontecia nas unidades de assessoria.
- **Última camada em coluna (opcional)**: um botão na barra lateral esquerda
  (logo abaixo dos controles de "Camadas") alterna a última fileira de cada
  ramo entre a fileira horizontal padrão e uma coluna vertical — útil quando
  o último nível tem muitos itens.
- **Botões de impressão reorganizados e renomeados**:
  - **Gerar PDF** (antigo "Imprimir / PDF") agora pergunta o que você quer
    gerar: **Organograma** (página única, sob medida para o tamanho do
    organograma — sem se prender a A4 ou qualquer formato padrão — em alta
    resolução, para dar zoom no PDF sem perder nitidez) ou **Competências /
    Descrição** (só a tabela, sem a página do organograma).
  - **Imprimir/PDF** (antigo "PDF otimizado") continua reproduzindo o
    organograma exatamente como na tela, dividido em páginas do tamanho de
    papel escolhido quando necessário — e agora é mais rápido: em vez de
    clonar a árvore inteira do zero para cada página, ela é serializada uma
    única vez e reaproveitada, e todas as páginas são montadas fora do
    documento e inseridas de uma só vez (menos travadas em organogramas com
    muitas páginas).
  - Os ícones de **Gerar PDF** e **Imprimir/PDF** foram trocados entre si.
  - **Imprimir seleção** (antigo "Imprimir recorte") agora fica dentro do
    menu **Exportar**, em vez de um botão avulso na barra de ferramentas, e
    imprime a área selecionada em tamanho exato (escala 1, sem redimensionar
    para caber num formato padrão), numa folha cortada sob medida para o
    recorte + o cabeçalho — sem sobra de espaço.
  - Em qualquer um dos modos, os cartões impressos usam borda simples e
    neutra (sem sombra e sem a cor por tipo de unidade).
- **Editar título/subtítulo direto no card**: cada card na tela inicial
  ganhou um botão de edição (ícone de lápis), à esquerda do botão de
  duplicar, para renomear o organograma sem precisar abri-lo primeiro.
- **Ajustar Layout**: na tela do organograma, o botão "Duplicar" da barra de
  ferramentas foi substituído por **Ajustar Layout**. Ele abre uma tela à
  parte com os mesmos controles de zoom, centralizar e camadas da tela
  principal (inclusive scroll para zoom e arrastar o fundo para navegar),
  onde dá para arrastar as caixas pelo canvas — sem poder editar unidades ou
  vínculos. O arraste fica travado no eixo horizontal OU vertical (o que for
  definido pelo primeiro movimento), e as linhas de conexão usam o mesmo
  desenho em ângulo reto da tela principal, acompanhando a caixa movida.
  Tem botões de **Desfazer**, **Refazer** e **Resetar posições** (volta tudo
  para a posição original calculada pela árvore). As posições ajustadas
  ficam salvas com o organograma.
  > Importante: esse ajuste de posição vale só dentro da própria tela
  > "Ajustar Layout" — a tela principal do organograma continua usando o
  > layout automático de árvore (hierárquico), e os modos de impressão
  > também não usam essas posições manuais ainda. Se no futuro você quiser
  > que a impressão ou a tela principal sigam esse layout ajustado, é um
  > passo a mais que peço para tratarmos separadamente.
- **Imprimir/PDF ajusta a escala automaticamente**: antes, ele sempre
  imprimia no tamanho exato da tela (1:1), então organogramas grandes podiam
  sair em muitas páginas. Agora ele testa reduções de escala (até 50%) e
  escolhe a maior escala que resulte no MENOR número de páginas — aproveita
  melhor cada folha (menos sobra em branco na última linha/coluna) e reduz o
  total de páginas quando uma redução pequena já evita precisar de mais uma
  linha ou coluna inteira. O card de seleção de papel mostra a porcentagem
  usada quando há redução.
- **Zoom mais fluido**: a rolagem do mouse/trackpad agora usa um fator
  proporcional à distância rolada (em vez de um valor fixo por evento), o
  que deixa trackpads (muitos eventos pequenos) e mouses comuns (poucos
  eventos grandes) igualmente suaves, com as atualizações agrupadas por
  quadro de animação para não travar em rolagens rápidas. Os botões de
  lupa (+/-) agora também ficam ancorados no centro da tela, em vez de
  fazer o organograma "pular" para longe do centro ao clicar neles. Essa
  correção vale tanto para a tela do organograma quanto para "Ajustar
  Layout".

## Arquivos deste pacote

| Arquivo | Para que serve |
|---|---|
| `index.html` | O painel em si — é o único arquivo que precisa ser publicado. |
| `logo-esquerda.png`, `logo-direita.png` | Logos exibidas no cabeçalho: Poder Judiciário de Mato Grosso (esquerda) e Fundação Dom Cabral (direita). Para trocar a marca no futuro, basta substituir estes dois arquivos, mantendo os mesmos nomes. |
| `config.js` | Configuração do Firebase já preenchida com o projeto `painel-organograma`. |
| `config.example.js` | Modelo em branco, útil se você reaproveitar este painel em outro projeto Firebase. |
| `firestore.rules` | Regras de segurança do banco de dados (leia a seção de segurança). |
| `.gitignore` | Arquivos que não devem ser versionados. |

## Passo a passo da implantação

### 1. Preparar o repositório no GitHub

1. Crie um repositório novo no GitHub (pode ser privado).
2. Envie todos os arquivos deste pacote para a raiz do repositório
   (`index.html`, `config.js`, `firestore.rules`, `.gitignore` etc.).
3. Este pacote já inclui as logos reais (`logo-esquerda.png` = Poder
   Judiciário de Mato Grosso, `logo-direita.png` = Fundação Dom Cabral) na
   raiz do repositório. Se precisar trocar a marca no futuro, basta
   substituir esses dois arquivos, mantendo exatamente esses nomes:
   - `logo-esquerda.png`
   - `logo-direita.png`

   Dica: se um dia precisar de só uma logo, use a mesma imagem nos dois
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

## Como funciona o "Imprimir/PDF" (organogramas grandes, antigo "PDF otimizado")

O botão **Imprimir/PDF** reproduz o organograma exatamente como ele aparece
na tela — no mesmo tamanho, com o mesmo estilo — e o divide em páginas do
tamanho de papel escolhido, com uma faixa de sobreposição entre elas (para
nenhum cartão ficar cortado). Ele **não redesenha nem reorganiza** cartões:
cada página é um recorte do próprio organograma, então juntar as folhas
impressas reproduz fielmente o que está na tela.

- **Sem reorganização**: a posição de cada unidade no PDF é idêntica à da
  tela. Organogramas grandes vão gerar mais páginas — essa é a troca: menos
  compactação, mais fidelidade.
- **Página de guia de montagem**: quando o organograma sai em mais de uma
  página, a primeira folha impressa é um esquema simples mostrando quantas
  páginas existem e a posição (linha/coluna) de cada uma, numeradas na mesma
  ordem em que saem da impressora. Use esse esquema para saber como encaixar
  as folhas antes de recortar e colar/grampear.
- Cada página também traz no rodapé do cabeçalho o texto "Página X de Y —
  Linha R de N, Coluna C de M", a mesma numeração da guia de montagem.
- **Tamanho de papel selecionável**: antes de gerar o PDF, escolha entre
  A4, A3, A2, A1, Carta ou Ofício. O painel calcula quantas folhas serão
  necessárias para aquele tamanho e ajusta a impressão (`@page`) para
  corresponder fisicamente ao papel escolhido.
- **Cabeçalho só no topo**: o cabeçalho institucional (logos + título)
  aparece apenas nas páginas da primeira linha da grade de montagem. As
  demais páginas trazem só uma numeração discreta no canto, para não
  interromper visualmente o organograma ao montar as folhas.
- **Margens reduzidas ao mínimo**: as margens físicas de cada folha (inclusive
  a inferior) foram diminuídas para 0,75mm, para aproveitar quase toda a
  área do papel e reduzir o número de páginas necessárias.
- **Só gera página com conteúdo de verdade**: uma página só é criada quando a
  MAIORIA de algum cartão (não só uma pontinha) aparece nela — evita folhas
  quase em branco, dominadas por um cantinho de cartão ou só por linhas de
  conexão passando por cima de espaço vazio.
- Cartões impressos usam borda simples e neutra (sem sombra e sem a cor por
  tipo de unidade — linha e assessoria saem iguais no papel), em qualquer
  tamanho de papel.

> **Importante sobre cabeçalho/rodapé do navegador**: se a opção
> "Cabeçalhos e rodapés" estiver marcada na caixa de diálogo de impressão do
> navegador, ele mesmo desenha, por conta própria, uma linha com data/hora e
> o título da página no topo e a URL com o número da página embaixo — isso
> não é gerado pelo painel. Nenhum site consegue pré-marcar ou desmarcar
> essa caixinha do navegador por código, nem mudar o tamanho da fonte ou a
> cor desse texto, porque ele é desenhado pelo motor de impressão, por fora
> da página. A única forma de deixá-la desmarcada por padrão é desmarcar
> manualmente na primeira impressão — a maioria dos navegadores guarda essa
> escolha para as próximas vezes no mesmo perfil. Com as margens agora em
> 0,75mm, vale desmarcar essa opção: sobra pouco espaço para esse texto do
> navegador, que pode acabar sobrepondo o conteúdo do organograma.

## Como funciona o "Gerar PDF" (antigo "Imprimir / PDF")

Esse botão abre um modal perguntando o que gerar:

- **Organograma**: uma única página, no tamanho exato do organograma
  (largura e altura calculadas a partir do próprio desenho — sem se prender
  a A4, Carta ou qualquer formato padrão), em alta resolução. Como a
  renderização é feita via `zoom` do CSS (o texto continua sendo texto de
  verdade, não uma imagem), o PDF gerado pode ser ampliado (zoom no leitor
  de PDF) sem perder nitidez, mesmo que o organograma pareça pequeno na
  visualização inicial.
- **Competências / Descrição**: gera só a tabela com hierarquia, sigla e
  descrição de cada unidade — sem a página do organograma.
