export default defineNuxtConfig({
  compatibilityDate: "2026-05-14",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  app: {
    head: {
      title: "Myopic Defocus Nuxt",
      meta: [
        { name: "description", content: "A GPL Nuxt demo for applying a Refractify-style myopic defocus overlay." }
      ]
    }
  }
});
