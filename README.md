GameForge AI: PWA Micro-Game Builder com IA

!Status: MVP em Desenvolvimento
!Licença: MIT
!Versão: 0.1.0

---

🚀 Visão Geral

O GameForge AI é um inovador Progressive Web App (PWA) que permite a criação de micro-games de forma instantânea, utilizando inteligência artificial. Nosso objetivo principal é democratizar o desenvolvimento de jogos, permitindo que qualquer pessoa, sem conhecimento prévio em programação, possa gerar e jogar games simples através de descrições textuais.

Público-alvo: Desenvolvedores, entusiastas de jogos, educadores, criadores de conteúdo e qualquer pessoa interessada em experimentar a criação de jogos com IA.

---

✨ Features Principais

*   AI-Powered Game Generation: Utilize a poderosa API Groq (modelo llama-3.1-8b-instant) para transformar descrições textuais em configurações de jogo JSON.
*   Endless Runner Game Engine: Um motor de jogo robusto baseado em Phaser 3, otimizado para criar experiências de "endless runner".
*   Progressive Web App (PWA): Desfrute de uma experiência offline-first, com instalação na tela inicial e acesso rápido.
*   Mobile-First Design: Interface responsiva e otimizada para dispositivos móveis, garantindo uma experiência fluida em qualquer tela.
*   Open Source (MIT): Código aberto, incentivando a colaboração e a inovação da comunidade.

---

🛠️ Tech Stack

O GameForge AI é construído com uma combinação de tecnologias modernas e eficientes:

*   Backend:
    *   Node.js
    *   Express.js
    *   Groq SDK
    *   Winston (para logging)
*   Frontend:
    *   React
    *   Vite (para build rápido)
    *   Phaser 3 (motor de jogo)
    *   Tailwind CSS (para estilização)
*   PWA:
    *   vite-plugin-pwa
    *   Service Worker
*   Gerenciamento de Estado:
    *   Zustand
    *   React Query

---

🏗️ Arquitetura

A arquitetura do GameForge AI é dividida em duas partes principais:

*   Backend (Node.js/Express):
    *   Atua como um servidor de API, expondo endpoints para geração e recuperação de jogos.
    *   Integra-se com a Groq API para processar as descrições dos usuários.
    *   Utiliza system prompts para guiar a IA na geração de configurações de jogo em formato JSON.
    *   Game Storage: Atualmente, os jogos gerados são armazenados em um In-memory Map, o que significa que não há persistência entre reinícios do servidor.
*   Frontend (React/Phaser):
    *   Consome a API do backend para solicitar a geração de jogos.
    *   O motor Phaser 3 é responsável por renderizar dinamicamente o jogo com base na configuração JSON recebida.
    *   A interface do usuário é construída com React e estilizada com Tailwind CSS.

---

⚙️ Instalação e Setup

Para configurar e executar o GameForge AI localmente, siga os passos abaixo:

Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

*   Node.js (versão 18 ou superior)
*   npm (gerenciador de pacotes do Node.js)

1. Clone o Repositório

`bash
git clone https://github.com/GuilhermeCamarotto/GameForge-AI.git
cd GameForge-AI
`

2. Configuração do Backend

`bash
cd backend
npm install
`

Crie um arquivo .env na raiz da pasta backend com suas credenciais da Groq API:

`
GROQ_API_KEY=sua_chave_api_groq_aqui
`

Inicie o servidor backend:

`bash
npm run dev
`

O servidor estará rodando em http://localhost:3000.

3. Configuração do Frontend

Abra um novo terminal e navegue para a pasta frontend:

`bash
cd ../frontend
npm install
`

Crie um arquivo .env na raiz da pasta frontend com a URL do seu backend:

`
VITE_API_URL=http://localhost:3000
`

Inicie o aplicativo frontend:

`bash
npm run dev
`

O aplicativo estará disponível em http://localhost:5173 (ou outra porta disponível).

---

🎮 Como Usar

1.  Descreva seu Jogo: Na interface do GameForge AI, insira uma descrição textual do micro-game que você deseja criar.
    *   Exemplo de descrição: "Um jogo de corredor infinito onde um astronauta desvia de meteoros no espaço."
    *   Exemplo de descrição: "Crie um jogo onde um carro corre em uma estrada e precisa pular cones."
2.  Gere o Jogo: Clique no botão "Gerar Jogo". O backend enviará sua descrição para a IA da Groq, que retornará uma configuração JSON para o jogo.
3.  Jogue: O motor Phaser 3 no frontend usará essa configuração para renderizar seu jogo dinamicamente.

