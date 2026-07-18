import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'

export const Route = createFileRoute('/reserve/confirm')({
  ssr: false,
  component: ReserveConfirmRoute,
})

function ReserveConfirmRoute() {
  usePageTitle(t('reserveConfirm.title'))
  const token = Route.useSearch({ strict: false }).token || ''
  const [state, setState] = useState<{
    status: 'loading' | 'success' | 'error'
    message: string
  }>({
    status: 'loading',
    message: t('reserveConfirm.loadingMessage'),
  })

  useEffect(() => {
    if (!token) {
      setState({
        status: 'error',
        message: t('reserveConfirm.missingToken'),
      })
      return
    }

    fetch('/api/hermeschiworld/reservations/confirm', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.error || 'Confirmation failed')
        }
        setState({
          status: 'success',
          message: t('reserveConfirm.successMessage', {
            name: payload.reservation.desiredName,
          }),
        })
      })
      .catch((error: Error) => {
        setState({
          status: 'error',
          message: error.message,
        })
      })
  }, [token])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#03060a] px-4 text-[#f8f3e7]">
      <div className="w-full max-w-xl rounded-[2rem] border border-[#d9b35f]/24 bg-[#05080e]/88 p-8 shadow-[0_40px_140px_rgba(0,0,0,.52)] backdrop-blur-2xl sm:p-10">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d9b35f]/72">
          {t('reserveConfirm.emailConfirmation')}
        </div>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-[#fff6df]">
          {state.status === 'success'
            ? t('reserveConfirm.successHeading')
            : state.status === 'error'
              ? t('reserveConfirm.errorHeading')
              : t('reserveConfirm.loadingHeading')}
        </h1>
        <p className="mt-4 text-base leading-7 text-[#d7d0bd]/68">{state.message}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/reserve"
            className="inline-flex items-center justify-center rounded-xl border border-[#ffe7a3]/55 bg-[linear-gradient(180deg,#ffe7a3,#d9a63f)] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#11100b] shadow-[0_30px_90px_rgba(217,179,95,.32),inset_0_1px_0_rgba(255,255,255,.32)]"
          >
            {t('reserveConfirm.backToReserve')}
          </a>
          <a
            href="/hermes-world"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#f8e4ac]"
          >
            {t('reserveConfirm.hermesWorldLanding')}
          </a>
        </div>
      </div>
    </main>
  )
}
