import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentToken, selectCurrentUser, setCredentials } from '../auth/authSlice'
import { useUpdateUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [updateUser] = useUpdateUserMutation()

  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email || '')
  const [pwd, setPwd] = useState('')
  const [bio, setBio] = useState(user.bio || '')
  const [iconFile, setIconFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('bio', bio)
    if (pwd) formData.append('pwd', pwd)
    if (iconFile) formData.append('icon', iconFile)

    try {
      const { user: updatedUser } =await updateUser({ _id: user._id, formData }).unwrap()
      dispatch(setCredentials({ user: updatedUser, accessToken: token }))
      navigate('/dash')
      alert('プロフィールを更新しました！')
    } catch (err) {
      console.error('更新エラー:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <label>Username</label>
      <input style={{ backgroundColor: 'grey' }} value={username} onChange={e => setUsername(e.target.value)} />

      <label>Email</label>
      <input style={{ backgroundColor: 'grey' }} value={email} onChange={e => setEmail(e.target.value)} />

      <label>Password</label>
      <input style={{ backgroundColor: 'grey' }} type="password" value={pwd} onChange={e => setPwd(e.target.value)} />

      <label>Bio</label>
      <textarea style={{ backgroundColor: 'grey' }} value={bio} onChange={e => setBio(e.target.value)} />

      <label>Icon (png/jpeg/webp)</label>
      <input style={{ backgroundColor: 'grey' }} type="file" accept="image/*" onChange={e => setIconFile(e.target.files[0])} />

      <button type="submit">Update</button>
    </form>
  )
}

export default EditProfile
