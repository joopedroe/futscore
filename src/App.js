import React, { useState } from 'react';
import './App.css';
import MatchForm from './components/MatchForm';
import ModernPlayerCard from './components/ModernPlayerCard';
import FutScoreCard from './components/FutScoreCard';
import Header from './components/Header';

function App() {
  const [matchData, setMatchData] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [cardStyle, setCardStyle] = useState('futscore'); // 'modern' ou 'futscore'

  const handleMatchSubmit = (data) => {
    // Calcular nota baseada na performance
    const rating = calculateRating(data);
    const matchWithRating = { ...data, rating };
    
    setMatchData(matchWithRating);
    setShowCard(true);
  };

  const calculateRating = (data) => {
    let score = 5; // Nota base
    
    // Gols (peso alto)
    score += data.goals * 1.5;
    
    // Assistências
    score += data.assists * 1.2;
    
    // Passes certos
    const passAccuracy = (data.successfulPasses / data.totalPasses) * 100;
    if (passAccuracy >= 90) score += 1;
    else if (passAccuracy >= 80) score += 0.5;
    else if (passAccuracy < 60) score -= 0.5;
    
    // Cartões (penalizam)
    score -= data.yellowCards * 0.5;
    score -= data.redCards * 2;
    
    // Duelos ganhos
    const duelWinRate = (data.duelsWon / data.totalDuels) * 100;
    if (duelWinRate >= 70) score += 0.5;
    else if (duelWinRate < 40) score -= 0.3;
    
    // Nota da partida subjetiva
    score += (data.matchRating - 5) * 0.3;
    
    // Limitar entre 0 e 10
    return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
  };

  const handleNewMatch = () => {
    setShowCard(false);
    setMatchData(null);
  };

  return (
    <div className="App">
      <div className="container">
        <Header />
        
        {!showCard ? (
          <div>
            <div className="style-selector">
              <h3>Escolha o estilo do card:</h3>
              <div className="style-buttons">
                <button 
                  className={`style-btn ${cardStyle === 'futscore' ? 'active' : ''}`}
                  onClick={() => setCardStyle('futscore')}
                >
                  FutScore Style
                </button>
                <button 
                  className={`style-btn ${cardStyle === 'modern' ? 'active' : ''}`}
                  onClick={() => setCardStyle('modern')}
                >
                  Modern Style
                </button>
              </div>
            </div>
            <MatchForm onSubmit={handleMatchSubmit} />
          </div>
        ) : (
          <div className="card-section">
            {cardStyle === 'futscore' ? (
              <FutScoreCard matchData={matchData} />
            ) : (
              <ModernPlayerCard matchData={matchData} />
            )}
            <button 
              className="btn btn-primary new-match-btn" 
              onClick={handleNewMatch}
            >
              <span>Nova Partida</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 