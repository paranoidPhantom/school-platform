// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@nuxthq/ui', 'nuxt-icon', '@nuxt/content'],
    app: {
        pageTransition: {
            name: "page",
            mode: "out-in"
        }
    }
});