import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen antialiased bg-[#0e0c0b] selection:bg-pink-200 selection:text-black">
      <div className="relative z-10 w-full mx-auto sm:max-w-screen-sm">
        <div className="relative">
          <span className="pointer-events-none absolute top-[-60vw] left-0 right-0 bottom-[-6vw] z-[-1] bg-gradient-to-r from-rose-400/20 via-fuchsia-500/20 to-indigo-500/20 blur-3xl filter sm:top-[-6vw] sm:right-[-7vw] sm:left-[-7vw]"></span>
        </div>
      </div>

      <main className="relative z-10 grid w-full h-auto min-h-screen px-4 pt-16 grid-rows-auto">
        {children}
      </main>
    </div>
  )
}
