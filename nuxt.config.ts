// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@vite-pwa/nuxt', '@nuxtjs/mdc', '@nuxt/ui', 'nuxt-icon', '@nuxtjs/supabase'],
	app: {
		pageTransition: {
			name: "page",
			mode: "out-in"
		}
	},
	supabase: {
		redirect: false
	},
	pwa: {
		includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
		manifest: {
			name: "Домашнее задание | 10Б",
			short_name: "ДЗ | 10Б",
			description: "Платформа для нашего класса включающая рассписание уроков, удобную систему для записи и решения домашнего задания.",
			theme_color: '#0a0a0a',
			orientation: "landscape",
			icons: [
				{
					src: "icons/homework.png",
					sizes: "512x512",
					type: "image/png"
				},
				{
					src: "icons/small_homework.png",
					sizes: "144x144",
					type: "image/png"
				},
				{
					src: "icons/medium_homework.png",
					sizes: "192x192",
					type: "image/png"
				},
				{
					src: "icons/extra_small_homework.png",
					sizes: "64x64",
					type: "image/png"
				}
			]
		},
		registerType: 'autoUpdate',
		workbox: {
			navigateFallback: "/",
			globPatterns: ['_nuxt/*.{js,css,html,ico,png,svg}'],
			navigateFallbackDenylist: [/^\/homework/]
		},
		devOptions: {
			enabled: false,
			type: "module"
		}
	}
});