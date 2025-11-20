export type Thread = {
	id: number
	content: string
	image: string
	created_at: string
	creator: {
		id: number
		username: string
		photo_profile: string
		full_name: string
	}
	_count: {
		likes: number
		replies: number
	}
	isLiked: boolean
}