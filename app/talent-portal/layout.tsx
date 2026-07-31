import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import TalentSidebar from './TalentSidebar'

export default async function TalentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminClient = createAdminClient()

  const { data: roleProfile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (roleProfile?.role !== 'talent') redirect('/login')

  const { data: talentProfile } = await adminClient
    .from('talent_profiles')
    .select('first_name, last_name, headshot_url, categories')
    .eq('user_id', user.id)
    .single()

  const firstName = talentProfile?.first_name ?? ''
  const lastName = talentProfile?.last_name ?? ''
  const category = (talentProfile?.categories as string[] | null)?.[0] ?? ''
  const headshotUrl = talentProfile?.headshot_url ?? null

  return (
    <div className="min-h-screen bg-[#06080f] flex">
      <TalentSidebar
        firstName={firstName}
        lastName={lastName}
        category={category}
        headshotUrl={headshotUrl}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  )
}
