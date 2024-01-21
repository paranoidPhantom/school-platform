export default defineNuxtRouteMiddleware((to, from) => {
	if (process.server) return
	const user = useSupabaseUser()
	if (!user.value) return navigateTo("/auth")
})
