// ========== CONFIGURAÇÃO DAS PALAVRAS ==========
const palavras = [
  { palavra: "APOSTOLO", posicao: { linha: 1, coluna: 1, direcao: "diagonal" } },
  { palavra: "PESCADOR", posicao: { linha: 0, coluna: 2, direcao: "horizontal" } },
  { palavra: "PAPA", posicao: { linha: 1, coluna: 8, direcao: "vertical" } },
  { palavra: "IMPULSIVO", posicao: { linha: 8, coluna: 0, direcao: "horizontal" } },
  { palavra: "PEDRO", posicao: { linha: 3, coluna: 2, direcao: "vertical" } }
];

const GRID_SIZE = 10;
const letrasAleatorias = "ABCDEFGHIJLMNOPQRSTUVXZ";

// ========== VARIÁVEIS DO JOGO ==========
let grid = [];
let palavrasEncontradas = [];
let celulaSelecionada = null;
let selecionandoPalavra = false;
let celulasTemporarias = [];

const gridEl = document.getElementById("grid");
const palavrasEncontradasEl = document.getElementById("palavras-encontradas");
const progressEl = document.getElementById("progress");
const mensagemEl = document.getElementById("mensagem");

// ========== FUNÇÃO: CRIAR GRADE VAZIA ==========
function criarGradeVazia() {
  grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = { letra: "", palavra: null };
    }
  }
}

// ========== FUNÇÃO: COLOCAR PALAVRAS NA GRADE ==========
function colocarPalavras() {
  palavras.forEach(item => {
    const { palavra, posicao } = item;
    const { linha, coluna, direcao } = posicao;

    for (let i = 0; i < palavra.length; i++) {
      let l = linha;
      let c = coluna;

      if (direcao === "horizontal") {
        c += i;
      } else if (direcao === "vertical") {
        l += i;
      } else if (direcao === "diagonal") {
        l += i;
        c += i;
      }

      if (l < GRID_SIZE && c < GRID_SIZE) {
        grid[l][c] = { letra: palavra[i], palavra: palavra };
      }
    }
  });
}

// ========== FUNÇÃO: PREENCHER ESPAÇOS VAZIOS ==========
function preencherEspacosVazios() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].letra === "") {
        grid[i][j].letra = letrasAleatorias[Math.floor(Math.random() * letrasAleatorias.length)];
      }
    }
  }
}

// ========== FUNÇÃO: RENDERIZAR GRADE ==========
function renderizarGrade() {
  gridEl.innerHTML = "";

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const celula = document.createElement("div");
      celula.classList.add("grid-cell");
      celula.textContent = grid[i][j].letra;
      celula.dataset.linha = i;
      celula.dataset.coluna = j;

      celula.addEventListener("mousedown", iniciarSelecao);
      celula.addEventListener("mouseenter", continuarSelecao);
      celula.addEventListener("mouseup", finalizarSelecao);

      celula.addEventListener("touchstart", iniciarSelecaoTouch);
      celula.addEventListener("touchmove", continuarSelecaoTouch);
      celula.addEventListener("touchend", finalizarSelecao);

      gridEl.appendChild(celula);
    }
  }
}

// ========== FUNÇÃO: INICIAR SELEÇÃO (MOUSE) ==========
function iniciarSelecao(e) {
  selecionandoPalavra = true;
  celulasTemporarias = [];
  
  const celula = e.target;
  celula.classList.add("selecting");
  celulasTemporarias.push(celula);
}

// ========== FUNÇÃO: CONTINUAR SELEÇÃO (MOUSE) ==========
function continuarSelecao(e) {
  if (!selecionandoPalavra) return;
  
  const celula = e.target;
  if (!celula.classList.contains("grid-cell")) return;
  if (celulasTemporarias.includes(celula)) return;
  
  celula.classList.add("selecting");
  celulasTemporarias.push(celula);
}

