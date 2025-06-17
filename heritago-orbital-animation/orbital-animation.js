/**
 * Heritago - Animação Orbital
 * Version: 1.3.1
 * Description: Lógica da animação orbital, sem links clicáveis.
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
		
		const ctx = canvas.getContext('2d');
		let planets = [];
		let meteors = [];
		let animationFrameId;
		let mouse = { x: null, y: null };
		let hoveredPlanetIndex = -1;

		function setupData() {
			planets = config.planets.map((p_config, index) => ({
				...p_config,
				id: index,
				angle: (p_config.startAngle * Math.PI) / 180,
				targetAngle: (p_config.startAngle * Math.PI) / 180,
				speed: config.baseSpeed,
				currentRadius: p_config.radius,
				targetRadius: p_config.radius,
				labelAlpha: 0,
				orbitRadius: 0,
				img: new Image()
			}));

			const numberOfOuterOrbits = config.outerOrbitCount || 0;
			if (config.meteors && config.meteors.count > 0 && numberOfOuterOrbits > 0) {
				for (let i = 0; i < config.meteors.count; i++) {
					meteors.push({
						angle: Math.random() * 2 * Math.PI,
						speed: config.baseSpeed * (Math.random() * 2 + 0.5),
						radius: Math.random() * 2.5 + 1.5,
						color: config.meteors.colors[Math.floor(Math.random() * config.meteors.colors.length)],
						orbitIndex: Math.floor(Math.random() * numberOfOuterOrbits)
					});
				}
			}
		}

		function setupCanvas() {
			const dpr = window.devicePixelRatio || 1;
			const rect = wrapper.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.scale(dpr, dpr);
			const mainOrbitRadius = (centralContent.clientWidth / 2) + 90;
			planets.forEach(p => p.orbitRadius = mainOrbitRadius);
			const outerOrbitSpacing = 70;
			meteors.forEach(m => { m.orbitRadius = mainOrbitRadius + outerOrbitSpacing * (m.orbitIndex + 1); });
			canvas.style.opacity = '1';
		}

		function draw() {
			if (!wrapper.isConnected) {
				cancelAnimationFrame(animationFrameId);
				return;
			}
			const currentWidth = wrapper.clientWidth;
			const currentHeight = wrapper.clientHeight;
			ctx.clearRect(0, 0, currentWidth, currentHeight);
			const centerX = currentWidth / 2;
			const centerY = currentHeight / 2;
			const speedModifier = hoveredPlanetIndex !== -1 ? 0.3 : 1;
			ctx.strokeStyle = config.orbitColor;
			ctx.lineWidth = 1;
			ctx.setLineDash([2, 8]);
			if (planets.length > 0 && planets[0].orbitRadius > 0) {
				ctx.beginPath();
				ctx.arc(centerX, centerY, planets[0].orbitRadius, 0, 2 * Math.PI);
				ctx.stroke();
			}
			const drawnOrbits = new Set();
			meteors.forEach(m => {
				if (m.orbitRadius > 0 && !drawnOrbits.has(m.orbitRadius)) {
					ctx.beginPath();
					ctx.arc(centerX, centerY, m.orbitRadius, 0, 2 * Math.PI);
					ctx.stroke();
					drawnOrbits.add(m.orbitRadius);
				}
			});
			ctx.setLineDash([]);
			meteors.forEach(m => {
				m.angle += m.speed * speedModifier;
				let x = centerX + m.orbitRadius * Math.cos(m.angle);
				let y = centerY + m.orbitRadius * Math.sin(m.angle);
				ctx.save();
				ctx.fillStyle = m.color;
                ctx.globalAlpha = 0.8;
				ctx.beginPath();
				ctx.arc(x, y, m.radius, 0, 2 * Math.PI);
				ctx.fill();
				ctx.restore();
			});
			ctx.globalAlpha = 1;
			planets.forEach(p => {
				p.targetAngle += p.speed * speedModifier;
				p.angle += (p.targetAngle - p.angle) * 0.05;
				const x = centerX + p.orbitRadius * Math.cos(p.angle);
				const y = centerY + p.orbitRadius * Math.sin(p.angle);
				p.x = x; p.y = y;
				p.targetRadius = (p.id === hoveredPlanetIndex) ? p.radius * 1.15 : p.radius;
				p.currentRadius += (p.targetRadius - p.currentRadius) * 0.1;
				p.labelAlpha += (((p.id === hoveredPlanetIndex) ? 1 : 0) - p.labelAlpha) * 0.1;
				ctx.beginPath();
				ctx.arc(x, y, p.currentRadius, 0, 2 * Math.PI);
				ctx.fillStyle = p.color;
				ctx.fill();
				if (p.img && p.img.complete) {
					const iconSize = p.currentRadius * 1.2;
					ctx.drawImage(p.img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
				}
				if (p.labelAlpha > 0.01) {
					ctx.save();
					ctx.globalAlpha = p.labelAlpha;
					ctx.font = '300 14px "degular", sans-serif';
					ctx.fillStyle = '#4A5568';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					const labelMargin = p.radius + 30;
					ctx.fillText(p.label, x, y + labelMargin);
					ctx.restore();
				}
			});
		}

		function animate() {
			animationFrameId = requestAnimationFrame(animate);
			draw();
		}

		function fullResetAndStart() {
			if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
			setupCanvas();
			animate();
		}

		canvas.addEventListener('mousemove', (e) => {
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
			let foundPlanet = false;
			for (const p of planets) {
				if (p.x !== undefined && p.y !== undefined) {
					const dist = Math.sqrt(Math.pow(mouse.x - p.x, 2) + Math.pow(mouse.y - p.y, 2));
					if (dist < p.radius) {
						hoveredPlanetIndex = p.id;
						foundPlanet = true;
						break;
					}
				}
			}
			if (!foundPlanet) {
				hoveredPlanetIndex = -1;
			}
		});

		canvas.addEventListener('mouseleave', () => {
			hoveredPlanetIndex = -1;
		});

		let loadedImages = 0;
		const numImages = config.planets.length;
		if (numImages === 0) { return; }
		setupData();
		planets.forEach(planet => {
			planet.img.crossOrigin = "Anonymous";
			planet.img.src = planet.iconSrc;
			planet.img.onload = () => {
				loadedImages++;
				if (loadedImages === numImages) {
					fullResetAndStart();
				}
			};
			planet.img.onerror = () => {
				console.error('Falha ao carregar ícone: ' + planet.iconSrc);
				loadedImages++;
				if (loadedImages === numImages) {
					fullResetAndStart();
				}
			};
		});

		new ResizeObserver(fullResetAndStart).observe(wrapper);
	};

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

	$(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
			const container = $scope[0].querySelector('.orbital-animation-container');
			if (container) { initAnimation(container); }
		});
	});

	$(function () {
		const containers = document.querySelectorAll('.orbital-animation-container:not([data-initialized="true"])');
		containers.forEach(function (container) {
			if (!container.closest('.elementor-widget')) { initAnimation(container); }
		});
	});

})(jQuery);
