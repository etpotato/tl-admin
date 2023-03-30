import type { FC } from 'react'

const Layout: FC = ({ children }) => (
  <div className="container max-w-screen-md mx-auto px-4">
    {children}
  </div>
)

export default Layout