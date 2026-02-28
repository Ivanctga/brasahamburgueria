# 📁 assets/images — Estrutura de Imagens

Esta pasta contém todos os assets visuais do projeto Brasa Burger.

## 📂 Estrutura recomendada

```
assets/
└── images/
    ├── hero/
    │   ├── burger-hero.webp          ← Imagem principal do hero (1200x900)
    │   ├── burger-hero@2x.webp       ← Versão 2x para telas retina
    │   └── burger-hero-mobile.webp   ← Versão otimizada para mobile (600x600)
    │
    ├── menu/
    │   ├── smash-bacon-duplo.webp    ← Foto do Smash Bacon Duplo (600x400)
    │   ├── brasa-classico.webp       ← Foto do Brasa Clássico (600x400)
    │   ├── triplo-cheddar.webp       ← Foto do Triplo Cheddar (600x400)
    │   ├── hot-inferno.webp          ← Foto do Hot Inferno (600x400)
    │   ├── green-monster.webp        ← Foto do Green Monster (600x400)
    │   └── combo-familia.webp        ← Foto do Combo Família (600x400)
    │
    ├── gallery/
    │   ├── foto-01.webp              ← Foto da galeria (600x600)
    │   ├── foto-02.webp
    │   ├── foto-03.webp
    │   ├── foto-04.webp
    │   └── foto-05.webp
    │
    ├── about/
    │   └── chapa-brasa.webp          ← Foto da chapa/cozinha (800x600)
    │
    ├── og/
    │   └── og-image.jpg              ← Imagem Open Graph (1200x630)
    │
    └── brand/
        ├── logo.svg                  ← Logo vetorial
        ├── logo-white.svg            ← Logo branco para fundo escuro
        ├── favicon-32x32.png
        ├── favicon-16x16.png
        └── apple-touch-icon.png      ← Ícone 180x180 para iOS
```

## 📋 Especificações técnicas

### Formato recomendado
- **WebP** para fotos (melhor compressão que JPEG/PNG)
- **SVG** para ícones e logo (infinitamente escalável)
- **PNG** para favicons (compatibilidade máxima)

### Tamanhos e otimização
| Tipo          | Tamanho máximo | Qualidade WebP |
|---------------|----------------|----------------|
| Hero          | 200 KB         | 85%            |
| Cards menu    | 80 KB          | 80%            |
| Galeria       | 100 KB         | 80%            |
| Open Graph    | 150 KB         | 85%            |

### Ferramentas de otimização gratuitas
- **Squoosh** → https://squoosh.app (converte e comprime)
- **TinyPNG** → https://tinypng.com (comprime PNG/JPG)
- **SVGOMG** → https://svgomg.net (otimiza SVG)
- **Favicon.io** → https://favicon.io (gera favicons)

## 🖼️ Como usar as imagens no HTML

### Em vez dos emojis (substituição futura):

```html
<!-- Imagem do menu com lazy loading -->
<img
  src="assets/images/menu/smash-bacon-duplo.webp"
  alt="Smash Bacon Duplo — pão brioche, 2 smash e bacon crocante"
  width="600"
  height="400"
  loading="lazy"
  decoding="async"
/>

<!-- Hero com srcset para responsividade -->
<img
  srcset="
    assets/images/hero/burger-hero-mobile.webp 600w,
    assets/images/hero/burger-hero.webp       1200w,
    assets/images/hero/burger-hero@2x.webp    2400w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  src="assets/images/hero/burger-hero.webp"
  alt="Hambúrguer artesanal Brasa Burger"
  width="1200"
  height="900"
  loading="eager"
  fetchpriority="high"
/>
```

## 🔖 Boas práticas de alt text

- **Bom:** `alt="Smash Bacon Duplo com cheddar derretido e bacon crocante"`
- **Ruim:** `alt="img1"` ou `alt="hamburguer"`
- **Decorativo:** `alt=""` (vazio) para imagens puramente decorativas

## 📱 Placeholder atual

O projeto atual usa **emojis** como placeholder visual enquanto
as fotos reais não estão disponíveis. Esta é uma estratégia válida
para MVP — substitua progressivamente pelos arquivos reais.
