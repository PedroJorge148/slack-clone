'use client'

import { Toolbar } from "./toolbar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode}) {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  )
}