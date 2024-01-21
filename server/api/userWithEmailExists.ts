import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
	const { email } = getQuery(event)
	const supabase = serverSupabaseServiceRole(event)

	const { data: { users }, error } = await supabase.auth.admin.listUsers()
	let found = false

	users.forEach((user) => {
        if (user.email === email) {
            found = true
        }
    })

	return found
})