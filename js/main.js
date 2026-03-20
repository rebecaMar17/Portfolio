// ==========================================
// 1. CONFIGURACIÓN Y ANIMACIÓN INICIAL
// ==========================================
const githubUsername = 'rebecaMar17';

// Animación de entrada de la página
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.7 } });
    
    tl.from(".logo", { y: -30, opacity: 0, ease: "bounce" })
      .from(".tab-btn", { opacity: 0, stagger: 0.1, y: -20 }, "-=0.5")
      .from(".image-container", { opacity: 0, x: -50 }, "-=0.3") // Animación de la foto
      .from(".text-column", { opacity: 0, x: 50 }, "-=0.5")      // Animación del texto hero
      .from(".refined-card", { opacity: 0, y: 30, stagger: 0.2 }, "-=0.3"); // Animación de las tarjetas
});

// ==========================================
// 2. EFECTO MÁQUINA DE ESCRIBIR
// ==========================================
const texto = "Hola, soy Rebeca";
const elementoTexto = document.getElementById("typewriter");
let indexLetra = 0;

function escribirTexto() {
    if (indexLetra < texto.length) {
        elementoTexto.innerHTML += texto.charAt(indexLetra);
        indexLetra++;
        const tiempoAleatorio = Math.floor(Math.random() * 80) + 40; // Un poco más rápido
        setTimeout(escribirTexto, tiempoAleatorio);
    }
}
setTimeout(escribirTexto, 800);

// ==========================================
// 3. EFECTO DE LINTERNA CON EL RATÓN
// ==========================================
const glow = document.getElementById('mouse-glow');
document.body.onpointermove = event => {
    const { clientX, clientY } = event;
    glow.style.setProperty('--mouse-x', `${clientX}px`);
    glow.style.setProperty('--mouse-y', `${clientY}px`);
};

// ==========================================
// 4. CONSUMO DE API GITHUB
// ==========================================
async function fetchGitHubRepos() {
    const container = document.getElementById('github-repos');
    
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
        if (!response.ok) throw new Error('Error al conectar con la API de GitHub');
        
        const repos = await response.json();
        container.innerHTML = ''; 
        
        if (repos.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--card-bg); border-radius: 8px; border: 1px dashed var(--border-color);">
                    <h3 style="color: var(--accent-color); margin-bottom: 1rem;">Repositorios en construcción 🚧</h3>
                    <p>He reiniciado mi entorno. Pronto subiré mi código más limpio y eficiente aquí.</p>
                </div>`;
            return;
        }
        
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            const desc = repo.description || 'Código tan limpio que se explica solo.';
            
            card.innerHTML = `
                <a href="${repo.html_url}" target="_blank">
                    <h3>📁 ${repo.name}</h3>
                    <p>${desc}</p>
                    <div class="stats">
                        <i class="fa-solid fa-star"></i> ${repo.stargazers_count} | <i class="fa-solid fa-code-fork"></i> ${repo.forks_count} | <i class="fa-solid fa-terminal"></i> ${repo.language || 'N/A'}
                    </div>
                </a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p style="color: #ff7b72;">¡Error crítico! ${error.message}</p>`;
        console.error(error);
    }
}

fetchGitHubRepos();

// ==========================================
// 5. SISTEMA DE PESTAÑAS (ROUTER SPA)
// ==========================================
function openTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    const clickedBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (clickedBtn) clickedBtn.classList.add('active');

    if (tabId === 'proyectos') {
        gsap.fromTo(".repo-card", 
            { y: 30, opacity: 0 }, 
            { duration: 0.6, y: 0, opacity: 1, stagger: 0.1, ease: "power2.out" }
        );
    }
    
    if (tabId === 'cv') {
        gsap.fromTo(".timeline-item", 
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, stagger: 0.2, ease: "power2.out" }
        );
    }
}