import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children, showNav = true, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-accent">
      {showNav && <Navbar />}
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
