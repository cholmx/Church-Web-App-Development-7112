import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-custom mb-4">Page Not Found</h2>
        <p className="text-lg text-text-custom mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound