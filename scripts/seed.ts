import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { generateSlug, calculateReadingTime } from '../lib/utils'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const samplePosts = [
  {
    title: 'The Last Dragon of Silverwood Forest',
    excerpt:
      'A young adventurer discovers the last dragon, hidden deep in the enchanted Silverwood Forest. But protecting this ancient creature comes with a price.',
    content: `# The Last Dragon of Silverwood Forest

The mist hung thick over Silverwood Forest as Aria pushed through the ancient trees. She had heard the legends her entire life—stories of a dragon, the last of its kind, hidden somewhere in these woods.

## The Discovery

After three days of searching, she found it. Not the fearsome beast she had imagined, but a magnificent creature with scales that shimmered like moonlight on water. The dragon regarded her with intelligent, ancient eyes.

"You've come at last," the dragon spoke, its voice like distant thunder. "I've been waiting."

## The Truth

The dragon revealed a secret that would change everything Aria knew about her world. Dragons hadn't disappeared—they had sacrificed themselves to protect the realm from a darkness that was now returning.

## A Choice

Now Aria faced an impossible choice: reveal the dragon's location and risk its life, or keep the secret and face the coming darkness alone.

*To be continued...*`,
    tags: ['fantasy', 'dragons', 'adventure'],
  },
  {
    title: '10 Mind-Bending Sci-Fi Concepts That Could Be Real',
    excerpt:
      'From quantum entanglement to parallel universes, explore scientific theories that sound like science fiction but might actually exist.',
    content: `# 10 Mind-Bending Sci-Fi Concepts That Could Be Real

Science fiction has always inspired real science, but what happens when reality starts catching up?

## 1. Quantum Entanglement

Einstein called it "spooky action at a distance," but quantum entanglement is very real. Particles can be connected across vast distances, instantly affecting each other.

## 2. The Simulation Hypothesis

Some physicists argue that we might be living in a computer simulation. The evidence? The universe seems to follow mathematical laws with surprising precision.

## 3. Time Dilation

Thanks to Einstein's relativity, time travel to the future is actually possible. Astronauts on the ISS age slightly slower than people on Earth.

## 4. Parallel Universes

The many-worlds interpretation of quantum mechanics suggests that every decision creates a branching universe where all possibilities play out.

## 5. Wormholes

General relativity allows for shortcuts through spacetime. While we haven't found one yet, the math checks out.

*And there are 5 more equally fascinating concepts...*`,
    tags: ['science', 'physics', 'list'],
  },
  {
    title: 'The Coffee Shop at the End of Time',
    excerpt:
      'A mysterious coffee shop appears only to those who truly need it. But every visit comes with a question you must answer.',
    content: `# The Coffee Shop at the End of Time

Marcus had walked past the alley a thousand times. But on this particular Tuesday, he noticed the soft amber glow and the small sign: "The Last Cup - Open When You Need Us Most."

## The First Visit

Inside, time seemed... different. Customers sat alone, each lost in thought, steaming cups before them. An elderly woman behind the counter smiled knowingly.

"First time?" she asked. "Then you'll want the House Special. It comes with a question."

## The Question

As Marcus sipped the best coffee he'd ever tasted, a piece of paper appeared under his cup:

*"If you could see one moment from your future, which would you choose?"*

## The Truth About the Coffee Shop

Some say the shop exists between moments, in the spaces where time bends and possibilities split. Others claim it's just a dream. But everyone who's been there agrees on one thing: the coffee is extraordinary, and the questions change your life.`,
    tags: ['fantasy', 'mystery', 'short-story'],
  },
  {
    title: '7 Ancient Libraries Lost to History (And What They Contained)',
    excerpt:
      'Before they were destroyed, these ancient libraries held knowledge that would have transformed our understanding of the ancient world.',
    content: `# 7 Ancient Libraries Lost to History

Throughout history, countless repositories of knowledge have been lost to fire, war, and time. Here are seven that would have changed everything.

## 1. The Library of Alexandria

Perhaps the most famous lost library, Alexandria held an estimated 400,000 scrolls. It wasn't destroyed in one event, but gradually declined over centuries.

**What we lost:** Plays by Sophocles, early scientific texts, and countless works of ancient philosophy.

## 2. The Library of Ashurbanipal

This Mesopotamian library contained over 30,000 clay tablets. While some survived, many were destroyed when Nineveh fell.

## 3. The House of Wisdom

Baghdad's great library was destroyed during the Mongol invasion of 1258. Books were thrown into the Tigris River until the water ran black with ink.

*And four more incredible lost libraries...*`,
    tags: ['history', 'books', 'list'],
  },
  {
    title: 'The Memory Thief',
    excerpt:
      'In a world where memories can be stolen and sold, one thief discovers a memory that no one should possess.',
    content: `# The Memory Thief

Kira specialized in delicate extractions—birthdays, first kisses, moments of triumph. She sold them to the highest bidder, people desperate to own experiences they never had.

## The Heist

The job seemed simple: extract a single memory from Dr. Elena Voss, a neurologist who claimed to have solved consciousness itself. The client offered enough credits to retire forever.

## The Memory

But the memory Kira stole wasn't what she expected. It was a warning. A message. And now everyone who deals in stolen memories is hunting her.

## The Truth

Dr. Voss hadn't solved consciousness—she'd discovered what was controlling it. And they knew Kira had found out.

Now Kira faces an impossible choice: sell the memory and doom humanity, or keep it and face those who will stop at nothing to get it back.`,
    tags: ['sci-fi', 'thriller', 'cyberpunk'],
  },
  {
    title: '5 Writing Prompts That Will Break Your Creative Block',
    excerpt:
      'Stuck in a creative rut? These unconventional writing prompts will kickstart your imagination and get the words flowing again.',
    content: `# 5 Writing Prompts That Will Break Your Creative Block

Every writer faces the blank page eventually. Here are five prompts designed to bypass your internal editor and unlock your creativity.

## 1. The Wrong Genre

Take a classic fairy tale and rewrite it as hard sci-fi, or vice versa. Red Riding Hood in space? Alien first contact as a romance? The genre clash forces fresh perspectives.

## 2. Reverse Engineering

Write the final sentence of a story first. Make it compelling, mysterious, or emotionally powerful. Then figure out the story that leads there.

## 3. The Object Exercise

Pick three random objects. They must all appear in your story, and each must be crucial to the plot. A paperclip, a map, and a broken watch—go!

## 4. Dialogue Only

Write a complete story using only dialogue. No narration, no description. Can you convey setting, character, and plot through conversation alone?

## 5. The Six-Word Story

Hemingway allegedly wrote "For sale: baby shoes, never worn." Can you write a complete story in six words? Try ten variations.`,
    tags: ['writing', 'creativity', 'list'],
  },
]

