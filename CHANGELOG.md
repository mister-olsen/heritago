# Changelog

Todas as alterações notáveis a este projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-17

### Adicionado
- Personalização total via atributos de shortcode para o container principal (`[animacao_orbital]`).
- Shortcode aninhado `[planeta_orbital]` para adicionar e personalizar dinamicamente cada planeta.
- Atributos para controlar título, botão, velocidade, cores e mais.
- Funções de sanitização e escape para garantir a segurança dos dados inseridos pelo utilizador.

### Alterado
- Refatoração do código do plugin para uma arquitetura mais robusta e modular.
- O JSON de configuração `data-config` agora é gerado dinamicamente com base nos atributos do shortcode.

## [1.0.0] - 2025-06-17

### Adicionado
- Versão inicial do plugin "Heritago - Animação Orbital".
- Shortcode `[animacao_orbital]` com animação e conteúdo fixos (hardcoded).
- Integração com os hooks do Elementor para garantir a execução correta do script.
- Separação de PHP, CSS e JavaScript em ficheiros distintos.
