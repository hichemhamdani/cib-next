'use client'

import { useState } from 'react'

interface Props {
  orderId: string
  defaultEmail: string
}

export default function SendInvoiceEmail({ orderId, defaultEmail }: Props) {
  const [email, setEmail] = useState(defaultEmail)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSend() {
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/invoice/${orderId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Erreur lors de l\'envoi.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Erreur de connexion.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-green-700 text-sm font-medium flex items-center gap-1.5">
        <span>✅</span> Facture envoyée à <strong>{email}</strong>
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemple.com"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSend}
          disabled={status === 'loading'}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Envoi...
            </>
          ) : (
            <>📧 Envoyer</>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-xs">{errorMsg}</p>
      )}
    </div>
  )
}
