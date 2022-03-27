import cx from 'clsx'
import React from 'react'
import { FOCUS_VISIBLE_OUTLINE } from '../lib'

export default function Quote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cx(
        'block rounded-2xl bg-white/[2%] p-4 shadow-surface-elevation-low transition duration-300 hover:bg-white/[3%] hover:shadow-surface-elevation-medium',
        FOCUS_VISIBLE_OUTLINE
      )}
    >
      {children}
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-medium transition duration-300 text-rose-100/80 hover:text-rose-100/90">
      {children}
    </h3>
  )
}

function Text({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-lg text-gray-400/90 line-clamp-3">
      {children}
    </p>
  )
}

Quote.Title = Title
Quote.Text = Text
