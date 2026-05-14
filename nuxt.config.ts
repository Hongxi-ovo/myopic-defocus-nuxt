export default defineNuxtConfig({
  compatibilityDate: "2026-05-14",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  app: {
    head: {
      title: "Myopic Defocus Nuxt",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#f4f7fb" },
        { name: "description", content: "A GPL Nuxt demo for applying a Refractify-style myopic defocus overlay." }
      ]
    }
  }
});
