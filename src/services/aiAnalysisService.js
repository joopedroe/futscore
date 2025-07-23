// Serviço de análise de IA para extrair dados da partida
class AIAnalysisService {
  
  // Simula uma análise de IA que extrai dados da descrição da partida
  static analyzeMatchDescription(description, playerImage = null) {
    return new Promise((resolve) => {
      // Simula delay de processamento da IA
      setTimeout(() => {
        const analysis = this.extractMatchData(description);
        const rating = this.calculateAIRating(analysis, description);
        
        resolve({
          ...analysis,
          aiRating: rating,
          aiAnalysis: this.generateAIInsights(description, analysis, rating)
        });
      }, 1500); // Simula 1.5s de processamento
    });
  }

  // Extrai dados específicos da descrição usando regex e palavras-chave
  static extractMatchData(description) {
    const text = description.toLowerCase();
    
    // Extração de gols
    const goals = this.extractNumber(text, ['gol', 'gols', 'golaço', 'golaços']) || 0;
    
    // Extração de assistências
    const assists = this.extractNumber(text, ['assistência', 'assistencias', 'passe', 'passes']) || 0;
    
    // Extração de cartões
    const yellowCards = this.extractNumber(text, ['cartão amarelo', 'amarelo', 'cartao']) || 0;
    const redCards = this.extractNumber(text, ['cartão vermelho', 'vermelho', 'expulso']) || 0;
    
    // Análise de performance baseada em palavras-chave
    const performanceKeywords = {
      excellent: ['excelente', 'perfeito', 'incrível', 'fantástico', 'sensacional'],
      good: ['bom', 'bem', 'legal', 'bacana', 'jogou muito'],
      average: ['ok', 'médio', 'regular', 'normal'],
      poor: ['ruim', 'mal', 'péssimo', 'terrível']
    };

    let performanceLevel = 'average';
    for (const [level, keywords] of Object.entries(performanceKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        performanceLevel = level;
        break;
      }
    }

    // Estimativa de passes baseada na descrição
    let successfulPasses = 25;
    let totalPasses = 35;
    
    if (text.includes('muitos passes') || text.includes('passou bem')) {
      successfulPasses = 45;
      totalPasses = 55;
    } else if (text.includes('errou passes') || text.includes('perdeu a bola')) {
      successfulPasses = 15;
      totalPasses = 30;
    }

    // Estimativa de duelos
    let duelsWon = 8;
    let totalDuels = 15;
    
    if (text.includes('ganhou duelos') || text.includes('disputou bem')) {
      duelsWon = 12;
      totalDuels = 18;
    } else if (text.includes('perdeu duelos') || text.includes('não disputou')) {
      duelsWon = 4;
      totalDuels = 12;
    }

    // Tempo jogado
    let minutesPlayed = 90;
    if (text.includes('saiu') || text.includes('substituído')) {
      minutesPlayed = 70;
    } else if (text.includes('entrou') || text.includes('banco')) {
      minutesPlayed = 30;
    }

    return {
      goals,
      assists,
      yellowCards,
      redCards,
      successfulPasses,
      totalPasses,
      duelsWon,
      totalDuels,
      minutesPlayed,
      performanceLevel
    };
  }

  // Extrai números da descrição baseado em palavras-chave
  static extractNumber(text, keywords) {
    const numbers = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
    
    for (const keyword of keywords) {
      // Procura por números antes da palavra-chave
      const regex1 = new RegExp(`(\\d+)\\s+${keyword}`, 'i');
      const match1 = text.match(regex1);
      if (match1) return parseInt(match1[1]);
      
      // Procura por números escritos por extenso
      for (let i = 0; i < numbers.length; i++) {
        if (text.includes(`${numbers[i]} ${keyword}`)) {
          return i;
        }
      }
      
      // Procura padrões como "fiz 3 gols"
      const regex2 = new RegExp(`fiz\\s+(\\d+)\\s+${keyword}`, 'i');
      const match2 = text.match(regex2);
      if (match2) return parseInt(match2[1]);
    }
    
    return 0;
  }

