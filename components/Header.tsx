import ClientHeader from './ClientHeader'

// Server component wrapper that simply renders the client-side header.
// ClientHeader is responsible for loading the current user via Supabase
// on the client, so we don't pass any props here.
export default function Header() {
  return <ClientHeader />
}