async function seed() {
  console.log('🌱 Starting seed process...')

  try {
    // Create authors (you'll need to create these users in Supabase Auth first)
    console.log('📝 Creating sample authors...')

    // Create Author 1
    const { data: author1, error: auth1Error } = await supabase.auth.admin.createUser({
      email: 'author1@topcollec.com',
      password: 'password123',
      email_confirm: true,
    })

    if (auth1Error && !auth1Error.message.includes('already exists')) {
      console.error('Error creating author 1:', auth1Error)
      throw auth1Error
    }

    // Create Author 2
    const { data: author2, error: auth2Error } = await supabase.auth.admin.createUser({
      email: 'author2@topcollec.com',
      password: 'password123',
      email_confirm: true,
    })

    if (auth2Error && !auth2Error.message.includes('already exists')) {
      console.error('Error creating author 2:', auth2Error)
      throw auth2Error
    }

    const authorId1 = author1?.user?.id
    const authorId2 = author2?.user?.id

    if (!authorId1 || !authorId2) {
      // Try to fetch existing authors
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingAuthor1 = users?.users.find((u) => u.email === 'author1@topcollec.com')
      const existingAuthor2 = users?.users.find((u) => u.email === 'author2@topcollec.com')

      if (!existingAuthor1 || !existingAuthor2) {
        throw new Error('Could not create or find authors')
      }
    }

    // Insert profiles
    const authors = [
      {
        id: authorId1,
        display_name: 'Elena Storyteller',
        bio: 'Fantasy and sci-fi author with a passion for world-building and character development.',
        role: 'author',
      },
      {
        id: authorId2,
        display_name: 'Marcus Wordsmith',
        bio: 'Curator of lists and collector of fascinating facts from history and science.',
        role: 'author',
      },
    ]

    for (const author of authors) {
      const { error } = await supabase.from('profiles').upsert(author)
      if (error) console.error('Error creating profile:', error)
    }

    console.log('✅ Authors created')

    // Create tags
    console.log('📌 Creating tags...')
    const tagNames = [
      'fantasy',
      'sci-fi',
      'adventure',
      'mystery',
      'short-story',
      'list',
      'history',
      'science',
      'writing',
      'cyberpunk',
      'dragons',
      'thriller',
    ]

    const tagMap: Record<string, string> = {}

    for (const tagName of tagNames) {
      const { data, error } = await supabase
        .from('tags')
        .upsert({ name: tagName, slug: generateSlug(tagName) }, { onConflict: 'slug' })
        .select()
        .single()

      if (error) {
        console.error(`Error creating tag ${tagName}:`, error)
      } else if (data) {
        tagMap[tagName] = data.id
      }
    }

    console.log('✅ Tags created')

    // Create posts
    console.log('📄 Creating posts...')
    let postIndex = 0

    for (const postData of samplePosts) {
      const authorId = postIndex % 2 === 0 ? authorId1 : authorId2
      const publishedAt = new Date(Date.now() - postIndex * 24 * 60 * 60 * 1000) // Stagger publish dates

      const post = {
        author_id: authorId,
        title: postData.title,
        slug: generateSlug(postData.title),
        excerpt: postData.excerpt,
        content: postData.content,
        content_type: 'markdown',
        status: 'published',
        published_at: publishedAt.toISOString(),
        reading_time: calculateReadingTime(postData.content),
      }

      const { data: createdPost, error: postError } = await supabase
        .from('posts')
        .upsert(post, { onConflict: 'slug' })
        .select()
        .single()

      if (postError) {
        console.error(`Error creating post "${postData.title}":`, postError)
        continue
      }

      // Add tags to post
      for (const tagName of postData.tags) {
        const tagId = tagMap[tagName]
        if (tagId && createdPost) {
          await supabase.from('post_tags').upsert(
            {
              post_id: createdPost.id,
              tag_id: tagId,
            },
            { onConflict: 'post_id,tag_id' }
          )
        }
      }

      console.log(`✅ Created post: ${postData.title}`)
      postIndex++
    }

    console.log('\n🎉 Seed completed successfully!')
    console.log('\n📧 Test author credentials:')
    console.log('Email: author1@topcollec.com | Password: password123')
    console.log('Email: author2@topcollec.com | Password: password123')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
