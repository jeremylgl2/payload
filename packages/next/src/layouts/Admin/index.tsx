import type { SanitizedConfig } from 'payload/types'

import { DefaultTemplate } from '@payloadcms/ui'
import '@payloadcms/ui/scss/app.scss'
import React from 'react'

import { initPage } from '../../utilities/initPage.js'

export const metadata = {
  description: 'Generated by Next.js',
  title: 'Next.js',
}

export const AdminLayout = async ({
  children,
  config,
}: {
  children: React.ReactNode
  config: Promise<SanitizedConfig> | SanitizedConfig
}) => {
  const { permissions, req } = await initPage({ config })

  return (
    <DefaultTemplate config={config} i18n={req.i18n} permissions={permissions} user={req.user}>
      {children}
    </DefaultTemplate>
  )
}
