import React, { useState } from 'react';
import { analyzeMatchPerformance, isAIServiceConfigured } from '../services/aiService';
import './AIMatchAnalyzer.css';

const AIMatchAnalyzer = ({ onAnalysisComplete }) => {
  const [matchDescription, setMatchDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  // Lidar com seleção de imagem
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analisar partida com IA
  const handleAnalyze = async () => {
    if (!matchDescription.trim()) {
      setError('Por favor, descreva como foi sua partida.');
      return;
    }

    if (!isAIServiceConfigured()) {
      setError('Serviço de IA não configurado. Por favor, adicione sua chave de API no arquivo .env');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      // Converter imagem para base64 se houver
      let imageBase64 = null;
      if (selectedImage) {
        imageBase64 = imagePreview;
      }

      // Chamar serviço de IA
      const result = await analyzeMatchPerformance(imageBase64, matchDescription);

      if (result.success) {
        setAnalysisResult(result);
        
        // Se houver callback, enviar os dados analisados
        if (onAnalysisComplete) {
          onAnalysisComplete(result.data);
        }
      } else {
        setError(result.error || 'Erro ao analisar com IA. Dados básicos foram extraídos do texto.');
        setAnalysisResult(result);
      }
    } catch (err) {
      setError('Erro ao processar análise: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Limpar formulário
  const handleClear = () => {
    setMatchDescription('');
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError('');
  };

  // Usar dados analisados
  const handleUseData = () => {
    if (analysisResult && analysisResult.data && onAnalysisComplete) {
      onAnalysisComplete(analysisResult.data);
      handleClear();
    }
  };

  return (
    <div className="ai-analyzer">
      <div className="analyzer-header">
        <h2>🤖 Análise Inteligente de Partida</h2>
        <p>Envie uma imagem e descreva sua partida para análise automática</p>
      </div>

      <div className="analyzer-content">
        {/* Upload de imagem */}
        <div className="image-upload-section">
          <label htmlFor="match-image" className="image-upload-label">
            <div className="upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📸</span>
                  <span>Clique para enviar imagem da partida</span>
                  <span className="upload-hint">(opcional)</span>
                </div>
              )}
            </div>
          </label>
          <input
            id="match-image"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Descrição da partida */}
        <div className="description-section">
          <label htmlFor="match-description">Conte como foi sua partida:</label>
          <textarea
            id="match-description"
            value={matchDescription}
            onChange={(e) => setMatchDescription(e.target.value)}
            placeholder='Exemplo: "Hoje eu joguei muito, fiz 3 gols, 2 assistências, tomei um cartão amarelo, dei vários olés, joguei todo o tempo da partida contra o Flamengo..."'
            rows={6}
            disabled={isAnalyzing}
          />
        </div>

        {/* Botões de ação */}
        <div className="action-buttons">
          <button 
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !matchDescription.trim()}
          >
            {isAnalyzing ? (
              <>
                <span className="loading-spinner">⏳</span>
                Analisando...
              </>
            ) : (
              <>
                <span>🎯</span>
                Analisar Partida
              </>
            )}
          </button>

          <button 
            className="clear-button"
            onClick={handleClear}
            disabled={isAnalyzing}
          >
            <span>🗑️</span>
            Limpar
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Resultado da análise */}
        {analysisResult && (
          <div className="analysis-result">
            <h3>📊 Resultado da Análise</h3>
            
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Gols</span>
                <span className="stat-value">{analysisResult.data.goals}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Assistências</span>
                <span className="stat-value">{analysisResult.data.assists}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Nota</span>
                <span className="stat-value rating">{analysisResult.data.matchRating}/10</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Minutos</span>
                <span className="stat-value">{analysisResult.data.minutesPlayed}'</span>
              </div>
            </div>

            {analysisResult.data.aiAnalysis && (
              <div className="ai-insights">
                <h4>💭 Análise da IA:</h4>
                <p>{analysisResult.data.aiAnalysis}</p>
              </div>
            )}

            <button 
              className="use-data-button"
              onClick={handleUseData}
            >
              <span>✅</span>
              Usar estes dados no formulário
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatchAnalyzer;