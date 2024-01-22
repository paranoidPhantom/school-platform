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
		redirect: false,
	},
	mdc: {
		headings: {
			anchorLinks: {
				h1: false,
				h2: false,
				h3: false,
				h4: false,
				h5: false,
				h6: false
			}
		}
	},
	pwa: {
		includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
		manifest: {
			name: "Домашнее задание | 10Б",
			short_name: "ДЗ | 10Б",
			description: "Платформа для нашего класса включающая рассписание уроков, удобную систему для записи и решения домашнего задания.",
			theme_color: '#0a0a0a',
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
			globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
			navigateFallbackDenylist: [/^\/homework/, /^\/auth/, /^\/callback/, /^\//, /^\/user/]
		},
		devOptions: {
			enabled: true,
			type: "module"
		}
	}
});