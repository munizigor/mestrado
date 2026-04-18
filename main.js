// main.js - SPA Logic & Chart.js Config

let currentSlide = 0;
const totalSlides = 8; // Slides 0 to 6

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    updateSlideVisibility();
    resizeSlides(); // initial scale
    window.addEventListener('resize', resizeSlides); // dynamic scale

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevSlide();
        }
    });

    // Sidebar navigation clicks
    const navItems = document.querySelectorAll('#side-nav .nav-item');
    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const slideIndex = parseInt(item.getAttribute('data-slide'));
            if (!isNaN(slideIndex)) {
                currentSlide = slideIndex;
                updateSlideVisibility();
            }
        });
    });
});

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlideVisibility();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlideVisibility();
    }
}

function updateSlideVisibility() {
    // Hide all
    for (let i = 0; i < totalSlides; i++) {
        const el = document.getElementById('slide-' + i);
        if (el) {
            el.classList.remove('active-slide');
            el.classList.add('hidden');
        }
    }

    // Show current
    const activeEl = document.getElementById('slide-' + currentSlide);
    if (activeEl) {
        activeEl.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            activeEl.classList.add('active-slide');
            // Re-render charts when slide becomes visible
            resizeCharts();
        }, 10);
    }

    updateSidebarUI();
    updateFooterUI();
}

function updateSidebarUI() {
    const navItems = document.querySelectorAll('#side-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active', 'bg-white', 'text-[#0b6d3b]', 'rounded-l-full', 'shadow-sm');
        item.classList.add('text-slate-600');

        const itemSlide = parseInt(item.getAttribute('data-slide'));
        if (itemSlide === currentSlide) {
            item.classList.add('active', 'bg-white', 'text-[#0b6d3b]', 'rounded-l-full', 'shadow-sm');
            item.classList.remove('text-slate-600');
        }
    });
}

function updateFooterUI() {
    const indicator = document.getElementById('slide-indicator');
    if (indicator) {
        indicator.innerText = `Slide ${currentSlide.toString().padStart(2, '0')} / ${(totalSlides - 1).toString().padStart(2, '0')}`;
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Chart.js Implementations
let chartGeralInstance = null;
let chartDimensoesInstance = null;

function initCharts() {
    Chart.defaults.font.family = 'Inter';
    Chart.defaults.color = '#43474f'; // on-surface-variant

    const ctxGeral = document.getElementById('chartGeral');
    if (ctxGeral) {
        chartGeralInstance = new Chart(ctxGeral, {
            type: 'bar',
            data: {
                labels: ['N1. Não Iniciado', 'N2. Iniciado', 'N3. Emergente', 'N4. Desenvolvido', 'N5. Otimizado'],
                datasets: [{
                    data: [12, 34, 41, 9, 4],
                    backgroundColor: [
                        '#e1e3e4', // surface-container-highest
                        '#a7c8ff', // primary-fixed-dim
                        '#001e40', // primary
                        '#e1e3e4',
                        '#e1e3e4'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: (ctx) => ctx.raw + '%' }
                    }
                },
                scales: {
                    y: {
                        display: false,
                        max: 50
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                }
            }
        });
    }

    const ctxDim = document.getElementById('chartDimensoes');
    if (ctxDim) {
        const dimensoes = [
            'Dados como Ativo', 'Análise de Dados', 'Governança',
            'Gerenciamento', 'Conhecimento', 'Dados Abertos', 'Qualidade',
            'Ética', 'Interoperabilidade', 'IA'
        ];
        const medias = [3.60, 3.45, 3.25, 2.91, 2.81, 2.81, 2.81, 2.69, 1.96, 2.00];

        chartDimensoesInstance = new Chart(ctxDim, {
            type: 'bar',
            data: {
                labels: dimensoes,
                datasets: [{
                    data: medias,
                    backgroundColor: medias.map(m => {
                        if (m >= 3.4) return '#0b6d3b'; // secondary (verde)
                        if (m <= 2.1) return '#ba1a1a'; // error (vermelho)
                        return '#001e40'; // primary (azul)
                    }),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: {
                        max: 5,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                    },
                    y: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

function resizeCharts() {
    if (chartGeralInstance) chartGeralInstance.resize();
    if (chartDimensoesInstance) chartDimensoesInstance.resize();
}

function resizeSlides() {
    const container = document.getElementById('slides-container');
    if (!container) return;

    const availableWidth = container.clientWidth;
    const availableHeight = container.clientHeight;

    // Design resolution
    const baseWidth = 1200;
    const baseHeight = 720;

    const scaleWidth = availableWidth / baseWidth;
    const scaleHeight = availableHeight / baseHeight;

    // Use the minimum scale to fit both dimensions safely. 
    // Multiply by 0.93 to leave a 7% safe margin around the slide content
    const scale = Math.min(scaleWidth, scaleHeight) * 0.93;

    const scalers = document.querySelectorAll('.slide-scaler');
    scalers.forEach(scaler => {
        scaler.style.transform = `scale(${scale})`;
    });
}
