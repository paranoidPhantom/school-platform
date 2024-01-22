import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
	const { UID } = getQuery(event)
	const supabase = serverSupabaseServiceRole(event)

	const { data: { user } } = await supabase.auth.admin.getUserById(UID)
	const { user_metadata, app_metadata } = user
	
	return {...user_metadata, ...app_metadata}
})