/**
 * Heritago - Animação Orbital
 * Version: 1.2.0
 * Description: Lógica da animação orbital, com links clicáveis e compatibilidade com Elementor/Gutenberg.
 */
(function ($) {
	'use strict';

	var runOrbitalAnimation = function (wrapper) {
		if (!wrapper || wrapper.dataset.initialized === 'true') {
			return;
		}
		wrapper.dataset.initialized = 'true';

		const canvas = wrapper.querySelector('.orbital-canvas');
		const centralContent = wrapper.querySelector('.central-content');
		if (!canvas || !centralContent) {
			console.error('Canvas ou conteúdo central não encontrado para a animação orbital.');
			return;
		}

		let config;
		try {
			config = JSON.parse(canvas.dataset.config);
		} catch (e) {
			console.error('Erro ao ler a configuração da animação:', e);
			return;
		}
		
		// ... (O resto do código de setupData, setupCanvas, draw, animate, etc. permanece igual) ...
		// A única alteração será nos event listeners no final da função.
        // Vou omitir o código que não muda para ser mais breve.

        // ... (todo o seu código de animação até aqui) ...

        // ---- INÍCIO DAS ALTERAÇÕES NO JAVASCRIPT ----

		canvas.addEventListener('mousemove', (e) => {
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
			const centerX = wrapper.clientWidth / 2;
			const centerY = wrapper.clientHeight / 2;
			hoveredOuterOrbitRadius = Math.sqrt(Math.pow(mouse.x - centerX, 2) + Math.pow(mouse.y - centerY, 2));
			
            let foundPlanet = false;
            let isHoveringLink = false; // Nova flag para o cursor

			for (const p of planets) {
				const dist = Math.sqrt(Math.pow(mouse.x - p.x, 2) + Math.pow(mouse.y - p.y, 2));
				if (dist < p.radius) {
					hoveredPlanetIndex = p.id;
					foundPlanet = true;
                    // Verifica se o planeta tem um link válido
                    if (p.link && p.link !== '#') {
                        isHoveringLink = true;
                    }
					break;
				}
			}

			if (!foundPlanet) {
				hoveredPlanetIndex = -1;
			}
            
            // Altera o cursor com base na flag
            canvas.style.cursor = isHoveringLink ? 'pointer' : 'default';
		});

        // NOVO EVENT LISTENER PARA O CLIQUE
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            let clickedPlanet = null;

            // Encontra o planeta que foi clicado
            for (const p of planets) {
                const dist = Math.sqrt(Math.pow(clickX - p.x, 2) + Math.pow(clickY - p.y, 2));
                if (dist < p.radius) {
                    clickedPlanet = p;
                    break;
                }
            }

            // Se um planeta com link válido foi clicado, navega
            if (clickedPlanet && clickedPlanet.link && clickedPlanet.link !== '#') {
                if (clickedPlanet.targetBlank) {
                    window.open(clickedPlanet.link, '_blank');
                } else {
                    window.location.href = clickedPlanet.link;
                }
            }
        });

		canvas.addEventListener('mouseleave', () => {
			hoveredPlanetIndex = -1;
			hoveredOuterOrbitRadius = -1;
            canvas.style.cursor = 'default'; // Restaura o cursor ao sair do canvas
		});

		// ... (O resto do código de carregamento das imagens e ResizeObserver permanece igual) ...
	};


	/**
	 * Função de inicialização que decide quando executar a animação.
	 */
	var initAnimation = function (container) {
		const observer = new IntersectionObserver((entries, obs) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					runOrbitalAnimation(entry.target);
					obs.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1 });
		observer.observe(container);
	};

	// INICIALIZAÇÃO (não muda)
	$(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
			const container = $scope[0].querySelector('.orbital-animation-container');
			if (container) {
				initAnimation(container);
			}
		});
	});

	$(function () {
		const containers = document.querySelectorAll('.orbital-animation-container:not([data-initialized="true"])');
		containers.forEach(function (container) {
			if (!container.closest('.elementor-widget')) {
				initAnimation(container);
			}
		});
	});

})(jQuery);
