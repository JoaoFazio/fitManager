# FitManager MVP - Sistema de Gestão para Academias

Bem-vindo ao repositório do **FitManager**. Este projeto é um MVP (Produto Mínimo Viável) desenvolvido para demonstrar uma plataforma SaaS moderna focada na retenção de alunos através da gamificação.

## 🚀 Visão Geral
O FitManager conecta donos de academias, personal trainers e alunos em um ecossistema integrado:
*   **Painel Admin:** Gestão financeira, controle de alunos e construtor de treinos.
*   **App do Aluno:** Experiência gamificada com níveis, streaks e feedback visual.
*   **Modo TV:** Leaderboard em tempo real para exibir na academia.

## 🛠️ Tecnologias
*   **Frontend:** React + Vite
*   **Estilização:** Tailwind CSS + Lucide React (Ícones)
*   **Animações:** Framer Motion + Canvas Confetti
*   **Roteamento:** React Router Dom

## 🏁 Como Rodar Localmente

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/seu-usuario/fitmanager.git
    cd fitmanager
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento**
    ```bash
    npm run dev
    ```

4.  **Acesse:** `http://localhost:5173`

## 🔑 Credenciais de Acesso (Modo Demo)

O sistema possui um "Modo Demo" ativado por padrão.
*   **Login Admin:** Qualquer e-mail e senha (ex: `admin@fitmanager.com` / `123456`)
*   **App do Aluno:** Não requer senha, basta selecionar o aluno na lista.

## 📱 Funcionalidades Principais
1.  **Dashboard Financeiro:** Visão de caixa e últimas atividades.
2.  **Gamificação:** Sistema de XP, Níveis (Bronze/Prata/Ouro) e Streaks.
3.  **Construtor de Treinos:** Interface drag-and-drop simplificada.
4.  **TV Mode:** Ranking ao vivo para engajamento presencial.

## ⚠️ Limitações Conhecidas (MVP)
*   **Vídeos:** Os vídeos de exercício são representados por imagens estáticas.
*   **Persistência:** Os dados são salvos no `localStorage` do navegador. Limpar o cache resetará o sistema.
