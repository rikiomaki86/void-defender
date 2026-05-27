// BASE DO JOGO
const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

// IMAGENS
const naveImg = new Image();
naveImg.src = "ship.png";

const alienImg = new Image();
alienImg.src = "alien.png";

// JOGADOR
const jogador = {
  x: 280,
  y: 340,
  largura: 40,
  altura: 40
};

// VARIÁVEIS PRINCIPAIS
let tiros = [];
let inimigos = [];
let powerups = [];
let fundoEstrelas = [];

let pontos = 0;
let vidas = 3;
let jogoAtivo = false;

let tiroDuplo = false;

// INICIAR JOGO
function iniciarJogo() {
  const botao = document.querySelector("button");
  botao.style.display = "none";

  canvas.style.display = "block";

  jogoAtivo = true;

  pontos = 0;
  vidas = 3;

  tiros = [];
  inimigos = [];
  powerups = [];

  tiroDuplo = false;

  jogador.x = 280;
  jogador.y = 340;

  criarFundoEstrelado();

  desenhar();
}

// ALIENS APARECEM A CADA 2,5 SEGUNDOS
setInterval(criarInimigo, 2500);

// POWERUP APARECE A CADA 16 SEGUNDOS
setInterval(criarPowerup, 16000);

// CRIAR FUNDO ESTRELADO
function criarFundoEstrelado() {
  fundoEstrelas = [];

  for (let i = 0; i < 80; i++) {
    fundoEstrelas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tamanho: Math.random() * 2 + 1,
      velocidade: Math.random() * 1.5 + 0.5
    });
  }
}

// DESENHAR FUNDO DO JOGO
function desenharFundo() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  fundoEstrelas.forEach(estrela => {
    estrela.y += estrela.velocidade;

    if (estrela.y > canvas.height) {
      estrela.y = 0;
      estrela.x = Math.random() * canvas.width;
    }

    ctx.fillRect(
      estrela.x,
      estrela.y,
      estrela.tamanho,
      estrela.tamanho
    );
  });
}

// CRIAR INIMIGO
function criarInimigo() {
  if (!jogoAtivo) return;

  let tipo = Math.floor(Math.random() * 3);
  let inimigo;

  // ALIEN RÁPIDO: pequeno, mais rápido, morre com 1 tiro e vale 3 pontos
  if (tipo === 0) {
    inimigo = {
      nome: "Alien Rápido",
      x: Math.random() * (canvas.width - 30),
      y: 0,
      largura: 30,
      altura: 30,
      velocidade: 3,
      vidas: 1,
      pontosValor: 3
    };
  }

  // ALIEN NORMAL: médio, velocidade média, morre com 2 tiros e vale 1 ponto
  else if (tipo === 1) {
    inimigo = {
      nome: "Alien Normal",
      x: Math.random() * (canvas.width - 40),
      y: 0,
      largura: 40,
      altura: 40,
      velocidade: 1.7,
      vidas: 2,
      pontosValor: 1
    };
  }

  // ALIEN TANK: grande, lento, morre com 3 tiros e vale 3 pontos
  else {
    inimigo = {
      nome: "Alien Tank",
      x: Math.random() * (canvas.width - 60),
      y: 0,
      largura: 60,
      altura: 60,
      velocidade: 1,
      vidas: 3,
      pontosValor: 3
    };
  }

  inimigos.push(inimigo);
}

// CRIAR POWERUP
function criarPowerup() {
  if (!jogoAtivo) return;

  powerups.push({
    x: Math.random() * (canvas.width - 40),
    y: 0,
    largura: 40,
    altura: 40,
    velocidade: 1.2,
    vidas: 3
  });
}

// CONTROLE DO JOGADOR
document.addEventListener("keydown", (e) => {
  if (!jogoAtivo) return;

  if (e.key === "ArrowLeft") {
    jogador.x -= 10;
  }

  if (e.key === "ArrowRight") {
    jogador.x += 10;
  }

  // Mantém a nave dentro do canvas
  jogador.x = Math.max(
    0,
    Math.min(canvas.width - jogador.largura, jogador.x)
  );
});

// TIRO COM CLIQUE DO MOUSE
document.addEventListener("click", () => {
  if (!jogoAtivo) return;

  // Tiro normal centralizado
  tiros.push({
    x: jogador.x + jogador.largura / 2 - 2.5,
    y: jogador.y,
    largura: 5,
    altura: 10
  });

  // Tiro extra quando o powerup está ativo
  if (tiroDuplo) {
    tiros.push({
      x: jogador.x + 10,
      y: jogador.y,
      largura: 5,
      altura: 10
    });
  }
});

// FUNÇÃO PRINCIPAL DO JOGO
function desenhar() {
  desenharFundo();

  // Desenha a nave do jogador
  ctx.drawImage(
    naveImg,
    jogador.x,
    jogador.y,
    jogador.largura,
    jogador.altura
  );

  atualizarTiros();
  atualizarInimigos();
  atualizarPowerups();

  verificarColisoes();

  mostrarHUD();
  verificarFimDeJogo();

  if (jogoAtivo) {
    requestAnimationFrame(desenhar);
  }
}

