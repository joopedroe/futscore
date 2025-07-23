import React, { useState, useRef } from 'react';
import ColorThief from 'colorthief';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // Função para converter RGB para HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Função para converter HSL para RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // Função para calcular o brilho de uma cor
  const getBrightness = (r, g, b) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Função para verificar se uma cor é vibrante
  const isVibrantColor = (r, g, b) => {
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Evita cores muito escuras, muito claras, ou com baixa saturação
    if (l < 15 || l > 85 || s < 25) return false;
    
    // Evita tons de cinza
    if (s < 15) return false;
    
    return true;
  };

  // Função para melhorar uma cor
  const enhanceColor = (r, g, b) => {
    let [h, s, l] = rgbToHsl(r, g, b);
    
    // Ajusta a saturação para ficar mais vibrante
    if (s < 40) s = Math.min(60, s + 20);
    if (s > 90) s = 85;
    
    // Ajusta o brilho para um range mais agradável
    if (l < 25) l = 30;
    if (l > 75) l = 70;
    
    // Para cores muito saturadas, reduz um pouco
    if (s > 80 && l > 60) {
      s = Math.max(60, s - 15);
    }
    
    return hslToRgb(h, s, l);
  };

  // Função para gerar cores complementares harmoniosas
  const generateHarmoniousColors = (baseColor) => {
    const [baseR, baseG, baseB] = baseColor;
    const [h, s, l] = rgbToHsl(baseR, baseG, baseB);
    
    const colors = [];
    
    // Cor base melhorada
    colors.push(enhanceColor(baseR, baseG, baseB));
    
    // Cor análoga (30 graus)
    const analogous1 = hslToRgb((h + 30) % 360, Math.max(40, s), Math.min(70, l));
    colors.push(enhanceColor(...analogous1));
    
    // Cor análoga (-30 graus)
    const analogous2 = hslToRgb((h - 30 + 360) % 360, Math.max(40, s), Math.min(70, l));
    colors.push(enhanceColor(...analogous2));
    
    // Cor complementar
    const complementary = hslToRgb((h + 180) % 360, Math.max(35, s - 10), Math.min(65, l));
    colors.push(enhanceColor(...complementary));
    
    // Cor triádica
    const triadic = hslToRgb((h + 120) % 360, Math.max(35, s - 5), Math.min(65, l));
    colors.push(enhanceColor(...triadic));
    
    // Cor split-complementar
    const splitComp = hslToRgb((h + 150) % 360, Math.max(30, s - 15), Math.min(60, l + 5));
    colors.push(enhanceColor(...splitComp));
    
    return colors;
  };

  const extractColors = async (imageElement) => {
    try {
      const colorThief = new ColorThief();
      
      // Aguarda a imagem carregar completamente
      if (!imageElement.complete) {
        await new Promise((resolve) => {
          imageElement.onload = resolve;
        });
      }

      // Extrai mais cores para ter mais opções
      const rawPalette = colorThief.getPalette(imageElement, 15);
      
      // Filtra cores vibrantes e interessantes
      const vibrantColors = rawPalette.filter(color => 
        isVibrantColor(color[0], color[1], color[2])
      );
      
      // Se não encontrou cores vibrantes suficientes, usa as melhores disponíveis
      let selectedColors = vibrantColors.length >= 3 ? vibrantColors.slice(0, 6) : rawPalette.slice(0, 6);
      
      // Pega a melhor cor como dominante
      const dominantColor = selectedColors[0] || colorThief.getColor(imageElement);
      
      // Gera uma paleta harmoniosa baseada na cor dominante
      const harmoniousColors = generateHarmoniousColors(dominantColor);
      
      // Combina cores extraídas com cores harmoniosas
      const finalPalette = [];
      
      // Adiciona as melhores cores extraídas
      selectedColors.slice(0, 3).forEach(color => {
        finalPalette.push(enhanceColor(color[0], color[1], color[2]));
      });
      
      // Completa com cores harmoniosas
      harmoniousColors.slice(0, 6 - finalPalette.length).forEach(color => {
        finalPalette.push(color);
      });
      
      // Garante que temos pelo menos 6 cores
      while (finalPalette.length < 6) {
        const lastColor = finalPalette[finalPalette.length - 1] || dominantColor;
        const [h, s, l] = rgbToHsl(lastColor[0], lastColor[1], lastColor[2]);
        const newColor = hslToRgb((h + 45) % 360, Math.max(30, s - 10), Math.min(70, l + 10));
        finalPalette.push(enhanceColor(...newColor));
      }
      
      const enhancedDominant = enhanceColor(dominantColor[0], dominantColor[1], dominantColor[2]);
      
      return {
        dominant: `rgb(${enhancedDominant.join(',')})`,
        palette: finalPalette.map(color => `rgb(${color.join(',')})`),
        dominantRgb: enhancedDominant,
        paletteRgb: finalPalette
      };
    } catch (error) {
      console.error('Erro ao extrair cores:', error);
      // Paleta padrão mais bonita caso haja erro
      return {
        dominant: 'rgb(88, 101, 242)',
        palette: [
          'rgb(88, 101, 242)',   // Azul vibrante
          'rgb(139, 69, 195)',   // Roxo elegante
          'rgb(236, 72, 153)',   // Rosa vibrante
          'rgb(34, 197, 94)',    // Verde fresco
          'rgb(249, 115, 22)',   // Laranja energético
          'rgb(6, 182, 212)'     // Ciano moderno
        ],
        dominantRgb: [88, 101, 242],
        paletteRgb: [[88, 101, 242], [139, 69, 195], [236, 72, 153], [34, 197, 94], [249, 115, 22], [6, 182, 212]]
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