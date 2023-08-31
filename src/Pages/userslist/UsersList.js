import { useState, useEffect } from "react"
import "./UsersList.css"
import { getUsers } from "../../utils"
import { Link } from "react-router-dom"

const UsersList = () => {
  const [userList, setUserList] = useState([" "])
  const [loadingCheck, setloadingCheck] = useState(false)
  useEffect(() => {
    const fetchUserList = async () => {
      let data = await getUsers()
      setUserList(data)
      setloadingCheck(!loadingCheck)
    }
    fetchUserList()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="userlist-container">
      <h1>Users List</h1>
      <ul className="user-list">
        {userList ?
          <>
            {userList.map((username, index) => (
              <li className="user-item" key={index}>{username}</li>
            ))}
          </>
          :
          <>
            {loadingCheck ?
              <Link to="/login-register" className="feature-container">
                <p>To access Users List feature please log in</p>
                <button className="login-button">Login</button>
              </Link>
              :
              <div className="loading-animation">
                <div className="loading-spinner"></div>
              </div>
            }
          </>
        }
      </ul>
    </div>
  )
}

export default UsersList