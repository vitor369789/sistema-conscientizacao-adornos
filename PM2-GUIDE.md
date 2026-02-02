# Guia de Uso do PM2

## 📦 Instalação do PM2

Primeiro, instale o PM2 globalmente:

```bash
npm install -g pm2
```

## 🚀 Comandos Principais

### Iniciar a Aplicação
```bash
npm run pm2:start
# ou
pm2 start ecosystem.config.cjs
```

### Parar a Aplicação
```bash
npm run pm2:stop
# ou
pm2 stop adornos-api
```

### Reiniciar a Aplicação
```bash
npm run pm2:restart
# ou
pm2 restart adornos-api
```

### Remover do PM2
```bash
npm run pm2:delete
# ou
pm2 delete adornos-api
```

### Ver Logs em Tempo Real
```bash
npm run pm2:logs
# ou
pm2 logs adornos-api
```

### Monitorar a Aplicação
```bash
npm run pm2:monit
# ou
pm2 monit
```

### Ver Status
```bash
npm run pm2:status
# ou
pm2 status
```

## 🔄 Configuração Automática no Boot

Para iniciar automaticamente quando o servidor reiniciar:

```bash
# Salvar a configuração atual
pm2 save

# Configurar para iniciar no boot (Windows)
pm2 startup

# Seguir as instruções mostradas no terminal
```

## 📊 Monitoramento

### Ver Informações Detalhadas
```bash
pm2 show adornos-api
```

### Ver Uso de Recursos
```bash
pm2 monit
```

### Dashboard Web (opcional)
```bash
pm2 plus
```

## 📝 Logs

Os logs são salvos em:
- `logs/api-error.log` - Erros
- `logs/api-out.log` - Saída padrão
- `logs/api-combined.log` - Todos os logs

### Limpar Logs
```bash
pm2 flush
```

### Ver Logs Antigos
```bash
pm2 logs adornos-api --lines 100
```

## 🔧 Configuração Avançada

### Alterar Número de Instâncias (Cluster Mode)
Edite `ecosystem.config.cjs`:
```javascript
instances: 2,  // ou 'max' para usar todos os CPUs
exec_mode: 'cluster',
```

### Ativar Watch Mode (Reiniciar ao Detectar Mudanças)
```javascript
watch: true,
```

### Variáveis de Ambiente
Adicione no arquivo `ecosystem.config.cjs`:
```javascript
env: {
  NODE_ENV: 'production',
  API_PORT: 3001,
  // outras variáveis...
}
```

## 🛠️ Troubleshooting

### Aplicação Não Inicia
```bash
# Ver logs de erro
pm2 logs adornos-api --err

# Reiniciar com logs
pm2 restart adornos-api --update-env
```

### Limpar Tudo e Recomeçar
```bash
pm2 delete all
pm2 kill
npm run pm2:start
```

### Atualizar PM2
```bash
npm install -g pm2@latest
pm2 update
```

## 📱 Integração com Frontend

O PM2 gerencia apenas o **backend** (API). Para o frontend em produção:

1. **Build do Frontend:**
   ```bash
   npm run build
   ```

2. **Servir com um servidor web:**
   - Use Nginx, Apache, ou
   - Sirva a pasta `client/dist` com um servidor estático

3. **Ou use PM2 com serve:**
   ```bash
   npm install -g serve
   pm2 start "serve -s client/dist -l 3000" --name adornos-frontend
   ```

## 🌐 Deploy em Produção

1. Clone o repositório no servidor
2. Instale as dependências:
   ```bash
   npm run install-all
   ```
3. Configure o `.env` com suas credenciais
4. Inicie com PM2:
   ```bash
   npm run pm2:start
   ```
5. Configure para iniciar no boot:
   ```bash
   pm2 save
   pm2 startup
   ```

## 📞 Comandos Úteis

```bash
# Recarregar sem downtime
pm2 reload adornos-api

# Ver uso de memória
pm2 list

# Resetar contador de reinicializações
pm2 reset adornos-api

# Escalar para mais instâncias
pm2 scale adornos-api 4
```

## 🔐 Segurança

- ✅ Logs são salvos localmente (não vão para o Git)
- ✅ Arquivo `.env` não é versionado
- ✅ PM2 reinicia automaticamente em caso de crash
- ✅ Limite de 10 reinicializações para evitar loops infinitos

---

**Dica:** Use `pm2 monit` para ter um dashboard em tempo real do status da aplicação!
