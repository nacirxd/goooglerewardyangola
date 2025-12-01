/**
 * Google Rewards - Script de Simulação Premium
 * 
 * Este script gerencia a interatividade da aplicação de pesquisas remuneradas,
 * incluindo navegação entre páginas, sistema de perguntas, animações de saldo,
 * popups de recompensa e efeito de confete.
 */

// ==================== CONFIGURAÇÃO INICIAL ====================

// Dados das perguntas da pesquisa
const surveyData = {
    initialBalance: 10000,
    currentBalance: 1000,
    currentQuestionIndex: 0,
    questions: [
        {
            text: "Qual é a sua operadora de telefone móvel preferida em Angola?",
            options: [
                { text: "Unitel", emoji: "📱" },
                { text: "Movicel", emoji: "📲" },
                { text: "Africell Angola", emoji: "☎️" }
            ],
            reward: 15000
        },
        {
            text: "Com que frequência você faz compras online?",
            options: [
                { text: "Frequentemente", emoji: "🛒" },
                { text: "Às vezes", emoji: "🔄" },
                { text: "Raramente", emoji: "📅" }
            ],
            reward: 25000
        },
        {
            text: "Qual é o seu método de pagamento preferido?",
            options: [
                { text: "Multicaixa", emoji: "📲" },
                { text: "Cartão de débito/crédito", emoji: "💳" },
                { text: "Dinheiro", emoji: "💵" }
            ],
            reward: 17560
        },
        {
            text: "Como você classifica os serviços bancários em Angola?",
            options: [
                { text: "Excelentes", emoji: "🌟" },
                { text: "Razoáveis", emoji: "⭐" },
                { text: "Precisam melhorar", emoji: "⚠️" }
            ],
            reward: 13000
        },
        {
            text: "Qual dessas marcas você confia mais?",
            options: [
                { text: "Marcas locais angolanas", emoji: "🇦🇴" },
                { text: "Marcas internacionais conhecidas", emoji: "🌍" },
                { text: "Depende do produto", emoji: "🤔" }
            ],
            reward: 20000
        }
    ]
};

// ==================== SELETORES DOM ====================

// Páginas
const welcomePage = document.getElementById('welcomePage');
const surveyPage = document.getElementById('surveyPage');
const completionPage = document.getElementById('completionPage');

// Elementos de balanço e progresso
const balanceElement = document.getElementById('balance');
const balanceIndicator = document.getElementById('balanceIndicator');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const questionValue = document.getElementById('questionValue');
const finalBalance = document.getElementById('finalBalance');

// Elementos da pesquisa
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');

// Popup de recompensa
const rewardPopup = document.getElementById('rewardPopup');
const rewardAmount = document.getElementById('rewardAmount');
const overlay = document.getElementById('overlay');

// Botões
const startButton = document.getElementById('startButton');
const withdrawButton = document.getElementById('withdrawButton');

// Ano atual para copyright
const currentYearElement = document.getElementById('currentYear');

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar dados do localStorage
    initializeData();
    
    // Configurar ano atual no rodapé
    currentYearElement.textContent = new Date().getFullYear();
    
    // Adicionar event listeners
    startButton.addEventListener('click', startSurvey);
    withdrawButton.addEventListener('click', withdrawMoney);
});

/**
 * Inicializa os dados da aplicação com valores padrão
 */
function initializeData() {
    // Definir saldo inicial
    surveyData.currentBalance = surveyData.initialBalance;
    
    // Atualizar interface com o saldo atual
    updateBalanceDisplay(surveyData.currentBalance, false);
}

// ==================== NAVEGAÇÃO ENTRE PÁGINAS ====================

/**
 * Inicia a pesquisa, escondendo a página de boas-vindas e mostrando a primeira pergunta
 */
function startSurvey() {
    // Resetar índice da pergunta atual se estiver reiniciando
    surveyData.currentQuestionIndex = 0;
    
    // Alternar visualização de páginas com animação
    fadeOut(welcomePage, () => {
        fadeIn(surveyPage);
        showCurrentQuestion();
    });
}

/**
 * Mostra a página final com o saldo total
 */
function showCompletionPage() {
    fadeOut(surveyPage, () => {
        // Atualizar exibição do saldo final
        finalBalance.textContent = surveyData.currentBalance;
        
        // Mostrar página de conclusão
        fadeIn(completionPage);
    });
}

/**
 * Função para fazer fade out de um elemento
 */
function fadeOut(element, callback) {
    element.classList.add('hidden');
    if (callback) callback();
}

/**
 * Função para fazer fade in de um elemento
 */
function fadeIn(element) {
    element.classList.remove('hidden');
    element.classList.add('fade-in');
    
    // Remover a classe de animação após o término
    setTimeout(() => {
        element.classList.remove('fade-in');
    }, 500);
}

// ==================== SISTEMA DE PERGUNTAS ====================

/**
 * Exibe a pergunta atual e suas opções
 */
