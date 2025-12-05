# Guia de Deploy (GitHub Pages)

Siga estes passos exatos para colocar o site no ar e mandar o link no grupo.

## 1. Preparação (Já feita no código)
*   Já configurei o arquivo `vite.config.js` com o nome do repositório (`/fitManager/`).
*   Já instalei a ferramenta de deploy (`gh-pages`).

## 2. Criar o Repositório no GitHub
1.  Vá em [github.com/new](https://github.com/new)
2.  Nome do repositório: **fitManager** (Tem que ser exatamente este!)
3.  Deixe como **Public**.
4.  Clique em **Create repository**.

## 3. Subir o Código (No seu terminal)
Abra o terminal na pasta do projeto e rode comando por comando:

```bash
# Inicializa o git (se não tiver iniciado)
git init

# Adiciona todos os arquivos
git add .

# Salva a versão
git commit -m "Entrega Final MVP - FitManager"

# Conecta com o GitHub (copie o link do SEU repo criado no passo 2)
# Exemplo: git remote add origin https://github.com/SEU-USUARIO/fitManager.git
git remote add origin https://github.com/SEU-USUARIO/fitManager.git

# Envia o código
git push -u origin main
```

*(Se der erro de `main` não existe, tente `git branch -M main` antes do push)*

## 4. Colocar o Site no Ar (O Grande Momento)
Ainda no terminal, rode este comando mágico:

```bash
npm run deploy
```

Ele vai criar uma versão otimizada e mandar para o GitHub Pages.
Espere aparecer "Published" no terminal.

## 5. Pegar o Link
1.  Vá no seu repositório no GitHub.
2.  Clique em **Settings** > **Pages** (no menu lateral esquerdo).
3.  O link estará lá em cima! (Algo como `https://seu-usuario.github.io/fitManager/`)

**Esse é o link que você manda no grupo! 🚀**
