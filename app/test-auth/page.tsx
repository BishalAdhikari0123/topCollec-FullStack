import { createClient } from '@/lib/supabase/server'

export default async function TestAuthPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#121212] p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8">Auth Test</h1>
        
        <div className="card-grunge p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">User Status:</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg">
              <p className="text-red-400 font-bold">Error: {error.message}</p>
            </div>
          )}
          
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/20 border-2 border-green-500/50 rounded-lg">
                <p className="text-green-400 font-bold text-xl mb-2">✓ Logged In</p>
              </div>
              
              <div className="bg-black/50 p-4 rounded-lg">
                <p className="text-gray-400 mb-2"><span className="font-bold text-white">User ID:</span> {user.id}</p>
                <p className="text-gray-400 mb-2"><span className="font-bold text-white">Email:</span> {user.email}</p>
                <p className="text-gray-400"><span className="font-bold text-white">Created:</span> {new Date(user.created_at).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg">
              <p className="text-yellow-400 font-bold text-xl">⚠ Not Logged In</p>
              <p className="text-gray-400 mt-2">Please sign in to test authentication.</p>
              <a href="/login" className="btn-grunge inline-block mt-4 px-6 py-3 text-white font-black uppercase text-sm">
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
