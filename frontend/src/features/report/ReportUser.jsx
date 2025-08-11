import { useState } from 'react'
import { useCreateReportUserMutation } from './reportApiSlice'
import { useNavigate, useParams } from 'react-router-dom'

const ReportUser = () => {
  const [ createReportUser, {isLoading} ] = useCreateReportUserMutation()
  const [content, setContent] = useState('')
  const {userId} = useParams()
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()

    try {
      await createReportUser({
        userId,
        data: {content} 
      }).unwrap()

      alert('Report submitted successfully')
      setContent('')
      navigate(-1)
    } catch (error) {
      console.error(error)
      alert('Failed to report user')
    }
  }

  return (
    <div>
      <h2>Report User</h2>
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


export default ReportUser