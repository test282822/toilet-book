/**
 * Toilet Book — Florida Deep Import
 * Pulls every public toilet in Florida with maximum OSM tag detail
 *
 * RUN:
 *   npx tsx --env-file=.env.local scripts/import-florida.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const OVERPASS_API = 'https://overpass.kumi.systems/api/interpreter'
const DELAY_MS = 12000

// Florida broken into regions for reliable fetching
const FLORIDA_REGIONS = [
  { name: 'Miami / Fort Lauderdale',  bbox: '25.5,-80.5,26.4,-80.0' },
  { name: 'Tampa / St Petersburg',    bbox: '27.7,-82.8,28.1,-82.2' },
  { name: 'Orlando / Central FL',     bbox: '28.0,-81.7,28.8,-81.0' },
  { name: 'Jacksonville',             bbox: '30.0,-82.0,30.6,-81.4' },
  { name: 'Space Coast / Brevard',    bbox: '27.8,-80.9,28.6,-80.5' },
  { name: 'Fort Myers / Naples',      bbox: '25.9,-81.9,26.7,-81.5' },
  { name: 'Sarasota / Bradenton',     bbox: '27.2,-82.7,27.5,-82.4' },
  { name: 'Daytona / Volusia',        bbox: '28.8,-81.5,29.3,-80.9' },
  { name: 'Gainesville / Alachua',    bbox: '29.5,-82.6,29.8,-82.2' },
  { name: 'Tallahassee',              bbox: '30.3,-84.5,30.6,-84.1' },
  { name: 'Pensacola / Panhandle W',  bbox: '30.2,-87.4,30.6,-86.8' },
  { name: 'Panama City / Panhandle E',bbox: '30.0,-86.0,30.5,-85.5' },
  { name: 'Key West / Keys',          bbox: '24.4,-81.9,25.2,-80.1' },
  { name: 'Palm Beach / Boca',        bbox: '26.2,-80.3,26.8,-80.0' },
  { name: 'Port St Lucie / Treasure', bbox: '27.0,-80.5,27.5,-80.1' },
  { name: 'Ocala / Marion',           bbox: '29.0,-82.4,29.4,-82.0' },
  { name: 'Lakeland / Polk',          bbox: '27.8,-82.1,28.1,-81.7' },
  { name: 'Cape Coral / Charlotte',   bbox: '26.5,-82.2,26.8,-81.8' },
]

// Extended Overpass query — pulls ALL toilet-related tags
function buildQuery(bbox: string): string {
  return `
    [out:json][timeout:90];
    (
      node["amenity"="toilets"](${bbox});
      node["amenity"="public_bath"](${bbox});
      node["toilets"="yes"](${bbox});
      way["amenity"="toilets"](${bbox});
    );
    out body center;
  `
}

function parseNode(node: any): any | null {
  const lat = node.lat ?? node.center?.lat
  const lon = node.lon ?? node.center?.lon
  if (!lat || !lon) return null

  const t = node.tags || {}

  // Extract city from multiple possible tags
  const city =
    t['addr:city'] ||
    t['addr:town'] ||
    t['addr:suburb'] ||
    t['is_in:city'] ||
    null

  // Full address assembly
  const addrParts = [
    t['addr:housenumber'],
    t['addr:street'],
  ].filter(Boolean)
  const address = addrParts.length > 0
    ? `${addrParts.join(' ')}, ${city || 'FL'}, FL`
    : null

  // Detect all facility flags
  const hasChanging =
    t['changing_table'] === 'yes' ||
    t['changing_table:adult'] === 'yes' ||
    t['diaper_changing_table'] === 'yes'

  const hasFamily =
    t['family'] === 'yes' ||
    t['family_toilet'] === 'yes' ||
    t['baby_care'] === 'yes'

  const hasNeutral =
    t['unisex'] === 'yes' ||
    t['gender_segregated'] === 'no' ||
    t['toilets:unisex'] === 'yes'

  const isAccessible =
    t['wheelchair'] === 'yes' ||
    t['wheelchair'] === 'limited' ||
    t['access:wheelchair'] === 'yes'

  const isFee =
    t['fee'] === 'yes' ||
    t['payment:coins'] === 'yes' ||
    t['toll'] === 'yes'

  // Venue type detection
  let venueType = 'public'
  if (t['tourism'])                         venueType = 'tourism'
  if (t['amenity'] === 'fuel')              venueType = 'gas_station'
  if (t['shop'])                            venueType = 'retail'
  if (t['leisure'] === 'park')              venueType = 'park'
  if (t['leisure'] === 'beach_resort')      venueType = 'beach'
  if (t['aeroway'])                         venueType = 'airport'
  if (t['highway'] === 'rest_area')         venueType = 'rest_area'
  if (t['building'] === 'retail')           venueType = 'retail'

  return {
    osm_id:                    node.id,
    name:                      t['name'] || t['description'] || t['operator'] || null,
    venue_type:                venueType,
    address,
    city:                      city || null,
    country:                   'US',
    location_lat:              lat,
    location_lng:              lon,
    has_adult_changing_station: hasChanging,
    has_family_bathroom:       hasFamily,
    has_gender_neutral:        hasNeutral,
    is_accessible:             isAccessible,
    opening_hours:             t['opening_hours'] || null,
    fee:                       isFee,
    avg_overall:               0,
    review_count:              0,
    source:                    'osm',
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function main() {
  console.log('🌴 Toilet Book — Florida Deep Import')
  console.log('=====================================')

  const { count, error } = await supabase
    .from('toilets')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Cannot connect:', error.message)
    process.exit(1)
  }
  console.log(`Connected! Current total: ${count?.toLocaleString()}`)

  // Count existing Florida toilets
  const { count: flCount } = await supabase
    .from('toilets')
    .select('*', { count: 'exact', head: true })
    .eq('country', 'US')
    .gte('location_lat', 24.4)
    .lte('location_lat', 31.0)
    .gte('location_lng', -87.5)
    .lte('location_lng', -80.0)

  console.log(`Florida toilets already in DB: ${flCount?.toLocaleString()}`)
  console.log(`Regions to scan: ${FLORIDA_REGIONS.length}\n`)

  let totalNew = 0

  for (let i = 0; i < FLORIDA_REGIONS.length; i++) {
    const region = FLORIDA_REGIONS[i]
    console.log(`[${i + 1}/${FLORIDA_REGIONS.length}] ${region.name}`)

    try {
      const res = await fetch(OVERPASS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(buildQuery(region.bbox))}`,
      })

      if (!res.ok) {
        console.log(`  HTTP ${res.status} — skipping`)
        await sleep(DELAY_MS * 2)
        continue
      }

      const json = await res.json()
      const nodes = (json.elements || []).map(parseNode).filter(Boolean)
      console.log(`  Found: ${nodes.length} toilets`)

      if (nodes.length > 0) {
        // Insert in batches of 100
        for (let j = 0; j < nodes.length; j += 100) {
          const batch = nodes.slice(j, j + 100)
          const { error: insertErr } = await supabase
            .from('toilets')
            .upsert(batch, { onConflict: 'osm_id', ignoreDuplicates: true })

          if (insertErr) {
            console.error('  Insert error:', insertErr.message)
          } else {
            totalNew += batch.length
            console.log(`  Saved: ${batch.length} (session total: ${totalNew})`)
          }
        }
      }
    } catch (err) {
      console.log('  Network error — skipping:', err)
    }

    if (i < FLORIDA_REGIONS.length - 1) {
      console.log(`  Waiting ${DELAY_MS / 1000}s...`)
      await sleep(DELAY_MS)
    }
  }

  // Final Florida count
  const { count: flFinal } = await supabase
    .from('toilets')
    .select('*', { count: 'exact', head: true })
    .eq('country', 'US')
    .gte('location_lat', 24.4)
    .lte('location_lat', 31.0)
    .gte('location_lng', -87.5)
    .lte('location_lng', -80.0)

  console.log('\n=====================================')
  console.log(`✅ Florida import complete!`)
  console.log(`   Florida toilets in DB: ${flFinal?.toLocaleString()}`)
  console.log(`   Session inserts: ${totalNew.toLocaleString()}`)
  console.log('\n🌴 Zoom into Florida on your map to see all the pins!')
}

main().catch(console.error)
