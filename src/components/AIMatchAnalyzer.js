import React, { useState } from 'react';
import AIAnalysisService from '../services/aiAnalysisService';
import './AIMatchAnalyzer.css';

const AIMatchAnalyzer = ({ onAnalysisComplete, playerImage }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      alert('Por favor, descreva como foi sua partida!');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Analisa a descrição da partida
      const results = await AIAnalysisService.analyzeMatchDescription(description, playerImage);
      
      // Se há imagem, analisa também
      let imageAnalysis = null;
      if (playerImage) {
        imageAnalysis = await AIAnalysisService.analyzePlayerImage(playerImage);
      }
      
      const finalResults = {
        ...results,
        imageAnalysis,
        originalDescription: description
      };
      
      setAnalysisResults(finalResults);
      setShowResults(true);
    } catch (error) {
      console.error('Erro na análise:', error);
      alert('Erro ao analisar a partida. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseResults = () => {
    onAnalysisComplete(analysisResults);
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setAnalysisResults(null);
    setDescription('');
  };

  if (showResults && analysisResults) {
    return (
      <div className="ai-analyzer">
        <div className="ai-results">
          <h3 className="results-title">
            🤖 Análise da IA Concluída
          </h3>
          
          <div className="ai-rating-section">
            <div className="ai-rating">
              <span className="rating-label">Nota da IA:</span>
              <span className="rating-value">{analysisResults.aiRating}/10</span>
            </div>
          </div>

          <div className="extracted-data">
            <h4>📊 Dados Extraídos:</h4>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-label">⚽ Gols:</span>
                <span className="data-value">{analysisResults.goals}</span>
              </div>
              <div className="data-item">
                <span className="data-label">🎭 Assistências:</span>
                <span className="data-value">{analysisResults.assists}</span>
              </div>
              <div className="data-item">
                <span className="data-label">📊 Passes Certos:</span>
                <span className="data-value">{analysisResults.successfulPasses}/{analysisResults.totalPasses}</span>
              </div>
              <div className="data-item">
                <span className="data-label">💪 Duelos Ganhos:</span>
                <span className="data-value">{analysisResults.duelsWon}/{analysisResults.totalDuels}</span>
              </div>
              <div className="data-item">
                <span className="data-label">🟨 Cartões:</span>
                <span className="data-value">{analysisResults.yellowCards}A {analysisResults.redCards}V</span>
              </div>
              <div className="data-item">
                <span className="data-label">⏱️ Minutos:</span>
                <span className="data-value">{analysisResults.minutesPlayed}'</span>
              </div>
            </div>
          </div>

          <div className="ai-insights">
            <h4>🧠 Insights da IA:</h4>
            <ul className="insights-list">
              {analysisResults.aiAnalysis.map((insight, index) => (
                <li key={index} className="insight-item">{insight}</li>
              ))}
            </ul>
          </div>

          {analysisResults.imageAnalysis && (
            <div className="image-analysis">
              <h4>📸 Análise da Imagem:</h4>
              <ul className="insights-list">
                {analysisResults.imageAnalysis.insights.map((insight, index) => (
                  <li key={index} className="insight-item">{insight}</li>
                ))}
              </ul>
              <p className="confidence">
                Confiança: {Math.round(analysisResults.imageAnalysis.confidenceScore * 100)}%
              </p>
            </div>
          )}

          <div className="results-actions">
            <button 
              className="btn btn-primary"
              onClick={handleUseResults}
            >
              ✅ Usar Estes Dados
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleTryAgain}
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-analyzer">
      <div className="ai-input-section">
        <h3 className="analyzer-title">
          🤖 Análise Inteligente da Partida
        </h3>
        <p className="analyzer-description">
          Conte como foi sua partida e deixe a IA extrair automaticamente os dados para seu card!
        </p>
        
        <div className="description-input">
          <label className="input-label">
            📝 Como foi sua partida?
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="description-textarea"
            placeholder="Exemplo: 'Hoje eu joguei muito bem! Fiz 3 gols e 2 assistências. Passei a bola com precisão e ganhei vários duelos. Tomei um cartão amarelo no final, mas foi uma das minhas melhores partidas. Joguei os 90 minutos completos e controlei o meio-campo.'"
            rows="6"
            disabled={isAnalyzing}
          />
        </div>

        {playerImage && (
          <div className="image-preview">
            <p className="image-info">
              📸 Imagem será analisada junto com a descrição
            </p>
          </div>
        )}

        <button 
          className={`btn btn-ai ${isAnalyzing ? 'analyzing' : ''}`}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !description.trim()}
        >
          {isAnalyzing ? (
            <>
              <span className="spinner"></span>
              🤖 Analisando sua partida...
            </>
          ) : (
            '🚀 Analisar com IA'
          )}
        </button>

        <div className="ai-features">
          <h4>🎯 O que a IA pode fazer:</h4>
          <ul className="features-list">
            <li>⚽ Extrair número de gols e assistências</li>
            <li>📊 Estimar passes certos e duelos ganhos</li>
            <li>🟨 Identificar cartões recebidos</li>
            <li>⏱️ Calcular tempo jogado</li>
            <li>🧠 Gerar insights personalizados</li>
            <li>🎯 Calcular nota de 0 a 10</li>
            <li>📸 Analisar imagem do jogador (se fornecida)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIMatchAnalyzer;