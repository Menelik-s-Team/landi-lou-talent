import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Casting Directors | Admin' }

export default async function CastingDirectorsPage() {
  const supabase = createAdminClient()

  const { data: directors } = await supabase
    .from('casting_directors')
    .select('*, profiles(email, full_name, created_at)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Network</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Casting Directors</h1>
        <p className="text-[#7a869a] text-sm mt-2">
          Casting directors gain access through a login you create manually. Send them to{' '}
          <span className="text-[#c9a84c]">landiloutalentagency.com/login</span> once their account is set up.
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {directors && directors.length > 0 ? (
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {directors.map(d => (
              <div key={d.id} className="px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-[#f0ead8] text-sm font-medium">{d.profiles?.full_name || d.email}</p>
                  <p className="text-[#7a869a] text-xs mt-0.5">{d.company || 'No company listed'} {d.title ? `· ${d.title}` : ''}</p>
                  <p className="text-[#7a869a] text-xs">{d.email}</p>
                </div>
                <div className="text-xs text-[#7a869a]">
                  Added {new Date(d.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-[#7a869a] text-sm mb-2">No casting directors yet.</p>
            <p className="text-[#7a869a] text-xs max-w-sm mx-auto">
              To add a casting director, create their account in Supabase Auth, set their role to{' '}
              <code className="text-[#c9a84c]">casting_director</code>, and add a row to the{' '}
              <code className="text-[#c9a84c]">casting_directors</code> table.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
