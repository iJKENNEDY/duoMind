/**
 * Card Component — Renders a single flippable card with neon emoji.
 */

export function createCard(cardData, index, onClick) {
    const container = document.createElement('div');
    container.className = 'card-container';
    container.id = `card-${index}`;
    container.setAttribute('data-index', index);

    container.innerHTML = `
    <div class="card ${cardData.isFlipped || cardData.isMatched ? 'flipped' : ''} ${cardData.isMatched ? 'matched' : ''}">
      <div class="card-face card-front"></div>
      <div class="card-face card-back">
        <span class="card-emoji">${cardData.emoji}</span>
      </div>
    </div>
  `;

    container.addEventListener('click', () => {
        if (!cardData.isFlipped && !cardData.isMatched) {
            onClick(index);
        }
    });

    return container;
}

/**
 * Update a card's visual state.
 */
export function updateCard(index, cardData) {
    const container = document.getElementById(`card-${index}`);
    if (!container) return;

    const card = container.querySelector('.card');
    if (cardData.isFlipped || cardData.isMatched) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
    }

    if (cardData.isMatched) {
        card.classList.add('matched');
    }
}
