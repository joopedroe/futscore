import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import './MatchForm.css';

const MatchForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    playerName: '',
    position: '',
    matchDate: '',
    opponent: '',
    result: '',
    goals: 0,
    assists: 0,
    successfulPasses: 0,
    totalPasses: 0,
    duelsWon: 0,
    totalDuels: 0,
    yellowCards: 0,
    redCards: 0,
    matchRating: 5,
    minutesPlayed: 90,
    description: ''
  });

  const [playerImage, setPlayerImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.playerName || !formData.opponent) {
      alert('Por favor, preencha pelo menos o nome do jogador e o adversário.');
      return;
    }
    onSubmit({ ...formData, playerImage });
  };

  const handleImageUpload = (imageData) => {
    setPlayerImage(imageData);
  };

  return (
    <form className="match-form" onSubmit={handleSubmit}>
      <h2 className="form-title">📊 Dados da Partida</h2>
      
      <ImageUpload 
        onImageUpload={handleImageUpload}
        currentImage={playerImage}
      />
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Nome do Jogador *</label>
          <input
            type="text"
            name="playerName"
            value={formData.playerName}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: João Silva"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Posição</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Selecione uma posição</option>
            <option value="Goleiro">Goleiro</option>
            <option value="Zagueiro">Zagueiro</option>
            <option value="Lateral">Lateral</option>
            <option value="Volante">Volante</option>
            <option value="Meia">Meia</option>
            <option value="Atacante">Atacante</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Data da Partida</label>
          <input
            type="date"
            name="matchDate"
            value={formData.matchDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Adversário *</label>
          <input
            type="text"
            name="opponent"
            value={formData.opponent}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: Corinthians"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Resultado</label>
          <input
            type="text"
            name="result"
            value={formData.result}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: 2-1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Minutos Jogados</label>
          <input
            type="number"
            name="minutesPlayed"
            value={formData.minutesPlayed}
            onChange={handleChange}
            className="form-input"
            min="0"
            max="120"
          />
        </div>
      </div>

      <h3 className="section-title">⚽ Estatísticas</h3>
      
      <div className="form-grid stats-grid">
        <div className="form-group">
          <label className="form-label">Gols</label>
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
          <label className="form-label">Assistências</label>
          <input
            type="number"
            name="assists"
            value={formData.assists}
            onChange={handleChange}
            className="form-input"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Passes Certos</label>
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
          <label className="form-label">Total de Passes</label>
          <input
            type="number"
            name="totalPasses"
            value={formData.totalPasses}
            onChange={handleChange}
            className="form-input"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Duelos Ganhos</label>
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
          <label className="form-label">Total de Duelos</label>
          <input
            type="number"
            name="totalDuels"
            value={formData.totalDuels}
            onChange={handleChange}
            className="form-input"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cartões Amarelos</label>
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
          <label className="form-label">Cartões Vermelhos</label>
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

      <div className="form-group">
        <label className="form-label">Avaliação Pessoal (1-10)</label>
        <input
          type="range"
          name="matchRating"
          value={formData.matchRating}
          onChange={handleChange}
          className="form-slider"
          min="1"
          max="10"
          step="0.5"
        />
        <span className="slider-value">{formData.matchRating}</span>
      </div>

      <div className="form-group">
        <label className="form-label">Resumo da Performance</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Descreva como foi sua partida, momentos importantes, etc..."
          rows="4"
        />
      </div>

      <button type="submit" className="btn btn-primary submit-btn">
        🎯 Gerar Card de Performance
      </button>
    </form>
  );
};

export default MatchForm; 