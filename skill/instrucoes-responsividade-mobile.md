# Instrução para o Agente: Implementar Responsividade Mobile

## Objetivo

Adicionar suporte a **dispositivos móveis (celular e tablet)** nos componentes de front-end existentes.

> ⚠️ **RESTRIÇÃO CRÍTICA**: Não alterar **absolutamente nada** no layout, estilo, comportamento ou visual do site quando acessado em **desktop (PC)**. Alterações em arquivos `.jsx` são permitidas quando necessário para implementar a responsividade, desde que o resultado no desktop permaneça **pixel-perfect** em relação ao estado atual. Qualquer lógica ou JSX adicionado deve ser condicional ao mobile e **nunca afetar a renderização no desktop**.

---

## Como o agente deve trabalhar

Antes de escrever qualquer código, o agente deve **ler e entender os arquivos do projeto**:

1. Identificar quais componentes e arquivos são responsáveis por cada seção descrita abaixo
2. Entender como o layout atual está estruturado (classes CSS, estrutura JSX, sistema de estilos utilizado)
3. Mapear onde cada adaptação mobile precisa ser aplicada, com base nos arquivos reais do projeto
4. Somente depois de entender o contexto, implementar as mudanças de forma cirúrgica e coerente com o código existente

O agente **não deve criar padrões novos** que conflitem com o que já existe no projeto — deve seguir a mesma convenção de nomes, organization de arquivos e abordagem de estilo já adotada.

---

## Escopo do Trabalho

### ✅ O que DEVE ser feito

- Implementar responsividade para **celular** (até `768px`) e **tablet** (entre `768px` e `1024px`), usando **media queries CSS**
- Garantir que o conteúdo seja **legível e utilizável** em telas pequenas sem scroll horizontal
- Adaptar layouts que usem `flex`, `grid`, posicionamento absoluto/fixo, ou larguras fixas em `px` para se comportarem bem em telas menores
- Ajustar tamanhos de fonte, espaçamentos e tamanhos de elementos quando necessário — apenas em mobile
- Garantir que botões, links e campos de formulário tenham área de toque mínima de `44x44px` em mobile
- Corrigir overflow horizontal (conteúdo saindo da tela) em dispositivos pequenos
- Verificar se a meta tag de viewport já existe no `<head>` e adicioná-la caso não exista

### ❌ O que NÃO deve ser feito

- **Não alterar** nenhuma regra CSS fora de media queries (nenhuma mudança em estilos globais que afete o desktop)
- **Não modificar** fontes, cores, espaçamentos ou estrutura do layout para telas grandes
- **Não refatorar** componentes além do necessário para a responsividade
- **Pode mexer em arquivos `.jsx`**, mas toda alteração deve garantir que o visual e comportamento no desktop continuem **idênticos ao estado atual**
- **Não alterar** lógica de negócio, funcionalidades, textos, ícones ou imagens
- **Não mudar** a ordem visual dos elementos no desktop

---

## Estratégia de Implementação

### Abordagem: Desktop-First com Media Queries

Como o layout atual foi desenvolvido para desktop, utilize a abordagem **desktop-first**: os estilos existentes permanecem intocados e as adaptações mobile são adicionadas exclusivamente dentro de media queries, sem interferir no que já existe.

### Breakpoints a usar

| Dispositivo | Breakpoint          |
|-------------|---------------------|
| Celular     | `max-width: 768px`  |
| Tablet      | `max-width: 1024px` |
| Desktop     | Estilos existentes (sem media query) |

---

## Especificações por Seção

### 1. Hero — Campos de Filtro/Pesquisa (Hero.jsx, HeroButton.jsx / O css deles está em App.css)

Localizar o componente responsável pela seção Hero e identificar os campos de filtro/pesquisa dentro dele.

Em mobile, esses campos devem ficar **dispostos lado a lado**, em linha, ocupando bem o espaço disponível na tela. A largura de cada campo deve ser generosa o suficiente para facilitar a digitação, sem causar overflow horizontal. O agente deve avaliar a estrutura atual dos campos e decidir a melhor forma de aplicar esse comportamento com base no que já está implementado.

### 2. Hero — Textos sobre as Imagens (Carrossel/Slider) (Hero.jsx, HeroButton.jsx / O css deles está em App.css)

Localizar onde os textos sobrepostos às imagens da Hero são renderizados (títulos, subtítulos, legendas do carrossel/slider).

Em mobile, esses textos devem **quebrar linha corretamente** e se manter legíveis, sem ficar cortados ou sobrepostos a outros elementos. O agente deve reduzir o tamanho da fonte e aplicar espaçamento lateral adequado para que o texto respire dentro da tela pequena, seguindo o padrão visual já adotado no projeto.

### 3. Seção de Hemocentros por Zona (Zona Centro, Zona Sul, Zona Leste, etc.) (ZoneSection.jsx, TitleList.jsx / O css deles está em App.css)

Localizar o componente que renderiza os cards de hemocentros agrupados por zona, incluindo as setas de navegação `‹` e `›`.

Em mobile, as setas devem ser **ocultadas** e substituídas por navegação via **arraste horizontal (swipe)**. O container dos cards deve permitir scroll lateral suave, com os cards se encaixando de forma precisa a cada gesto. Parte do próximo card deve ficar visível na borda da tela para indicar ao usuário que há mais conteúdo. A barra de scroll deve ser invisível. As setas **não devem ser removidas do desktop** — apenas ocultadas no mobile.

O agente deve estudar como o componente atual gerencia a navegação entre cards e implementar a solução de swipe de forma compatível com essa estrutura.

### 4. Pop-up de Login e Cadastro (UserProgile.jsx / O css dele está em UserProfile.css e uma parte em App.css)

Localizar o componente de modal/pop-up utilizado no fluxo de login e cadastro.

Em mobile, o modal deve **caber inteiramente na tela** sem overflow ou elementos cortados. Deve ocupar a maior parte da largura disponível, com margens laterais adequadas. Caso o conteúdo seja longo, o modal deve ter rolagem vertical interna. O overlay de fundo deve cobrir toda a tela corretamente. Todos os campos e botões devem ser visíveis e acessíveis sem necessidade de zoom.

---

## Menu Hambúrguer — Navigation (Navigation.jsx / O css dele está em Navigation.css e uma parte em App.css)

Localizar o arquivo `.jsx` do componente de navegação (Navbar/Header) e entender como os itens de menu estão estruturados atualmente.

### Comportamento esperado em mobile

Em mobile, os itens de menu (`Quem Somos`, `Por que doar?`, `Requisitos de Doação`, `Precisa de Sangue?`) devem ser **ocultados da navbar horizontal**. No lugar, deve aparecer um **ícone de três linhas (hambúrguer)** alinhado à direita da barra de navegação.

Ao clicar no ícone, um **painel lateral (drawer)** deve deslizar para dentro da tela a partir da lateral, contendo as opções do menu organizadas verticalmente com espaçamento confortável.

O painel **não deve ter botão de fechar (X)**. O fechamento deve ocorrer exclusivamente quando o usuário **tocar na área escurecida fora do painel**. Essa área (overlay) deve cobrir todo o restante da tela com transparência semi-escura enquanto o menu estiver aberto.

O agente deve implementar o estado de abertura/fechamento e o overlay diretamente no componente de navegação existente, sem criar um componente novo desnecessariamente. As cores, tipografia e estilo visual do drawer devem ser coerentes com o tema já adotado no projeto.

O visual do desktop **não deve ser afetado** — o hambúrguer deve ser invisível em desktop e o menu desktop deve continuar funcionando normalmente.

### Conteúdo interno das páginas acessadas pelo menu (mobile)

Dentro das páginas acessadas pelo menu (como "Quem Somos"), caso existam **cards em grade** (como fotos de membros da equipe ou outros cards dispostos em múltiplas colunas), esses cards devem ter a funcionalidade de **arraste horizontal** em mobile, seguindo o mesmo comportamento definido para a seção de Hemocentros por Zona. O layout desktop dessas páginas não deve ser alterado.

---

## Arquivos que precisam ser responsivos
- [ ] Navigation.css e Navigation.jsx
- [ ] Item.css e Item.jsx
- [ ] SearchResults.css e SearchResults.jsx
- [ ] TeamCard.css e TeamCard.jsx
- [ ] UserProfile.css e UserProfile.jsx
- [ ] ZoneSection.css e ZoneSection.jsx
- [ ] Hero.jsx
- [ ] Header.jsx
- [ ] HeroButton.jsx
- [ ] Modal.jsx
- [ ] TitleList.jsx
- [ ] App.css e App.jsx


## Checklist Geral

