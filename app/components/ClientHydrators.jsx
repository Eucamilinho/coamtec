'use client'

import dynamic from 'next/dynamic'

const AnalyticsTracker = dynamic(() => import('./AnalyticsTracker'), { ssr: false, loading: () => null })
const BotonWhatsapp = dynamic(() => import('./BotonWhatsapp'), { ssr: false, loading: () => null })

export default function ClientHydrators() {
  return (
    <>
      <AnalyticsTracker />
      <BotonWhatsapp />
    </>
  )
}
