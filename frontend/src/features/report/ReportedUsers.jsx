import React from 'react'
import { useGetUserReportsQuery } from './reportApiSlice'
import { useNavigate } from 'react-router-dom'

const ReportedUsers = () => {
  const {data: reportedUsers = [] } = useGetUserReportsQuery()
  const navigate = useNavigate()

  const handleOpenUserPage = (id) => {
    navigate(`/users/${id}`)
  }

  return (
    <div>
      {!reportedUsers?.length ? (
        <p>No Reported Users</p>
      ) : (
        <ul>
          {reportedUsers?.map((reportedUser) => (
            <div>
              <button onClick={handleOpenUserPage(reportedUser.reportedUser._id)}>Reported User: {reportedUser.reportedUser.username}</button>
              <p>Reporter: {reportedUser.reporter.username}</p>
              <p>Content: {reportedUser.content}</p>
            </div>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReportedUsers