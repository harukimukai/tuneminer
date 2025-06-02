import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCurrentToken } from '../features/auth/authSlice'
import '../css/home.css'

const Home = () => {
  const currentToken = useSelector(selectCurrentToken)

  return (
      <div className='home-container'>
        <h1>Welcome to TuneMiner 🎵</h1>
        <p>
          When you follow your BIG DREAM, it feels like you're climbing the mountain all alone.
        </p>
        <p>
          I'm here to help you get found and find artists like you
        </p>
        {!currentToken &&
        (<p><Link to="/login">Login</Link></p>)
        }
      </div>
  )
}

export default Home
