export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  image_url: string
  image_path: string
  caption: string | null
  rating: number
  store_name: string | null
  store_url: string | null
  tags: string[]
  likes_count: number
  moderation_status: string
  has_adult_changing_station: boolean
  is_family_friendly: boolean | null
  created_at: string
  updated_at: string
  profiles?: Profile
  user_has_liked?: boolean
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export type FeedPost = Post & { profiles: Profile; user_has_liked: boolean }
