# Guia de Instalação em Produção

## ⚠️ Requisitos de Sistema

### Node.js - Versão Recomendada
**IMPORTANTE:** Use Node.js v20 LTS ou v22 LTS para melhor compatibilidade.

```bash
# Verificar versão atual
node -v

# Se estiver usando Node.js v24, downgrade para v20 LTS
nvm install 20
nvm use 20
# ou
nvm install 22
nvm use 22
```

### Versões Testadas
- ✅ Node.js v20.x LTS (Recomendado)
- ✅ Node.js v22.x LTS
- ⚠️ Node.js v24.x (Pode ter problemas com better-sqlite3)

## 🚀 Instalação Passo a Passo

### 1. Clonar o Repositório
```bash
git clone https://github.com/vitor369789/sistema-conscientizacao-adornos.git
cd sistema-conscientizacao-adornos
```

### 2. Configurar Node.js (se necessário)
```bash
# Usando NVM
nvm install 20
nvm use 20

# Verificar versão
node -v  # Deve mostrar v20.x.x
```

### 3. Instalar Dependências

#### Opção A: Instalação Normal
```bash
npm run install-all
```

#### Opção B: Se houver erro com better-sqlite3
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json

# Reinstalar
npm install
cd client && npm install
```

#### Opção C: Forçar rebuild do better-sqlite3
```bash
npm install
npm rebuild better-sqlite3
cd client && npm install
```

### 4. Configurar Variáveis de Ambiente

#### Backend (.env na raiz)
```bash
cp .env.example .env
nano .env
```

Edite:
```env
# Credenciais de Administrador
VITE_ADMIN_USERNAME=seu_usuario
VITE_ADMIN_PASSWORD=sua_senha_forte

# Configurações de Porta
API_PORT=3001

# URL da API
VITE_API_URL=http://localhost:3001
```

#### Frontend (client/.env)
```bash
cp .env.example client/.env
nano client/.env
```

Edite:
```env
# Credenciais de Administrador
VITE_ADMIN_USERNAME=seu_usuario
VITE_ADMIN_PASSWORD=sua_senha_forte

# Configurações de Porta
VITE_PORT=3000
VITE_API_PORT=3001

# URL da API
VITE_API_URL=http://localhost:3001
```

### 5. Build do Frontend (Produção)
```bash
npm run build
```

### 6. Iniciar com PM2

#### Instalar PM2
```bash
npm install -g pm2
```

#### Iniciar Aplicação
```bash
npm run pm2:start
```

#### Configurar Auto-start
```bash
pm2 save
pm2 startup
# Seguir instruções mostradas
```

## 🔧 Solução de Problemas

### Erro: "better-sqlite3" não compila

**Causa:** Incompatibilidade com Node.js v24

**Solução 1:** Usar Node.js v20 LTS
```bash
nvm install 20
nvm use 20
rm -rf node_modules package-lock.json
npm install
```

**Solução 2:** Atualizar better-sqlite3
```bash
npm install better-sqlite3@latest
npm rebuild better-sqlite3
```

**Solução 3:** Instalar dependências de build (Linux)
```bash
# Debian/Ubuntu
sudo apt-get update
sudo apt-get install -y build-essential python3

# CentOS/RHEL
sudo yum groupinstall "Development Tools"
sudo yum install python3
```

### Erro: "gyp ERR! build error"

**Solução:**
```bash
# Instalar ferramentas de build
npm install -g node-gyp

# Limpar e reinstalar
npm cache clean --force
rm -rf node_modules
npm install
```

### Erro: Porta já em uso

**Solução:**
```bash
# Verificar processos na porta
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Matar processo
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows

# Ou mudar a porta no .env
```

## 🌐 Configuração com Nginx (Opcional)

### Instalar Nginx
```bash
sudo apt-get install nginx
```

### Configurar Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/adornos
```

Adicione:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        root /opt/sistema-conscientizacao-adornos/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar:
```bash
sudo ln -s /etc/nginx/sites-available/adornos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 📊 Verificação

### Verificar Status
```bash
pm2 status
pm2 logs adornos-api
```

### Testar API
```bash
curl http://localhost:3001/api/stats
```

### Testar Frontend
Acesse: `http://seu-servidor:3000`

## 🔒 Segurança em Produção

1. **Firewall:**
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **SSL/HTTPS:** Use Certbot para Let's Encrypt
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

3. **Variáveis de Ambiente:** Nunca commite arquivos `.env`

4. **Atualizações:**
   ```bash
   git pull
   npm install
   npm run build
   pm2 restart adornos-api
   ```

## 📞 Suporte

Se continuar com problemas:
1. Verifique a versão do Node.js: `node -v`
2. Verifique os logs: `pm2 logs adornos-api`
3. Verifique o sistema: `uname -a`
4. Compartilhe o erro completo

---

**Recomendação:** Use Node.js v20 LTS para máxima estabilidade!
