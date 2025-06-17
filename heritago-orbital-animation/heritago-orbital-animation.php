<?php
/**
 * Plugin Name:       Heritago - Animação Orbital
 * Plugin URI:        https://www.borvo-sc.com
 * Description:       Adiciona um shortcode [animacao_orbital] para mostrar uma animação interativa. Compatível com Elementor.
 * Version:           1.1.0
 * Author:            Alexandre Rodrigues
 * Author URI:        https://www.borvo-sc.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       heritago-orbital
 */

if (!defined('ABSPATH')) {
    exit;
}

// O enfileiramento de scripts e estilos permanece o mesmo.
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'heritago-orbital-style',
        plugin_dir_url(__FILE__) . 'orbital-animation.css',
        [],
        '1.1.0'
    );
    wp_enqueue_script(
        'heritago-orbital-script',
        plugin_dir_url(__FILE__) . 'orbital-animation.js',
        ['jquery', 'elementor-frontend'],
        '1.1.0',
        true
    );
});

// -- INÍCIO DAS MODIFICAÇÕES --

// Vamos usar uma variável estática para guardar os dados dos planetas.
// Isto evita o uso de variáveis globais, que é uma má prática.
class HeritagoOrbitalData {
    public static $planets = [];
}

// 2. O shortcode aninhado [planeta_orbital]
add_shortcode('planeta_orbital', function($atts) {
    // Definir atributos e valores padrão para cada planeta.
    $atts = shortcode_atts([
        'label'      => 'Item',
        'color'      => '#7B61FF',
        'icon_svg'   => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /></svg>',
    ], $atts, 'planeta_orbital');

    // **CRÍTICO:** O SVG precisa de ser codificado para ser usado num data URI.
    $encoded_svg = rawurlencode($atts['icon_svg']);

    // Adiciona os dados deste planeta ao nosso array estático.
    HeritagoOrbitalData::$planets[] = [
        'iconSrc' => 'data:image/svg+xml,' . $encoded_svg,
        'color'   => sanitize_hex_color($atts['color']),
        'label'   => sanitize_text_field($atts['label']),
        // Valores fixos que podemos expor como atributos mais tarde, se necessário.
        'radius'  => 35, 
    ];

    // Este shortcode não produz output HTML diretamente.
    return ''; 
});

// 1. O shortcode principal [animacao_orbital]
add_shortcode('animacao_orbital', function($atts, $content = null) {
    // Resetar os planetas para cada nova instância da animação.
    HeritagoOrbitalData::$planets = [];

    // Processar os shortcodes aninhados (isto irá chamar a função do [planeta_orbital] para cada um).
    do_shortcode($content);

    // Definir atributos e valores padrão para a animação principal.
    $atts = shortcode_atts([
        'titulo'              => 'Onde o Património<br>encontra o Futuro.',
        'texto_botao'         => 'Explorar Estratégias',
        'link_botao'          => '#',
        'velocidade'          => 0.0008,
        'cor_orbita'          => '#FDCC00',
        'contagem_meteoros'   => 80,
        'contagem_orbitas_ext' => 3,
    ], $atts, 'animacao_orbital');

    // Construir o array de dados dos planetas com os ângulos iniciais distribuídos uniformemente.
    $planets_data = [];
    $planet_count = count(HeritagoOrbitalData::$planets);
    $angle_step = ($planet_count > 0) ? 360 / $planet_count : 0;

    foreach (HeritagoOrbitalData::$planets as $index => $planet) {
        $planets_data[] = array_merge($planet, [
            'startAngle' => $index * $angle_step,
        ]);
    }

    // Construir a configuração completa para o data-config.
    $config = [
        'planets'         => $planets_data,
        'orbitColor'      => sanitize_hex_color($atts['cor_orbita']),
        'baseSpeed'       => floatval($atts['velocidade']),
        'outerOrbitCount' => intval($atts['contagem_orbitas_ext']),
        'meteors'         => [
            'count'  => intval($atts['contagem_meteoros']),
            'colors' => ["#4f46e5", "#db2777", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"], // Poderia também ser um atributo
        ],
    ];

    // Converter a configuração para uma string JSON.
    $json_config = json_encode($config);

    // Gerar o HTML final com os dados personalizados.
    ob_start();
    ?>
    <link rel="stylesheet" href="https://use.typekit.net/rjg3qcy.css">
    <div class="orbital-animation-container">
        <canvas class="orbital-canvas" data-config='<?php echo esc_attr($json_config); ?>'></canvas>
        <div class="central-content">
            <h1><?php echo wp_kses_post($atts['titulo']); ?></h1>
            <a href="<?php echo esc_url($atts['link_botao']); ?>" class="orbital-hero-button">
                <?php echo esc_html($atts['texto_botao']); ?>
                <svg style="margin-left: 0.5rem; width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </a>
        </div>
    </div>
    <?php
    return ob_get_clean();
});
