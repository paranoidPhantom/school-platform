import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
	const supabase = serverSupabaseServiceRole(event)

	const { access_token } = getHeaders(event)

	const { data: userJWT } = await supabase.auth.getUser(access_token)
	
	if (!(userJWT.user?.app_metadata.moderator)) return []

	const { data } = await supabase.from("homework").select()
	
	return data
})