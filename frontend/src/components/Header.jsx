import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import SearchForm from '../features/songs/SearchForm'
import LogoutButton from '../features/auth/LogoutButton'
import '../css/header.css'
import NowPlayingBar from './NowPlayingBar'

const Header = () => {
  const currentUser = useSelector(selectCurrentUser)
  console.log(currentUser)

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-left">
          <div className="header-head">
            <Link to="/dash" >
              <img src='http://localhost:3000/logo4.png' id="logo" alt="icon" />
            </Link>
            <Link to="/dash" >
              <h1 id='title'>TuneMiner</h1>
            </Link>
          </div>
          <p className='header-welcome'>Welcome! {currentUser.username}</p>
          <div className="header-links">
              {currentUser && (
                <Link to={`/users/${currentUser._id}`} className="header-button">
                <button>My Page</button>
                </Link>
              )}
              <Link to='/songs/mining' className="header-button">
                <button>Mining</button>
              </Link>
              <Link to="/mining-history" className="header-button">
                <button>Mining History</button>
              </Link>
          </div>
        </div>
        <div className="header-center">
          <p id='search-form'><SearchForm /></p>
          <p id='now-playing-bar'><NowPlayingBar/></p>
        </div>
        <div className="header-right">
          <div className="header-buttons">
            <p>
              <Link to='/upload'>
                <button className="header-button">Upload</button>
              </Link>
            </p>
            <p><LogoutButton/></p>
          </div>
          <div className="header-buttons-below">
            <p>
              <Link to={`/messages/${currentUser._id}`}>
                <button className="header-button">Message</button>
              </Link>
            </p>
            {currentUser.isAdmin === true &&
            <p>
              <Link to='/admin-dash'>
                <button className="header-button">Admin</button>
              </Link>
            </p>}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