// ATUALIZAR TIROS
function atualizarTiros() {
  ctx.fillStyle = "red";

  tiros.forEach(tiro => {
    tiro.y -= 5;

    ctx.fillRect(
      tiro.x,
      tiro.y,
      tiro.largura,
      tiro.altura
    );
  });

  // Remove tiros que saíram da tela
  tiros = tiros.filter(tiro => tiro.y + tiro.altura > 0);
}

// ATUALIZAR INIMIGOS
function atualizarInimigos() {
  for (let i = inimigos.length - 1; i >= 0; i--) {
    let inimigo = inimigos[i];

    inimigo.y += inimigo.velocidade;

    ctx.drawImage(
      alienImg,
      inimigo.x,
      inimigo.y,
      inimigo.largura,
      inimigo.altura
    );

    // Se o alien passar da parte de baixo, o jogador perde vida
    if (inimigo.y > canvas.height) {
      inimigos.splice(i, 1);
      vidas--;

      if (vidas <= 0) {
        jogoAtivo = false;
      }
    }
  }
}

// ATUALIZAR POWERUPS
function atualizarPowerups() {
  for (let i = powerups.length - 1; i >= 0; i--) {
    let powerup = powerups[i];

    powerup.y += powerup.velocidade;

    // O powerup 
    ctx.drawImage(
      naveImg,
      powerup.x,
      powerup.y,
      powerup.largura,
      powerup.altura
    );

    // Remove powerup se sair da tela
    if (powerup.y > canvas.height) {
      powerups.splice(i, 1);
    }
  }
}

// VERIFICAR COLISÕES
function verificarColisoes() {
  // Tiros acertam inimigos
  for (let i = tiros.length - 1; i >= 0; i--) {
    for (let j = inimigos.length - 1; j >= 0; j--) {
      if (colisao(tiros[i], inimigos[j])) {
        tiros.splice(i, 1);

        inimigos[j].vidas--;

        if (inimigos[j].vidas <= 0) {
          pontos += inimigos[j].pontosValor;
          inimigos.splice(j, 1);
        }

        break;
      }
    }
  }

  // Tiros acertam powerups
  for (let i = tiros.length - 1; i >= 0; i--) {
    for (let j = powerups.length - 1; j >= 0; j--) {
      if (colisao(tiros[i], powerups[j])) {
        tiros.splice(i, 1);

        powerups[j].vidas--;

        if (powerups[j].vidas <= 0) {
          powerups.splice(j, 1);

          // Ao acertar a nave aliada, ganha vida e tiro duplo temporário
          vidas++;
          ativarPowerup();
        }

        break;
      }
    }
  }

  // Inimigos batem na nave
  for (let i = inimigos.length - 1; i >= 0; i--) {
    if (colisao(inimigos[i], jogador)) {
      inimigos.splice(i, 1);
      vidas--;

      if (vidas <= 0) {
        jogoAtivo = false;
      }
    }
  }
}

// ATIVAR POWERUP
function ativarPowerup() {
  tiroDuplo = true;

  setTimeout(() => {
    tiroDuplo = false;
  }, 5000);
}

// FUNÇÃO DE COLISÃO
function colisao(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.largura &&
    obj1.x + obj1.largura > obj2.x &&
    obj1.y < obj2.y + obj2.altura &&
    obj1.y + obj1.altura > obj2.y
  );
}

// MOSTRAR HUD
function mostrarHUD() {
  // Fundo escuro atrás das informações
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(8, 8, 190, tiroDuplo ? 85 : 60);

  // Borda do HUD
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 1;
  ctx.strokeRect(8, 8, 190, tiroDuplo ? 85 : 60);

  // Textos principais
  ctx.fillStyle = "cyan";
  ctx.font = "16px Arial";

  ctx.fillText(`Pontos: ${pontos}`, 18, 30);
  ctx.fillText(`Vidas: ${vidas}`, 18, 52);

  // Aviso do powerup
  if (tiroDuplo) {
    ctx.fillStyle = "yellow";
    ctx.fillText("Tiro duplo ativo!", 18, 75);
  }
}

// VERIFICAR FIM DE JOGO
function verificarFimDeJogo() {
  if (vidas <= 0) {
    mostrarMensagem("Você Perdeu!");
  }

  else if (pontos >= 50) {
    mostrarMensagem("Você Ganhou!");
  }
}

// MOSTRAR MENSAGEM FINAL
function mostrarMensagem(texto) {
  // Fundo escuro no centro
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(120, 135, 360, 130);

  // Borda neon
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 135, 360, 130);

  // Mensagem principal
  ctx.fillStyle = "white";
  ctx.font = "38px Arial";

  ctx.fillText(
    texto,
    canvas.width / 2 - 115,
    canvas.height / 2 - 15
  );

  // Pontuação final
  ctx.fillStyle = "cyan";
  ctx.font = "18px Arial";

  ctx.fillText(
    `Pontuação final: ${pontos}`,
    canvas.width / 2 - 75,
    canvas.height / 2 + 25
  );

  jogoAtivo = false;

  // Mostra o botão novamente para reiniciar
  const botao = document.querySelector("button");
  botao.style.display = "inline-block";
  botao.innerText = "Jogar Novamente";
}