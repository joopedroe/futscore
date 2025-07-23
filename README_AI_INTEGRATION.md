# 🤖 Integração com IA - FutScore

## Visão Geral

A integração com IA permite que os jogadores analisem suas partidas de forma automática, enviando uma imagem e/ou descrição textual de como foi o jogo. A IA irá:

- Extrair estatísticas da descrição (gols, assistências, cartões, etc.)
- Analisar imagens da partida (opcional)
- Gerar uma nota de 0 a 10 baseada no desempenho
- Fornecer uma análise detalhada do desempenho

## Como Funciona

### 1. Configuração Inicial

1. **Obter uma chave de API do OpenAI:**
   - Acesse [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Crie uma conta ou faça login
   - Gere uma nova chave de API
   - Copie o arquivo `.env.example` para `.env`
   - Cole sua chave no arquivo `.env`

2. **Instalar dependências:**
   ```bash
   npm install
   ```

### 2. Usando a Análise com IA

1. Na tela inicial, clique no botão **"🤖 Análise com IA"**
2. **Envie uma imagem (opcional):** Clique na área de upload para adicionar uma foto da partida
3. **Descreva sua partida:** No campo de texto, conte como foi seu jogo. Exemplo:
   ```
   "Hoje eu joguei muito bem! Fiz 3 gols, dei 2 assistências, 
   tomei um cartão amarelo mas foi por uma falta tática importante. 
   Dei vários dribles e olés, joguei os 90 minutos completos contra o Flamengo."
   ```
4. Clique em **"🎯 Analisar Partida"**
5. A IA irá processar as informações e retornar:
   - Estatísticas extraídas
   - Nota de desempenho
   - Análise detalhada
6. Clique em **"✅ Usar estes dados no formulário"** para gerar o card

### 3. O que a IA Analisa

A IA é capaz de identificar:

- **Gols marcados**
- **Assistências**
- **Cartões (amarelos e vermelhos)**
- **Tempo jogado**
- **Passes (certos e totais)**
- **Duelos (ganhos e totais)**
- **Adversário**
- **Posição em campo**
- **Qualidade geral do desempenho**

### 4. Dicas para Melhores Resultados

- **Seja específico:** Quanto mais detalhes você fornecer, melhor será a análise
- **Use números:** Mencione quantidades específicas (ex: "3 gols", "2 assistências")
- **Inclua contexto:** Mencione o adversário, tempo jogado, situações importantes
- **Imagens ajudam:** Se tiver fotos da partida, a análise será mais precisa

### 5. Fallback Inteligente

Se houver algum problema com a API da IA, o sistema ainda tentará extrair informações básicas do texto usando expressões regulares, garantindo que você sempre consiga gerar seu card.

## Tecnologias Utilizadas

- **OpenAI GPT-4o-mini:** Modelo de IA com capacidade de visão computacional
- **React:** Interface do usuário
- **Análise de Linguagem Natural:** Para extrair informações do texto
- **Processamento de Imagens:** Para analisar fotos das partidas

## Segurança

- A chave de API é armazenada localmente no arquivo `.env`
- Nunca compartilhe sua chave de API
- O arquivo `.env` está no `.gitignore` para evitar exposição acidental

## Troubleshooting

**Erro: "Serviço de IA não configurado"**
- Verifique se o arquivo `.env` existe
- Confirme que a chave de API está correta
- Reinicie o servidor de desenvolvimento

**Análise não retorna resultados esperados**
- Seja mais específico na descrição
- Use números e quantidades exatas
- Verifique se a imagem está clara e relacionada à partida

**Limite de API excedido**
- Verifique seu saldo na OpenAI
- Considere usar o modo de entrada manual temporariamente