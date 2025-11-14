// ========== SISTEMA DE PROGRESSO ==========
const DESAFIOS = [
  { id: 1, nome: 'Jogo da Memória', url: 'memoria/index.html', icone: '🧠' },
  { id: 2, nome: 'Associação', url: 'associacao/index.html', icone: '🔗' },
  { id: 3, nome: 'Quiz Relâmpago', url: 'quiz/index.html', icone: '📖' },
  { id: 4, nome: 'Caça-Palavras', url: 'caca-palavras/index.html', icone: '🔍' }
];

// ========== CARREGAR PROGRESSO ==========
function carregarProgresso() {
  const pecasConquistadas = parseInt(localStorage.getItem('pecasConquistadas') || '0');
  const desafioAtual = parseInt(localStorage.getItem('desafioAtual') || '1');
  
  return { pecasConquistadas, desafioAtual };
}

// ========== ATUALIZAR INTERFACE ==========
function atualizarInterface() {
  const { pecasConquistadas, desafioAtual } = carregarProgresso();
  
  // Atualizar ícones dos jogos
  const gameIcons = document.querySelectorAll('.game-icon');
  gameIcons.forEach((icon, index) => {
    const gameId = index + 1;
    
    if (gameId <= pecasConquistadas) {
      // Jogo completo
      icon.classList.remove('locked');
      icon.classList.add('unlocked');
    } else if (gameId === desafioAtual) {
      // Jogo atual disponível
      icon.classList.remove('locked');
      icon.classList.add('available');
    } else {
      // Jogo bloqueado
      icon.classList.add('locked');
      icon.classList.remove('unlocked', 'available');
    }
  });

  // Mostrar seção de progresso se já começou
  if (pecasConquistadas > 0) {
    const progressSection = document.getElementById('progress-section');
    progressSection.style.display = 'block';
    
    // Atualizar slots de peças
    const pieceSlots = document.querySelectorAll('.piece-slot');
    pieceSlots.forEach((slot, index) => {
      if (index < pecasConquistadas) {
        slot.classList.add('collected');
      }
    });

    // Mudar texto do botão principal
    document.querySelector('.start-button').textContent = '🔄 RECOMEÇAR DO INÍCIO';
  }
}

// ========== INICIAR AVENTURA ==========
function iniciarAventura() {
  const { pecasConquistadas } = carregarProgresso();
  
  if (pecasConquistadas > 0) {
    // Se já tem progresso, mostrar aviso visual
    const startBtn = document.querySelector('.start-button');
    startBtn.style.background = 'linear-gradient(135deg, #FF6B6B, #F44336)';
    startBtn.textContent = '⚠️ Resetando em 3...';
    
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        startBtn.textContent = `⚠️ Resetando em ${countdown}...`;
      } else {
        clearInterval(countdownInterval);
        // Resetar progresso
        localStorage.setItem('pecasConquistadas', '0');
        localStorage.setItem('desafioAtual', '1');
        
        startBtn.textContent = 'Carregando...';
        startBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
          window.location.href = DESAFIOS[0].url;
        }, 500);
      }
    }, 1000);
    
    return;
  }
  
  // Se não tem progresso, iniciar diretamente
  const btn = document.querySelector('.start-button');
  btn.textContent = 'Preparando desafios...';
  btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
  
  setTimeout(() => {
    window.location.href = DESAFIOS[0].url;
  }, 1000);
}

// ========== CONTINUAR AVENTURA ==========
function continuarAventura() {
  const { pecasConquistadas, desafioAtual } = carregarProgresso();
  
  if (pecasConquistadas >= 4) {
    // Já completou tudo, ir para mensagem bíblica
    window.location.href = 'mensagem-biblica.html';
    return;
  }
  
  // Ir para o próximo desafio
  const proximoDesafio = DESAFIOS[desafioAtual - 1];
  
  if (proximoDesafio) {
    const continueBtn = document.querySelector('.continue-button');
    continueBtn.textContent = `Carregando ${proximoDesafio.nome}...`;
    continueBtn.style.background = 'linear-gradient(135deg, #4ECDC4, #44A08D)';
    
    setTimeout(() => {
      window.location.href = proximoDesafio.url;
    }, 800);
  }
}

// ========== RESETAR PROGRESSO ==========
function resetarProgresso() {
  const resetBtn = document.querySelector('.reset-button');
  resetBtn.style.background = 'rgba(255, 107, 107, 0.3)';
  resetBtn.textContent = '⏳ Resetando...';
  
  setTimeout(() => {
    localStorage.removeItem('pecasConquistadas');
    localStorage.removeItem('desafioAtual');
    
    resetBtn.textContent = '✅ Resetado!';
    
    setTimeout(() => {
      location.reload();
    }, 800);
  }, 500);
}

// ========== ANIMAÇÃO DOS ÍCONES ==========
function animarIcones() {
  const icons = document.querySelectorAll('.game-icon');
  icons.forEach((icon, index) => {
    icon.style.opacity = '0';
    icon.style.transform = 'translateY(20px)';
    setTimeout(() => {
      icon.style.transition = 'all 0.5s ease';
      icon.style.opacity = '1';
      icon.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

// ========== INICIALIZAR ==========
window.addEventListener('load', () => {
  atualizarInterface();
  animarIcones();
});