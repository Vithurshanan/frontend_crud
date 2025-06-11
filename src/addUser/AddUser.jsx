import React, { useState } from 'react'
import "./addUser.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SuccessMessage from '../components/SuccessMessage'

const API_URL = 'https://backend-curd-hazel.vercel.app/api'

const AddUser = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  })
  const [successMessage, setSuccessMessage] = useState('')

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
      const response = await axios.post(`${API_URL}/create/user`, formData)
      if (response.status === 201) {
        setSuccessMessage('User added successfully!')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error adding user"
      toast.error(errorMessage)
    }
  }

  return (
    <div className='addUser'>
      <h2>Add User</h2>
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
        <button type="submit" className="btn btn-primary">Add User</button>
      </form>

      {successMessage && <SuccessMessage message={successMessage} />}
    </div>
  )
}

export default AddUser
