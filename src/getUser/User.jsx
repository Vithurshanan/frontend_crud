import React, { useEffect, useState } from 'react'
import "./user.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DeleteConfirmation from '../components/DeleteConfirmation'

const API_URL = 'https://backend-curd-hazel.vercel.app/api'

const User = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: ''
  })

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`)
      setUsers(response.data)
      setLoading(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching users"
      setError(errorMessage)
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteClick = (user) => {
    setDeleteModal({
      isOpen: true,
      userId: user._id,
      userName: user.name
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`${API_URL}/delete/user/${deleteModal.userId}`)
      if (response.status === 200) {
        toast.success(`User "${deleteModal.userName}" deleted successfully`)
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error deleting user"
      toast.error(errorMessage)
    } finally {
      setDeleteModal({ isOpen: false, userId: null, userName: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: '' })
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className='userTable'>
      <Link to="/add" className='btn btn-primary'>
        Add User   <i className="fa-solid fa-user-plus"></i>
      </Link>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th scope='col'>S.No.</th>
            <th scope='col'>Name</th>
            <th scope='col'>Email</th>
            <th scope='col'>Address</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={user._id}>
                <td data-label="S.No.">{index + 1}</td>
                <td data-label="Name">{user.name}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Address">{user.address}</td>
                <td data-label="Actions" className='actionBtn'>
                  <Link to={`/update/user/${user._id}`} className='btn btn-info'>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <button 
                    type='button' 
                    className='btn btn-danger'
                    onClick={() => handleDeleteClick(user)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        userName={deleteModal.userName}
      />
    </div>
  )
}

export default User
