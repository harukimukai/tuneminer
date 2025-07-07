import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import SearchForm from '../features/songs/SearchForm'
import LogoutButton from '../features/auth/LogoutButton'
import '../css/header.css'
import NowPlayingBar from './NowPlayingBar'

const Header = () => {
  const currentUser = useSelector(selectCurrentUser)

  // if (!currentUser) {
  //   return (
  //     <header className="header">
  //       <p style={{ color: 'white', padding: '10px' }}>Loading user info...</p>
  //     </header>
  //   )
  // }
  console.log(currentUser)

  return (
    <header className="header">
      <div className="header-background" />
      <nav className="header-nav">
        <div className="header-left">
          <div className="header-head">
            <Link to="/" >
              <img src='http://localhost:3000/logo4.png' id="logo" alt="icon" />
            </Link>
            <Link to="/" >
              <h1 id='title'>TuneMiner</h1>
            </Link>
          </div>
          {currentUser ? 
            <p className='header-welcome'>
              Welcome! {currentUser.username}
            </p>
          : <p className='header-welcome'>Welcome!</p>
          }
          <div className="header-links">
              {currentUser && (
                <Link to={`/users/${currentUser._id}`} className="header-button">
                <button>My Page</button>
                </Link>
              )}
              <Link to='/songs/mining' className="header-button">
                <button>Mining</button>
              </Link>
              {currentUser && 
                <Link to="/mining-history" className="header-button">
                  <button>Mining History</button>
                </Link>
              }
          </div>
        </div>
        <div className="header-center">
          <p id='search-form'><SearchForm /></p>
          <p id='now-playing-bar'><NowPlayingBar/></p>
        </div>
        <div className="header-right">
          {currentUser ?
            (<div className="header-buttons">
              <p>
                <Link to='/upload'>
                  <button className="header-button">Upload</button>
                </Link>
              </p>
              <Link to={'/settings'}>
                <button className="header-button">Settings</button>
              </Link>
              <p><LogoutButton/></p>
            </div>)
          : (
            <div className="header-buttons">
              <Link to={`/login`}>
                <button className="header-button">Login</button>
              </Link>
            </div>
          )}
          {currentUser && 
            <div className="header-buttons-below">
              <p>
                <Link to={`/messages/${currentUser._id}`}>
                  <button className="header-button">Message</button>
                </Link>
              </p>
              <p>
                <Link to='/playlists/create'>
                  <button className="header-button">Playlist</button>
                </Link>
              </p>
              {currentUser.isAdmin === true &&
                <p>
                  <Link to='/admin-dash'>
                    <button className="header-button">Admin</button>
                  </Link>
                </p>
              }
            </div>
          }
        </div>
      </nav>
    </header>
  )
}

export default Header
