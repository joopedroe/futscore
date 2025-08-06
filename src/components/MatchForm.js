import React, { useState } from 'react';
import './MatchForm.css';
import ImageUpload from './ImageUpload';

function MatchForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    playerName: '',
    matchDate: '',
    competition: '',
    homeTeam: '',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    position: 'MC',
    goals: 0,
    assists: 0,
    successfulPasses: 0,
    totalPasses: 0,
    yellowCards: 0,
    redCards: 0,
    duelsWon: 0,
    totalDuels: 0,
    foulsCommitted: 0,
    foulsSuffered: 0,
    matchRating: 5,
    highlights: '',
    profileImage: null
  });

  const positions = [
    { value: 'GK', label: 'Goleiro' },
    { value: 'DC', label: 'Zagueiro' },
    { value: 'LB', label: 'Lateral Esquerdo' },
    { value: 'RB', label: 'Lateral Direito' },
    { value: 'DMC', label: 'Volante' },
    { value: 'MC', label: 'Meio-campo' },
    { value: 'AMC', label: 'Meia Atacante' },
    { value: 'LW', label: 'Ponta Esquerda' },
    { value: 'RW', label: 'Ponta Direita' },
    { value: 'ST', label: 'Atacante' }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageUpload = (imageData) => {
    setFormData(prev => ({
      ...prev,
      profileImage: imageData
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="match-form-container">
      <h2 className="match-form-title">Registrar Nova Partida</h2>
      
      <form className="match-form" onSubmit={handleSubmit}>
        {/* Seção de Informações Pessoais */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">👤</span>
            Informações do Jogador
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">⚽</span>
                Nome do Jogador
              </label>
              <input
                type="text"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                className="form-input"
                placeholder="Seu nome"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🏃</span>
                Posição
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-input form-select"
                required
              >
                {positions.map(pos => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">📸</span>
              Foto do Perfil
            </label>
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
        </div>

        {/* Seção de Informações da Partida */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🏆</span>
            Informações da Partida
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">📅</span>
                Data da Partida
              </label>
              <input
                type="date"
                name="matchDate"
                value={formData.matchDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🏅</span>
                Competição
              </label>
              <input
                type="text"
                name="competition"
                value={formData.competition}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: Campeonato, Copa, Amistoso"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🏠</span>
                Time da Casa
              </label>
              <input
                type="text"
                name="homeTeam"
                value={formData.homeTeam}
                onChange={handleChange}
                className="form-input"
                placeholder="Nome do time da casa"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">✈️</span>
                Time Visitante
              </label>
              <input
                type="text"
                name="awayTeam"
                value={formData.awayTeam}
                onChange={handleChange}
                className="form-input"
                placeholder="Nome do time visitante"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">⚽</span>
                Gols Time Casa
              </label>
              <input
                type="number"
                name="homeScore"
                value={formData.homeScore}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">⚽</span>
                Gols Time Visitante
              </label>
              <input
                type="number"
                name="awayScore"
                value={formData.awayScore}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Seção de Estatísticas */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📊</span>
            Estatísticas da Partida
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">⚽</span>
                Gols
              </label>
              <input
                type="number"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🎯</span>
                Assistências
              </label>
              <input
                type="number"
                name="assists"
                value={formData.assists}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">✅</span>
                Passes Certos
              </label>
              <input
                type="number"
                name="successfulPasses"
                value={formData.successfulPasses}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">📈</span>
                Total de Passes
              </label>
              <input
                type="number"
                name="totalPasses"
                value={formData.totalPasses}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">💪</span>
                Duelos Ganhos
              </label>
              <input
                type="number"
                name="duelsWon"
                value={formData.duelsWon}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🤝</span>
                Total de Duelos
              </label>
              <input
                type="number"
                name="totalDuels"
                value={formData.totalDuels}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🟨</span>
                Cartões Amarelos
              </label>
              <input
                type="number"
                name="yellowCards"
                value={formData.yellowCards}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="2"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🟥</span>
                Cartões Vermelhos
              </label>
              <input
                type="number"
                name="redCards"
                value={formData.redCards}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">⚠️</span>
                Faltas Cometidas
              </label>
              <input
                type="number"
                name="foulsCommitted"
                value={formData.foulsCommitted}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">🛡️</span>
                Faltas Sofridas
              </label>
              <input
                type="number"
                name="foulsSuffered"
                value={formData.foulsSuffered}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Seção de Avaliação */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">⭐</span>
            Avaliação e Destaques
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">📊</span>
              Nota da Partida: {formData.matchRating}
            </label>
            <input
              type="range"
              name="matchRating"
              value={formData.matchRating}
              onChange={handleChange}
              className="form-input"
              min="0"
              max="10"
              step="0.5"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">✨</span>
              Destaques da Partida
            </label>
            <textarea
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Descreva os momentos mais importantes da sua atuação..."
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          <span className="submit-button-text">
            <span>🏆</span>
            Gerar Card de Performance
          </span>
        </button>
      </form>
    </div>
  );
}

export default MatchForm; 