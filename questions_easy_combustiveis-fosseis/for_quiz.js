document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.cards');
    const nextButton = document.getElementById('next');
    const explain = document.getElementById('explica');
    const sideBottom = document.getElementsByClassName('check');
    const bolaContainer = document.getElementById('bolaContainer');
    const audioCorrect = document.getElementById('audioCorrect');
    const audioIncorrect = document.getElementById('audioIncorrect');

    let selectedCard = null;
    let questionChecked = false;
    let nextCount = 0; // <<< APLICADO DA LÓGICA DO PRIMEIRO CÓDIGO

    const getFileNameFromUrl = () => {
        const url = window.location.pathname;
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const resetCounters = () => {
        localStorage.removeItem('correctCount');
        localStorage.removeItem('totalAnswered');
        localStorage.removeItem('currentQuestionNumber');
        document.getElementById('correctCount').textContent = 0;
        document.getElementById('totalAnswered').textContent = 0;
    };

    if (getFileNameFromUrl() === 'combustiveis-fosseis_quiz_1_easy.html') {
        resetCounters();
    }

    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        if (getFileNameFromUrl() === 'combustiveis-fosseis_quiz_1_easy.html') {
            resetCounters();
        }
        window.location.href = 'combustiveis-fosseis_quiz_1_easy.html';
    }

    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    let totalAnswered = parseInt(localStorage.getItem('totalAnswered')) || 0;
    let questionNumber = parseInt(localStorage.getItem('currentQuestionNumber')) || 1;

    const currentPageQuestionNumber = parseInt(document.body.getAttribute('data-question-number')) || 1;

    if (questionNumber < currentPageQuestionNumber) {
        questionNumber = currentPageQuestionNumber;
        localStorage.setItem('currentQuestionNumber', questionNumber);
    }

    const correctCountElement = document.getElementById('correctCount');
    const totalAnsweredElement = document.getElementById('totalAnswered');
    correctCountElement.textContent = correctCount;
    totalAnsweredElement.textContent = totalAnswered;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (questionChecked) return;

            if (selectedCard) selectedCard.classList.remove('selected');

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

        // ------------------- 1º CLICK = CONFERIR RESPOSTA -------------------
        if (nextCount === 0) {
            nextCount = 1;

            if (!questionChecked) {
                questionChecked = true;

                totalAnswered++;
                totalAnsweredElement.textContent = totalAnswered;
                localStorage.setItem('totalAnswered', totalAnswered);

                explain.style.display = "block";

                const isCorrect = selectedCard.getAttribute('data-answer') === 'correct';

                if (isCorrect) {
                    selectedCard.classList.add('correct');
                    correctCount++;
                    correctCountElement.textContent = correctCount;
                    localStorage.setItem('correctCount', correctCount);

                    nextButton.style.backgroundColor = 'rgb(51, 167, 51)';
                    nextButton.style.borderBottom = '5px solid rgb(0, 51, 0)';

                    bolaContainer.innerHTML = `
                        <div class="bola">
                            <div class="checked">✓</div>
                        </div>
                    `;
                    audioCorrect.play();

                } else {
                    selectedCard.classList.add('incorrect');
                    nextButton.style.backgroundColor = 'red';
                    nextButton.style.borderBottom = '5px solid rgb(164, 3, 3)';

                    bolaContainer.innerHTML = `
                        <div class="erro">
                            <div class="error-mark">✗</div>
                        </div>
                    `;
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

                Array.from(sideBottom).forEach(check => {
                    check.classList.add(isCorrect ? 'correct' : 'incorrect');
                });

                nextButton.textContent = "PRÓXIMO";
            }

            // 🔒 BLOQUEIO TEMPORÁRIO (para evitar clique duplo)
            nextButton.disabled = true;
            nextButton.blur();
            setTimeout(() => {
                nextButton.disabled = false;
            }, 350);

            return;
        }

        // ------------------- 2º CLICK = AVANÇAR -------------------
        if (nextCount === 1) {
            nextCount = 2;

            if (totalAnswered == 15) {
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
                questionNumber++;
                localStorage.setItem('currentQuestionNumber', questionNumber);

                history.pushState({ questionNumber }, '', `cf_q_${questionNumber}_f.html`);

                window.location.href = `cf_q_${questionNumber}_f.html`;
            }

            return;
        }

        // Ignora qualquer clique extra
        return;
    });

    window.addEventListener('popstate', () => {
        const userConfirmed = window.confirm("Você tem certeza de que deseja sair do jogo? Seu progresso pode ser perdido.");
        if (!userConfirmed) {
            history.pushState(null, '', window.location.href);
        } else {
            window.location.href = '../topico.html';
        }
    });
});
