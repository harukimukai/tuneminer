import { useSelector } from "react-redux"
import { selectCurrentUser } from "../features/auth/authSlice"
import LogoutButton from "../features/auth/LogoutButton"

// components/Sidebar.jsx
const Sidebar = ({ isOpen, onClose }) => {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50`}
    >
      <button onClick={onClose} className="p-4 text-right w-full">
        ✕
      </button>
      <ul className="p-4 space-y-4">
        <li><a href="/dash">Dashboard</a></li>
        {currentUser && 
          <li> 
            <a href={`/users/${currentUser._id}`}>
              My Profile
            </a>
          </li>
        }
        <li><a href="/upload">Upload</a></li>
        <li><LogoutButton/></li>
      </ul>
    </div>
  )
}
  
  export default Sidebar
  