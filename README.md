# ⚽ FutScore - Cards de Performance de Futebol

Um SaaS desenvolvido em React que permite criar cards de performance no estilo **SofaScore** para suas partidas de futebol, com sistema de avaliação automática de 0 a 10.

![FutScore Preview](https://via.placeholder.com/800x400/2c2c54/ffffff?text=FutScore+Preview)

## 🚀 Funcionalidades

- ✅ **Interface Intuitiva**: Formulário completo para inserir dados da partida
- ✅ **Card Profissional**: Design inspirado no SofaScore com visual moderno
- ✅ **Avaliação Automática**: Sistema inteligente que calcula nota de 0-10 baseado na performance
- ✅ **Estatísticas Completas**: Gols, assistências, passes, duelos, cartões e mais
- ✅ **Responsivo**: Funciona perfeitamente em desktop e mobile
- ✅ **Animações Suaves**: Transições e efeitos visuais profissionais

## 🏆 Sistema de Avaliação

O algoritmo considera diversos fatores para calcular a nota final:

- **Gols** (peso alto): +1.5 por gol
- **Assistências**: +1.2 por assistência  
- **Precisão de Passes**: Bônus para >80% de acerto
- **Duelos Ganhos**: Bônus para >70% de vitórias
- **Cartões**: Penalização por cartões amarelos/vermelhos
- **Avaliação Pessoal**: Influencia o resultado final

## 🎯 Como Usar

1. **Preencha os dados básicos**:
   - Nome do jogador
   - Posição
   - Data da partida
   - Adversário
   - Resultado

2. **Insira as estatísticas**:
   - Gols e assistências
   - Passes certos/totais
   - Duelos ganhos/totais
   - Cartões recebidos

3. **Avalie sua performance** (1-10)

4. **Descreva momentos importantes** da partida

5. **Clique em "Gerar Card"** e veja seu card profissional!

## 🛠 Tecnologias

- **React 18** - Framework principal
- **CSS3** - Estilização avançada com gradientes e animações
- **JavaScript ES6+** - Lógica da aplicação
- **Responsive Design** - Layout adaptativo

## 📱 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/futscore.git
cd futscore
```

2. **Instale as dependências**:
```bash
npm install
# ou
yarn install
```

3. **Execute o projeto**:
```bash
npm start
# ou 
yarn start
```

4. **Acesse no navegador**:
```
http://localhost:3000
```

## 🎨 Capturas de Tela

### Formulário de Entrada
Interface limpa e intuitiva para inserir os dados da partida.

### Card de Performance
Card profissional com design inspirado no SofaScore, mostrando:
- Nota calculada automaticamente
- Estatísticas principais destacadas
- Detalhamento completo da performance
- Resumo personalizado da partida

## 🚀 Build para Produção

```bash
npm run build
# ou
yarn build
```

Os arquivos otimizados serão gerados na pasta `build/`.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💬 Contato

Desenvolvido com ❤️ para a comunidade do futebol.

---

**⚽ FutScore** - Transformando suas performances em arte visual! 