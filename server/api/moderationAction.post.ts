import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
	const { action, ID } = getQuery(event)
	const supabase = serverSupabaseServiceRole(event)
	
	const { access_token } = getHeaders(event)

	const { data: userJWT } = await supabase.auth.getUser(access_token)
	
	if (!(userJWT.user?.app_metadata.moderator)) return

	if (action === "approve") {
		await supabase.from("homework").update({
			approved: true
		} as never).eq("id", ID as any)
	} else if (action === "delete") {
		await supabase.from("homework").delete().eq("id", ID as any)
	}
})