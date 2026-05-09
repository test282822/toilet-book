/**
 * Toilet Book — OpenStreetMap Import Script v2
 * Fixed to use NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * RUN:
 *   npx tsx --env-file=.env.local scripts/import-osm-toilets.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars - check .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const OVERPASS_API = 'https://overpass.kumi.systems/api/interpreter'
const BATCH_SIZE = 200
const DELAY_MS = 8000

const REGIONS = [
  { name: 'New York',       bbox: '40.4,-74.3,41.0,-73.6' },
  { name: 'Los Angeles',    bbox: '33.7,-118.7,34.4,-117.9' },
  { name: 'Chicago',        bbox: '41.6,-87.9,42.1,-87.4' },
  { name: 'Houston',        bbox: '29.5,-95.8,30.2,-95.0' },
  { name: 'San Francisco',  bbox: '37.6,-122.6,37.9,-122.3' },
  { name: 'Seattle',        bbox: '47.4,-122.5,47.8,-122.1' },
  { name: 'Miami',          bbox: '25.6,-80.5,26.0,-80.1' },
  { name: 'Atlanta',        bbox: '33.6,-84.6,33.9,-84.2' },
  { name: 'Boston',         bbox: '42.2,-71.3,42.5,-70.9' },
  { name: 'Denver',         bbox: '39.5,-105.2,39.9,-104.7' },
  { name: 'Las Vegas',      bbox: '36.0,-115.4,36.4,-115.0' },
  { name: 'London',         bbox: '51.3,-0.5,51.7,0.3' },
  { name: 'Paris',          bbox: '48.7,2.2,49.0,2.6' },
  { name: 'Berlin',         bbox: '52.3,13.1,52.7,13.7' },
  { name: 'Amsterdam',      bbox: '52.3,4.7,52.5,5.1' },
  { name: 'Tokyo',          bbox: '35.5,139.5,35.9,140.0' },
  { name: 'Sydney',         bbox: '-34.1,150.9,-33.7,151.4' },
  { name: 'Singapore',      bbox: '1.2,103.7,1.5,104.1' },
  { name: 'USA East',       bbox: '24,-90,50,-60' },
  { name: 'USA Central',    bbox: '24,-110,50,-90' },
  { name: 'USA West',       bbox: '24,-130,50,-110' },
  { name: 'Canada',         bbox: '42,-140,70,-60' },
  { name: 'UK Full',        bbox: '49,-11,62,2' },
  { name: 'W Europe',       bbox: '41,-5,56,20' },
  { name: 'E Europe',       bbox: '44,20,56,35' },
  { name: 'Australia',      bbox: '-44,112,-10,155' },
  { name: 'Japan',          bbox: '30,130,46,146' },
  { name: 'India',          bbox: '8,68,36,98' },
  { name: 'SE Asia',        bbox: '-10,95,25,142' },
  { name: 'China',          bbox: '20,80,55,135' },
  { name: 'Middle East',    bbox: '12,30,42,60' },
  { name: 'S Africa',       bbox: '-35,15,-20,35' },
  { name: 'Brazil',         bbox: '-35,-75,-5,-35' },
  { name: 'Mexico',         bbox: '14,-120,33,-85' },
]

function parseNode(node: any): any | null {
  if (!node.lat || !node.lon) return null
  const t = node.tags || {}
  return {
    osm_id: node.id,
    name: t['name'] || null,
    venue_type: 'public',
    address: [t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' ') || null,
    city: t['addr:city'] || null,
    country: t['addr:country'] || null,
    location_lat: node.lat,
    location_lng: node.lon,
    has_adult_changing_station: t['changing_table'] === 'yes' || t['changing_table:adult'] === 'yes',
    has_family_bathroom: t['family'] === 'yes',
    has_gender_neutral: t['unisex'] === 'yes' || t['gender_segregated'] === 'no',
    is_accessible: t['wheelchair'] === 'yes',
    opening_hours: t['opening_hours'] || null,
    fee: t['fee'] === 'yes',
    avg_overall: 0,
    review_count: 0,
    source: 'osm',
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function main() {
  console.log('Toilet Book - OSM Import v2')
  console.log('===========================')

  // Test connection first
  const { count, error } = await supabase.from('toilets').select('*', { count: 'exact', head: true })
  if (error) {
    console.error('Cannot access toilets table:', error.message)
    console.error('Run migration_v7.sql in Supabase SQL Editor first!')
    console.error('Also add this policy in SQL Editor:')
    console.error('CREATE POLICY "anon insert toilets" ON public.toilets FOR INSERT WITH CHECK (true);')
    process.exit(1)
  }
  console.log(`Connected! Current count: ${count}`)

  let total = 0

  for (let i = 0; i < REGIONS.length; i++) {
    const region = REGIONS[i]
    console.log(`\n[${i + 1}/${REGIONS.length}] ${region.name}`)
    try {
      const res = await fetch(OVERPASS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(`[out:json][timeout:60];(node["amenity"="toilets"](${region.bbox}););out body;`)}`,
      })
      if (!res.ok) { console.log('  HTTP error - skipping'); continue }
      const json = await res.json()
      const nodes = (json.elements || []).map(parseNode).filter(Boolean)
      console.log(`  Found: ${nodes.length} toilets`)

      for (let j = 0; j < nodes.length; j += BATCH_SIZE) {
        const batch = nodes.slice(j, j + BATCH_SIZE)
        const { error: insertErr } = await supabase.from('toilets').upsert(batch, { onConflict: 'osm_id', ignoreDuplicates: true })
        if (insertErr) {
          console.error('  Insert error:', insertErr.message)
          if (insertErr.message.includes('policy') || insertErr.message.includes('row-level')) {
            console.error('\n  FIX: Run this in Supabase SQL Editor:')
            console.error('  CREATE POLICY "anon insert" ON public.toilets FOR INSERT WITH CHECK (true);\n')
            process.exit(1)
          }
        } else {
          total += batch.length
          console.log(`  Saved batch: ${batch.length} (total: ${total})`)
        }
      }
    } catch (err) {
      console.log('  Error - skipping:', err)
    }

    if (i < REGIONS.length - 1) await sleep(DELAY_MS)
  }

  const { count: final } = await supabase.from('toilets').select('*', { count: 'exact', head: true })
  console.log(`\nDone! Total in database: ${final?.toLocaleString()}`)
  console.log('Visit toilet-book.com/map to see the pins!')
}

main().catch(console.error)
