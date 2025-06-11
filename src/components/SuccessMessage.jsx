import React, { useEffect } from 'react'
import './SuccessMessage.css'

const SuccessMessage = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000) // Auto close after 2 seconds

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="success-overlay">
      <div className="success-content">
        <div className="success-icon">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <p className="success-message">{message}</p>
      </div>
    </div>
  )
}

export default SuccessMessage 