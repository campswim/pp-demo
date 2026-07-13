'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Calendar,
  Heart,
  Weight,
  Ruler,
  MapPin,
  MessageSquare,
  UserRound,
  ChevronDown,
} from 'lucide-react'
import { useLoggedIn } from '@/context/loggedIn'
import VeritasHeader from '@/components/demo/veritas-header'
import { capitalize } from '@/lib/utils'

const GOLD = '#b8943a'
const CREAM = '#c8b87a'

const appointments = [
  { doctor: 'Dr. Emily Harrison', specialty: 'Cardiologist' },
  { doctor: 'Dr. Jason Reynolds', specialty: 'Orthopedic Surgeon' },
  { doctor: 'Dr. Sarah Mitchell', specialty: 'Dermatologist' },
]

const messages = [
  { from: 'Dr. Emily Harrison', preview: 'Test results from your recent...', when: '3 days ago' },
  { from: 'Billing Department', preview: 'Reminder: Invoice #485764', when: '5 days ago' },
  { from: 'Dr. Sarah Mitchell', preview: 'Is there a convenient time...', when: '1 week ago', manage: true },
]

export default function HealthCareAccount() {
  const { username } = useLoggedIn()
  const displayName = capitalize(username || 'Patient')
  const [greeting, setGreeting] = useState('Good day')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-repeat bg-center"
      style={{ backgroundImage: 'url(/backgrounds/veritas-login-background.png)' }}
    >
      <VeritasHeader />

      {/* Hero */}
      <div
        className="relative overflow-hidden pt-10 pb-8"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 500px 300px at 95% 0%, rgba(184,148,58,0.25), transparent 60%)',
        }}
      >
        <div className="px-6 md:px-10 max-w-6xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-2"
            style={{ color: '#f2ebda', fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {greeting}, {displayName}
          </h1>
          <p className="text-sm md:text-base" style={{ color: '#9a9aaa' }}>
            Here is your health dashboard at a glance.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-12 max-w-6xl mx-auto">
        {/* Top cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Next appointment */}
          <div className="rounded-2xl overflow-hidden border backdrop-blur-sm" style={{ backgroundColor: 'rgba(23,29,51,0.55)', borderColor: 'rgba(184,148,58,0.25)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(184,148,58,0.2)' }}>
              <h2 className="text-lg font-medium" style={{ color: CREAM, fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Next Appointment
              </h2>
              <ChevronDown size={18} style={{ color: '#6b7280' }} />
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-white mb-1">{appointments[0].doctor}</p>
                <p className="text-sm mb-4" style={{ color: '#9a9aaa' }}>Harley Street Clinic</p>
                <p className="text-sm font-medium" style={{ color: '#e5e5e5' }}>Wednesday, May 15, 2024</p>
                <p className="text-sm mb-4" style={{ color: '#e5e5e5' }}>9:30 AM</p>
                <div className="flex gap-3">
                  <button className="px-4 py-1.5 rounded-md text-sm font-medium" style={{ backgroundColor: GOLD, color: '#1e2340' }}>
                    Confirm
                  </button>
                  <button className="px-4 py-1.5 rounded-md text-sm font-medium border" style={{ borderColor: '#4b5563', color: '#e5e5e5' }}>
                    Reschedule
                  </button>
                </div>
              </div>
              <div className="relative w-36 h-32 shrink-0 rounded-lg overflow-hidden">
                <Image
                  src="/images/veritas-clinic-building.png"
                  alt="Harley Street Clinic"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Medical record */}
          <div className="rounded-2xl overflow-hidden border backdrop-blur-sm" style={{ backgroundColor: 'rgba(23,29,51,0.55)', borderColor: 'rgba(184,148,58,0.25)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(184,148,58,0.2)' }}>
              <h2 className="text-lg font-medium" style={{ color: CREAM, fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Your Medical Record
              </h2>
              <button className="px-3 py-1 rounded-md text-xs font-medium border" style={{ borderColor: '#4b5563', color: '#e5e5e5' }}>
                View Full Records
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs mb-1" style={{ color: '#9a9aaa' }}>Membership Status</p>
              <p className="text-lg font-semibold text-white mb-4">Platinum Member</p>
              <div className="grid grid-cols-2 gap-y-3 text-sm" style={{ color: '#e5e5e5' }}>
                <p className="flex items-center gap-2"><Calendar size={14} style={{ color: GOLD }} /> Jul 12, 1976 (50 years old)</p>
                <p className="flex items-center gap-2"><Heart size={14} style={{ color: GOLD }} /> Blood Type: A+</p>
                <p className="flex items-center gap-2"><Ruler size={14} style={{ color: GOLD }} /> Height: 6&apos;1&quot; (185 cm)</p>
                <p className="flex items-center gap-2"><Weight size={14} style={{ color: GOLD }} /> Weight: 180 lbs</p>
                <p className="flex items-center gap-2 col-span-2"><MapPin size={14} style={{ color: GOLD }} /> Allergies: None</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments + Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden border backdrop-blur-sm" style={{ backgroundColor: 'rgba(23,29,51,0.55)', borderColor: 'rgba(184,148,58,0.25)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(184,148,58,0.2)' }}>
              <h2 className="text-lg font-medium" style={{ color: CREAM, fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Appointments
              </h2>
            </div>
            <div className="divide-y">
              {appointments.map(({ doctor, specialty }) => (
                <div key={doctor} className="flex items-center justify-between px-5 py-4" style={{ borderColor: 'rgba(184,148,58,0.15)' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(184,148,58,0.2)' }}>
                      <UserRound size={18} style={{ color: GOLD }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{doctor}</p>
                      <p className="text-xs" style={{ color: '#9a9aaa' }}>{specialty}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ backgroundColor: GOLD, color: '#1e2340' }}>
                      Confirm
                    </button>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium border" style={{ borderColor: '#4b5563', color: '#e5e5e5' }}>
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border backdrop-blur-sm" style={{ backgroundColor: 'rgba(23,29,51,0.55)', borderColor: 'rgba(184,148,58,0.25)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(184,148,58,0.2)' }}>
              <h2 className="text-lg font-medium" style={{ color: CREAM, fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Messages
              </h2>
              <span className="text-sm hover:underline cursor-pointer" style={{ color: GOLD }}>View All ›</span>
            </div>
            <div className="divide-y">
              {messages.map(({ from, preview, when, manage }) => (
                <div key={from + when} className="flex items-center justify-between px-5 py-4 gap-3" style={{ borderColor: 'rgba(184,148,58,0.15)' }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(184,148,58,0.2)' }}>
                      <MessageSquare size={16} style={{ color: GOLD }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{from}</p>
                      <p className="text-xs truncate" style={{ color: '#9a9aaa' }}>{preview}</p>
                    </div>
                  </div>
                  {manage ? (
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium shrink-0" style={{ backgroundColor: GOLD, color: '#1e2340' }}>
                      Manage
                    </button>
                  ) : (
                    <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>{when}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
