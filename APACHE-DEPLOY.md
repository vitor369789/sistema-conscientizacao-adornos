# Guia de Deploy com Apache

## 📋 Configuração Atual

Você está usando **Apache** com painel de controle (provavelmente BT Panel/aaPanel).

- **DocumentRoot**: `/www/wwwroot/adornoshmm.d36.com.br/`
- **Domínio**: `adornoshmm.d36.com.br`
- **SSL**: Já configurado ✅
- **Proxy**: Pasta `/www/server/panel/vhost/apache/proxy/adornoshmm.d36.com.br/`

## 🚀 Passos para Deploy

### 1. Build do Frontend

```bash
cd /opt/sistema-conscientizacao-adornos
npm run build
```

Isso cria a pasta `client/dist` com os arquivos otimizados.

### 2. Copiar Arquivos para DocumentRoot

```bash
# Backup do conteúdo atual (se houver)
sudo mv /www/wwwroot/adornoshmm.d36.com.br /www/wwwroot/adornoshmm.d36.com.br.backup

# Copiar arquivos do build
sudo cp -r /opt/sistema-conscientizacao-adornos/client/dist /www/wwwroot/adornoshmm.d36.com.br

# Ajustar permissões
sudo chown -R www:www /www/wwwroot/adornoshmm.d36.com.br
sudo chmod -R 755 /www/wwwroot/adornoshmm.d36.com.br
```

### 3. Configurar Proxy Reverso para API

```bash
# Criar pasta de proxy se não existir
sudo mkdir -p /www/server/panel/vhost/apache/proxy/adornoshmm.d36.com.br

# Criar arquivo de configuração
sudo nano /www/server/panel/vhost/apache/proxy/adornoshmm.d36.com.br/api-proxy.conf
```

**Cole este conteúdo:**

```apache
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyRequests Off
    
    # Proxy para API Backend
    ProxyPass /api http://localhost:4001/api
    ProxyPassReverse /api http://localhost:4001/api
    
    ProxyTimeout 300
    
    <Location /api>
        ProxyPass http://localhost:4001/api
        ProxyPassReverse http://localhost:4001/api
        RequestHeader set X-Forwarded-Proto "https"
        RequestHeader set X-Forwarded-For %{REMOTE_ADDR}s
    </Location>
</IfModule>
```

### 4. Habilitar Módulos Apache Necessários

```bash
# Verificar se módulos estão habilitados
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod rewrite

# Ou se estiver usando BT Panel, use o painel web:
# Apache > Módulos > Habilitar: proxy, proxy_http, headers
```

### 5. Atualizar .htaccess (Opcional)

Criar `/www/wwwroot/adornoshmm.d36.com.br/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Não reescrever requisições para API
  RewriteRule ^api/ - [L]
  
  # Redirecionar tudo para index.html (SPA)
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6. Reiniciar Apache

```bash
# Via comando
sudo systemctl restart apache2
# ou
sudo service apache2 restart

# Via BT Panel
# Apache > Reiniciar
```

### 7. Verificar Backend com PM2

```bash
# Verificar se está rodando
pm2 status

# Se não estiver, iniciar
cd /opt/sistema-conscientizacao-adornos
pm2 start ecosystem.config.cjs

# Salvar configuração
pm2 save
```

## 🧪 Testar

### Testar Frontend
```bash
curl https://adornoshmm.d36.com.br/
```

### Testar API
```bash
curl https://adornoshmm.d36.com.br/api/stats
```

## 📊 Estrutura Final

```
adornoshmm.d36.com.br/
├── index.html              (Frontend - Apache)
├── assets/                 (CSS, JS, imagens)
└── /api/*                  (Proxy → localhost:4001 - PM2)
```

## 🔄 Atualizar Aplicação

Sempre que fizer mudanças:

```bash
# 1. Atualizar código
cd /opt/sistema-conscientizacao-adornos
git pull origin main

# 2. Instalar dependências (se necessário)
npm install

# 3. Build do frontend
npm run build

# 4. Copiar para DocumentRoot
sudo rm -rf /www/wwwroot/adornoshmm.d36.com.br/*
sudo cp -r client/dist/* /www/wwwroot/adornoshmm.d36.com.br/
sudo chown -R www:www /www/wwwroot/adornoshmm.d36.com.br

# 5. Reiniciar backend
pm2 restart adornos-api
```

## 🔧 Solução de Problemas

### Erro 502 Bad Gateway
```bash
# Verificar se backend está rodando
pm2 status
pm2 logs adornos-api

# Verificar porta
netstat -tulpn | grep 4001
```

### Erro 404 nas rotas
- Verificar se `.htaccess` está configurado
- Verificar se `mod_rewrite` está habilitado

### API não responde
```bash
# Testar diretamente
curl http://localhost:4001/api/stats

# Verificar logs do Apache
tail -f /www/wwwlogs/adornoshmm.d36.com.br-error_log
```

## 📝 Variáveis de Ambiente

Certifique-se de que o `.env` no servidor está correto:

```bash
# /opt/sistema-conscientizacao-adornos/.env
API_PORT=4001
VITE_API_URL=https://adornoshmm.d36.com.br
```

## ✅ Checklist Final

- [ ] Build do frontend criado
- [ ] Arquivos copiados para `/www/wwwroot/adornoshmm.d36.com.br/`
- [ ] Proxy reverso configurado
- [ ] Módulos Apache habilitados
- [ ] Apache reiniciado
- [ ] Backend rodando com PM2
- [ ] Frontend acessível via HTTPS
- [ ] API respondendo via `/api/*`

---

**Pronto!** Sua aplicação estará rodando em produção com Apache + PM2! 🚀