// ========== FUNÇÃO: INICIAR SELEÇÃO (TOUCH) ==========
function iniciarSelecaoTouch(e) {
  e.preventDefault();
  selecionandoPalavra = true;
  celulasTemporarias = [];
  
  const celula = e.target;
  celula.classList.add("selecting");
  celulasTemporarias.push(celula);
}

// ========== FUNÇÃO: CONTINUAR SELEÇÃO (TOUCH) ==========
function continuarSelecaoTouch(e) {
  e.preventDefault();
  if (!selecionandoPalavra) return;
  
  const touch = e.touches[0];
  const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
  
  if (!elemento || !elemento.classList.contains("grid-cell")) return;
  if (celulasTemporarias.includes(elemento)) return;
  
  elemento.classList.add("selecting");
  celulasTemporarias.push(elemento);
}

// ========== FUNÇÃO: FINALIZAR SELEÇÃO ==========
function finalizarSelecao() {
  if (!selecionandoPalavra) return;
  selecionandoPalavra = false;

  const palavraSelecionada = celulasTemporarias
    .map(c => c.textContent)
    .join("");

  const palavraEncontrada = palavras.find(p => p.palavra === palavraSelecionada);

  if (palavraEncontrada && !palavrasEncontradas.includes(palavraSelecionada)) {
    palavrasEncontradas.push(palavraSelecionada);
    
    celulasTemporarias.forEach(c => {
      c.classList.remove("selecting");
      c.classList.add("found");
    });

    const wordItem = document.querySelector(`[data-word="${palavraSelecionada}"]`);
    if (wordItem) {
      wordItem.classList.add("found");
    }

    atualizarStats();

    if (palavrasEncontradas.length === 4) {
      alert("Você encontrou as 4 primeiras palavras! \nAgora descubra a 😶‍🌫️PALAVRA SECRETA😶‍🌫️ para conquistar a peça final!");
      alert("DICA: A palavra secreta é a pessoa que possi todas essas características mencionadas nas palavras anteriores.");
    }

    if (palavrasEncontradas.length === palavras.length) {
      setTimeout(mostrarVitoria, 500);
    }
  } else {
    celulasTemporarias.forEach(c => {
      c.classList.remove("selecting");
    });
  }

  celulasTemporarias = [];
}

// ========== FUNÇÃO: ATUALIZAR ESTATÍSTICAS ==========
function atualizarStats() {
  palavrasEncontradasEl.textContent = `${palavrasEncontradas.length} / ${palavras.length}`;
  
  const progresso = (palavrasEncontradas.length / palavras.length) * 100;
  progressEl.style.width = `${progresso}%`;
}

// ========== FUNÇÃO: MOSTRAR VITÓRIA (SEM ALERT!) ==========
function mostrarVitoria() {
  mensagemEl.textContent = "🏆 PARABÉNS! Você encontrou todas as palavras!";
  mensagemEl.className = "message win";

  // Salvar progresso
  localStorage.setItem('pecasConquistadas', '4');
  localStorage.setItem('desafioAtual', '4');

  // Redirecionar para página da peça 4 após 2 segundos
  setTimeout(() => {
    window.location.href = '../pecas/peca-conquistada.html?peca=4';
  }, 2000);
}

// ========== FUNÇÃO: REINICIAR JOGO ==========
function reiniciarJogo() {
  palavrasEncontradas = [];
  celulasTemporarias = [];
  selecionandoPalavra = false;
  
  mensagemEl.textContent = "";
  mensagemEl.className = "message";
  
  criarGradeVazia();
  colocarPalavras();
  preencherEspacosVazios();
  renderizarGrade();
  atualizarStats();

  document.querySelectorAll(".word-item").forEach(item => {
    item.classList.remove("found");
  });
}

// ========== INICIALIZAR JOGO ==========
window.addEventListener("DOMContentLoaded", () => {
  criarGradeVazia();
  colocarPalavras();
  preencherEspacosVazios();
  renderizarGrade();
  atualizarStats();

  document.addEventListener("selectstart", (e) => {
    if (e.target.classList.contains("grid-cell")) {
      e.preventDefault();
    }
  });
});