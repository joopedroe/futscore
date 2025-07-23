import OpenAI from 'openai';

// Configuração do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Necessário para uso no navegador
});

// Função para analisar a imagem e texto da partida
export const analyzeMatchPerformance = async (imageBase64, matchDescription) => {
  try {
    // Preparar a mensagem para a IA
    const messages = [
      {
        role: "system",
        content: `Você é um especialista em análise de desempenho de futebol. 
        Analise a imagem e a descrição da partida fornecidas e extraia as seguintes informações:
        - Gols marcados
        - Assistências
        - Passes certos e totais
        - Duelos ganhos e totais
        - Cartões amarelos
        - Cartões vermelhos
        - Minutos jogados
        - Posição do jogador
        - Nome do adversário (se mencionado)
        
        Baseando-se na análise, forneça também:
        - Uma nota de 0 a 10 para o desempenho
        - Uma breve análise do desempenho
        
        Retorne as informações em formato JSON estruturado.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Descrição da partida: ${matchDescription}`
          }
        ]
      }
    ];

    // Se houver imagem, adicionar à mensagem
    if (imageBase64) {
      messages[1].content.push({
        type: "image_url",
        image_url: {
          url: imageBase64
        }
      });
    }

    // Fazer a chamada para a API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo com visão computacional
      messages: messages,
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
    });

    // Processar a resposta
    const aiAnalysis = JSON.parse(response.choices[0].message.content);
    
    // Estruturar os dados para o formulário
    const formData = {
      goals: aiAnalysis.gols || 0,
      assists: aiAnalysis.assistencias || 0,
      successfulPasses: aiAnalysis.passes_certos || 0,
      totalPasses: aiAnalysis.passes_totais || 0,
      duelsWon: aiAnalysis.duelos_ganhos || 0,
      totalDuels: aiAnalysis.duelos_totais || 0,
      yellowCards: aiAnalysis.cartoes_amarelos || 0,
      redCards: aiAnalysis.cartoes_vermelhos || 0,
      minutesPlayed: aiAnalysis.minutos_jogados || 90,
      matchRating: aiAnalysis.nota || 5,
      position: aiAnalysis.posicao || '',
      opponent: aiAnalysis.adversario || '',
      aiAnalysis: aiAnalysis.analise || '',
      description: matchDescription
    };

    return {
      success: true,
      data: formData,
      aiInsights: aiAnalysis
    };

  } catch (error) {
    console.error('Erro ao analisar com IA:', error);
    
    // Tentar extrair informações básicas do texto mesmo sem IA
    const fallbackData = extractBasicInfo(matchDescription);
    
    return {
      success: false,
      error: error.message,
      data: fallbackData
    };
  }
};

// Função de fallback para extrair informações básicas do texto
const extractBasicInfo = (text) => {
  const data = {
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    minutesPlayed: 90,
    matchRating: 5,
    description: text
  };

  // Procurar por números de gols
  const golsMatch = text.match(/(\d+)\s*(gols?|goals?)/i);
  if (golsMatch) data.goals = parseInt(golsMatch[1]);

  // Procurar por assistências
  const assistsMatch = text.match(/(\d+)\s*(assist[êe]ncias?|assists?)/i);
  if (assistsMatch) data.assists = parseInt(assistsMatch[1]);

  // Procurar por cartões
  const yellowMatch = text.match(/cart[ãa]o\s*amarelo|yellow\s*card/i);
  if (yellowMatch) data.yellowCards = 1;

  const redMatch = text.match(/cart[ãa]o\s*vermelho|red\s*card/i);
  if (redMatch) data.redCards = 1;

  // Procurar por tempo jogado
  const minutesMatch = text.match(/(\d+)\s*(minutos?|minutes?)/i);
  if (minutesMatch) data.minutesPlayed = parseInt(minutesMatch[1]);

  // Estimar nota baseada no desempenho descrito
  if (data.goals >= 3) data.matchRating = 10;
  else if (data.goals >= 2) data.matchRating = 9;
  else if (data.goals >= 1) data.matchRating = 8;
  else if (data.assists >= 2) data.matchRating = 7;
  else if (data.assists >= 1) data.matchRating = 6;

  return data;
};

// Função para validar se a chave da API está configurada
export const isAIServiceConfigured = () => {
  return !!process.env.REACT_APP_OPENAI_API_KEY && 
         process.env.REACT_APP_OPENAI_API_KEY !== 'sua_chave_api_aqui';
};