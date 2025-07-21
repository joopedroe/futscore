import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ matchData }) => {
  const {
    playerName,
    position,
    matchDate,
    opponent,
    result,
    goals,
    assists,
    successfulPasses,
    totalPasses,
    duelsWon,
    totalDuels,
    yellowCards,
    redCards,
    matchRating,
    minutesPlayed,
    description,
    rating
  } = matchData;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPassAccuracy = () => {
    if (totalPasses === 0) return 0;
    return Math.round((successfulPasses / totalPasses) * 100);
  };

  const getDuelWinRate = () => {
    if (totalDuels === 0) return 0;
    return Math.round((duelsWon / totalDuels) * 100);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#4caf50'; // Verde
    if (rating >= 6.5) return '#ff9800'; // Laranja
    if (rating >= 5) return '#ffc107'; // Amarelo
    return '#f44336'; // Vermelho
  };

  const getRatingText = (rating) => {
    if (rating >= 9) return 'EXCEPCIONAL';
    if (rating >= 8) return 'EXCELENTE';
    if (rating >= 7) return 'MUITO BOM';
    if (rating >= 6) return 'BOM';
    if (rating >= 5) return 'REGULAR';
    if (rating >= 4) return 'ABAIXO';
    return 'RUIM';
  };

  return (
    <div className="player-card">
      {/* Header do Card */}
      <div className="card-header">
        <div className="match-info">
          <div className="opponent-section">
            <span className="vs-text">vs</span>
            <h3 className="opponent-name">{opponent}</h3>
            {result && <span className="result">{result}</span>}
          </div>
          {matchDate && (
            <div className="match-date">
              <span>{formatDate(matchDate)}</span>
            </div>
          )}
        </div>
        
        <div className="rating-section">
          <div 
            className="rating-circle"
            style={{ borderColor: getRatingColor(rating) }}
          >
            <span className="rating-number" style={{ color: getRatingColor(rating) }}>
              {rating}
            </span>
          </div>
          <span 
            className="rating-text"
            style={{ color: getRatingColor(rating) }}
          >
            {getRatingText(rating)}
          </span>
        </div>
      </div>

      {/* Informações do Jogador */}
      <div className="player-info">
        <h2 className="player-name">{playerName}</h2>
        <div className="player-details">
          {position && <span className="position">{position}</span>}
          <span className="minutes">{minutesPlayed}'</span>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="main-stats">
        <div className="stat-item highlight">
          <span className="stat-value">{goals}</span>
          <span className="stat-label">Gols</span>
        </div>
        <div className="stat-item highlight">
          <span className="stat-value">{assists}</span>
          <span className="stat-label">Assists</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{getPassAccuracy()}%</span>
          <span className="stat-label">Passes</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{getDuelWinRate()}%</span>
          <span className="stat-label">Duelos</span>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="detailed-stats">
        <h4 className="stats-title">📊 Estatísticas Detalhadas</h4>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-name">Passes Certos</span>
            <span className="stat-data">{successfulPasses}/{totalPasses}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Duelos Ganhos</span>
            <span className="stat-data">{duelsWon}/{totalDuels}</span>
          </div>
          {yellowCards > 0 && (
            <div className="stat-row">
              <span className="stat-name">Cartões Amarelos</span>
              <span className="stat-data yellow-card">{yellowCards} 🟡</span>
            </div>
          )}
          {redCards > 0 && (
            <div className="stat-row">
              <span className="stat-name">Cartões Vermelhos</span>
              <span className="stat-data red-card">{redCards} 🔴</span>
            </div>
          )}
          <div className="stat-row">
            <span className="stat-name">Avaliação Pessoal</span>
            <span className="stat-data">{matchRating}/10</span>
          </div>
        </div>
      </div>

      {/* Resumo da Performance */}
      {description && (
        <div className="performance-summary">
          <h4 className="summary-title">💬 Resumo da Performance</h4>
          <p className="summary-text">{description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="footer-branding">
          <span className="app-name">FutScore</span>
        </div>
        <div className="share-options">
          <span className="share-text">Compartilhar</span>
          <div className="share-buttons">
            <span>📱</span>
            <span>💾</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 