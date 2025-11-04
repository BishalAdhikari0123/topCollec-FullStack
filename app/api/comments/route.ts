import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { postId, body, authorName, authorEmail } = await request.json()

    if (!postId || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          body,
          author_name: user ? null : authorName,
          author_email: user ? null : authorEmail,
          author_id: user?.id || null,
          is_approved: false,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
