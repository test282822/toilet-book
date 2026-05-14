export interface Profile {
  id:                      string
  username:                string | null
  full_name:               string | null
  avatar_url:              string | null
  bio:                     string | null
  website:                 string | null
  created_at:              string
  updated_at:              string
  flush_balance:           number | null
  sol_wallet_address:      string | null
  whitelist_registered_at: string | null
  reviewer_badge:          string | null
  total_reviews:           number | null
  referral_code:           string | null
  referral_count:          number | null
  referred_by:             string | null
}

export interface Post {
  id:                         string
  user_id:                    string
  image_url:                  string
  image_path:                 string
  caption:                    string | null
  rating:                     number
  store_name:                 string | null
  store_url:                  string | null
  address:                    string | null
  google_maps_url:            string | null
  tags:                       string[]
  likes_count:                number
  moderation_status:          string
  created_at:                 string
  updated_at:                 string
  // Facility flags
  has_adult_changing_station: boolean
  has_family_bathroom:        boolean
  has_gender_neutral:         boolean
  is_family_friendly:         boolean | null
  // New fields — migration v11
  bathroom_type:              string | null
  is_single_stall:            boolean
  has_hygiene_products:       boolean
  opening_hours:              string | null
  is_open_247:                boolean
  is_permanently_closed:      boolean
  needs_update:               boolean
  // Location
  location_lat:               number | null
  location_lng:               number | null
  country:                    string | null
  // Source device
  source:                     string | null
  toilet_id:                  string | null
  // Relations
  profiles?:                  Profile
  user_has_liked?:            boolean
}

export interface Like {
  id:         string
  post_id:    string
  user_id:    string
  created_at: string
}

export type FeedPost = Post & {
  profiles:       Profile
  user_has_liked: boolean
}
