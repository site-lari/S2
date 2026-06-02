export function renderUI(data) {
    // 1. Contador de Dias
    const startDate = new Date(data.config.startDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    document.getElementById("days-count").innerText = diffDays;
    
    const formattedDate = startDate.toLocaleDateString('pt-BR');
    document.getElementById("start-date-label").innerText = `Desde ${formattedDate}`;

    // 2. Renderizar Cards
    const cardsContainer = document.getElementById("cards-container");
    data.cards.forEach(card => {
        const cardHTML = `
            <div class="card" onclick="this.classList.toggle('flipped')">
                <div class="card-inner">
                    <div class="card-front">${card.front}</div>
                    <div class="card-back">${card.back}</div>
                </div>
            </div>
        `;
        cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // 3. Renderizar Timeline
    const timelineContainer = document.getElementById("timeline-container");
    data.timeline.forEach(item => {
        const itemHTML = `
            <div class="timeline-item">
                <div class="timeline-icon" style="background: ${item.color}"><i class="fas ${item.icon}"></i></div>
                <div class="timeline-content">
                    <span class="date">${item.date}</span>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            </div>
        `;
        timelineContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    // 4. Modal da Carta
    const modal = document.getElementById("letterModal");
    const openBtn = document.getElementById("open-letter-btn");
    const closeBtn = document.getElementById("close-modal-btn");
    
    document.getElementById("letter-content").innerHTML = data.letter;

    openBtn.addEventListener("click", () => modal.style.display = "flex");
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // 5. Gerar Corações Flutuantes no fundo
    createFloatingHearts();
}

function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const heartCount = 15; // Quantidade de corações na tela

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart floating-heart';
        
        // Posição aleatória na horizontal
        heart.style.left = Math.random() * 100 + 'vw';
        
        // Tamanho aleatório
        const size = Math.random() * 15 + 10;
        heart.style.fontSize = size + 'px';
        
        // Duração e atraso aleatórios para a animação
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.animationDelay = (Math.random() * 5) + 's';
        
        container.appendChild(heart);
    }
}