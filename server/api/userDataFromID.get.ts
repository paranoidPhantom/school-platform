import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
	const { UID } = getQuery(event)
	const supabase = serverSupabaseServiceRole(event)

	const { data: { user: { user_metadata } } } = await supabase.auth.admin.getUserById(UID)

	return user_metadata
})