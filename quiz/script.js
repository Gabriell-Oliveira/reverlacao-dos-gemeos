// ========== CONFIGURAÇÃO DO QUIZ ==========
const TEMPO_TOTAL = 30; // segundos
const RESPOSTA_CORRETA = "André";

// ========== VARIÁVEIS DO JOGO ==========
let tempoRestante = TEMPO_TOTAL;
let timerInterval = null;
let jogoAtivo = true;

const timerNumberEl = document.getElementById("timer-number");
const timerProgressEl = document.getElementById("timer-progress");
const mensagemEl = document.getElementById("mensagem");
const restartBtn = document.getElementById("restart-btn");
const alternativasEl = document.getElementById("alternatives");

// Circunferência do círculo
const CIRCUNFERENCIA = 2 * Math.PI * 45;

// ========== FUNÇÃO: INICIAR TIMER ==========
function iniciarTimer() {
  timerInterval = setInterval(() => {
    tempoRestante--;
    atualizarTimer();

    if (tempoRestante <= 0) {
      clearInterval(timerInterval);
      tempoEsgotado();
    }
  }, 1000);
}

// ========== FUNÇÃO: ATUALIZAR TIMER VISUAL ==========
function atualizarTimer() {
  timerNumberEl.textContent = tempoRestante;

  const progresso = (tempoRestante / TEMPO_TOTAL) * CIRCUNFERENCIA;
  timerProgressEl.style.strokeDashoffset = CIRCUNFERENCIA - progresso;

  if (tempoRestante <= 5) {
    timerProgressEl.classList.add("danger");
    timerProgressEl.classList.remove("warning");
  } else if (tempoRestante <= 10) {
    timerProgressEl.classList.add("warning");
    timerProgressEl.classList.remove("danger");
  }
}

// ========== FUNÇÃO: SELECIONAR ALTERNATIVA ==========
function selecionarAlternativa(botao, resposta) {
  if (!jogoAtivo) return;

  clearInterval(timerInterval);
  jogoAtivo = false;

  const todasAlternativas = document.querySelectorAll(".alternative");
  todasAlternativas.forEach(alt => alt.classList.add("disabled"));

  if (resposta === RESPOSTA_CORRETA) {
    botao.classList.add("correct");
    mostrarVitoria();
  } else {
    botao.classList.add("wrong");
    
    setTimeout(() => {
      todasAlternativas.forEach(alt => {
        if (alt.querySelector(".alt-text").textContent.includes("André")) {
          alt.classList.remove("disabled");
          alt.classList.add("correct");
        }
      });
      mostrarDerrota();
    }, 1000);
  }
}

// ========== FUNÇÃO: TEMPO ESGOTADO ==========
function tempoEsgotado() {
  jogoAtivo = false;

  timerNumberEl.style.color = "#FF6B6B";
  timerNumberEl.textContent = "0";

  const todasAlternativas = document.querySelectorAll(".alternative");
  todasAlternativas.forEach(alt => alt.classList.add("disabled"));

  setTimeout(() => {
    todasAlternativas.forEach(alt => {
      if (alt.querySelector(".alt-text").textContent.includes("André")) {
        alt.classList.remove("disabled");
        alt.classList.add("correct");
      }
    });
    
    mensagemEl.textContent = "⏰ Tempo esgotado! A resposta correta era Santo André.";
    mensagemEl.className = "message lose";
    restartBtn.classList.remove("hidden");
  }, 500);
}

// ========== FUNÇÃO: MOSTRAR VITÓRIA (SEM ALERT!) ==========
function mostrarVitoria() {
  const tempoGasto = TEMPO_TOTAL - tempoRestante;
  
  mensagemEl.textContent = `🏆 CORRETO! Você respondeu em ${tempoGasto} segundos!`;
  mensagemEl.className = "message win";

  // Salvar progresso
  localStorage.setItem('pecasConquistadas', '3');
  localStorage.setItem('desafioAtual', '4');

  // Redirecionar para página da peça 3 após 2 segundos
  setTimeout(() => {
    window.location.href = '../pecas/peca-conquistada.html?peca=3';
  }, 2000);
}

// ========== FUNÇÃO: MOSTRAR DERROTA ==========
function mostrarDerrota() {
  mensagemEl.textContent = "❌ Resposta incorreta! A resposta correta era Santo André.";
  mensagemEl.className = "message lose";
  restartBtn.classList.remove("hidden");
}

// ========== FUNÇÃO: REINICIAR JOGO ==========
function reiniciarJogo() {
  tempoRestante = TEMPO_TOTAL;
  jogoAtivo = true;

  timerNumberEl.textContent = TEMPO_TOTAL;
  timerNumberEl.style.color = "white";
  timerProgressEl.style.strokeDashoffset = 0;
  timerProgressEl.classList.remove("warning", "danger");

  mensagemEl.textContent = "";
  mensagemEl.className = "message";

  restartBtn.classList.add("hidden");

  const todasAlternativas = document.querySelectorAll(".alternative");
  todasAlternativas.forEach(alt => {
    alt.classList.remove("disabled", "correct", "wrong");
  });

  iniciarTimer();
}

// ========== INICIALIZAR JOGO ==========
window.addEventListener("DOMContentLoaded", () => {
  timerProgressEl.style.strokeDasharray = CIRCUNFERENCIA;
  timerProgressEl.style.strokeDashoffset = 0;

  setTimeout(() => {
    iniciarTimer();
  }, 1000);

  const alternativas = document.querySelectorAll(".alternative");
  alternativas.forEach((alt, index) => {
    alt.style.opacity = "0";
    alt.style.transform = "translateX(-20px)";

    setTimeout(() => {
      alt.style.transition = "all 0.5s ease";
      alt.style.opacity = "1";
      alt.style.transform = "translateX(0)";
    }, 100 * index);
  });
});