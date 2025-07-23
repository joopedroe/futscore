import React, { useState } from 'react';
import './App.css';
import MatchForm from './components/MatchForm';
import ModernPlayerCard from './components/ModernPlayerCard';
import Header from './components/Header';
import AIMatchAnalyzer from './components/AIMatchAnalyzer';

function App() {
  const [matchData, setMatchData] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);

  const handleMatchSubmit = (data) => {
    // Calcular nota baseada na performance
    const rating = calculateRating(data);
    const matchWithRating = { ...data, rating };
    
    setMatchData(matchWithRating);
    setShowCard(true);
    setShowAIAnalyzer(false);
  };

  const handleAIAnalysisComplete = (aiData) => {
    // Quando a IA completar a análise, preencher o formulário
    const rating = calculateRating(aiData);
    const matchWithRating = { ...aiData, rating };
    
    setMatchData(matchWithRating);
    setShowCard(true);
    setShowAIAnalyzer(false);
  };

  const calculateRating = (data) => {
    // Se já houver uma nota da IA, usar ela
    if (data.matchRating !== undefined && data.matchRating !== null) {
      return data.matchRating;
    }
    
    let score = 5; // Nota base
    
    // Gols (peso alto)
    score += data.goals * 1.5;
    
    // Assistências
    score += data.assists * 1.2;
    
    // Passes certos
    if (data.totalPasses > 0) {
      const passAccuracy = (data.successfulPasses / data.totalPasses) * 100;
      if (passAccuracy >= 90) score += 1;
      else if (passAccuracy >= 80) score += 0.5;
      else if (passAccuracy < 60) score -= 0.5;
    }
    
    // Cartões (penalizam)
    score -= data.yellowCards * 0.5;
    score -= data.redCards * 2;
    
    // Duelos ganhos
    if (data.totalDuels > 0) {
      const duelWinRate = (data.duelsWon / data.totalDuels) * 100;
      if (duelWinRate >= 70) score += 0.5;
      else if (duelWinRate < 40) score -= 0.3;
    }
    
    // Limitar entre 0 e 10
    return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
  };

  const handleNewMatch = () => {
    setShowCard(false);
    setMatchData(null);
    setShowAIAnalyzer(false);
  };

  const toggleAIAnalyzer = () => {
    setShowAIAnalyzer(!showAIAnalyzer);
  };

  return (
    <div className="App">
      <div className="container">
        <Header />
        
        {!showCard ? (
          <>
            {/* Botão para alternar entre formulário manual e análise com IA */}
            <div className="mode-toggle">
              <button 
                className={`mode-btn ${!showAIAnalyzer ? 'active' : ''}`}
                onClick={() => setShowAIAnalyzer(false)}
              >
                📝 Entrada Manual
              </button>
              <button 
                className={`mode-btn ${showAIAnalyzer ? 'active' : ''}`}
                onClick={() => setShowAIAnalyzer(true)}
              >
                🤖 Análise com IA
              </button>
            </div>

            {/* Mostrar componente baseado no modo selecionado */}
            {showAIAnalyzer ? (
              <AIMatchAnalyzer onAnalysisComplete={handleAIAnalysisComplete} />
            ) : (
              <MatchForm onSubmit={handleMatchSubmit} />
            )}
          </>
        ) : (
          <div className="card-section">
            <ModernPlayerCard matchData={matchData} />
            <button 
              className="btn btn-primary new-match-btn" 
              onClick={handleNewMatch}
            >
              Nova Partida
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 