import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
async function run() {
  const { data, error } = await supabase.from('lotes').select('*').limit(2)
  console.log('lotes', data, error)
  const { data: d2 } = await supabase.from('tareo_registros').select('*').limit(2)
  console.log('tareo', d2)
  const { data: d3 } = await supabase.from('cultivos').select('*').limit(2)
  console.log('cultivos', d3)
}
run()
