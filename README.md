# Myopic Defocus Nuxt

A small Nuxt demo that applies a Refractify-style myopic defocus overlay to a web page.

The effect is implemented with an SVG filter and a fixed full-screen `backdrop-filter` layer:

```html
<div id="blurLayer" style="position: fixed; inset: 0px; z-index: 9999; backdrop-filter: url(&quot;#RefractifyBlending1&quot;); pointer-events: none; display: block;"></div>
```

## Features

- Nuxt 4 client-side myopic defocus overlay.
- Adjustable strength, screen diagonal, viewing distance, and resolution.
- Chinese, English, and Japanese UI.
- Best-effort detection for an existing Refractify browser extension layer.
- GPL-3.0-only license.

## Attribution

This project is adapted from the core idea and filter technique of [refractify/myopic_defocus](https://github.com/refractify/myopic_defocus), which is licensed under GPL-3.0.

The original project is a Manifest V3 browser extension. This repository repackages the idea as a standalone Nuxt demo, without Chrome extension APIs.

## Usage

```bash
corepack enable
yarn install
yarn dev
```

Build:

```bash
yarn build
```

## Note

This is an experimental visual comfort tool and not medical advice. The UI describes the intended purpose as reducing eye strain and helping eyes relax, but it should not be treated as a medical treatment.
