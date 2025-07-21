import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './PlayerCard.css';

const PlayerCard = ({ matchData }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
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
  
  const generateImage = async () => {
    if (!cardRef.current || isGenerating) return null;
    
    setIsGenerating(true);
    
    try {
      // Aguarda um pouco para garantir que o DOM está estável
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1a2e', // Cor de fundo sólida para garantir consistência
        scale: 2, // Maior qualidade
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        ignoreElements: (element) => {
          // Ignora elementos que podem causar problemas
          return element.classList?.contains('ignore-capture');
        }
      });
      
      return canvas;
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const shareAsImage = async () => {
    try {
      const canvas = await generateImage();
      if (!canvas) return;
      
      canvas.toBlob((blob) => {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'futscore-card.png', { type: 'image/png' })] })) {
          // Usar Web Share API se disponível (mobile)
          const file = new File([blob], 'futscore-card.png', { type: 'image/png' });
          navigator.share({
            title: 'Meu Card FutScore',
            text: `Confira minha performance: ${playerName} - Nota ${rating}`,
            files: [file]
          }).catch(err => {
            if (err.name !== 'AbortError') {
              console.error('Erro ao compartilhar:', err);
              downloadImage(blob);
            }
          });
        } else {
          // Fallback: download da imagem
          downloadImage(blob);
        }
      }, 'image/png', 0.9);
      
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    }
  };
  
  const downloadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `futscore-${playerName.replace(/\s+/g, '_')}-${formatDate(matchDate).replace(/\//g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const copyToClipboard = async () => {
    try {
      const canvas = await generateImage();
      if (!canvas) return;
      
      canvas.toBlob(async (blob) => {
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            
            // Feedback visual
            const button = document.querySelector('.copy-btn');
            if (button) {
              button.classList.add('copied');
              const originalText = button.textContent;
              button.textContent = '✓';
              setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
              }, 2000);
            }
          } else {
            // Fallback: download se clipboard não estiver disponível
            downloadImage(blob);
            alert('Imagem baixada! (Clipboard não suportado neste navegador)');
          }
        } catch (clipboardError) {
          console.error('Erro ao copiar:', clipboardError);
          downloadImage(blob);
          alert('Imagem baixada! (Erro ao copiar para clipboard)');
        }
      }, 'image/png', 0.9);
      
    } catch (error) {
      console.error('Erro ao gerar imagem para clipboard:', error);
      alert('Erro ao processar imagem. Tente novamente.');
    }
  };

  return (
    <div className="player-card" ref={cardRef}>
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
            <button 
              className={`share-btn copy-btn ${isGenerating ? 'loading' : ''}`}
              onClick={copyToClipboard}
              title="Copiar imagem"
              disabled={isGenerating}
            >
              {isGenerating ? '⏳' : '📋'}
            </button>
            <button 
              className={`share-btn download-btn ${isGenerating ? 'loading' : ''}`}
              onClick={shareAsImage}
              title="Baixar/Compartilhar imagem"
              disabled={isGenerating}
            >
              {isGenerating ? '⏳' : '📱'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 