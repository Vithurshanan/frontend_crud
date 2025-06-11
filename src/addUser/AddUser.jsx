import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SuccessMessage from '../components/SuccessMessage'
import './addUser.css'

const AddUser = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState({
    isOpen: false,
    message: ''
  })

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post('http://localhost:4000/api/user', formData)
      if (response.status === 200) {
        setSuccessMessage({
          isOpen: true,
          message: `User "${formData.name}" added successfully!`
        })
        // Wait for success message to be shown before navigating
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 400) {
          setErrors(prev => ({
            ...prev,
            email: error.response.data.message || 'User already exists'
          }))
          toast.error(error.response.data.message || 'User already exists')
        } else {
          toast.error(error.response.data.errorMessage || 'Failed to add user')
        }
      } else {
        toast.error('Network error. Please check your connection.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-user-container">
      <div className="form-wrapper">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter name"
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="Enter address"
              disabled={isSubmitting}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <SuccessMessage
        isOpen={successMessage.isOpen}
        onClose={() => setSuccessMessage({ isOpen: false, message: '' })}
        message={successMessage.message}
      />
    </div>
  )
}

export default AddUser
