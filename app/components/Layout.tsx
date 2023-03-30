import type { FC } from 'react'

export const Layout: FC = ({ children }) => (
  <div className="container max-w-screen-md mx-auto p-4">
    {children}
  </div>
)
