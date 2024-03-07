import type { SanitizedConfig } from 'payload/types'

import { auth } from '@payloadcms/next/utilities/auth'
import { translations } from '@payloadcms/translations/client'
import { RootProvider, buildComponentMap } from '@payloadcms/ui'
import '@payloadcms/ui/scss/app.scss'
import { headers as getHeaders } from 'next/headers.js'
import { createClientConfig } from 'payload/config'
import { deepMerge } from 'payload/utilities'
import React from 'react'
import 'react-toastify/dist/ReactToastify.css'

import { getRequestLanguage } from '../../utilities/getRequestLanguage.js'
import { DefaultEditView } from '../../views/Edit/Default/index.js'
import { DefaultListView } from '../../views/List/Default/index.js'
import { DefaultCell } from '../../views/List/Default/Cell/index.js'
import { getPayload } from '../../utilities/getPayload.js'

export const metadata = {
  description: 'Generated by Next.js',
  title: 'Next.js',
}

const rtlLanguages = ['ar', 'fa', 'ha', 'ku', 'ur', 'ps', 'dv', 'ks', 'khw', 'he', 'yi']

export const RootLayout = async ({
  children,
  config: configPromise,
}: {
  children: React.ReactNode
  config: Promise<SanitizedConfig>
}) => {
  const config = await configPromise
  const clientConfig = await createClientConfig(config)

  const headers = getHeaders()

  const payload = await getPayload({ config: configPromise })

  const { cookies, user, permissions } = await auth({
    payload,
    headers,
  })

  const lang =
    getRequestLanguage({
      cookies,
      headers,
    }) ?? clientConfig.i18n.fallbackLanguage

  const dir = rtlLanguages.includes(lang) ? 'RTL' : 'LTR'

  const mergedTranslations = deepMerge(translations, clientConfig.i18n.translations)

  const languageOptions = Object.entries(translations || {}).map(([language, translations]) => ({
    label: translations.general.thisLanguage,
    value: language,
  }))

  const componentMap = buildComponentMap({
    DefaultCell,
    DefaultEditView,
    DefaultListView,
    config,
    permissions: permissions,
  })

  return (
    <html dir={dir} lang={lang}>
      <body>
        <RootProvider
          componentMap={componentMap}
          config={clientConfig}
          fallbackLang={clientConfig.i18n.fallbackLanguage}
          lang={lang}
          languageOptions={languageOptions}
          translations={mergedTranslations[lang]}
        >
          {children}
        </RootProvider>
        <div id="portal" />
      </body>
    </html>
  )
}
