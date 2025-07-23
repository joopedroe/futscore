import React, { useState, useRef } from 'react';
import ColorThief from 'colorthief';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const extractColors = async (imageElement) => {
    try {
      const colorThief = new ColorThief();
      
      // Aguarda a imagem carregar completamente
      if (!imageElement.complete) {
        await new Promise((resolve) => {
          imageElement.onload = resolve;
        });
      }

      // Extrai a cor dominante e paleta
      const dominantColor = colorThief.getColor(imageElement);
      const palette = colorThief.getPalette(imageElement, 6);
      
      return {
        dominant: `rgb(${dominantColor.join(',')})`,
        palette: palette.map(color => `rgb(${color.join(',')})`),
        dominantRgb: dominantColor,
        paletteRgb: palette
      };
    } catch (error) {
      console.error('Erro ao extrair cores:', error);
      // Paleta padrão caso haja erro
      return {
        dominant: 'rgb(102, 126, 234)',
        palette: [
          'rgb(102, 126, 234)',
          'rgb(118, 75, 162)',
          'rgb(240, 147, 251)',
          'rgb(74, 172, 254)',
          'rgb(0, 242, 254)',
          'rgb(67, 233, 123)'
        ],
        dominantRgb: [102, 126, 234],
        paletteRgb: [[102, 126, 234], [118, 75, 162], [240, 147, 251], [74, 172, 254], [0, 242, 254], [67, 233, 123]]
      };
    }
  };

  const processImage = async (file) => {
    setIsProcessing(true);
    
    try {
      // Cria URL da imagem
      const imageUrl = URL.createObjectURL(file);
      
      // Cria elemento de imagem para extração de cores
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            const colors = await extractColors(img);
            
            const imageData = {
              file,
              url: imageUrl,
              colors,
              name: file.name,
              size: file.size
            };
            
            resolve(imageData);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Valida tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Valida tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB.');
      return;
    }

    try {
      const imageData = await processImage(file);
      onImageUpload(imageData);
    } catch (error) {
      alert('Erro ao processar a imagem. Tente novamente.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <div className="image-upload-label">
        <span>📸</span>
        <span>Foto do Jogador</span>
      </div>
      
      {currentImage ? (
        <div className="image-preview-container">
          <div className="image-preview">
            <img 
              ref={imageRef}
              src={currentImage.url} 
              alt="Jogador" 
              className="preview-image"
            />
            <div className="image-overlay">
              <button 
                type="button"
                className="remove-image-btn"
                onClick={removeImage}
                title="Remover imagem"
              >
                ✕
              </button>
              <button 
                type="button"
                className="change-image-btn"
                onClick={handleClick}
                title="Alterar imagem"
              >
                📷
              </button>
            </div>
          </div>
          
          {currentImage.colors && (
            <div className="color-palette">
              <div className="palette-label">Paleta Extraída:</div>
              <div className="color-swatches">
                {currentImage.colors.palette.slice(0, 5).map((color, index) => (
                  <div 
                    key={index}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={`image-dropzone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          {isProcessing ? (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <span>Processando imagem...</span>
            </div>
          ) : (
            <>
              <div className="dropzone-icon">📷</div>
              <div className="dropzone-text">
                <strong>Clique ou arraste uma foto aqui</strong>
                <span>PNG, JPG, JPEG até 10MB</span>
              </div>
            </>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;