### Navegação
- [ ] Menu horizontal oculto em mobile
- [ ] Ícone hambúrguer visível apenas em mobile
- [ ] Drawer lateral abre au clicar no hambúrguer
- [ ] Drawer fecha ao clicar fora (sem botão X)
- [ ] Logo e demais elementos da navbar ajustados para mobile

### Hero
- [ ] Campos de filtro/pesquisa lado a lado em mobile
- [ ] Largura dos campos generosa
- [ ] Textos do carrossel com quebra de linha organizada e font-size adequado

### Seção de Zonas (Hemocentros)
- [ ] Setas de navegação ocultadas em mobile
- [ ] Swipe horizontal habilitado com encaixe suave entre cards
- [ ] Barra de scroll invisível
- [ ] Parte do próximo card visível como indicador

### Pop-ups (Login / Cadastro)
- [ ] Modal responsivo, sem overflow
- [ ] Todos os campos e botões visíveis e acessíveis

### Tipografia e Layout Geral
- [ ] Títulos redimensionados para mobile mantendo hierarquia
- [ ] Textos sem overflow horizontal
- [ ] Imagens com largura máxima de 100% e altura automática

### Cards nas páginas internas do menu
- [ ] Cards em grade adaptados para swipe horizontal em mobile

---

## Critérios de Aceitação

1. O visual e comportamento no **desktop permanecem idênticos** ao estado atual
2. Não há scroll horizontal indesejado em telas de **375px** de largura
3. Todo o conteúdo é **legível sem zoom** em celulares comuns
4. Elementos interativos são clicáveis com conforto no mobile
5. O menu hambúrguer abre e fecha corretamente; **não possui botão X**
6. O swipe nas seções de Zonas e cards internos funciona de forma natural
7. O pop-up de login/cadastro é completamente utilizável em mobile
8. Nenhuma funcionalidade existente foi quebrada

---

## Notas Finais

- Testar nos tamanhos: **375px** (celular pequeno), **390px** (iPhone 14), **768px** (tablet portrait), **1024px** (tablet landscape)
- Utilizar o DevTools do navegador (modo responsivo) para validar cada breakpoint
- Em caso de dúvida sobre um componente específico, **priorizar não quebrar o desktop** e sinalizar para revisão humana
- Manter consistência com as convenções de código, nomes de classes e organização de arquivos já adotadas no projeto

## Atualização de Versões

- Versão 1.1:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Menu Hambúrguer (Navigation.jsx, Navigation.css, App.css):**
      - O menu hambúrguer deve sumir junto com a Header (Logo, UserProfile) ao arrastar a tela para baixo (não deve ficar fixo).
      - A seta ao lado da imagem de UserProfile deve sumir.
    - **Layout de Item (Item.jsx, Item.css):**
      - Remover a informação "Clique para visualizar os hemocentros deste bairro.". Deve aparecer somente o item, sem os detalhes de baixo (igual ao passar o mouse em cima do Item no desktop).
    - **Exibição de Bairros:**
      - Exibir dois bairros por tela au invés de um só.
    - **Modais (NeighborhoodModal.jsx, Modal.jsx, App.css):**
      - Arrumar a modal de hemocentro e bairro para serem responsivas.

- Versão 1.2:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Menu Hambúrguer (Navigation.jsx, Navigation.css, App.css):**
      - Quando o menu lateral abrir, o ícone do hambúrguer deve sumir.
      - O ícone do hambúrguer deve estar posicionado corretamente à direita da logo "logo-od" na Header.
      - O menu hambúrguer não deve aparecer sobre as opções de "Entrar" e "Cadastrar-se" do UserProfile.
    - **Textos na Hero (Hero.jsx):**
      - Os textos que passam devem ficar mais para baixo e centralizados no canto esquerdo da tela.
    - **Modal de Login/Cadastro (UserProfile.jsx, UserProfile.css, App.css):**
      - Os botões "Entrar" e "Cadastrar-se" devem ter largura total (auto fill).

- Versão 1.3:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Modal de Login/Cadastro (UserProfile.jsx, UserProfile.css, App.css):**
      - Quando a modal de "Entrar" ou "Cadastrar-se" for aberta (clicando no avatar), o menu hambúrguer deve desaparecer (não deve sobrepor a modal).
      - A modal deve fechar ao clicar fora dela.
    - **Hero (Hero.jsx, App.css):**
      - As "dots" (indicadores de paginação) do carrossel de imagens devem sumir em mobile/tablet.
      - A seção "Filtrar por" (opções: "Zona", "Abertos", "Mais próximos") deve ser responsiva.
      - O texto placeholder do campo de pesquisa ("Endereço, CEP, Bairro") deve ser menor para exibir o texto completo.
      - Os textos do carrossel (título e descrição) devem ficar mais para baixo e centralizados no canto esquerdo da tela.

