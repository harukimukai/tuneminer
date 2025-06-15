import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentToken, selectCurrentUser, setCredentials } from '../auth/authSlice'
import { useUpdateUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import '../../css/editProfile.css'

const EditProfile = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [updateUser] = useUpdateUserMutation()

  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email || '')
  const [bio, setBio] = useState(user.bio || '')
  const [socials, setSocials] = useState({
    soundcloud: user.socials?.soundcloud || '',
    bandcamp: user.socials?.bandcamp || '',
    youtube: user.socials?.youtube || '',
    instagram: user.socials?.instagram || '',
    x: user.socials?.x || ''
  })
  const [iconFile, setIconFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('bio', bio)
    if (iconFile) formData.append('icon', iconFile)

    // ✅ SNSリンクも追加
    for (const key in socials) {
      if (socials[key]) {
        formData.append(`socials[${key}]`, socials[key])
      }
    }

    try {
      const { user: updatedUser } = await updateUser({ _id: user._id, formData }).unwrap()
      dispatch(setCredentials({ user: updatedUser, accessToken: token }))
      navigate(`/users/${user._id}`)
      alert('Updated your profile!')
    } catch (err) {
      console.error('Update error: ', err)
    }
  }


  const handleSocialChange = (e) => {
    const { name, value } = e.target
    setSocials(prev => ({
      ...prev,
        [name]: value
    }))
  }


  return (
    <form onSubmit={handleSubmit} className='edit-profile-form'>
      <h2>Edit Profile</h2>
      <label>Username</label>
      <input style={{ backgroundColor: 'grey' }} type='text' value={username} onChange={e => setUsername(e.target.value)} />

      <label>Email</label>
      <input style={{ backgroundColor: 'grey' }} type='email' value={email} onChange={e => setEmail(e.target.value)} />

      <label>Icon (png/jpeg/webp)</label>
      <input style={{ backgroundColor: 'grey' }} type="file" accept="image/*" onChange={e => setIconFile(e.target.files[0])} />


      <label>Bio</label>
      <textarea style={{ backgroundColor: 'grey' }} value={bio} onChange={e => setBio(e.target.value)} />
      
      <div className='sns-field'>
        <h2>SNS Links</h2>
        <label>SoundCloud: </label>
        <input 
          type="url"
          name='soundcloud'
          style={{ backgroundColor: 'grey' }}
          value={socials.soundcloud || ''}
          onChange={handleSocialChange}
          placeholder='https://soundcloud.com/yourname'
        />
        <br />

        <label>Bandcamp: </label>
        <input 
          type="url"
          name='bandcamp'
          style={{ backgroundColor: 'grey' }}
          value={socials.bandcamp || ''}
          onChange={handleSocialChange}
          placeholder='https://yourname.bandcamp.com'
        />
        <br />

        <label>YouTube: </label>
        <input 
          type="url"
          name='youtube'
          style={{ backgroundColor: 'grey' }}
          value={socials.youtube || ''}
          onChange={handleSocialChange}
          placeholder='https://youtube.com/@yourname'
        />
        <br />

        <label>Instagram: </label>
        <input
          type="url"
          name="instagram"
          style={{ backgroundColor: 'grey' }}
          value={socials.instagram || ''}
          onChange={handleSocialChange}
          placeholder="https://instagram.com/yourname"
        />
        <br />

        <label>x: </label>
        <input
          type="url"
          name="x"
          style={{ backgroundColor: 'grey' }}
          value={socials.x || ''}
          onChange={handleSocialChange}
          placeholder="https://x.com/yourname"
        />
        <br />
      </div>

      <button type="submit">Update</button>
    </form>
  )
}

export default EditProfile
