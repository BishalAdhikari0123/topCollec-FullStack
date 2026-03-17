import { createClient } from '@/lib/supabase/server'
import ClientHeader from './ClientHeader'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <ClientHeader user={user} />
}

