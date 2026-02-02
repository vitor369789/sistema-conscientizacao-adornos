# Guia de Logos Personalizadas

## 📋 Como Adicionar Suas Logos

### Logos do Cabeçalho (Topo)
Você pode adicionar **até 3 logos** no topo da página inicial:
- **Logo 1, 2 e 3**: Aparecem lado a lado (quantas existirem)
- **Nenhuma**: Mostra o ícone Sparkles roxo (padrão)

### Logos do Rodapé (Embaixo)
Você pode adicionar **2 logos** no rodapé:
- **Logo 4**: Aparece à esquerda
- **Logo 5**: Aparece à direita
- **Texto central**: "Desenvolvido por iCore Soluções" (sempre visível)
- **Sem logos**: Apenas o texto aparece

### 1. Preparar as Imagens

**Formato recomendado:**
- PNG com fundo transparente
- Tamanho: 200x200px a 400x400px
- Proporção: Quadrada ou retangular horizontal
- Peso: Máximo 500KB cada

### 2. Adicionar Logos ao Projeto

**Arquivos do Cabeçalho (Topo):**
- `logo.png` - Primeira logo (opcional)
- `logo2.png` - Segunda logo (opcional)
- `logo3.png` - Terceira logo (opcional)

**Arquivos do Rodapé (Embaixo):**
- `logo4.png` - Logo à esquerda (opcional)
- `logo5.png` - Logo à direita (opcional)

**Opção A - Via Servidor (Produção):**

```bash
# Fazer upload das logos para o servidor
# Cabeçalho (topo) - até 3 logos
scp logo.png root@seu-servidor:/opt/sistema-conscientizacao-adornos/client/public/
scp logo2.png root@seu-servidor:/opt/sistema-conscientizacao-adornos/client/public/
scp logo3.png root@seu-servidor:/opt/sistema-conscientizacao-adornos/client/public/

# Rodapé (embaixo) - 2 logos
scp logo4.png root@seu-servidor:/opt/sistema-conscientizacao-adornos/client/public/
scp logo5.png root@seu-servidor:/opt/sistema-conscientizacao-adornos/client/public/

# Ou via painel de arquivos do servidor
# Copiar para: /opt/sistema-conscientizacao-adornos/client/public/
```

**Opção B - Via Desenvolvimento Local:**

```bash
# Copiar logos para a pasta public
# Cabeçalho (topo) - até 3 logos
cp sua-logo1.png client/public/logo.png
cp sua-logo2.png client/public/logo2.png
cp sua-logo3.png client/public/logo3.png

# Rodapé (embaixo) - 2 logos
cp sua-logo4.png client/public/logo4.png
cp sua-logo5.png client/public/logo5.png

# Fazer commit e push
git add client/public/logo*.png
git commit -m "Adicionar logos personalizadas"
git push origin main
```

### 3. Verificar

Acesse a página inicial e as logos devem aparecer automaticamente.

## 🎨 Comportamento

### Cabeçalho (Topo)
- **3 logos** (`logo.png` + `logo2.png` + `logo3.png`): Exibe todas lado a lado
- **2 logos**: Exibe as 2 que existem
- **1 logo**: Exibe apenas a que existe
- **Nenhuma logo**: Exibe o ícone Sparkles roxo (padrão)

### Rodapé (Embaixo)
- **2 logos** (`logo4.png` + `logo5.png`): Exibe uma à esquerda e outra à direita
- **1 logo** (apenas `logo4.png` OU `logo5.png`): Exibe apenas a que existe
- **Nenhuma logo**: Apenas o texto "Desenvolvido por iCore Soluções" aparece
- **Texto**: Sempre visível no centro entre as logos

## 📁 Localização dos Arquivos

```
client/
  └── public/
      ├── logo.png   ← Cabeçalho: Logo 1 (opcional)
      ├── logo2.png  ← Cabeçalho: Logo 2 (opcional)
      ├── logo3.png  ← Cabeçalho: Logo 3 (opcional)
      ├── logo4.png  ← Rodapé: Logo esquerda (opcional)
      └── logo5.png  ← Rodapé: Logo direita (opcional)
```

## 🔄 Atualizar Logos

Para trocar as logos, basta substituir os arquivos na pasta `public` e recarregar a página.

## ✅ Exemplo de Comandos

```bash
# No servidor
cd /opt/sistema-conscientizacao-adornos/client/public

# Fazer upload das logos
wget https://seu-site.com/logo.png
wget https://seu-site.com/logo2.png
# ou
# Fazer upload via FTP/SFTP para esta pasta

# Verificar se os arquivos existem
ls -lh logo*.png

# Reiniciar frontend (se necessário)
cd /opt/sistema-conscientizacao-adornos
pm2 restart adornos-frontend
```

## 🎯 Dicas

1. Use PNG com fundo transparente para melhor resultado
2. Logos muito grandes podem demorar para carregar
3. Teste em diferentes dispositivos (PC e mobile)
4. Se as logos não aparecerem, verifique os nomes dos arquivos:
   - **Cabeçalho**: `logo.png`, `logo2.png`, `logo3.png`
   - **Rodapé**: `logo4.png`, `logo5.png`
5. Para logos do cabeçalho, use tamanhos similares (altura: 96px)
6. Para logos do rodapé, use tamanhos menores (altura: 48px)
7. Espaçamento entre as logos do cabeçalho: 24px (automático)
8. Logos do rodapé têm opacidade de 70% e ficam 100% ao passar o mouse
9. Layout responsivo: logos do cabeçalho quebram linha em telas pequenas

## 📊 Exemplos de Uso

### Apenas uma logo da empresa (cabeçalho)
```
client/public/
  └── logo.png  ← Logo da empresa
```

### Duas logos no cabeçalho (empresa + parceiro)
```
client/public/
  ├── logo.png   ← Logo da empresa
  └── logo2.png  ← Logo do parceiro/cliente
```

### Configuração completa (5 logos)
```
client/public/
  ├── logo.png   ← Cabeçalho: Logo 1
  ├── logo2.png  ← Cabeçalho: Logo 2
  ├── logo3.png  ← Cabeçalho: Logo 3
  ├── logo4.png  ← Rodapé esquerda: Logo 4
  └── logo5.png  ← Rodapé direita: Logo 5
```

### Apenas logos do rodapé
```
client/public/
  ├── logo4.png  ← Rodapé esquerda
  └── logo5.png  ← Rodapé direita
```
*Nota: Cabeçalho mostrará o ícone Sparkles padrão*

### Apenas logos do cabeçalho
```
client/public/
  ├── logo.png   ← Cabeçalho: Logo 1
  ├── logo2.png  ← Cabeçalho: Logo 2
  └── logo3.png  ← Cabeçalho: Logo 3
```
*Nota: Rodapé mostrará apenas o texto do desenvolvedor*

---

**Pronto!** Suas logos personalizadas aparecerão na página inicial! 🎨
