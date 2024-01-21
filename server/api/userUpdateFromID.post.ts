import { serverSupabaseServiceRole } from '#supabase/server'
import { useError } from 'nuxt/app'

export default defineEventHandler(async (event) => {
	const { UID } = getQuery(event)
	const { full_name, avatar_url } = await readBody(event)
	const supabase = serverSupabaseServiceRole(event)
	const { error } = await supabase.auth.admin.updateUserById(UID as string, { user_metadata: { full_name, avatar_url } })
})