Controles do Jogo

*   Pular: Barra de espaço ou seta para cima (↑)
*   Mover: Setas para a esquerda (←) e direita (→) (se aplicável ao tipo de jogo gerado)

---

🌐 API Endpoints

O backend do GameForge AI expõe os seguintes endpoints:

*   POST /api/generate
    *   Descrição: Gera uma nova configuração de jogo com base em uma descrição textual.
    *   Corpo da Requisição:
        `json
        {
          "description": "Um jogo de corredor infinito onde um ninja salta sobre shurikens."
        }
        `
    *   Resposta:
        `json
        {
          "gameId": "unique-game-id-123",
          "config": {
            "player": { "sprite": "ninja", "speed": 200 },
            "obstacles": [{ "sprite": "shuriken", "frequency": 1500 }],
            "background": "dojo"
          }
        }
        `

*   GET /api/games/:id
    *   Descrição: Recupera a configuração de um jogo específico pelo seu ID.
    *   Parâmetros: :id (o gameId retornado pelo endpoint /api/generate)
    *   Resposta:
        `json
        {
          "gameId": "unique-game-id-123",
          "config": {
            "player": { "sprite": "ninja", "speed": 200 },
            "obstacles": [{ "sprite": "shuriken", "frequency": 1500 }],
            "background": "dojo"
          }
        }
        `

---

🗺️ Roadmap e Status de Desenvolvimento

Nosso projeto está em constante evolução. Aqui está o status atual e o que planejamos para o futuro:

*   ✅ MVP Frontend: Interface de usuário funcional com integração Phaser para renderização de jogos.
*   🔄 Real AI: Refinamento contínuo das capacidades da IA para gerar configurações de jogo mais complexas e variadas.
*   🔄 Multiplayer + Marketplace: Exploração de funcionalidades multiplayer e um marketplace para compartilhar jogos.
*   🔄 Pro Tier: Desenvolvimento de um nível "Pro" com recursos avançados.
*   🔜 Persistência de Games: Implementação de um banco de dados para armazenar jogos gerados, permitindo que os usuários salvem e carreguem suas criações.
*   🔜 Suporte a Mais Tipos de Games: Expansão para além dos "endless runners", incluindo outros gêneros de micro-games.
*   🔜 Assets Customizados: Permitir que a IA gere ou utilize assets gráficos mais específicos, em vez de formas genéricas.

---

⚠️ Limitações Atuais

É importante estar ciente das limitações atuais do projeto:

*   Storage em Memória: Os jogos gerados não são persistentes e são perdidos ao reiniciar o servidor backend.
*   Sprites Genéricos: Atualmente, os "sprites" são renderizados como formas geométricas genéricas (retângulos, círculos) e não como assets gráficos customizados.
*   Apenas Endless Runner: O motor de jogo atual suporta exclusivamente o gênero "endless runner".
*   Sem Autenticação/Autorização: Não há sistema de login ou controle de acesso implementado.

---

🤝 Contribuindo

Adoramos contribuições! Se você deseja ajudar a melhorar o GameForge AI, siga estas diretrizes:

1.  Reportar Bugs: Se encontrar um bug, por favor, abra uma Issue no repositório GitHub, descrevendo o problema em detalhes e os passos para reproduzi-lo.
2.  Sugerir Features: Novas ideias são sempre bem-vindas! Abra uma Issue para discutir suas sugestões.
3.  Fazer Pull Requests (PRs):
    *   Faça um fork do repositório.
    *   Crie uma nova branch para sua feature ou correção (git checkout -b feature/minha-feature ou bugfix/correcao-bug).
    *   Faça suas alterações e teste-as.
    *   Commit suas mudanças (git commit -m 'feat: Adiciona nova funcionalidade X').
    *   Envie para o seu fork (git push origin feature/minha-feature).
    *   Abra um Pull Request para a branch main do repositório original.

---

📄 Licença e Créditos

Este projeto está sob a Licença MIT.

Desenvolvedor Principal: Guilherme Camarotto (Full Stack Developer)

---

📧 Contato e Links

*   Repositório GitHub: https://github.com/GuilhermeCamarotto/GameForge-AI
*   Demo (se disponível): [Link para a demo online] (Em breve)
*   Documentação (se disponível): (Em breve)
*   Contato: guilherme.camarotto@example.com (Substitua pelo seu email real)