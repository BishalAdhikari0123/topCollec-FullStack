'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password || !name) {
    redirect('/signup?error=All fields are required')
  }

  if (password.length < 6) {
    redirect('/signup?error=Password must be at least 6 characters')
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (signUpError) {
    redirect(`/signup?error=${encodeURIComponent(signUpError.message)}`)
  }

  if (!authData.user) {
    redirect('/signup?error=Failed to create user')
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles' as any)
    .insert({
      id: authData.user.id,
      display_name: name,
      bio: null,
      avatar_url: null,
      is_admin: false,
    })

  if (profileError) {
    console.error('Profile creation error:', profileError)
    // Don't fail the signup if profile creation fails - user can still login
  }

  revalidatePath('/', 'layout')
  redirect('/login?signup=success')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=Email and password are required')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles' as any)
    .select('is_admin')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')
  
  if (profile?.is_admin) {
    redirect('/admin')
  } else {
    redirect('/')
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
