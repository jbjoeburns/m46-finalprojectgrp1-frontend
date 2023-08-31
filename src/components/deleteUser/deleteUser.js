import React from "react"
import { deleteAccount } from "../../utils"
import { useNavigate } from "react-router-dom"
import "./deleteUser.css"

const DeleteAccount = () => {
  const navigate = useNavigate()
  const handleDelete = async () => {
    try {
      await deleteAccount()
      navigate("/login-register")
    } catch (error) {
      console.log("Error deleting account:", error.message)
    }
  }


  return (
    <div className="delete-account-container">
      <h1>Delete Account</h1>
      <p>Are you sure you want to delete your account?</p>
      <button onClick={handleDelete} className="delete-account-button">
        Delete Account
      </button>
    </div>
  )
}

export default DeleteAccount
