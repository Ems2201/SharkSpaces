🦈 Shark Space – NASA AI Ocean Explorer

Shark Space é uma aplicação interativa desenvolvida para explorar e visualizar dados ambientais oceânicos e comportamentais de tubarões com base em missões e satélites parceiros da NASA, como PACE, MODIS-Aqua e SWOT.
O projeto combina ciência de dados, visualização interativa e gamificação para tornar o estudo dos oceanos mais acessível e educativo.

🌍 Sobre o Projeto

O Shark Space permite que usuários explorem 20 regiões oceânicas estratégicas monitoradas por satélites da NASA e suas agências parceiras.
Cada ponto no mapa representa uma região com dados reais e simulados sobre:

Temperatura da superfície do mar (Sea Surface Temperature)

Altura da superfície do mar (Sea Surface Height)

Concentração de fitoplâncton (Phytoplankton Abundance)

Detecção acústica simulada de espécies marinhas

Dados de aceleração e movimento (simulando etiquetas eletrônicas — bio-logging tags)

A aplicação também possui um modo educativo e multilíngue, permitindo traduzir espécies e informações conforme o idioma do usuário.

🚀 Tecnologias Utilizadas
Categoria	Ferramentas
Frontend	React + Vite
UI/UX	shadcn/ui, TailwindCSS, Lucide Icons
Internacionalização	i18next
Visualização de Dados	Recharts
APIs NASA Integradas	PACE, MODIS-Aqua, SWOT
Banco de Dados	Supabase
Hospedagem	Netlify (site estático)
Outros	Simulação de sensores (áudio, temperatura, aceleração)
🛰️ Integração com APIs da NASA

A aplicação consome dados das seguintes missões:

PACE (2024–presente) – Observação de fitoplâncton, aerossóis e ecossistemas oceânicos.

MODIS-Aqua (2002–presente) – Medições de temperatura e cor da água para detecção de produtividade marinha.

SWOT (2022–presente) – Dados de elevação da superfície oceânica e variação de nível do mar.

Essas informações são acessadas via integração REST (implementada no backend com Node.js/Express), processadas e exibidas dinamicamente no painel.

🧠 Funcionalidades Principais

🌊 Exploração de Pontos Oceânicos — visualize até 20 regiões com dados ambientais e satelitais.

🦈 Simulação de Detecção de Espécies — o sistema gera detecções aleatórias de sons e movimentos marinhos.

🌐 Suporte Multilíngue — tradução automática dos nomes das espécies e textos informativos.

🛰️ Integração NASA API — exibe dados reais e simulados dos satélites.

📊 Gráficos e Mapas Interativos — análise visual em tempo real de parâmetros oceânicos.

🎧 Simulação de Áudio — recria eventos de detecção sonora, sem depender de microfone real.

🧩 Sidebar Dinâmica — exibe detalhes ao clicar em pontos do mapa.

💻 Instalação e Execução
🔧 Requisitos

Antes de iniciar, certifique-se de ter instalado:

Node.js
 (versão 18+)

npm
 (geralmente incluso no Node)

Editor de código (ex: VS Code)

🪄 Passo a Passo
# 1. Clone o repositório
git clone https://github.com/Ems2201/Shark-Spaces.git

# 2. Acesse a pasta do projeto
cd Shark-Spaces

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev


A aplicação será iniciada localmente em:

👉 http://localhost:5173

Desenvolvido por: Erick Paes, Guilherme Pinheiro, Leonardo Cassillo, Pedro Souza
🌐 Projeto educacional inspirado em NASA Ocean Missions & Marine Ecology Data Visualization

⚖️ Licença

Este projeto é distribuído sob a licença MIT.
Você pode usar, modificar e redistribuir livremente, desde que mantenha os créditos.
