import { useState } from 'react'
import { useCreateReportSongMutation } from './reportApiSlice'
import { useNavigate, useParams } from 'react-router-dom'

const ReportSong = () => {
  const [ createReportSong, {isLoading} ] = useCreateReportSongMutation()
  const [content, setContent] = useState('')
  const {songId} = useParams()
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()

    try {

      await createReportSong({
        songId,
        data: {content} 
      }).unwrap()

      alert('Report submitted successfully')
      setContent('')
      navigate(-1)
    } catch (error) {
      console.error(error)
      alert('Failed to report song')
    }
  }

  return (
    <div>
      <h2>Report Song</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={isLoading} className='upload-btn'>
          {isLoading ? 'Reporting...' : 'Report'}
        </button>
      </form>
    </div>
  )
}


export default ReportSong