document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.cards');
    const nextButton = document.getElementById('next');
    const explain = document.getElementById('explica');
    const sideBottom = document.getElementsByClassName('check');
    const bolaContainer = document.getElementById('bolaContainer');
    const audioCorrect = document.getElementById('audioCorrect');
    const audioIncorrect = document.getElementById('audioIncorrect');

    let selectedCard = null;
    let questionChecked = false; // Estado para verificar se a pergunta já foi conferida
    let nextButtonClicked = false;
    // Função para obter o nome do arquivo da URL atual
    const getFileNameFromUrl = () => {
        const url = window.location.pathname;
        return url.substring(url.lastIndexOf('/') + 1);
    };

    // Função para zerar os contadores
    const resetCounters = () => {
        localStorage.removeItem('correctCount');
        localStorage.removeItem('totalAnswered');
        localStorage.removeItem('currentQuestionNumber');
        document.getElementById('correctCount').textContent = 0;
        document.getElementById('totalAnswered').textContent = 0;
    };

    // Verifica se o nome do arquivo é 'rs_quiz_1_easy.html'
    if (getFileNameFromUrl() === 'chuva-acida_quiz_1_easy.html') {
        // Zera os contadores se o nome do arquivo corresponde
        resetCounters();
    }

    // Verifica se a página foi recarregada
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        // Se a página foi recarregada, zera os contadores e redireciona para a primeira página
        if (getFileNameFromUrl() === 'chuva-acida_quiz_1_easy.html') {
            resetCounters();
        }
        window.location.href = 'chuva-acida_quiz_1_easy.html';
    }

    // Recupera os valores de acertos e perguntas respondidas do localStorage ou inicia com 0
    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    let totalAnswered = parseInt(localStorage.getItem('totalAnswered')) || 0;
    
    // Recupera o número da questão atual ou inicia com 1
    let questionNumber = parseInt(localStorage.getItem('currentQuestionNumber')) || 1;

    // Obtém o número da questão dessa página
    const currentPageQuestionNumber = parseInt(document.body.getAttribute('data-question-number')) || 1;

    // Se o número da questão armazenado for menor que o número da questão atual, atualize o localStorage
    if (questionNumber < currentPageQuestionNumber) {
        questionNumber = currentPageQuestionNumber;
        localStorage.setItem('currentQuestionNumber', questionNumber);
    }

    // Atualiza os elementos de contagem com os valores recuperados
    const correctCountElement = document.getElementById('correctCount');
    const totalAnsweredElement = document.getElementById('totalAnswered');
    correctCountElement.textContent = correctCount;
    totalAnsweredElement.textContent = totalAnswered;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (questionChecked) return; // Não permite alterar a seleção após a conferência

            if (selectedCard) {
                selectedCard.classList.remove('selected');
            }
            card.classList.add('selected');
            selectedCard = card;
            nextButton.disabled = false;
            nextButton.classList.add('enabled');
            nextButton.style.backgroundColor = 'rgb(51, 167, 51)';
            nextButton.style.borderBottom = '5px solid rgb(0, 51, 0)';
            nextButton.style.cursor = 'pointer';
        });
    });

    nextButton.addEventListener('click', () => {
        if (!selectedCard) return;

        if (!questionChecked) {
            questionChecked = true; // Marca a pergunta como conferida
            nextButtonClicked = true; // Marca que o botão foi clicado
            

            // Incrementa o contador de questões respondidas
            totalAnswered++;
            totalAnsweredElement.textContent = totalAnswered;
            localStorage.setItem('totalAnswered', totalAnswered);

            explain.style.display = "block";

            const isCorrect = selectedCard.getAttribute('data-answer') === 'correct';
            if (isCorrect) {
                selectedCard.classList.add('correct');
                // Incrementa o contador de acertos
                correctCount++;
                correctCountElement.textContent = correctCount;
                localStorage.setItem('correctCount', correctCount);

                nextButton.style.backgroundColor = 'rgb(51, 167, 51)';
                nextButton.style.borderBottom = '5px solid rgb(0, 51, 0)';

                // Adiciona a bola ao container
                bolaContainer.innerHTML = `
                    <div class="bola">
                        <div class="checked">✓</div>
                    </div>
                `;
                // Toca o áudio correto
                audioCorrect.play();
            } else {
                selectedCard.classList.add('incorrect');
                nextButton.style.backgroundColor = 'red';
                nextButton.style.borderBottom = '5px solid rgb(164, 3, 3)';

                // Adiciona o X ao container
                bolaContainer.innerHTML = `
                    <div class="erro">
                        <div class="error-mark">✗</div>
                    </div>
                `;
                // Toca o áudio incorreto
                audioIncorrect.play();
            }

            cards.forEach(card => {
                if (card !== selectedCard) {
                    if (card.getAttribute('data-answer') === 'correct') {
                        card.classList.add('correct');
                    } else {
                        card.classList.add('incorrect');
                    }
                }
                card.style.pointerEvents = 'none';
            });

            // Adiciona a classe 'correct' ou 'incorrect' ao elemento .check
            Array.from(sideBottom).forEach(check => {
                check.classList.add(isCorrect ? 'correct' : 'incorrect');
            });

            nextButton.textContent = 'PRÓXIMO';
        } else {
            if (totalAnswered == 15) {
                // Todas as perguntas foram respondidas, redireciona para a página apropriada
                if (correctCount <= 5) {
                    window.location.href = 'tentativa.html';
                } else if (correctCount <= 10) {
                    window.location.href = 'bronze.html';
                } else if (correctCount <= 14) {
                    window.location.href = 'prata.html';
                } else if (correctCount == 15) {
                    window.location.href = 'ouro.html';
                }
            } else {
                // Incrementa o número da questão
                questionNumber++;
                localStorage.setItem('currentQuestionNumber', questionNumber);

                // Adiciona o número da questão no histórico
                history.pushState({ questionNumber }, '', `ch_q_${questionNumber}_f.html`);

                // Redireciona para a próxima página
                window.location.href = `ch_q_${questionNumber}_f.html`;
            }
        }
    });

    // Manipulador para eventos de navegação
    window.addEventListener('popstate', (event) => {
        // Pergunta de confirmação ao voltar para uma página anterior
        const userConfirmed = window.confirm("Você tem certeza de que deseja sair do jogo? Seu progresso pode ser perdido.");
        if (!userConfirmed) {
            // Se o usuário não confirmar, previne a navegação
            history.pushState(null, '', window.location.href);
        } else {
            // Se o usuário confirmar, permite a navegação
            window.location.href = '../topico.html'; // ou outra URL de destino
        }
    });
});
