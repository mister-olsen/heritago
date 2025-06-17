<?php
/**
 * Plugin Name:       Heritago - Animação Orbital
 * Plugin URI:        https://github.com/mister-olsen/heritago/
 * Description:       Adiciona um shortcode [animacao_orbital] para mostrar uma animação interativa e personalizável.
 * Version:           1.3.1
 * Author:            Alexandre Rodrigues
 * Author URI:        https://www.borvo-sc.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       heritago-orbital
 * Domain Path:       /languages
 */

// Medida de segurança: impede o acesso direto ao ficheiro.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Heritago_Orbital_Data {
	public static $planets       = [];
	public static $assets_loaded = false;
}

/**
 * Regista o shortcode aninhado [planeta_orbital].
 */
add_shortcode(
	'planeta_orbital',
	function ( $atts ) {
		// Atributos para cada planeta (sem link).
		$atts = shortcode_atts(
			[
				'label'    => 'Item',
				'color'    => '#7B61FF',
				'icon_svg' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /></svg>',
			],
			$atts,
			'planeta_orbital'
		);

		$encoded_svg = rawurlencode( $atts['icon_svg'] );

		Heritago_Orbital_Data::$planets[] = [
			'iconSrc' => 'data:image/svg+xml,' . $encoded_svg,
			'color'   => sanitize_hex_color( $atts['color'] ),
			'label'   => sanitize_text_field( $atts['label'] ),
			'radius'  => 35,
		];
		return '';
	}
);

/**
 * Regista o shortcode principal [animacao_orbital].
 */
add_shortcode(
	'animacao_orbital',
	function ( $atts, $content = null ) {
		if ( ! Heritago_Orbital_Data::$assets_loaded ) {
			wp_enqueue_style( 'heritago-orbital-style', plugin_dir_url( __FILE__ ) . 'orbital-animation.css', [], '1.3.0' );
			wp_enqueue_script( 'heritago-orbital-script', plugin_dir_url( __FILE__ ) . 'orbital-animation.js', [ 'jquery', 'elementor-frontend' ], '1.3.0', true );
			Heritago_Orbital_Data::$assets_loaded = true;
		}

        // Lógica de processamento de shortcodes aninhados.
        Heritago_Orbital_Data::$planets = [];
		do_shortcode( $content );

		$atts = shortcode_atts(
			[
				'titulo'               => 'Onde o Património<br>encontra o Futuro.',
				'texto_botao'          => 'Explorar Estratégias',
				'link_botao'           => '#',
				'velocidade'           => 0.0008,
				'cor_orbita'           => '#FDCC00',
				'contagem_meteoros'    => 80,
				'contagem_orbitas_ext' => 3,
			],
			$atts,
			'animacao_orbital'
		);

		$planets_data = [];
		$planet_count = count( Heritago_Orbital_Data::$planets );
		$angle_step   = ( $planet_count > 0 ) ? 360 / $planet_count : 0;

		foreach ( Heritago_Orbital_Data::$planets as $index => $planet ) {
			$planets_data[] = array_merge(
				$planet,
				[ 'startAngle' => $index * $angle_step, ]
			);
		}

		$config = [
			'planets'         => $planets_data,
			'orbitColor'      => sanitize_hex_color( $atts['cor_orbita'] ),
			'baseSpeed'       => floatval( $atts['velocidade'] ),
			'outerOrbitCount' => intval( $atts['contagem_orbitas_ext'] ),
			'meteors'         => [
				'count'  => intval( $atts['contagem_meteoros'] ),
				'colors' => [ '#4f46e5', '#db2777', '#f59e0b', '#10b981', '#3b82f6', '#ef4444' ],
			],
		];

		$json_config = wp_json_encode( $config );

		ob_start();
		?>
		<link rel="stylesheet" href="https://use.typekit.net/rjg3qcy.css">
		<div class="orbital-animation-container">
			<canvas class="orbital-canvas" data-config='<?php echo esc_attr( $json_config ); ?>'></canvas>
			<div class="central-content">
				<h1><?php echo wp_kses_post( $atts['titulo'] ); ?></h1>
				<a href="<?php echo esc_url( $atts['link_botao'] ); ?>" class="orbital-hero-button">
					<?php echo esc_html( $atts['texto_botao'] ); ?>
					<svg style="margin-left: 0.5rem; width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
				</a>
			</div>
		</div>
		<?php
		
		return ob_get_clean();
	}
);
