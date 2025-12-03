import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="text-gray-500 text-sm py-6 mt-10 border-t border-yellow-700/30 w-full text-center">
          © {new Date().getFullYear()} MoviesFear | All Movie
        </footer>
    </div>
  )
}

export default Footer