- Versão 1.4:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Modal de Login/Cadastro (UserProfile.jsx, UserProfile.css, App.css):**
      - A modal de "Entrar" ou "Cadastrar-se" deve fechar ao clicar fora dela (reforço da v1.3).
    - **NeighborhoodModal.jsx (App.css):**
      - Quando um bairro possuir múltiplos hemocentros, os cards devem ser exibidos lado a lado com capacidade de arraste horizontal (swipe) para visualização de todos os hemocentros.

- Versão 1.5:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Modal de Login/Cadastro (UserProfile.jsx, UserProfile.css, App.css):**
      - Adicionar um botão "X" no canto superior direito da modal de "Entrar" ou "Cadastrar-se" para fechá-la.
    - **NeighborhoodModal.jsx (App.css):**
      - Aumentar o tamanho da modal para que o botão "Saiba mais" dos cards de hemocentros seja totalmente visível.

- Versão 1.6:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Modal de Login/Cadastro (UserProfile.jsx, UserProfile.css, App.css):**
      - O botão "X" da modal de "Entrar" ou "Cadastrar-se" está quebrado; aumentar o tamanho da modal para que o botão "X" fique parecido com o botão de "close" da modal Neighborhood.jsx.
    - **Filtro (Hero.jsx, App.css):**
      - Quando o usuário clicar fora das opções do filtro ("Zona", "Abertos", "Mais próximos"), o filtro deve fechar.

- Versão 1.7:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Modais (UserProfile.jsx, Hero.jsx, App.css):**
      - Remover o botão "X" das modais de "Entrar" ou "Cadastrar-se" (UserProfile) e do filtro (Hero).
      - Ambas as modais (UserProfile e filtro) devem fechar au clicar fora delas (dropdown), retornando à tela inicial.

- Versão 1.9:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Menu de Filtros com Checkbox (Hero.jsx, App.css):**
      - O menu de filtros com checkbox deve fechar ao clicar fora dele, seguindo a mesma funcionalidade do menu dropdown de UserProfile da versão 1.8.

- Versão 2.0:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Modais (Modal.jsx, Neighborhood.jsx, App.css):**
      - Diminuir o tamanho da Modal.jsx e Neighborhood.jsx para evitar que o botão de fechar (close) desapareça atrás da barra de pesquisa do navegador no celular.
    - **Neighborhood.jsx (Desktop e Mobile):**
      - Os cards de hemocentros devem ser exibidos in linhas (um abaixo do outro) em vez de lado a lado.
      - Na versão desktop, deve haver uma barra de rolagem para essa seção.
      - Na versão mobile, o usuário deve poder arrastar para baixo para visualizar todos os hemocentros.
    - **Seção "Quem somos" (App.jsx, Navigation.jsx, TeamCard.jsx):**
      - Remover "Quem somos" da Navigation.jsx.
      - Quando o usuário passar o mouse (desktop) ou clicar (mobile) em "Desenvolvido por doadores © Onde Doar 2026" no footer de App.jsx, um menu "dropup" com os membros (TeamCard) deve ser exibido, mantendo o visual existente.
    - **Status Bar (Item.jsx):**
      - Para desktop e mobile, a "status-bar" não deve mais preencher o item inteiro quando estiver fechado.
      - Deve ser uma faixa vermelha retangular no meio do item, indicando que está fechado.

- Versão 2.1:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **NeighborhoodModal.jsx (Desktop):**
      - Organizar os elementos "Saiba Mais", status de funcionamento ("operation") e as imagens, padronizando o tamanho das imagens.
    - **NeighborhoodModal.jsx (Mobile):**
      - Quando houver mais de um hemocentro, deve ter a funcionalidade do usuário arrastar para baixo para ver os hemocentros daquele bairro.
    - **Footer (App.jsx) - "Desenvolvido por doadores © Onde Doar 2026" (Desktop e Mobile):**
      - A parte de baixo do menu dos membros deve estar grudada no final da tela, não flutuando.
      - Quando o usuário clicar ou passar o mouse, trocar a cor do texto para vermelho e subir o menu dos integrantes, com as bordas do topo arredondadas.
    - **ZoneSection.jsx (Desktop e Mobile):**
      - Se for "METROPOLIS" substituir para "GRANDE SÃO PAULO".
      - Se for "INTERIOR" colocar logo em seguida do "INTERIOR DE" o estado, no caso "SÃO PAULO", ficando "INTERIOR DE SÃO PAULO".

- Versão 2.2:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **NeighborhoodModal.jsx (Desktop):**
      - A imagem do hemocentro (`unit-thumb-wrapper`) deve encaixar corretamente no card (`unit-card`), sem cortar a parte de baixo.
      - Ao passar o mouse no nome do hemocentro, ele deve mudar de cor para vermelho.
      - O texto "Hemocentros disponíveis neste bairro" deve ficar alinhado com o nome do bairro e ter uma cor cinza claro.
    - **Navigation.jsx (Mobile):**
      - Quando o menu hambúrguer for clicado e aberto, o avatar do usuário (`UserProfile`) deve desaparecer.
      - O menu hambúrguer deve funcionar corretamente no Google Chrome para celular e tablet.

- Versão 2.3:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **NeighborhoodModal.jsx (Mobile):**
      - Quando houver mais de um hemocentro de um determinado bairro, deve ter a funcionalidade de arrastar para baixo (scroll vertical) para ver os hemocentros daquele bairro.
    - **NeighborhoodModal.jsx (Desktop):**
      - Organizar o conteúdo dentro da modal de bairro: os cards de hemocentro devem ser exibidos em forma de lista (um embaixo do outro), com a imagem, o conteúdo e as informações do hemocentro visíveis e sem quebras. A imagem não deve estar cortada.

- Versão 2.4:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **NeighborhoodModal.jsx (Desktop):**
      - Corrigir a `status-bar` para hemocentros fechados: evitar que a bolinha vermelha interna fique achatada.
      - Resolver quebras de informação em bairros com mais de 2 hemocentros: garantir que nomes longos de hemocentros e endereços não quebrem o layout do card.
    - **Navegação de Cards (ZoneSection.jsx, SearchResults.jsx, Filtros):**
      - Corrigir o comportamento das setas de navigation: quando o usuário clica na seta direita (`›`), a seta esquerda (`‹`) deve aparecer e permitir a visualização dos hemocentros anteriores corretamente. Aplicar essa correção na `ZoneSection`, nos resultados de busca e nos filtros por "Abertos" e "Mais próximos".

- Versão 2.5:
  - **Responsividade Mobile (Celular/Tablet) - SEM alterar Desktop**
    - **Navegação de Cards (Desktop):**
      - Não remover a regra do `TitleList` para mostrar o próximo hemocentro; deve aparecer que há um próximo hemocentro para não dar a falsa impressão de que a lista acabou.
      - O usuário deve passar o mouse sobre algum `Item` para que a seta apareça.
      - Ao clicar na seta direita (`›`) para exibir os próximos hemocentros, a seta esquerda (`‹`) deve mostrar os hemocentros que já passaram, sem dar a falsa impressão de que só existem aqueles hemocentros na tela.
    - **NeighborhoodModal.jsx (Desktop):**
      - Arrumar o conteúdo dos hemocentros que estão quebrando o layout.
      - Diminuir o conteúdo de dentro dos cards que plota os hemocentros de um determinado bairro, permitindo a visualização de todos os elementos internos.
      - Corrigir especificamente quando há mais de dois hemocentros: evitar que o status de funcionamento (`operation`) e o botão "Saiba mais" desçam dentro dos cards e fiquem invisíveis. O layout deve garantir que esses elementos permaneçam visíveis e organizados.

- Versão 2.6:
  - **versão Desktop**
    - **NeighborhoodModal.jsx (Desktop):**
      - Corrigir a quebra de card para hemocentros com nomes muito longos (ex: Iamspe). O card deve se adaptar automaticamente para que elementos como o status de funcionamento (`operation`) e o botão "Saiba mais →" não fiquem cortados ou invisíveis.
    - **Footer (Desktop):**
      - Quando o usuário passar o mouse sobre o footer "Desenvolvido por doadores © Onde Doar 2026", o menu de integrantes que subir deve **sobrepor** os campos de pesquisa e filtro localizados na seção Hero, garantindo total visibilidade.
