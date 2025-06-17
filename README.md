# Plugin WordPress: Animação Orbital Interativa

![Licença](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)
![WordPress](https://img.shields.io/badge/Made%20for-WordPress-blue?logo=wordpress)

Um plugin para WordPress que adiciona uma animação orbital interativa e altamente personalizável através de um simples shortcode. Ideal para páginas de herói (hero sections) dinâmicas e envolventes.

![Demonstração da animação em funcionamento](URL_PARA_UM_GIF_OU_IMAGEM_AQUI.gif)
*(Recomendo fortemente que grave um GIF da animação e coloque o link aqui)*

## Funcionalidades

- **Fácil de Usar:** Adicione a animação a qualquer página com o shortcode `[animacao_orbital]`.
- **Altamente Personalizável:** Controle o conteúdo central, o número de planetas, textos, cores, ícones e velocidade através de atributos de shortcode.
- **Shortcodes Aninhados:** Adicione e configure cada "planeta" individualmente de forma limpa e legível.
- **Ícones SVG:** Use os seus próprios ícones SVG para uma personalização visual completa.
- **Compatível com Elementor:** Construído para funcionar perfeitamente com o ciclo de vida do Elementor e outros construtores de páginas.
- **Leve e Otimizado:** O CSS e o JavaScript só são carregados nas páginas onde o shortcode é utilizado.

## Instalação

1.  Descarregue a versão mais recente do plugin a partir da secção [Releases](https://github.com/SEU_USER/SEU_REPOSITORIO/releases) do GitHub (ficheiro `.zip`).
2.  No seu painel de administração do WordPress, vá a **Plugins > Adicionar Novo**.
3.  Clique em **Carregar Plugin** e selecione o ficheiro `.zip` que descarregou.
4.  Após a instalação, clique em **Ativar**.

## Como Usar

Para usar a animação, insira o shortcode num bloco de HTML ou de shortcode no seu editor de páginas. Pode personalizar quase tudo!

### Exemplo Completo

```shortcode
[animacao_orbital
    titulo="Onde a Criatividade<br>encontra a Tecnologia."
    texto_botao="Conhecer Projetos"
    link_botao="[https://seusite.com/projetos](https://seusite.com/projetos)"
    velocidade="0.0007"
    cor_orbita="#DDDDDD"
]
    [planeta_orbital
        label="Design de Interfaces"
        cor="#FE5D26"
        icon_svg='<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 19.5a7.5 7.5 0 0 0 4.413 -13.298a7.5 7.5 0 0 0 -8.826 0a7.5 7.5 0 0 0 4.413 13.298z" /></svg>'
    ]

    [planeta_orbital
        label="Desenvolvimento Web"
        cor="#10B981"
        icon_svg='<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 4v1a1 1 0 0 0 1 1h1" /><path d="M14 20h-8a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5" /><path d="M19 16l-2 3h4l-2 3" /></svg>'
    ]
[/animacao_orbital]
```

### Atributos do Shortcode Principal: `[animacao_orbital]`

| Atributo               | Descrição                                         | Padrão                                        |
| ---------------------- | ------------------------------------------------- | --------------------------------------------- |
| `titulo`               | O título principal no centro (aceita `<br>`).     | `Onde o Património<br>encontra o Futuro.`      |
| `texto_botao`          | O texto dentro do botão central.                  | `Explorar Estratégias`                        |
| `link_botao`           | O URL para onde o botão aponta.                   | `#`                                           |
| `velocidade`           | A velocidade base da animação (valores pequenos). | `0.0008`                                      |
| `cor_orbita`           | A cor das linhas das órbitas (formato HEX).       | `#FDCC00`                                     |
| `contagem_meteoros`    | O número de "meteoros" nas órbitas exteriores.    | `80`                                          |
| `contagem_orbitas_ext` | O número de órbitas exteriores para os meteoros.  | `3`                                           |

### Atributos do Shortcode Aninhado: `[planeta_orbital]`

| Atributo     | Descrição                                                                      | Padrão                                |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------- |
| `label`      | O texto que aparece abaixo do planeta ao passar o rato.                        | `Item`                                |
| `cor`        | A cor de fundo do planeta (formato HEX).                                       | `#7B61FF`                             |
| `icon_svg`   | O código completo do ícone SVG (`<svg>...</svg>`) a ser exibido no planeta. | Um círculo SVG simples.               |

## Licença

Este projeto está licenciado sob a GPL-2.0-or-later. Veja o ficheiro [LICENSE](LICENSE) para mais detalhes.
