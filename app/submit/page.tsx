'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import TalentFAQSection from '@/components/home/TalentFAQSection'
import { Upload, CheckCircle, Check, AlertCircle, Loader2 } from 'lucide-react'

// ─── File upload types ────────────────────────────────────────────────────────

type FileSlot = 'headshot' | 'commercial_headshot' | 'theatrical_headshot' | 'full_body' | 'resume'

type UploadedFile = {
  path: string
  name: string
  publicUrl: string
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_RESUME_BYTES = 5 * 1024 * 1024

function validateFileClient(file: File, slot: FileSlot): string | null {
  const isResume = slot === 'resume'
  const maxBytes = isResume ? MAX_RESUME_BYTES : MAX_IMAGE_BYTES
  const maxLabel = isResume ? '5MB' : '10MB'
  if (file.size > maxBytes) {
    return `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)}MB — ${isResume ? 'resume' : 'photo'} files must be ${maxLabel} or smaller.`
  }
  if (isResume && file.type !== 'application/pdf') {
    return `${file.name}: Resume must be a PDF file.`
  }
  if (!isResume && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
    return `${file.name}: Photos must be JPG or PNG files.`
  }
  return null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TALENT_CATEGORIES = [
  'Actor', 'Commercial', 'Television', 'Theatre', 'Print', 'Fashion', 'Modeling', 'Lifestyle',
  'Voice Over', 'Singer', 'Dancer', 'Host', 'Influencer',
  'Children & Youth', 'Fitness', 'Specialty Talent',
]

const UNION_STATUSES = ['SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union', 'Other']

const ETHNICITIES = [
  'Black/African American', 'White/Caucasian', 'Hispanic/Latino',
  'Asian/Pacific Islander', 'Middle Eastern', 'Native American', 'Multiracial', 'Other',
]

const AVAILABILITY_OPTIONS = [
  'Local Hire Only', 'Available to Travel', 'Available Nationally', 'Available Internationally',
]

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Professional', 'Extensive Credits']

const STEP_LABELS = [
  'Personal Info',
  'Talent Details',
  'Attributes',
  'Media',
  'Experience',
  'Availability',
  'Review',
]

const SKILLS_GROUPS = [
  {
    group: 'Performance',
    skills: ['Dancing', 'Singing', 'Comedy', 'Improvisation', 'Public Speaking', 'Teleprompter', 'Musical Theater'],
  },
  {
    group: 'Physical',
    skills: ['Firearms', 'Horseback Riding', 'Swimming', 'Scuba', 'Martial Arts', 'Stunts', 'Motorcycle', 'Driving'],
  },
  {
    group: 'Sports',
    skills: [
      'Basketball', 'Football', 'Soccer', 'Baseball', 'Softball', 'Tennis', 'Golf',
      'Track & Field', 'Gymnastics', 'Volleyball', 'Wrestling', 'Hockey', 'Swim Competitively',
      'Boxing', 'Cheerleading', 'Lacrosse', 'Rugby',
    ],
  },
  {
    group: 'Background',
    skills: ['Military Experience', 'Law Enforcement Experience', 'Medical Training'],
  },
]

// ─── Type ─────────────────────────────────────────────────────────────────────

type FormData = {
  // Step 1
  first_name: string
  last_name: string
  stage_name: string
  email: string
  phone: string
  dob: string
  city: string
  state: string
  bio: string
  // Step 2
  representation_type: string
  union_status: string
  talent_categories: string[]
  // Step 3
  gender: string
  height: string
  weight: string
  hair_color: string
  eye_color: string
  ethnicity: string[]
  // Male sizes
  neck_size: string
  sleeve_size: string
  jacket_size: string
  pant_waist: string
  inseam: string
  hat_size: string
  // Female sizes
  shirt_size: string
  pant_size: string
  bust: string
  waist: string
  hip: string
  dress_size: string
  // Shared
  shoe_size: string
  skills: string[]
  languages: string
  dialects: string
  instruments: string
  skin_tone: string
  notable_credits: string
  // Step 4
  demo_reel_url: string
  voice_reel_url: string
  instagram: string
  tiktok: string
  youtube: string
  // Step 5
  experience_categories: string[]
  experience_level: string
  // Step 6
  availability_type: string[]
  has_passport: boolean
  has_drivers_license: boolean
  has_transportation: boolean
  will_travel: boolean
  local_hire_markets: string
  // Step 7 — Consent
  confirmed_accurate: boolean
  accepted_privacy: boolean
  accepted_terms: boolean
  // Guardian (minors only)
  guardian_name: string
  guardian_email: string
  guardian_phone: string
  guardian_relationship: string
  guardian_consent: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'landi_lou_submission_draft'

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [hasDraft, setHasDraft] = useState(false)

  // Submission record (created on first file upload)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  // File states — new File selections (not yet uploaded)
  const [headshot, setHeadshot] = useState<File | null>(null)
  const [commercialHeadshot, setCommercialHeadshot] = useState<File | null>(null)
  const [theatricalHeadshot, setTheatricalHeadshot] = useState<File | null>(null)
  const [fullBody, setFullBody] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  // Already-uploaded files (from previous session or successful upload)
  const [uploadedFiles, setUploadedFiles] = useState<Partial<Record<FileSlot, UploadedFile>>>({})
  // Per-slot client validation errors (shown immediately on file selection)
  const [fileValidErrors, setFileValidErrors] = useState<Partial<Record<FileSlot, string>>>({})
  // Per-slot upload status/errors (shown during and after upload attempt)
  const [uploadStatuses, setUploadStatuses] = useState<Partial<Record<FileSlot, 'uploading' | 'done' | 'error'>>>({})
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<FileSlot, string>>>({})

  const [formData, setFormData] = useState<FormData>({
    first_name: '', last_name: '', stage_name: '', email: '', phone: '',
    dob: '', city: '', state: 'FL', bio: '',
    representation_type: '', union_status: '', talent_categories: [],
    gender: '', height: '', weight: '', hair_color: '', eye_color: '',
    ethnicity: [],
    neck_size: '', sleeve_size: '', jacket_size: '', pant_waist: '', inseam: '', hat_size: '',
    shirt_size: '', pant_size: '', bust: '', waist: '', hip: '', dress_size: '',
    shoe_size: '',
    skills: [], languages: '', dialects: '', instruments: '', skin_tone: '', notable_credits: '',
    demo_reel_url: '', voice_reel_url: '', instagram: '', tiktok: '', youtube: '',
    experience_categories: [], experience_level: '',
    availability_type: [], has_passport: false, has_drivers_license: false,
    has_transportation: false, will_travel: false, local_hire_markets: '',
    confirmed_accurate: false, accepted_privacy: false, accepted_terms: false,
    guardian_name: '', guardian_email: '', guardian_phone: '',
    guardian_relationship: '', guardian_consent: false,
  })

  // ── Draft persistence ──────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const { _submissionId, _uploadedFiles, ...rest } = parsed
        setFormData(prev => ({ ...prev, ...rest }))
        if (_submissionId) setSubmissionId(_submissionId)
        if (_uploadedFiles) setUploadedFiles(_uploadedFiles)
        setHasDraft(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (submitted) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        ...formData,
        _submissionId: submissionId,
        _uploadedFiles: uploadedFiles,
      }))
    } catch {}
  }, [formData, submitted, submissionId, uploadedFiles])

  // ── Helpers ────────────────────────────────────────────────────────────────

  function isMinor(dob: string): boolean {
    if (!dob) return false
    const birth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age < 18
  }

  const inputClass =
    'w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors'
  const labelClass = 'block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2'
  const sectionTitle = 'font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-1'
  const sectionSub = 'text-[#9ba9bb] text-sm mb-5'

  function set(field: keyof FormData, value: unknown) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleText(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    set(e.target.name as keyof FormData, e.target.value)
  }

  function toggleArrayItem(field: keyof FormData, item: string) {
    setFormData(prev => {
      const arr = prev[field] as string[]
      return { ...prev, [field]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] }
    })
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function validateStep(s: number): string[] {
    const errs: string[] = []
    if (s === 1) {
      if (!formData.first_name.trim()) errs.push('First Name is required.')
      if (!formData.last_name.trim()) errs.push('Last Name is required.')
      if (!formData.email.trim()) errs.push('Email is required.')
      if (!formData.dob) errs.push('Date of Birth is required.')
      if (!formData.city.trim()) errs.push('City is required.')
      if (!formData.state.trim()) errs.push('State is required.')
      if (formData.dob && isMinor(formData.dob)) {
        if (!formData.guardian_name.trim()) errs.push('Guardian/Parent Name is required for applicants under 18.')
        if (!formData.guardian_email.trim()) errs.push('Guardian/Parent Email is required for applicants under 18.')
      }
    }
    if (s === 2) {
      if (!formData.representation_type) errs.push('Representation Type is required.')
      if (!formData.union_status) errs.push('Union Status is required.')
      if (formData.talent_categories.length === 0) errs.push('Select at least one Talent Category.')
    }
    if (s === 3) {
      if (!formData.gender) errs.push('Gender is required.')
    }
    if (s === 4) {
      if (!headshot) errs.push('Primary Headshot is required.')
    }
    if (s === 5) {
      if (!formData.experience_level) errs.push('Experience Level is required.')
    }
    if (s === 7) {
      if (!formData.confirmed_accurate) errs.push('Please confirm all information is accurate.')
      if (!formData.accepted_privacy) errs.push('You must accept the Privacy Policy.')
      if (!formData.accepted_terms) errs.push('You must accept the Terms of Use.')
      if (formData.dob && isMinor(formData.dob) && !formData.guardian_consent) {
        errs.push('Guardian/Parent must provide consent for applicants under 18.')
      }
    }
    return errs
  }

  function advance() {
    const errs = validateStep(step)
    if (errs.length > 0) { setErrors(errs); return }
    setErrors([])
    setStep(s => s + 1)
  }

  function back() {
    setErrors([])
    setStep(s => s - 1)
  }

  // ── Build payloads ─────────────────────────────────────────────────────────

  function buildStartPayload() {
    return {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      city: formData.city,
      state: formData.state,
      bio: formData.bio,
      stage_name: formData.stage_name,
      representation_type: formData.representation_type,
      union_status: formData.union_status,
      categories: formData.talent_categories,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      hair_color: formData.hair_color,
      eye_color: formData.eye_color,
      skin_tone: formData.skin_tone,
      ethnicity: formData.ethnicity,
      wardrobe_sizes: {
        neck: formData.neck_size,
        sleeve: formData.sleeve_size,
        jacket: formData.jacket_size,
        pant_waist: formData.pant_waist,
        inseam: formData.inseam,
        hat: formData.hat_size,
        shirt: formData.shirt_size,
        pant: formData.pant_size,
        bust: formData.bust,
        waist: formData.waist,
        hip: formData.hip,
        dress: formData.dress_size,
        shoe: formData.shoe_size,
      },
      shoe_size: formData.shoe_size,
      skills: formData.skills,
      languages: formData.languages,
      dialects: formData.dialects,
      instruments: formData.instruments,
      demo_reel_url: formData.demo_reel_url,
      voice_reel_url: formData.voice_reel_url,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      youtube: formData.youtube,
      guardian_name: formData.guardian_name,
      guardian_email: formData.guardian_email,
      guardian_phone: formData.guardian_phone,
      guardian_relationship: formData.guardian_relationship,
    }
  }

  function buildFinalizePayload() {
    return {
      ...buildStartPayload(),
      categories: formData.talent_categories,
      experience_categories: formData.experience_categories,
      experience_level: formData.experience_level,
      notable_credits: formData.notable_credits,
      availability_type: formData.availability_type,
      has_passport: formData.has_passport,
      has_drivers_license: formData.has_drivers_license,
      has_transportation: formData.has_transportation,
      will_travel: formData.will_travel,
      local_hire_markets: formData.local_hire_markets,
    }
  }

  // ── Step 4: file upload flow ───────────────────────────────────────────────

  async function handleMediaContinue() {
    // Require at least a headshot (new file OR already uploaded)
    const headshotSatisfied = headshot !== null || uploadedFiles.headshot != null
    if (!headshotSatisfied) {
      setErrors(['Primary Headshot is required.'])
      return
    }

    // Client-side validation for all selected files
    const fileSlotPairs: Array<[FileSlot, File | null]> = [
      ['headshot', headshot],
      ['commercial_headshot', commercialHeadshot],
      ['theatrical_headshot', theatricalHeadshot],
      ['full_body', fullBody],
      ['resume', resumeFile],
    ]

    const newValidErrors: Partial<Record<FileSlot, string>> = {}
    for (const [slot, file] of fileSlotPairs) {
      if (file) {
        const err = validateFileClient(file, slot)
        if (err) newValidErrors[slot] = err
      }
    }

    if (Object.keys(newValidErrors).length > 0) {
      setFileValidErrors(newValidErrors)
      return
    }

    setFileValidErrors({})
    setErrors([])
    setLoading(true)

    try {
      // Create submission record if we don't already have one
      let sid = submissionId
      if (!sid) {
        const startRes = await fetch('/api/submissions/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildStartPayload()),
        })
        const startData = await startRes.json()
        if (!startRes.ok) {
          setErrors([startData.error || 'Could not start your application. Please try again.'])
          return
        }
        sid = startData.id as string
        setSubmissionId(sid)
      }

      // Upload each new file
      const nextUploadedFiles = { ...uploadedFiles }
      const newUploadErrors: Partial<Record<FileSlot, string>> = {}

      for (const [slot, file] of fileSlotPairs) {
        if (!file) continue // no new file for this slot

        setUploadStatuses(prev => ({ ...prev, [slot]: 'uploading' }))

        try {
          // Get signed upload URL from server
          const urlRes = await fetch(`/api/submissions/${sid}/upload-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slot, fileName: file.name, fileType: file.type, fileSize: file.size }),
          })
          const urlData = await urlRes.json()
          if (!urlRes.ok) {
            newUploadErrors[slot] = urlData.error || `Could not prepare ${file.name} for upload.`
            setUploadStatuses(prev => ({ ...prev, [slot]: 'error' }))
            continue
          }

          // Upload directly to Supabase Storage (no Vercel proxy, no size limit)
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          const { error: uploadErr } = await supabase.storage
            .from('talent-media')
            .uploadToSignedUrl(urlData.path, urlData.token, file, { contentType: file.type, upsert: true })

          if (uploadErr) {
            newUploadErrors[slot] = `${file.name} failed to upload. Please try again.`
            setUploadStatuses(prev => ({ ...prev, [slot]: 'error' }))
            continue
          }

          // Record confirmed path on the submission
          const fileRes = await fetch(`/api/submissions/${sid}/file`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slot, publicUrl: urlData.publicUrl }),
          })
          if (!fileRes.ok) {
            newUploadErrors[slot] = `${file.name} uploaded but could not be saved. Please retry.`
            setUploadStatuses(prev => ({ ...prev, [slot]: 'error' }))
            continue
          }

          // Success
          nextUploadedFiles[slot] = { path: urlData.path, name: file.name, publicUrl: urlData.publicUrl }
          setUploadStatuses(prev => ({ ...prev, [slot]: 'done' }))

        } catch {
          newUploadErrors[slot] = `${file.name} upload was interrupted. Your other files were saved. Please retry.`
          setUploadStatuses(prev => ({ ...prev, [slot]: 'error' }))
        }
      }

      setUploadedFiles(nextUploadedFiles)

      if (Object.keys(newUploadErrors).length > 0) {
        setUploadErrors(newUploadErrors)
        // Stay on step 4 so the applicant can see which files failed and retry
        return
      }

      // All uploads succeeded — advance
      setUploadErrors({})
      setErrors([])
      setStep(5)

    } finally {
      setLoading(false)
    }
  }

  // ── Final submit ───────────────────────────────────────────────────────────

  async function handleSubmit() {
    const errs = validateStep(7)
    if (errs.length > 0) { setErrors(errs); return }

    if (!submissionId) {
      setErrors(['Your file uploads are missing. Please go back to Step 4 and re-upload your photos.'])
      return
    }

    setErrors([])
    setLoading(true)

    try {
      const res = await fetch(`/api/submissions/${submissionId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildFinalizePayload()),
      })
      if (res.ok) {
        try { localStorage.removeItem(DRAFT_KEY) } catch {}
        setSubmitted(true)
      } else {
        const data = await res.json()
        setErrors([data.error || 'Submission failed. Please try again.'])
      }
    } catch {
      setErrors(['Something went wrong. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  // ── Sub-components ─────────────────────────────────────────────────────────

  function FileUploadBox({
    label,
    required,
    accept,
    slot,
    file,
    uploadedFile,
    uploadStatus,
    uploadError,
    validationError,
    onFile,
    onClearUploaded,
  }: {
    label: string
    required?: boolean
    accept: string
    slot: FileSlot
    file: File | null
    uploadedFile?: UploadedFile | null
    uploadStatus?: 'uploading' | 'done' | 'error'
    uploadError?: string | null
    validationError?: string | null
    onFile: (f: File | null) => void
    onClearUploaded?: () => void
  }) {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [previewError, setPreviewError] = React.useState(false)

    function handleFile(f: File | null) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewError(false)
      if (f && f.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(f))
      } else {
        setPreviewUrl(null)
      }
      // Clear any prior validation error for this slot
      setFileValidErrors(prev => { const n = { ...prev }; delete n[slot]; return n })
      setUploadErrors(prev => { const n = { ...prev }; delete n[slot]; return n })
      onFile(f)
    }

    const hasError = !!(validationError || uploadError)
    const isUploading = uploadStatus === 'uploading'
    const isDone = uploadStatus === 'done'
    // Show "previously uploaded" only when there's a confirmed path AND no new file selected
    const showPrevious = !file && uploadedFile && !hasError

    return (
      <div>
        <label className={labelClass}>
          {label} {required && <span className="text-[#c9a84c]">*</span>}
        </label>

        {/* Validation / upload error */}
        {hasError && (
          <div className="flex items-start gap-2 mb-2 px-3 py-2 rounded bg-red-500/10 border border-red-500/30">
            <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-xs leading-snug">{validationError || uploadError}</p>
          </div>
        )}

        {/* Previously uploaded file from draft */}
        {showPrevious && (
          <div className="flex items-center gap-3 mb-2 px-3 py-2 rounded bg-green-500/10 border border-green-500/20">
            <CheckCircle size={14} className="text-green-400 shrink-0" />
            <span className="text-green-400 text-xs flex-1 truncate">{uploadedFile.name}</span>
            <button
              type="button"
              onClick={onClearUploaded}
              className="text-[#9ba9bb] text-xs hover:text-[#f0ead8] transition-colors whitespace-nowrap"
            >
              Change
            </button>
          </div>
        )}

        {/* Upload dropzone — hidden when previously uploaded and no error */}
        {!showPrevious && (
          <label className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg p-5 cursor-pointer transition-colors ${
            hasError ? 'border-red-500/40 hover:border-red-500/60' :
            isDone ? 'border-green-500/40' :
            'border-[rgba(201,168,76,0.35)] hover:border-[#c9a84c]/70'
          }`}>
            {isUploading ? (
              <Loader2 size={22} className="text-[#c9a84c] animate-spin" />
            ) : isDone ? (
              <CheckCircle size={22} className="text-green-400" />
            ) : previewUrl && !previewError ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-28 h-36 object-cover rounded"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <Upload size={22} className={hasError ? 'text-red-400' : 'text-[#c9a84c]'} />
            )}
            <span className="text-[#9ba9bb] text-sm text-center">
              {isUploading ? 'Uploading…' :
               isDone ? (file?.name ?? 'Uploaded') :
               file ? file.name : 'Click to upload'}
            </span>
            {previewError && !isUploading && (
              <span className="text-red-400 text-xs text-center">
                This file format can&apos;t be previewed and may not display correctly. Use JPG or PNG.
              </span>
            )}
            {file && !previewError && !isUploading && (
              <span className="text-[#c9a84c] text-xs">{(file.size / 1024).toFixed(0)} KB</span>
            )}
            <input
              type="file"
              accept={accept}
              className="hidden"
              disabled={isUploading}
              onChange={e => handleFile(e.target.files?.[0] || null)}
            />
          </label>
        )}
      </div>
    )
  }

  function GoldCheckbox({
    checked,
    onChange,
    label,
    name,
    id: providedId,
  }: {
    checked: boolean
    onChange: (v: boolean) => void
    label: React.ReactNode
    name?: string
    id?: string
  }) {
    const id = providedId ?? `check-${name ?? String(label).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
    return (
      <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          aria-hidden="true"
          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#c9a84c] ${
            checked
              ? 'bg-[#c9a84c] border-[#c9a84c]'
              : 'border-[rgba(201,168,76,0.3)] bg-[#141929] group-hover:border-[#c9a84c]/60'
          }`}
        >
          {checked && <Check size={10} className="text-[#06080f]" strokeWidth={3} />}
        </span>
        <span className="text-[#f0ead8] text-sm">{label}</span>
      </label>
    )
  }

  function GoldRadio({
    checked,
    onChange,
    label,
    name,
  }: {
    checked: boolean
    onChange: () => void
    label: string
    name?: string
  }) {
    const id = `radio-${name ?? 'choice'}-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
    return (
      <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
        <input
          id={id}
          name={name}
          type="radio"
          checked={checked}
          onChange={() => onChange()}
          className="sr-only peer"
        />
        <span
          aria-hidden="true"
          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#c9a84c] ${
            checked
              ? 'border-[#c9a84c]'
              : 'border-[rgba(201,168,76,0.3)] bg-[#141929] group-hover:border-[#c9a84c]/60'
          }`}
        >
          {checked && <div className="w-2 h-2 rounded-full bg-[#c9a84c]" />}
        </span>
        <span className="text-[#f0ead8] text-sm">{label}</span>
      </label>
    )
  }

  function NavButtons({ onContinue, continueLabel }: { onContinue?: () => void; continueLabel?: string }) {
    return (
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 py-3 border border-[rgba(201,168,76,0.2)] text-[#9ba9bb] rounded text-sm hover:text-[#f0ead8] hover:border-[#c9a84c]/40 transition-colors"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onContinue || advance}
          disabled={loading}
          className="flex-1 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-40"
        >
          {loading ? 'Submitting...' : (continueLabel || 'Continue')}
        </button>
      </div>
    )
  }

  function ErrorBanner() {
    if (errors.length === 0) return null
    return (
      <div role="alert" aria-live="polite" className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3">
        {errors.map((e, i) => (
          <p key={i} className="text-red-400 text-sm">{e}</p>
        ))}
      </div>
    )
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <CheckCircle size={56} className="text-[#c9a84c] mx-auto mb-6" />
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8] mb-4">
              Application Received
            </h1>
            <p className="text-[#9ba9bb] leading-relaxed mb-8">
              We review every submission personally. We&apos;ll be in touch if there&apos;s a fit.
            </p>
            <a href="/" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors text-sm">
              Return to Home
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />

      <main id="main-content">
      {/* Header */}
      <section className="pt-40 pb-8 px-6 text-center">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Join the Roster</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl text-[#f0ead8] mb-4">
          Submission
        </h1>
        <p className="text-[#9ba9bb] max-w-xl mx-auto text-sm leading-relaxed">
          We review every submission personally. Complete the form below — we&apos;ll be in touch if there&apos;s a fit.
        </p>
      </section>

      {/* Stepper */}
      <section className="pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, idx) => {
              const s = idx + 1
              const isCompleted = step > s
              const isCurrent = step === s
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all flex-shrink-0 ${
                        isCompleted
                          ? 'bg-[#c9a84c] text-[#06080f]'
                          : isCurrent
                          ? 'bg-[#c9a84c] text-[#06080f] ring-2 ring-[#c9a84c]/30'
                          : 'bg-[#141929] text-[#9ba9bb] border border-[rgba(201,168,76,0.2)]'
                      }`}
                    >
                      {isCompleted ? <Check size={12} strokeWidth={3} /> : s}
                    </div>
                    <span
                      className={`text-[10px] tracking-wide text-center leading-tight ${
                        isCurrent ? 'text-[#c9a84c]' : 'text-[#9ba9bb]'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {s < 7 && (
                    <div
                      className={`flex-1 h-px mx-1 mb-5 transition-all ${
                        step > s ? 'bg-[#c9a84c]' : 'bg-[rgba(201,168,76,0.15)]'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form body */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-5">
              <div>
                <h2 className={sectionTitle}>Personal Information</h2>
                <p className={sectionSub}>Tell us the basics.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className={labelClass}>First Name <span className="text-[#c9a84c]">*</span></label>
                  <input id="first_name" name="first_name" required autoComplete="given-name" value={formData.first_name} onChange={handleText} className={inputClass} placeholder="First" />
                </div>
                <div>
                  <label htmlFor="last_name" className={labelClass}>Last Name <span className="text-[#c9a84c]">*</span></label>
                  <input id="last_name" name="last_name" required autoComplete="family-name" value={formData.last_name} onChange={handleText} className={inputClass} placeholder="Last" />
                </div>
              </div>
              <div>
                <label htmlFor="stage_name" className={labelClass}>Stage Name (if any)</label>
                <input id="stage_name" name="stage_name" autoComplete="nickname" value={formData.stage_name} onChange={handleText} className={inputClass} placeholder="Professional or stage name" />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email <span className="text-[#c9a84c]">*</span></label>
                <input id="email" type="email" name="email" required autoComplete="email" value={formData.email} onChange={handleText} className={inputClass} placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input id="phone" type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleText} className={inputClass} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label htmlFor="dob" className={labelClass}>Date of Birth <span className="text-[#c9a84c]">*</span></label>
                <input id="dob" type="date" name="dob" required autoComplete="bday" value={formData.dob} onChange={handleText} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className={labelClass}>City <span className="text-[#c9a84c]">*</span></label>
                  <input id="city" name="city" required autoComplete="address-level2" value={formData.city} onChange={handleText} className={inputClass} placeholder="City" />
                </div>
                <div>
                  <label htmlFor="state" className={labelClass}>State <span className="text-[#c9a84c]">*</span></label>
                  <input id="state" name="state" required autoComplete="address-level1" value={formData.state} onChange={handleText} className={inputClass} placeholder="FL" />
                </div>
              </div>
              <div>
                <label htmlFor="bio" className={labelClass}>Bio / Tell Us About Yourself</label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleText} rows={4} className={inputClass} placeholder="Brief background, experience, goals..." />
              </div>

              {/* Guardian section — only shows when applicant is under 18 */}
              {formData.dob && isMinor(formData.dob) && (
                <div className="border border-[#c9a84c]/40 rounded-lg p-5 flex flex-col gap-4 bg-[#c9a84c]/5">
                  <div>
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-1">Parent / Guardian Information</p>
                    <p className="text-[#9ba9bb] text-xs leading-relaxed">
                      Applicants under 18 require a parent or legal guardian to provide their information and authorize this submission.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="guardian_name" className={labelClass}>Guardian Full Name <span className="text-[#c9a84c]">*</span></label>
                      <input id="guardian_name" name="guardian_name" autoComplete="name" value={formData.guardian_name} onChange={handleText} className={inputClass} placeholder="Full legal name" />
                    </div>
                    <div>
                      <label htmlFor="guardian_relationship" className={labelClass}>Relationship</label>
                      <select id="guardian_relationship" name="guardian_relationship" value={formData.guardian_relationship} onChange={handleText} className={inputClass}>
                        <option value="">Select</option>
                        {['Parent', 'Legal Guardian', 'Other'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="guardian_email" className={labelClass}>Guardian Email <span className="text-[#c9a84c]">*</span></label>
                    <input id="guardian_email" type="email" name="guardian_email" autoComplete="email" value={formData.guardian_email} onChange={handleText} className={inputClass} placeholder="guardian@email.com" />
                  </div>
                  <div>
                    <label htmlFor="guardian_phone" className={labelClass}>Guardian Phone</label>
                    <input id="guardian_phone" type="tel" name="guardian_phone" autoComplete="tel" value={formData.guardian_phone} onChange={handleText} className={inputClass} placeholder="(555) 000-0000" />
                  </div>
                </div>
              )}

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 2: Talent Details ── */}
          {step === 2 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Talent Details</h2>
                <p className={sectionSub}>Tell us how you work and where you fit.</p>
              </div>

              <div>
                <label className={labelClass}>Representation Type <span className="text-[#c9a84c]">*</span></label>
                <div className="flex gap-5 mt-1">
                  {['Exclusive', 'Non-Exclusive'].map(opt => (
                    <GoldRadio
                      key={opt}
                      checked={formData.representation_type === opt}
                      onChange={() => set('representation_type', opt)}
                      label={opt}
                      name="representation_type"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Union Status <span className="text-[#c9a84c]">*</span></label>
                <div className="flex flex-col gap-3 mt-1">
                  {UNION_STATUSES.map(opt => (
                    <GoldRadio
                      key={opt}
                      checked={formData.union_status === opt}
                      onChange={() => set('union_status', opt)}
                      label={opt}
                      name="union_status"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Talent Categories <span className="text-[#c9a84c]">*</span></label>
                <p className="text-[#9ba9bb] text-xs mb-3">Select all that apply (at least one required).</p>
                <div className="grid grid-cols-2 gap-2">
                  {TALENT_CATEGORIES.map(cat => (
                    <GoldCheckbox
                      key={cat}
                      checked={formData.talent_categories.includes(cat)}
                      onChange={() => toggleArrayItem('talent_categories', cat)}
                      label={cat}
                    />
                  ))}
                </div>
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 3: Attributes & Skills ── */}
          {step === 3 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Attributes & Skills</h2>
                <p className={sectionSub}>Physical attributes and special abilities.</p>
              </div>

              <div>
                <label className={labelClass}>Gender <span className="text-[#c9a84c]">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleText} className={inputClass}>
                  <option value="">Select gender</option>
                  {['Male', 'Female', 'Non-Binary', 'Prefer not to say'].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Height</label>
                  <input name="height" value={formData.height} onChange={handleText} className={inputClass} placeholder="5'10&quot;" />
                </div>
                <div>
                  <label className={labelClass}>Weight</label>
                  <input name="weight" value={formData.weight} onChange={handleText} className={inputClass} placeholder="155 lbs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hair Color</label>
                  <select name="hair_color" value={formData.hair_color} onChange={handleText} className={inputClass}>
                    <option value="">Select</option>
                    {['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Gray', 'White', 'Other'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Eye Color</label>
                  <select name="eye_color" value={formData.eye_color} onChange={handleText} className={inputClass}>
                    <option value="">Select</option>
                    {['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Other'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Ethnicity</label>
                <p className="text-[#9ba9bb] text-xs mb-3">Select all that apply.</p>
                <div className="grid grid-cols-1 gap-2">
                  {ETHNICITIES.map(e => (
                    <GoldCheckbox
                      key={e}
                      checked={formData.ethnicity.includes(e)}
                      onChange={() => toggleArrayItem('ethnicity', e)}
                      label={e}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Skin Tone</label>
                <select name="skin_tone" value={formData.skin_tone} onChange={handleText} className={inputClass}>
                  <option value="">Select</option>
                  {['Very Fair', 'Fair', 'Light', 'Light Medium', 'Medium', 'Medium Tan', 'Tan', 'Deep Tan', 'Brown', 'Dark Brown', 'Deep'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Wardrobe Sizes</label>
                {!formData.gender && (
                  <p className="text-[#9ba9bb] text-xs mb-3">Select your gender above to see the appropriate size fields.</p>
                )}

                {/* Male sizes */}
                {formData.gender === 'Male' && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'neck_size', label: 'Neck', placeholder: 'e.g. 16"' },
                      { name: 'sleeve_size', label: 'Sleeve', placeholder: 'e.g. 34"' },
                      { name: 'jacket_size', label: 'Jacket Size', placeholder: 'e.g. 42R' },
                      { name: 'pant_waist', label: 'Pant Waist', placeholder: 'e.g. 32' },
                      { name: 'inseam', label: 'Inseam', placeholder: 'e.g. 30"' },
                      { name: 'hat_size', label: 'Hat Size', placeholder: 'e.g. 7 1/4' },
                      { name: 'shoe_size', label: 'Shoe Size', placeholder: 'e.g. 10.5' },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className={labelClass}>{label}</label>
                        <input name={name} value={formData[name as keyof FormData] as string} onChange={handleText} className={inputClass} placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Female sizes */}
                {formData.gender === 'Female' && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'dress_size', label: 'Dress Size', placeholder: 'e.g. 6, 8, 10' },
                      { name: 'shirt_size', label: 'Shirt/Blouse Size', placeholder: 'e.g. S, M, L' },
                      { name: 'pant_size', label: 'Pant Size', placeholder: 'e.g. 4, 6, 28' },
                      { name: 'bust', label: 'Bust', placeholder: 'e.g. 36"' },
                      { name: 'waist', label: 'Waist', placeholder: 'e.g. 28"' },
                      { name: 'hip', label: 'Hip', placeholder: 'e.g. 38"' },
                      { name: 'shoe_size', label: 'Shoe Size', placeholder: 'e.g. 8' },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className={labelClass}>{label}</label>
                        <input name={name} value={formData[name as keyof FormData] as string} onChange={handleText} className={inputClass} placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Non-Binary / Prefer not to say — show both */}
                {(formData.gender === 'Non-Binary' || formData.gender === 'Prefer not to say') && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">Men&apos;s Sizes (if applicable)</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'neck_size', label: 'Neck', placeholder: 'e.g. 16"' },
                          { name: 'sleeve_size', label: 'Sleeve', placeholder: 'e.g. 34"' },
                          { name: 'jacket_size', label: 'Jacket Size', placeholder: 'e.g. 42R' },
                          { name: 'pant_waist', label: 'Pant Waist', placeholder: 'e.g. 32' },
                          { name: 'inseam', label: 'Inseam', placeholder: 'e.g. 30"' },
                          { name: 'hat_size', label: 'Hat Size', placeholder: 'e.g. 7 1/4' },
                          { name: 'shoe_size', label: 'Shoe Size', placeholder: 'e.g. 10' },
                        ].map(({ name, label, placeholder }) => (
                          <div key={name}>
                            <label className={labelClass}>{label}</label>
                            <input name={name} value={formData[name as keyof FormData] as string} onChange={handleText} className={inputClass} placeholder={placeholder} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">Women&apos;s Sizes (if applicable)</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'dress_size', label: 'Dress Size', placeholder: 'e.g. 6, 8, 10' },
                          { name: 'shirt_size', label: 'Shirt/Blouse Size', placeholder: 'e.g. S, M, L' },
                          { name: 'pant_size', label: 'Pant Size', placeholder: 'e.g. 4, 6, 28' },
                          { name: 'bust', label: 'Bust', placeholder: 'e.g. 36"' },
                          { name: 'waist', label: 'Waist', placeholder: 'e.g. 28"' },
                          { name: 'hip', label: 'Hip', placeholder: 'e.g. 38"' },
                        ].map(({ name, label, placeholder }) => (
                          <div key={name}>
                            <label className={labelClass}>{label}</label>
                            <input name={name} value={formData[name as keyof FormData] as string} onChange={handleText} className={inputClass} placeholder={placeholder} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Skills</label>
                {SKILLS_GROUPS.map(({ group, skills }) => (
                  <div key={group} className="mb-5">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">{group}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {skills.map(skill => (
                        <GoldCheckbox
                          key={skill}
                          checked={formData.skills.includes(skill)}
                          onChange={() => toggleArrayItem('skills', skill)}
                          label={skill}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mb-4">
                  <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">Languages & More</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className={labelClass}>Languages Spoken</label>
                      <input name="languages" value={formData.languages} onChange={handleText} className={inputClass} placeholder="e.g. Spanish, French, Mandarin" />
                    </div>
                    <div>
                      <label className={labelClass}>Accents / Dialects</label>
                      <input name="dialects" value={formData.dialects} onChange={handleText} className={inputClass} placeholder="e.g. British RP, Southern American, German accent" />
                    </div>
                    <div>
                      <label className={labelClass}>Musical Instruments</label>
                      <input name="instruments" value={formData.instruments} onChange={handleText} className={inputClass} placeholder="e.g. Piano, Guitar, Drums" />
                    </div>
                  </div>
                </div>
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 4: Media ── */}
          {step === 4 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Media</h2>
                <p className={sectionSub}>Upload your photos and share your links. JPG/PNG/WEBP for photos up to 10MB, PDF resume up to 5MB.</p>
                {hasDraft && Object.keys(uploadedFiles).length > 0 && (
                  <p className="mt-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded px-3 py-2">
                    Previously uploaded files have been restored — you do not need to re-upload them.
                  </p>
                )}
                {hasDraft && Object.keys(uploadedFiles).length === 0 && (
                  <p className="mt-2 text-xs text-[#c9a84c] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] rounded px-3 py-2">
                    Your form info was restored from a previous session. Please re-select your photos to upload them.
                  </p>
                )}
              </div>

              <FileUploadBox
                label="Primary Headshot"
                required
                accept="image/jpeg,image/png,image/webp"
                slot="headshot"
                file={headshot}
                uploadedFile={uploadedFiles.headshot}
                uploadStatus={uploadStatuses.headshot}
                uploadError={uploadErrors.headshot}
                validationError={fileValidErrors.headshot}
                onFile={setHeadshot}
                onClearUploaded={() => setUploadedFiles(prev => { const n = { ...prev }; delete n.headshot; return n })}
              />
              <FileUploadBox
                label="Commercial Headshot"
                accept="image/jpeg,image/png,image/webp"
                slot="commercial_headshot"
                file={commercialHeadshot}
                uploadedFile={uploadedFiles.commercial_headshot}
                uploadStatus={uploadStatuses.commercial_headshot}
                uploadError={uploadErrors.commercial_headshot}
                validationError={fileValidErrors.commercial_headshot}
                onFile={setCommercialHeadshot}
                onClearUploaded={() => setUploadedFiles(prev => { const n = { ...prev }; delete n.commercial_headshot; return n })}
              />
              <FileUploadBox
                label="Theatrical Headshot"
                accept="image/jpeg,image/png,image/webp"
                slot="theatrical_headshot"
                file={theatricalHeadshot}
                uploadedFile={uploadedFiles.theatrical_headshot}
                uploadStatus={uploadStatuses.theatrical_headshot}
                uploadError={uploadErrors.theatrical_headshot}
                validationError={fileValidErrors.theatrical_headshot}
                onFile={setTheatricalHeadshot}
                onClearUploaded={() => setUploadedFiles(prev => { const n = { ...prev }; delete n.theatrical_headshot; return n })}
              />
              <FileUploadBox
                label="Full Body Photo"
                accept="image/jpeg,image/png,image/webp"
                slot="full_body"
                file={fullBody}
                uploadedFile={uploadedFiles.full_body}
                uploadStatus={uploadStatuses.full_body}
                uploadError={uploadErrors.full_body}
                validationError={fileValidErrors.full_body}
                onFile={setFullBody}
                onClearUploaded={() => setUploadedFiles(prev => { const n = { ...prev }; delete n.full_body; return n })}
              />
              <FileUploadBox
                label="Resume (PDF)"
                accept=".pdf,application/pdf"
                slot="resume"
                file={resumeFile}
                uploadedFile={uploadedFiles.resume}
                uploadStatus={uploadStatuses.resume}
                uploadError={uploadErrors.resume}
                validationError={fileValidErrors.resume}
                onFile={setResumeFile}
                onClearUploaded={() => setUploadedFiles(prev => { const n = { ...prev }; delete n.resume; return n })}
              />

              <div>
                <label className={labelClass}>Demo Reel URL</label>
                <input name="demo_reel_url" value={formData.demo_reel_url} onChange={handleText} className={inputClass} placeholder="YouTube or Vimeo link" />
              </div>
              <div>
                <label className={labelClass}>Voice Reel URL</label>
                <input name="voice_reel_url" value={formData.voice_reel_url} onChange={handleText} className={inputClass} placeholder="YouTube or SoundCloud link" />
              </div>

              <div>
                <label className={labelClass}>Social Handles</label>
                <div className="flex flex-col gap-3">
                  <input name="instagram" value={formData.instagram} onChange={handleText} className={inputClass} placeholder="@instagram" />
                  <input name="tiktok" value={formData.tiktok} onChange={handleText} className={inputClass} placeholder="@tiktok" />
                  <input name="youtube" value={formData.youtube} onChange={handleText} className={inputClass} placeholder="YouTube channel URL" />
                </div>
              </div>

              <ErrorBanner />
              {/* Upload errors with per-file retry guidance */}
              {Object.keys(uploadErrors).length > 0 && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 flex flex-col gap-1">
                  <p className="text-red-400 text-sm font-medium">Some files failed to upload:</p>
                  {Object.entries(uploadErrors).map(([slot, err]) => (
                    <p key={slot} className="text-red-400 text-xs">{err}</p>
                  ))}
                  <p className="text-[#9ba9bb] text-xs mt-1">Your already-uploaded files are saved. Fix the errors above and click Continue to retry only the failed files.</p>
                </div>
              )}
              <NavButtons onContinue={handleMediaContinue} continueLabel={loading ? 'Uploading…' : 'Continue'} />
            </div>
          )}

          {/* ── Step 5: Experience ── */}
          {step === 5 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Experience</h2>
                <p className={sectionSub}>Where have you worked and what&apos;s your level?</p>
              </div>

              <div>
                <label className={labelClass}>Where Do You Have Experience?</label>
                <p className="text-[#9ba9bb] text-xs mb-3">Select all categories you have active experience in.</p>
                <div className="grid grid-cols-2 gap-2">
                  {TALENT_CATEGORIES.map(cat => (
                    <GoldCheckbox
                      key={cat}
                      checked={formData.experience_categories.includes(cat)}
                      onChange={() => toggleArrayItem('experience_categories', cat)}
                      label={cat}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Experience Level <span className="text-[#c9a84c]">*</span></label>
                <div className="flex flex-col gap-3 mt-1">
                  {EXPERIENCE_LEVELS.map(lvl => (
                    <GoldRadio
                      key={lvl}
                      checked={formData.experience_level === lvl}
                      onChange={() => set('experience_level', lvl)}
                      label={lvl}
                      name="experience_level"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Notable Credits</label>
                <p className="text-[#9ba9bb] text-xs mb-2">List any TV shows, films, commercials, or stage productions you&apos;ve appeared in.</p>
                <textarea
                  name="notable_credits"
                  value={formData.notable_credits}
                  onChange={handleText}
                  rows={4}
                  className={inputClass}
                  placeholder="e.g. Law & Order SVU (2022), Nike Commercial (2023), Hamilton — touring cast (2021)"
                />
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 6: Availability ── */}
          {step === 6 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Availability</h2>
                <p className={sectionSub}>Let us know where and how you can work.</p>
              </div>

              <div>
                <label className={labelClass}>Availability Type</label>
                <div className="flex flex-col gap-3 mt-1">
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <GoldCheckbox
                      key={opt}
                      checked={formData.availability_type.includes(opt)}
                      onChange={() => toggleArrayItem('availability_type', opt)}
                      label={opt}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <GoldCheckbox
                  checked={formData.will_travel}
                  onChange={v => set('will_travel', v)}
                  label="I am willing to travel for work"
                  name="will_travel"
                />
                <GoldCheckbox
                  checked={formData.has_passport}
                  onChange={v => set('has_passport', v)}
                  label="I have a valid passport"
                  name="has_passport"
                />
                <GoldCheckbox
                  checked={formData.has_drivers_license}
                  onChange={v => set('has_drivers_license', v)}
                  label="I have a valid driver's license"
                  name="has_drivers_license"
                />
                <GoldCheckbox
                  checked={formData.has_transportation}
                  onChange={v => set('has_transportation', v)}
                  label="I have reliable transportation"
                  name="has_transportation"
                />
              </div>

              <div>
                <label className={labelClass}>Local Hire Markets</label>
                <input
                  name="local_hire_markets"
                  value={formData.local_hire_markets}
                  onChange={handleText}
                  className={inputClass}
                  placeholder="e.g. Orlando, Tampa, Jacksonville (comma-separated)"
                />
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 7: Review ── */}
          {step === 7 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Review Your Application</h2>
                <p className={sectionSub}>Look everything over before submitting.</p>
              </div>

              {/* Review sections */}
              {[
                {
                  title: 'Personal Info',
                  rows: [
                    ['Name', `${formData.first_name} ${formData.last_name}${formData.stage_name ? ` (${formData.stage_name})` : ''}`],
                    ['Email', formData.email],
                    ['Phone', formData.phone || '—'],
                    ['Date of Birth', formData.dob || '—'],
                    ['Location', `${formData.city}, ${formData.state}`],
                    ['Bio', formData.bio || '—'],
                  ],
                },
                {
                  title: 'Talent Details',
                  rows: [
                    ['Representation', formData.representation_type || '—'],
                    ['Union Status', formData.union_status || '—'],
                    ['Categories', formData.talent_categories.join(', ') || '—'],
                  ],
                },
                {
                  title: 'Attributes & Skills',
                  rows: [
                    ['Gender', formData.gender || '—'],
                    ['Height / Weight', `${formData.height || '—'} / ${formData.weight || '—'}`],
                    ['Hair / Eyes', `${formData.hair_color || '—'} / ${formData.eye_color || '—'}`],
                    ['Ethnicity', formData.ethnicity.join(', ') || '—'],
                    ['Wardrobe', [
                      formData.neck_size && `Neck: ${formData.neck_size}`,
                      formData.sleeve_size && `Sleeve: ${formData.sleeve_size}`,
                      formData.jacket_size && `Jacket: ${formData.jacket_size}`,
                      formData.pant_waist && `Pant Waist: ${formData.pant_waist}`,
                      formData.inseam && `Inseam: ${formData.inseam}`,
                      formData.hat_size && `Hat: ${formData.hat_size}`,
                      formData.dress_size && `Dress: ${formData.dress_size}`,
                      formData.shirt_size && `Shirt: ${formData.shirt_size}`,
                      formData.pant_size && `Pant: ${formData.pant_size}`,
                      formData.bust && `Bust: ${formData.bust}`,
                      formData.waist && `Waist: ${formData.waist}`,
                      formData.hip && `Hip: ${formData.hip}`,
                      formData.shoe_size && `Shoe: ${formData.shoe_size}`,
                    ].filter(Boolean).join(', ') || '—'],
                    ['Skin Tone', formData.skin_tone || '—'],
                    ['Skills', formData.skills.join(', ') || '—'],
                    ['Languages', formData.languages || '—'],
                    ['Accents / Dialects', formData.dialects || '—'],
                    ['Instruments', formData.instruments || '—'],
                  ],
                },
                {
                  title: 'Media',
                  rows: [
                    ['Primary Headshot', headshot?.name || '—'],
                    ['Commercial Headshot', commercialHeadshot?.name || '—'],
                    ['Theatrical Headshot', theatricalHeadshot?.name || '—'],
                    ['Full Body', fullBody?.name || '—'],
                    ['Resume', resumeFile?.name || '—'],
                    ['Demo Reel', formData.demo_reel_url || '—'],
                    ['Voice Reel', formData.voice_reel_url || '—'],
                    ['Instagram', formData.instagram || '—'],
                    ['TikTok', formData.tiktok || '—'],
                    ['YouTube', formData.youtube || '—'],
                  ],
                },
                {
                  title: 'Experience',
                  rows: [
                    ['Experience Categories', formData.experience_categories.join(', ') || '—'],
                    ['Experience Level', formData.experience_level || '—'],
                    ['Notable Credits', formData.notable_credits || '—'],
                  ],
                },
                {
                  title: 'Availability',
                  rows: [
                    ['Availability', formData.availability_type.join(', ') || '—'],
                    ['Passport', formData.has_passport ? 'Yes' : 'No'],
                    ["Driver's License", formData.has_drivers_license ? 'Yes' : 'No'],
                    ['Transportation', formData.has_transportation ? 'Yes' : 'No'],
                    ['Local Markets', formData.local_hire_markets || '—'],
                  ],
                },
              ].map(section => (
                <div key={section.title} className="border border-[rgba(201,168,76,0.15)] rounded-lg overflow-hidden">
                  <div className="bg-[rgba(201,168,76,0.06)] px-5 py-3 border-b border-[rgba(201,168,76,0.15)]">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase">{section.title}</p>
                  </div>
                  <div className="divide-y divide-[rgba(201,168,76,0.08)]">
                    {section.rows.map(([key, val]) => (
                      <div key={key} className="flex px-5 py-3 gap-4">
                        <span className="text-[#9ba9bb] text-xs w-36 flex-shrink-0 pt-0.5">{key}</span>
                        <span className="text-[#f0ead8] text-sm break-words flex-1">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border border-[#c9a84c]/30 rounded-lg p-5 flex flex-col gap-4">
                <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold">Acknowledgements</p>

                <GoldCheckbox
                  checked={formData.confirmed_accurate}
                  onChange={v => set('confirmed_accurate', v)}
                  name="confirmed_accurate"
                  label="I confirm all information provided is accurate and complete."
                />

                <GoldCheckbox
                  checked={formData.accepted_privacy}
                  onChange={v => set('accepted_privacy', v)}
                  name="accepted_privacy"
                  label={
                    <span>
                      I have read and agree to the{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] underline hover:text-[#e8c97a]">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  }
                />

                <GoldCheckbox
                  checked={formData.accepted_terms}
                  onChange={v => set('accepted_terms', v)}
                  name="accepted_terms"
                  label={
                    <span>
                      I have read and agree to the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] underline hover:text-[#e8c97a]">
                        Terms of Use
                      </a>
                      .
                    </span>
                  }
                />

                {/* Guardian consent — only shown for minors */}
                {formData.dob && isMinor(formData.dob) && (
                  <div className="mt-2 pt-4 border-t border-[rgba(201,168,76,0.2)] flex flex-col gap-3">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold">Guardian Consent</p>
                    <p className="text-[#9ba9bb] text-xs leading-relaxed">
                      As the parent or legal guardian of {formData.first_name || 'this applicant'}, I authorize the submission of this talent profile to Landi-Lou Talent Agency and consent to the collection and use of the information provided.
                    </p>
                    <GoldCheckbox
                      checked={formData.guardian_consent}
                      onChange={v => set('guardian_consent', v)}
                      label={`I, ${formData.guardian_name || 'the guardian'}, authorize and consent to this submission on behalf of the minor applicant.`}
                      name="guardian_consent"
                    />
                  </div>
                )}
              </div>

              <ErrorBanner />

              {(() => {
                const allAcknowledged =
                  formData.confirmed_accurate &&
                  formData.accepted_privacy &&
                  formData.accepted_terms &&
                  (!formData.dob || !isMinor(formData.dob) || formData.guardian_consent)
                return (
                  <div className="flex flex-col gap-3">
                    {!allAcknowledged && (
                      <p className="text-[#9ba9bb] text-xs text-center">Please check all boxes above to submit.</p>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={back}
                        className="flex-1 py-3 border border-[rgba(201,168,76,0.2)] text-[#9ba9bb] rounded text-sm hover:text-[#f0ead8] hover:border-[#c9a84c]/40 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !allAcknowledged}
                        className="flex-1 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

        </div>
      </section>
      </main>

      <TalentFAQSection />
      <Footer />
    </>
  )
}
