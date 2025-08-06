import React, { useState, useRef, useEffect } from 'react';
import './ModernPlayerCard.css';
import html2canvas from 'html2canvas';

function ModernPlayerCard({ matchData }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  // Apply dynamic colors from uploaded image
  useEffect(() => {
    if (matchData.imageData?.colors && cardRef.current) {
      const { palette, dominantRgb } = matchData.imageData.colors;
      const cardElement = cardRef.current;
      
      // Set CSS custom properties for dynamic colors
      cardElement.style.setProperty('--primary-color', palette[0]);
      cardElement.style.setProperty('--secondary-color', palette[1]);
      cardElement.style.setProperty('--accent-color', palette[2]);
      cardElement.style.setProperty('--gradient-start', palette[0]);
      cardElement.style.setProperty('--gradient-middle', palette[1]);
      cardElement.style.setProperty('--gradient-end', palette[2]);
      
      // Create dynamic gradient
      const gradient = `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 50%, ${palette[2]} 100%)`;
      cardElement.style.setProperty('--card-gradient', gradient);
      
      // Set lighter variants for subtle effects
      const lightVariant1 = palette[0].replace('rgb(', 'rgba(').replace(')', ', 0.3)');
      const lightVariant2 = palette[1].replace('rgb(', 'rgba(').replace(')', ', 0.2)');
      cardElement.style.setProperty('--primary-light', lightVariant1);
      cardElement.style.setProperty('--secondary-light', lightVariant2);
    }
  }, [matchData.imageData]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPositionLabel = (position) => {
    const positions = {
      'GK': 'GOL',
      'DC': 'ZAG',
      'LB': 'LE',
      'RB': 'LD',
      'DMC': 'VOL',
      'MC': 'MC',
      'AMC': 'MEI',
      'LW': 'PE',
      'RW': 'PD',
      'ST': 'ATA'
    };
    return positions[position] || position;
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#10b981';
    if (rating >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const passAccuracy = matchData.totalPasses > 0 
    ? Math.round((matchData.successfulPasses / matchData.totalPasses) * 100)
    : 0;

  const duelSuccessRate = matchData.totalDuels > 0
    ? Math.round((matchData.duelsWon / matchData.totalDuels) * 100)
    : 0;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `futscore-${matchData.playerName}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao baixar o card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Performance de ${matchData.playerName}`,
        text: `Confira minha performance na partida! ⚽ Nota: ${matchData.rating}/10`,
        url: window.location.href
      }).catch(console.error);
    }
  };

  return (
    <div className="modern-player-card">
      <div className={`card-wrapper ${isFlipped ? 'flipped' : ''}`} ref={cardRef}>
        {/* Frente do card */}
        <div className="card-face card-front">
          <div className="card-pattern"></div>
          
          {/* Botões de ação */}
          <div className="card-actions">
            <button className="action-button" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? '⏳' : '📥'}
            </button>
            <button className="action-button" onClick={handleShare}>
              📤
            </button>
          </div>

          {/* Header */}
          <div className="card-header">
            <div className="match-info">
              <span className="competition-badge">{matchData.competition || 'Partida'}</span>
              <span className="match-date">{formatDate(matchData.matchDate)}</span>
            </div>
            <div className="teams-score">
              <span className="team-name">{matchData.homeTeam}</span>
              <span className="score-divider">{matchData.homeScore} - {matchData.awayScore}</span>
              <span className="team-name">{matchData.awayTeam}</span>
            </div>
          </div>

          {/* SofaScore-style branding */}
          <div className="card-branding">
            <div className="brand-logo">⚽</div>
            <span className="brand-text">FutScore</span>
          </div>

          {/* Performance indicator */}
          <div className="performance-indicator" style={{ 
            height: `${Math.min(matchData.rating * 8, 60)}px`,
            background: getRatingColor(matchData.rating)
          }}></div>

          {/* Seção do jogador */}
          <div className="player-section">
            <div className="player-image-container">
              <div className="player-image-wrapper">
                {matchData.imageData?.url ? (
                  <img src={matchData.imageData.url} alt={matchData.playerName} className="player-image" />
                ) : matchData.profileImage ? (
                  <img src={matchData.profileImage} alt={matchData.playerName} className="player-image" />
                ) : (
                  <div className="player-image-placeholder">👤</div>
                )}
              </div>
              <span className="position-badge">{getPositionLabel(matchData.position)}</span>
            </div>

            <h2 className="player-name">{matchData.playerName}</h2>
            
            <div className="rating-display" style={{ borderColor: getRatingColor(matchData.rating) }}>
              <span className="rating-star">⭐</span>
              <span style={{ color: getRatingColor(matchData.rating) }}>{matchData.rating}</span>
            </div>

            {/* Grid de estatísticas principais */}
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{matchData.goals}</span>
                <span className="stat-label">Gols</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{matchData.assists}</span>
                <span className="stat-label">Assists</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{passAccuracy}%</span>
                <span className="stat-label">Passes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{duelSuccessRate}%</span>
                <span className="stat-label">Duelos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{matchData.yellowCards}</span>
                <span className="stat-label">Amarelos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{matchData.redCards}</span>
                <span className="stat-label">Vermelhos</span>
              </div>
            </div>
          </div>

          {/* Estatísticas detalhadas */}
          <div className="detailed-stats">
            <div className="stat-row">
              <span className="stat-name">
                <span className="stat-icon">⚡</span>
                Faltas Cometidas
              </span>
              <span className="stat-number">{matchData.foulsCommitted}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">
                <span className="stat-icon">🛡️</span>
                Faltas Sofridas
              </span>
              <span className="stat-number">{matchData.foulsSuffered}</span>
            </div>
          </div>

          <div className="flip-hint" onClick={() => setIsFlipped(!isFlipped)}>
            <span>↻</span>
            <span>Virar card</span>
          </div>
        </div>

        {/* Verso do card */}
        <div className="card-face card-back">
          <div className="card-back-header">
            <h3 className="card-back-title">Análise Detalhada</h3>
            <p>{matchData.playerName} • {formatDate(matchData.matchDate)}</p>
          </div>

          {matchData.highlights && (
            <div className="highlights-section">
              <h4 className="highlights-title">
                <span>✨</span>
                Destaques da Partida
              </h4>
              <p className="highlights-text">{matchData.highlights}</p>
            </div>
          )}

          <div className="performance-chart">
            <h4 className="highlights-title">
              <span>📊</span>
              Resumo de Performance
            </h4>
            <div className="chart-placeholder">
              <div style={{ textAlign: 'left' }}>
                <p>• Total de Passes: {matchData.successfulPasses}/{matchData.totalPasses}</p>
                <p>• Duelos Ganhos: {matchData.duelsWon}/{matchData.totalDuels}</p>
                <p>• Participação em Gols: {matchData.goals + matchData.assists}</p>
                <p>• Nota Final: {matchData.rating}/10</p>
              </div>
            </div>
          </div>

          <div className="flip-hint" onClick={() => setIsFlipped(!isFlipped)}>
            <span>↻</span>
            <span>Voltar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernPlayerCard;