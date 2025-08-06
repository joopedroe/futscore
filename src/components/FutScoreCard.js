import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './FutScoreCard.css';

const FutScoreCard = ({ matchData }) => {
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
    playerImage,
    teamLogo,
    opponentLogo
  } = matchData;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getPassAccuracy = () => {
    if (!totalPasses || totalPasses === 0) return 0;
    return Math.round((successfulPasses / totalPasses) * 100);
  };

  const getDuelWinRate = () => {
    if (!totalDuels || totalDuels === 0) return 0;
    return Math.round((duelsWon / totalDuels) * 100);
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return '#00ff88';
    if (rating >= 8) return '#52ff52';
    if (rating >= 7) return '#00d4ff';
    if (rating >= 6) return '#ffd700';
    if (rating >= 5) return '#ff9500';
    return '#ff4444';
  };

  const getPositionAbbreviation = (pos) => {
    const positions = {
      'Goleiro': 'GOL',
      'Zagueiro': 'ZAG',
      'Lateral': 'LAT',
      'Volante': 'VOL',
      'Meia': 'MEI',
      'Atacante': 'ATA',
      'Ponta': 'PON'
    };
    return positions[pos] || pos?.substring(0, 3).toUpperCase() || 'JOG';
  };

  const generateImage = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Usar html2canvas se disponível, senão usar canvas nativo
      if (html2canvas) {
        // Método 1: html2canvas (mais preciso)
        const canvas = await html2canvas(cardRef.current, {
          scale: 3,
          backgroundColor: null,
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `futscore-${playerName.replace(/\s+/g, '_')}-${formatDate(matchDate).replace(/\//g, '-')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
      } else {
        // Método 2: Canvas nativo (fallback)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // High resolution for social media
        const scale = 3;
        const width = 400;
        const height = 600;
        
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);
        
        // Recriar o card manualmente no canvas
        await drawCardOnCanvas(ctx, width, height);
        
        // Download the image
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `futscore-${playerName.replace(/\s+/g, '_')}-${formatDate(matchDate).replace(/\//g, '-')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
      }
      
      // Show success feedback
      const successMsg = document.createElement('div');
      successMsg.className = 'download-success';
      successMsg.textContent = '✓ Card baixado com sucesso!';
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.remove();
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar o card. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const drawCardOnCanvas = async (ctx, width, height) => {
    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#1a1a2e');
    bgGradient.addColorStop(0.5, '#0f0f1e');
    bgGradient.addColorStop(1, '#16213e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Card frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Top accent with team colors
    const topGradient = ctx.createLinearGradient(0, 0, width, 0);
    topGradient.addColorStop(0, getRatingColor(rating));
    topGradient.addColorStop(0.5, getRatingColor(rating));
    topGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, width, 4);
    
    // Header section
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(20, 20, width - 40, 80);
    
    // Match info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(formatDate(matchDate), 30, 45);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.fillText('vs', width/2 - 10, 45);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(opponent, width/2 + 10, 45);
    
    // Result
    if (result) {
      ctx.fillStyle = getRatingColor(rating);
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(result, width/2, 80);
      ctx.textAlign = 'left';
    }
    
    // Player section background
    const playerGradient = ctx.createLinearGradient(0, 110, 0, 280);
    playerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    playerGradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    ctx.fillStyle = playerGradient;
    ctx.fillRect(20, 110, width - 40, 170);
    
    // Player image placeholder
    if (playerImage) {
      // Would draw player image here if available
    } else {
      // Silhouette placeholder
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(width/2, 195, 60, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Player name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(playerName.toUpperCase(), width/2, 140);
    
    // Position badge
    const posX = width/2 - 30;
    const posY = 250;
    ctx.fillStyle = getRatingColor(rating);
    ctx.fillRect(posX, posY, 60, 25);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(getPositionAbbreviation(position), width/2, posY + 18);
    
    // Rating circle
    const ratingX = width - 80;
    const ratingY = 195;
    ctx.fillStyle = getRatingColor(rating);
    ctx.beginPath();
    ctx.arc(ratingX, ratingY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(rating.toString(), ratingX, ratingY + 10);
    
    // Stats section
    ctx.textAlign = 'left';
    const statsY = 300;
    const statHeight = 35;
    
    // Stats background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(20, statsY - 10, width - 40, statHeight * 4 + 20);
    
    // Individual stats
    const stats = [
      { icon: '⚽', label: 'GOLS', value: goals || 0 },
      { icon: '🎯', label: 'ASSISTÊNCIAS', value: assists || 0 },
      { icon: '📊', label: 'PASSES CERTOS', value: `${getPassAccuracy()}%` },
      { icon: '⚔️', label: 'DUELOS GANHOS', value: `${getDuelWinRate()}%` }
    ];
    
    stats.forEach((stat, index) => {
      const y = statsY + (index * statHeight);
      
      // Stat bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(30, y, width - 60, 25);
      
      // Icon
      ctx.font = '16px Arial';
      ctx.fillText(stat.icon, 40, y + 18);
      
      // Label
      ctx.fillStyle = '#cccccc';
      ctx.font = '12px Arial';
      ctx.fillText(stat.label, 65, y + 17);
      
      // Value
      ctx.fillStyle = getRatingColor(rating);
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(stat.value.toString(), width - 40, y + 18);
      ctx.textAlign = 'left';
    });
    
    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, height - 50, width, 50);
    
    // FutScore branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FUTSCORE', width/2, height - 20);
    
    // Minutes played
    if (minutesPlayed) {
      ctx.fillStyle = '#cccccc';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${minutesPlayed}'`, width - 30, height - 20);
    }
    
    // Cards if any
    if (yellowCards > 0 || redCards > 0) {
      ctx.textAlign = 'left';
      let cardX = 30;
      
      if (yellowCards > 0) {
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(cardX, height - 35, 15, 20);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(yellowCards.toString(), cardX + 20, height - 20);
        cardX += 40;
      }
      
      if (redCards > 0) {
        ctx.fillStyle = '#f44336';
        ctx.fillRect(cardX, height - 35, 15, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(redCards.toString(), cardX + 20, height - 20);
      }
    }
  };

  return (
    <div className={`futscore-card-container ${isVisible ? 'visible' : ''}`}>
      <div className="futscore-card" ref={cardRef} data-rating={rating} style={{ '--rating-color': getRatingColor(rating) }}>
        <div className="card-gradient-bg"></div>
        
        <div className="card-header">
          <div className="match-info">
            <span className="match-date">{formatDate(matchDate)}</span>
            <div className="match-versus">
              <span className="vs-text">VS</span>
              <span className="opponent-name">{opponent}</span>
            </div>
            {result && <span className="match-result">{result}</span>}
          </div>
        </div>
        
        <div className="player-section">
          <div className="player-image-container">
            {playerImage ? (
              <img src={playerImage} alt={playerName} className="player-image" />
            ) : (
              <div className="player-silhouette">
                <svg viewBox="0 0 100 100" className="silhouette-svg">
                  <circle cx="50" cy="30" r="15" fill="rgba(255,255,255,0.2)" />
                  <ellipse cx="50" cy="70" rx="25" ry="30" fill="rgba(255,255,255,0.2)" />
                </svg>
              </div>
            )}
          </div>
          
          <h2 className="player-name">{playerName.toUpperCase()}</h2>
          
          <div className="position-badge" style={{ backgroundColor: getRatingColor(rating) }}>
            {getPositionAbbreviation(position)}
          </div>
          
          <div className="rating-circle" style={{ backgroundColor: getRatingColor(rating) }}>
            <span className="rating-number">{rating}</span>
          </div>
        </div>
        
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-icon">⚽</span>
            <span className="stat-label">GOLS</span>
            <span className="stat-value" style={{ color: getRatingColor(rating) }}>{goals || 0}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">ASSISTÊNCIAS</span>
            <span className="stat-value" style={{ color: getRatingColor(rating) }}>{assists || 0}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <span className="stat-label">PASSES CERTOS</span>
            <span className="stat-value" style={{ color: getRatingColor(rating) }}>{getPassAccuracy()}%</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">⚔️</span>
            <span className="stat-label">DUELOS GANHOS</span>
            <span className="stat-value" style={{ color: getRatingColor(rating) }}>{getDuelWinRate()}%</span>
          </div>
        </div>
        
        <div className="card-footer">
          <div className="futscore-logo">FUTSCORE</div>
          
          {minutesPlayed && (
            <div className="minutes-played">{minutesPlayed}'</div>
          )}
          
          <div className="cards-info">
            {yellowCards > 0 && (
              <div className="card-indicator yellow">
                <span className="card-count">{yellowCards}</span>
              </div>
            )}
            {redCards > 0 && (
              <div className="card-indicator red">
                <span className="card-count">{redCards}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button 
        className={`download-button ${isGenerating ? 'generating' : ''}`}
        onClick={generateImage}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="spinner"></span>
            Gerando...
          </>
        ) : (
          <>
            <span className="download-icon">📥</span>
            Baixar Card
          </>
        )}
      </button>
    </div>
  );
};

export default FutScoreCard;