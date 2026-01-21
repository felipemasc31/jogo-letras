const areaJogo = document.getElementById('area-jogo');
const pontosComp = document.getElementById('pontos');
const vidasComp = document.getElementById('vidas');
const botaoReiniciar = document.getElementById('botao-reiniciar');
const botaoComecar = document.getElementById('botao-comecar');

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let listaLetras = [];
let pontos = 0;
let vidas = 5;
let tempoDesdeUltimaLetra = 0;
let intervaloSpawn = 1000;
let ultimoFrame = performance.now();
let jogoEncerrado = false;
let animacaoIniciada = false;
let acrescimoVelocidade = 0;

function letraAleatoria() {
    const indice = Math.floor(Math.random() * LETRAS.length); // gera uma letra aleatória
    return LETRAS[indice];
}

function criarLetra() {
    const caracter = letraAleatoria();
    const elemento = document.createElement('span');
    elemento.classList.add('letra');
    elemento.textContent = caracter;

    const posX = Math.random() * (areaJogo.clientWidth - 30); // posição aleatória
    const posY = -30;
    const velocidade = (1.5 + acrescimoVelocidade);

    acrescimoVelocidade += 0.05

    const letraObj = { elemento, caracter, posX, posY, velocidade };

    elemento.style.left = posX + 'px';
    elemento.style.top = posY + 'px';

    areaJogo.appendChild(elemento);
    listaLetras.push(letraObj);
}

// usado tanto no Recomeçar quanto no Começar
function reiniciarJogo() {
    // remove letras da tela
    listaLetras.forEach(l => areaJogo.removeChild(l.elemento));
    listaLetras = [];

    // reseta variáveis
    pontos = 0;
    vidas = 5;
    intervaloSpawn = 1000;
    tempoDesdeUltimaLetra = 0;
    ultimoFrame = performance.now();
    jogoEncerrado = false;
    acrescimoVelocidade = 0;

    pontosComp.textContent = pontos;
    vidasComp.textContent = vidas;

    // remove tela game over
    const overlay = document.getElementById('tela-gameover');
    if (overlay) {
        areaJogo.removeChild(overlay);
    }
}

function comecarJogo() {
    reiniciarJogo(); // começa sempre zerado

    // inicia o loop do jogo apenas uma vez
    if (!animacaoIniciada) {
        animacaoIniciada = true;
        requestAnimationFrame(loopJogo);
    }

    // desabilita o botão "Começar" depois do início
    botaoComecar.disabled = true;
    botaoComecar.style.opacity = '0.6';
}

// atualiza a posição das letras
function atualizarLetras(tempoDecorrido) {
    for (let i = listaLetras.length - 1; i >= 0; i--) {
        const l = listaLetras[i];

        l.posY += l.velocidade;
        l.elemento.style.top = l.posY + 'px';

        if (l.posY > areaJogo.clientHeight) {
            areaJogo.removeChild(l.elemento);
            listaLetras.splice(i, 1);

            vidas--;
            vidasComp.textContent = vidas;

            if (vidas <= 0) {
                mostrarGameOver();
            }
        }
    }
}

// cria e exibe tela Game Over
function mostrarGameOver() {
    if (jogoEncerrado) return;
    jogoEncerrado = true;

    const overlay = document.createElement('div');
    overlay.id = 'tela-gameover';

    const titulo = document.createElement('h2');
    titulo.textContent = 'GAME OVER';

    const pontuacaoFinal = document.createElement('p');
    pontuacaoFinal.textContent = `Pontuação final: ${pontos}`;

    const dica = document.createElement('p');
    dica.textContent = 'Clique em "Recomeçar" para jogar novamente.';

    overlay.appendChild(titulo);
    overlay.appendChild(pontuacaoFinal);
    overlay.appendChild(dica);

    areaJogo.appendChild(overlay);
}

// loop do jogo
function loopJogo(tempoAtual) {
    const tempoDecorrido = tempoAtual - ultimoFrame;
    ultimoFrame = tempoAtual;

    if (!jogoEncerrado) {
        tempoDesdeUltimaLetra += tempoDecorrido;
        if (tempoDesdeUltimaLetra >= intervaloSpawn) {
            criarLetra();
            tempoDesdeUltimaLetra = 0;

            if (intervaloSpawn > 400) {
                intervaloSpawn -= 10;
            }
        }

        atualizarLetras(tempoDecorrido);
    }

    // mantém o loop sempre rodando, o jogo só anda se não estiver encerrado
    requestAnimationFrame(loopJogo);
}

function aoPressionarTecla(e) {
    if (jogoEncerrado) return;

    const tecla = e.key.toUpperCase(); // a ou A funciona
    if (!LETRAS.includes(tecla)) return;

    const indice = listaLetras.findIndex(l => l.caracter === tecla);
    if (indice !== -1) {
        const l = listaLetras[indice];

        areaJogo.removeChild(l.elemento);
        listaLetras.splice(indice, 1);

        pontos += 10;
        pontosComp.textContent = pontos;
    }
}

window.addEventListener('keydown', aoPressionarTecla);
botaoReiniciar.addEventListener('click', reiniciarJogo);
botaoComecar.addEventListener('click', comecarJogo);
