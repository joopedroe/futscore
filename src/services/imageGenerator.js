class ImageGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }

  async generatePlayerCard(matchData) {
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

    // Card dimensions
    const width = 600;
    const height = 800;
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    
    // Enable high DPI rendering
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);
    
    // Background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#2c2c54');
    gradient.addColorStop(1, '#1a1a2e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // Top accent line
    const topGradient = this.ctx.createLinearGradient(0, 0, width, 0);
    topGradient.addColorStop(0, '#667eea');
    topGradient.addColorStop(1, '#764ba2');
    this.ctx.fillStyle = topGradient;
    this.ctx.fillRect(0, 0, width, 6);
    
    // Card border radius effect (simulate with clipping)
    this.ctx.save();
    this.roundRect(0, 0, width, height, 20);
    this.ctx.clip();
    
    // Header section
    this.drawHeader(opponent, result, matchDate, rating, 40);
    
    // Player info
    this.drawPlayerInfo(playerName, position, minutesPlayed, 140);
    
    // Main stats
    this.drawMainStats(goals, assists, successfulPasses, totalPasses, duelsWon, totalDuels, 220);
    
    // Detailed stats
    this.drawDetailedStats(matchData, 360);
    
    // Performance summary
    if (description) {
      this.drawPerformanceSummary(description, 580);
    }
    
    // Footer
    this.drawFooter(680);
    
    this.ctx.restore();
    
    return this.canvas;
  }
  
  drawHeader(opponent, result, matchDate, rating, y) {
    // Opponent info
    this.ctx.fillStyle = '#8892b0';
    this.ctx.font = '16px Inter, sans-serif';
    this.ctx.fillText('vs', 40, y);
    
    this.ctx.fillStyle = '#ccd6f6';
    this.ctx.font = 'bold 28px Inter, sans-serif';
    this.ctx.fillText(opponent, 70, y);
    
    if (result) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.fillRect(70 + this.ctx.measureText(opponent).width + 15, y - 20, 80, 30);
      this.ctx.fillStyle = '#ccd6f6';
      this.ctx.font = '14px Inter, sans-serif';
      this.ctx.fillText(result, 70 + this.ctx.measureText(opponent).width + 25, y - 5);
    }
    
    // Date
    if (matchDate) {
      this.ctx.fillStyle = '#8892b0';
      this.ctx.font = '14px Inter, sans-serif';
      const formattedDate = new Date(matchDate).toLocaleDateString('pt-BR');
      this.ctx.fillText(formattedDate, 40, y + 25);
    }
    
    // Rating circle
    const ratingColor = this.getRatingColor(rating);
    const centerX = 500;
    const centerY = y - 10;
    const radius = 40;
    
    // Circle background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // Circle border
    this.ctx.strokeStyle = ratingColor;
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
    
    // Rating number
    this.ctx.fillStyle = ratingColor;
    this.ctx.font = 'bold 24px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(rating.toString(), centerX, centerY + 8);
    
    // Rating text
    this.ctx.fillStyle = ratingColor;
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillText(this.getRatingText(rating), centerX, centerY + 55);
    
    this.ctx.textAlign = 'left'; // Reset text alignment
  }
  
  drawPlayerInfo(playerName, position, minutesPlayed, y) {
    // Player name
    this.ctx.fillStyle = '#ccd6f6';
    this.ctx.font = 'bold 36px Inter, sans-serif';
    this.ctx.fillText(playerName, 40, y);
    
    // Position and minutes
    this.ctx.fillStyle = '#8892b0';
    this.ctx.font = '16px Inter, sans-serif';
    let details = '';
    if (position) details += position;
    if (minutesPlayed) details += (details ? ' • ' : '') + minutesPlayed + "'";
    this.ctx.fillText(details, 40, y + 30);
  }
  
  drawMainStats(goals, assists, successfulPasses, totalPasses, duelsWon, totalDuels, y) {
    const stats = [
      { value: goals, label: 'Gols', highlight: true },
      { value: assists, label: 'Assists', highlight: true },
      { value: this.getPercentage(successfulPasses, totalPasses) + '%', label: 'Passes', highlight: false },
      { value: this.getPercentage(duelsWon, totalDuels) + '%', label: 'Duelos', highlight: false }
    ];
    
    const statWidth = (560 - 60) / 4; // Total width minus margins, divided by 4 stats
    
    stats.forEach((stat, index) => {
      const x = 40 + index * statWidth;
      
      // Background for highlighted stats
      if (stat.highlight) {
        this.ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        this.ctx.fillRect(x - 10, y - 40, statWidth - 20, 80);
      }
      
      // Value
      this.ctx.fillStyle = stat.highlight ? '#64ffda' : '#ccd6f6';
      this.ctx.font = 'bold 28px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(stat.value.toString(), x + statWidth/2 - 10, y);
      
      // Label
      this.ctx.fillStyle = '#8892b0';
      this.ctx.font = '14px Inter, sans-serif';
      this.ctx.fillText(stat.label, x + statWidth/2 - 10, y + 25);
    });
    
    this.ctx.textAlign = 'left'; // Reset text alignment
  }
  
  drawDetailedStats(matchData, y) {
    // Title
    this.ctx.fillStyle = '#ccd6f6';
    this.ctx.font = 'bold 18px Inter, sans-serif';
    this.ctx.fillText('📊 Estatísticas Detalhadas', 40, y);
    
    const stats = [
      { name: 'Passes Certos', value: `${matchData.successfulPasses}/${matchData.totalPasses}` },
      { name: 'Duelos Ganhos', value: `${matchData.duelsWon}/${matchData.totalDuels}` },
      { name: 'Avaliação Pessoal', value: `${matchData.matchRating}/10` }
    ];
    
    if (matchData.yellowCards > 0) {
      stats.push({ name: 'Cartões Amarelos', value: `${matchData.yellowCards} 🟡` });
    }
    
    if (matchData.redCards > 0) {
      stats.push({ name: 'Cartões Vermelhos', value: `${matchData.redCards} 🔴` });
    }
    
    let currentY = y + 35;
    stats.forEach(stat => {
      this.ctx.fillStyle = '#8892b0';
      this.ctx.font = '14px Inter, sans-serif';
      this.ctx.fillText(stat.name, 40, currentY);
      
      this.ctx.fillStyle = '#ccd6f6';
      this.ctx.font = 'bold 14px Inter, sans-serif';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(stat.value, 560, currentY);
      this.ctx.textAlign = 'left';
      
      currentY += 25;
    });
  }
  
  drawPerformanceSummary(description, y) {
    // Title
    this.ctx.fillStyle = '#ccd6f6';
    this.ctx.font = 'bold 18px Inter, sans-serif';
    this.ctx.fillText('💬 Resumo da Performance', 40, y);
    
    // Description with text wrapping
    this.ctx.fillStyle = '#8892b0';
    this.ctx.font = '14px Inter, sans-serif';
    this.wrapText(description, 40, y + 30, 520, 20);
  }
  
  drawFooter(y) {
    // App name
    this.ctx.fillStyle = '#667eea';
    this.ctx.font = 'bold 20px Inter, sans-serif';
    this.ctx.fillText('FutScore', 40, y);
    
    // Timestamp
    this.ctx.fillStyle = '#8892b0';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(new Date().toLocaleString('pt-BR'), 560, y);
    this.ctx.textAlign = 'left';
  }
  
  // Helper methods
  roundRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }
  
  wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && i > 0) {
        this.ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, currentY);
  }
  
  getPercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
  
  getRatingColor(rating) {
    if (rating >= 8) return '#4caf50';
    if (rating >= 6.5) return '#ff9800';
    if (rating >= 5) return '#ffc107';
    return '#f44336';
  }
  
  getRatingText(rating) {
    if (rating >= 9) return 'EXCEPCIONAL';
    if (rating >= 8) return 'EXCELENTE';
    if (rating >= 7) return 'MUITO BOM';
    if (rating >= 6) return 'BOM';
    if (rating >= 5) return 'REGULAR';
    if (rating >= 4) return 'ABAIXO';
    return 'RUIM';
  }
  
  async downloadImage(canvas, filename) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png', 0.95);
    });
  }
}

export default ImageGenerator;