import React, { useState, useEffect } from 'react'
import "./editUser.css"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import SuccessMessage from '../components/SuccessMessage'

const API_URL = 'https://backend-curd-hazel.vercel.app/api'

const EditUser = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  })
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/${id}`)
        setFormData(response.data)
        setLoading(false)
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error fetching user"
        toast.error(errorMessage)
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`${API_URL}/update/user/${id}`, formData)
      if (response.status === 200) {
        setSuccessMessage('User updated successfully!')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating user"
      toast.error(errorMessage)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className='editUser'>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update User</button>
      </form>

      {successMessage && <SuccessMessage message={successMessage} />}
    </div>
  )
}

export default EditUser 