  // Calcula nota baseada na análise da IA
  static calculateAIRating(analysis, description) {
    let rating = 5.0; // Nota base
    
    // Gols têm peso alto
    rating += analysis.goals * 1.8;
    
    // Assistências
    rating += analysis.assists * 1.4;
    
    // Eficiência nos passes
    const passAccuracy = (analysis.successfulPasses / analysis.totalPasses) * 100;
    if (passAccuracy >= 85) rating += 1.2;
    else if (passAccuracy >= 75) rating += 0.8;
    else if (passAccuracy < 60) rating -= 0.8;
    
    // Cartões penalizam
    rating -= analysis.yellowCards * 0.7;
    rating -= analysis.redCards * 2.5;
    
    // Duelos ganhos
    const duelWinRate = (analysis.duelsWon / analysis.totalDuels) * 100;
    if (duelWinRate >= 70) rating += 0.8;
    else if (duelWinRate < 40) rating -= 0.5;
    
    // Análise de sentimento da descrição
    const text = description.toLowerCase();
    if (text.includes('joguei muito') || text.includes('excelente')) rating += 1.0;
    if (text.includes('dominei') || text.includes('controlei')) rating += 0.8;
    if (text.includes('ruim') || text.includes('mal')) rating -= 1.0;
    
    // Tempo jogado influencia
    if (analysis.minutesPlayed >= 80) rating += 0.3;
    else if (analysis.minutesPlayed < 30) rating -= 0.5;
    
    // Performance level
    const levelBonus = {
      excellent: 1.5,
      good: 0.8,
      average: 0,
      poor: -1.2
    };
    rating += levelBonus[analysis.performanceLevel] || 0;
    
    // Limita entre 0 e 10
    return Math.max(0, Math.min(10, Math.round(rating * 10) / 10));
  }

  // Gera insights da IA sobre a performance
  static generateAIInsights(description, analysis, rating) {
    const insights = [];
    
    if (analysis.goals > 2) {
      insights.push(`🎯 Performance ofensiva excepcional com ${analysis.goals} gols!`);
    } else if (analysis.goals > 0) {
      insights.push(`⚽ Contribuição importante no ataque com ${analysis.goals} gol(s).`);
    }
    
    if (analysis.assists > 1) {
      insights.push(`🎭 Excelente visão de jogo com ${analysis.assists} assistências.`);
    }
    
    const passAccuracy = Math.round((analysis.successfulPasses / analysis.totalPasses) * 100);
    if (passAccuracy >= 85) {
      insights.push(`📊 Precisão excepcional nos passes: ${passAccuracy}%.`);
    } else if (passAccuracy < 60) {
      insights.push(`⚠️ Precisa melhorar a precisão nos passes: ${passAccuracy}%.`);
    }
    
    if (analysis.yellowCards > 0 || analysis.redCards > 0) {
      insights.push(`🟨 Precisa controlar mais a disciplina em campo.`);
    }
    
    const duelWinRate = Math.round((analysis.duelsWon / analysis.totalDuels) * 100);
    if (duelWinRate >= 70) {
      insights.push(`💪 Domínio físico impressionante: ${duelWinRate}% dos duelos ganhos.`);
    }
    
    // Insight geral baseado na nota
    if (rating >= 8.5) {
      insights.push(`🌟 Performance de elite! Uma das melhores partidas da temporada.`);
    } else if (rating >= 7.0) {
      insights.push(`👏 Ótima performance! Jogou acima da média.`);
    } else if (rating >= 5.5) {
      insights.push(`👍 Performance sólida com margem para crescimento.`);
    } else {
      insights.push(`📈 Oportunidade de melhoria para as próximas partidas.`);
    }
    
    return insights;
  }

  // Simula análise de imagem (placeholder para futura integração com APIs de visão computacional)
  static analyzePlayerImage(imageData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula análise da imagem
        const imageInsights = [
          "🏃‍♂️ Postura atlética identificada na imagem",
          "⚽ Equipamento de futebol detectado",
          "🎯 Expressão focada e determinada"
        ];
        
        resolve({
          imageAnalyzed: true,
          insights: imageInsights,
          confidenceScore: 0.87
        });
      }, 800);
    });
  }
}

export default AIAnalysisService;