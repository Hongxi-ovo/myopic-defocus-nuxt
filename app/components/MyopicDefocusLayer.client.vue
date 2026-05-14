<template>
  <Teleport to="body">
    <div v-if="enabled" id="myopic-defocus-nuxt-svg" data-myopic-defocus-nuxt="true" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" focusable="false">
        <defs>
          <filter id="RefractifyBlending1" data-myopic-defocus-nuxt="true" x="0" y="0" width="100%" height="100%">
            <feColorMatrix
              result="red_ch"
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
            <feColorMatrix
              result="green_ch"
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
            <feColorMatrix
              result="blue_ch"
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
            <feGaussianBlur color-interpolation-filters="sRGB" result="blue_ch_blur" in="blue_ch" :stdDeviation="blur.blue" />
            <feGaussianBlur color-interpolation-filters="sRGB" result="green_ch_blur" in="green_ch" :stdDeviation="blur.green" />
            <feComposite color-interpolation-filters="sRGB" result="rg_ch" operator="arithmetic" in="red_ch" in2="green_ch_blur" k1="0" k2="1" k3="1" k4="0" />
            <feComposite color-interpolation-filters="sRGB" result="rgb_ch" operator="arithmetic" in="rg_ch" in2="blue_ch_blur" k1="0" k2="1" k3="1" k4="0" />
            <feComposite color-interpolation-filters="sRGB" result="scr_ch" operator="arithmetic" in="SourceGraphic" in2="rgb_ch" k1="0" :k2="1 - strength" :k3="strength" k4="0" />
          </filter>
        </defs>
      </svg>
    </div>
    <div
      v-if="enabled"
      id="blurLayer"
      data-myopic-defocus-nuxt="true"
      :style="layerStyle"
      aria-hidden="true"
    />
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps<{
  enabled: boolean;
  strengthPercent: number;
  distanceCm: number;
  diagonalInch: number;
  resX: number;
  resY: number;
}>();

const strength = computed(() => Math.min(0.8, Math.max(0.1, props.strengthPercent / 100)));

// Adapted from Refractify Myopic Defocus (GPL-3.0): channel splitting plus SVG blur compositing.
const blur = computed(() => {
  const resX = Math.max(640, Number(props.resX) || 2560);
  const resY = Math.max(480, Number(props.resY) || 1440);
  const diagonalPx = Math.sqrt(resX ** 2 + resY ** 2);
  const diagonalMm = Math.max(8, Number(props.diagonalInch) || 14) * 25.4;
  const realWidthMm = resX * (diagonalMm / diagonalPx);
  const pixelMm = realWidthMm / resX;
  const screenDistanceMm = Math.max(25, Number(props.distanceCm) || 40) * 10;
  const pupilSizeMm = 6.5;
  const lcaNatural = { red: -0.23, green: 0.24, blue: 1.1 };
  const shift = -lcaNatural.red;

  const blurFor = (lca: number) => {
    const shifted = lca + shift;
    const focalPoint = 1000 / (1000 / screenDistanceMm + shifted);
    const circle = pupilSizeMm * ((screenDistanceMm - focalPoint) / focalPoint);
    return Math.max(0.02, (circle / pixelMm) * 0.32);
  };

  return {
    blue: Number(blurFor(lcaNatural.blue).toFixed(3)),
    green: Number(blurFor(lcaNatural.green).toFixed(3))
  };
});

const layerStyle = {
  position: "fixed",
  inset: "0px",
  zIndex: "9999",
  backdropFilter: 'url("#RefractifyBlending1")',
  WebkitBackdropFilter: 'url("#RefractifyBlending1")',
  pointerEvents: "none",
  display: "block"
};
</script>
