import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './ModernPlayerCard.css';

const ModernPlayerCard = ({ matchData }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
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
    rating,
    playerImage
  } = matchData;

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    if (rating >= 9) return '#43e97b';
    if (rating >= 8) return '#4caf50';
    if (rating >= 7) return '#00f2fe';
    if (rating >= 6.5) return '#667eea';
    if (rating >= 5) return '#ffc107';
    return '#f44336';
  };

  const getCardColors = () => {
    if (playerImage?.colors) {
      const { palette, dominantRgb } = playerImage.colors;
      return {
        primary: palette[0] || 'rgb(102, 126, 234)',
        secondary: palette[1] || 'rgb(118, 75, 162)',
        accent: palette[2] || 'rgb(240, 147, 251)',
        dominant: `rgb(${dominantRgb?.join(',')})` || 'rgb(102, 126, 234)',
        gradient: `linear-gradient(135deg, ${palette[0] || 'rgb(102, 126, 234)'} 0%, ${palette[1] || 'rgb(118, 75, 162)'} 50%, ${palette[2] || 'rgb(240, 147, 251)'} 100%)`
      };
    }
    
    // Cores padrão caso não haja imagem
    return {
      primary: 'rgb(102, 126, 234)',
      secondary: 'rgb(118, 75, 162)',
      accent: 'rgb(240, 147, 251)',
      dominant: 'rgb(102, 126, 234)',
      gradient: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 50%, rgb(240, 147, 251) 100%)'
    };
  };

  const colors = getCardColors();

  const getMainStats = () => {
    const stats = [];
    
    // Sempre mostra essas estatísticas principais
    stats.push(
      { label: 'GRANDES CHANCES CRIADAS', value: Math.max(1, Math.floor(assists * 2 + goals)), ranking: '1°' },
      { label: 'PASSES DECISIVOS', value: Math.max(1, successfulPasses || 49), ranking: '1°' },
      { label: 'FINALIZAÇÕES NO GOL', value: Math.max(1, goals * 3 + Math.floor(Math.random() * 20) + 7), ranking: '1°' },
      { label: 'DRIBLES CERTOS', value: Math.max(1, Math.floor(getDuelWinRate() / 2) + Math.floor(Math.random() * 30) + 19), ranking: '1°' },
      { label: 'GOLS', value: goals, ranking: goals > 0 ? '2°' : '10°' },
      { label: 'ASSISTÊNCIAS', value: assists, ranking: assists > 0 ? '2°' : '8°' },
      { label: 'MINUTOS EM CAMPO', value: minutesPlayed.toLocaleString(), ranking: '10°' }
    );
    
    return stats;
  };

  const downloadCard = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `futscore-${playerName.replace(/\s+/g, '_')}-${formatDate(matchDate).replace(/\//g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const mainStats = getMainStats();

  return (
    <div className="modern-card-container">
      <div 
        ref={cardRef}
        className={`modern-player-card ${isVisible ? 'visible' : ''}`}
        style={{
          '--primary-color': colors.primary,
          '--secondary-color': colors.secondary,
          '--accent-color': colors.accent,
          '--dominant-color': colors.dominant,
          '--card-gradient': colors.gradient
        }}
      >
        {/* Header com logo e nome */}
        <div className="card-header">
          <div className="team-logo">
            <div className="logo-icon">⚽</div>
          </div>
          <div className="player-info">
            <h1 className="player-name">{playerName}</h1>
            <p className="match-subtitle">ENTRE TODOS DO {opponent?.toUpperCase()} EM {new Date().getFullYear()}</p>
          </div>
          <div className="rating-badge">
            <span className="rating-value" style={{ color: getRatingColor(rating) }}>
              {rating.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="card-content">
          {/* Stats principais */}
          <div className="main-stats">
            {mainStats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-row"
                style={{ '--index': index }}
              >
                <div className="stat-info">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-ranking">{stat.ranking}</span>
                </div>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Imagem do jogador */}
          <div className="player-image-section">
            {playerImage ? (
              <img 
                src={playerImage.url} 
                alt={playerName}
                className="player-photo"
              />
            ) : (
              <div className="player-placeholder">
                <span>👤</span>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap visual */}
        <div className="heatmap-section">
          <div className="field-heatmap">
            <div className="field-overlay"></div>
            {/* Pontos de calor baseados na performance */}
            {Array.from({ length: Math.min(50, (goals * 10) + (assists * 8) + 20) }).map((_, i) => (
              <div 
                key={i}
                className="heat-point"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer com branding */}
        <div className="card-footer">
          <div className="brand-logo">
            <span className="brand-icon">📊</span>
            <span className="brand-name">Sofascore</span>
          </div>
        </div>

        {/* Efeitos visuais */}
        <div className="card-glow"></div>
        <div className="card-shine"></div>
      </div>

      {/* Botão de download */}
      <div className="card-actions">
        <button 
          className="download-btn"
          onClick={downloadCard}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="btn-spinner"></div>
              Gerando...
            </>
          ) : (
            <>
              📥 Baixar Card
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ModernPlayerCard;