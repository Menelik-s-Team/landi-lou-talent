'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

const inputClass = 'w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors'

export default function SettingsPage() {
  const supabase = createClient()

  const [currentPassword, setCurrentPassword]   = useState('')
  const [newPassword, setNewPassword]           = useState('')
  const [confirmPassword, setConfirmPassword]   = useState('')
  const [showCurrent, setShowCurrent]           = useState(false)
  const [showNew, setShowNew]                   = useState(false)
  const [showConfirm, setShowConfirm]           = useState(false)
  const [loading, setLoading]                   = useState(false)
  const [success, setSuccess]                   = useState(false)
  const [error, setError]                       = useState<string | null>(null)

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) { setError('Session expired. Please log in again.'); return }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (signInError) { setError('Current password is incorrect.'); return }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) { setError(updateError.message); return }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Portal</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Settings</h1>
        <p className="text-[#9ba9bb] text-sm mt-1">Manage your account security</p>
      </div>

      {/* Password change */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">
            <Lock size={15} className="text-[#c9a84c]" />
          </div>
          <p className="text-[#f0ead8] font-medium">Change Password</p>
        </div>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                placeholder="Enter current password"
                required
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba9bb] hover:text-[#f0ead8] transition-colors">
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                placeholder="Minimum 8 characters"
                required
              />
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba9bb] hover:text-[#f0ead8] transition-colors">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                placeholder="Repeat new password"
                required
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba9bb] hover:text-[#f0ead8] transition-colors">
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
              <p className="text-green-400 text-sm">Password updated successfully.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm hover:bg-[#e8c97a] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="glass-card rounded-xl p-6">
        <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Account</p>
        <p className="text-[#9ba9bb] text-sm leading-relaxed">
          To update your email address or request account changes, contact your agency at{' '}
          <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">
            info@landiloutalentagency.com
          </a>
        </p>
      </div>
    </div>
  )
}
