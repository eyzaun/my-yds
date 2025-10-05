'use client'

import { ScriptProps, default as NextScript } from 'next/script'

export default function ClientScript(props: ScriptProps) {
  return <NextScript {...props} />
}