function showCurrentQuestion() {
    const currentQuestion = surveyData.questions[surveyData.currentQuestionIndex];
    
    // Atualizar texto da pergunta
    questionText.textContent = currentQuestion.text;
    
    // Atualizar valor da recompensa
    questionValue.textContent = `Vale: ${currentQuestion.reward} Kz`;
    
    // Atualizar progresso
    const progress = ((surveyData.currentQuestionIndex + 1) / surveyData.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Pergunta ${surveyData.currentQuestionIndex + 1} de ${surveyData.questions.length}`;
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Criar e adicionar novas opções
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'survey-option';
        optionElement.innerHTML = `
            <span class="survey-option-emoji">${option.emoji}</span>
            <span class="survey-option-text">${option.text}</span>
        `;
        
        // Adicionar event listener para seleção de opção
        optionElement.addEventListener('click', () => selectOption(index));
        
        // Adicionar ao container
        optionsContainer.appendChild(optionElement);
    });
}

/**
 * Processa a seleção de uma opção de resposta
 */
function selectOption(optionIndex) {
    const currentQuestion = surveyData.questions[surveyData.currentQuestionIndex];
    const reward = currentQuestion.reward;
    
    // Adicionar recompensa ao saldo
    addToBalance(reward);
    
    // Mostrar popup de recompensa
    showRewardPopup(reward);
    
    // Após um delay, passar para a próxima pergunta ou finalizar
    setTimeout(() => {
        hideRewardPopup();
        
        // Incrementar índice da pergunta
        surveyData.currentQuestionIndex++;
        
        // Verificar se ainda há perguntas
        if (surveyData.currentQuestionIndex < surveyData.questions.length) {
            showCurrentQuestion();
        } else {
            showCompletionPage();
        }
    }, 2000);
}

// ==================== GERENCIAMENTO DE SALDO ====================

/**
 * Adiciona um valor ao saldo atual e atualiza a exibição
 */
function addToBalance(amount) {
    // Atualizar saldo no objeto de dados
    surveyData.currentBalance += amount;
    
    // Atualizar interface
    updateBalanceDisplay(surveyData.currentBalance, true);
}

/**
 * Atualiza a exibição do saldo com animação
 */
function updateBalanceDisplay(newAmount, animate = false) {
    if (animate) {
        // Animação de contagem
        const startValue = parseInt(balanceElement.textContent);
        const endValue = newAmount;
        const duration = 1000; // ms
        const frameRate = 30; // frames por segundo
        const increment = Math.ceil((endValue - startValue) / (duration / (1000 / frameRate)));
        
        let currentValue = startValue;
        const counter = setInterval(() => {
            currentValue += increment;
            
            // Verificar se chegou ou ultrapassou o valor final
            if ((increment > 0 && currentValue >= endValue) || 
                (increment < 0 && currentValue <= endValue)) {
                clearInterval(counter);
                currentValue = endValue;
            }
            
            // Atualizar o texto
            balanceElement.textContent = currentValue;
        }, 1000 / frameRate);
        
        // Mostrar indicador de atualização
        balanceIndicator.classList.add('active');
        
        // Esconder indicador após um tempo
        setTimeout(() => {
            balanceIndicator.classList.remove('active');
        }, 2000);
    } else {
        // Atualização simples sem animação
        balanceElement.textContent = newAmount;
    }
}

// ==================== POPUP DE RECOMPENSA ====================

/**
 * Exibe o popup de recompensa com o valor ganho
 */
function showRewardPopup(amount) {
    // Atualizar texto do valor
    rewardAmount.textContent = `+${amount} Kz`;
    
    // Mostrar overlay e popup
    overlay.classList.add('active');
    rewardPopup.classList.add('active');
    
    // Criar efeito de confete
    createConfetti();
}

/**
 * Esconde o popup de recompensa
 */
function hideRewardPopup() {
    overlay.classList.remove('active');
    rewardPopup.classList.remove('active');
}

// ==================== EFEITO DE CONFETE ====================

/**
 * Cria um efeito de confete no popup de recompensa
 */
function createConfetti() {
    const confettiContainer = document.getElementById('confettiCanvas');
    confettiContainer.innerHTML = '';
    
    // Cores para o confete
    const colors = ['#38B764', '#4BDE7C', '#4D7CFE', '#6D93FF', '#FBBC04'];
    
    // Criar 50 partículas de confete
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 4 + 2}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `-10px`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.borderRadius = '2px';
        
        // Adicionar à container
        confettiContainer.appendChild(confetti);
        
        // Animar queda
        const duration = Math.random() * 2000 + 1000;
        const delay = Math.random() * 500;
        
        confetti.animate([
            { transform: `translate(0, 0) rotate(${Math.random() * 360}deg)`, opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 + 200}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: duration,
            delay: delay,
            fill: 'forwards',
            easing: 'cubic-bezier(0.21, 0.98, 0.6, 0.99)'
        });
    }
}
