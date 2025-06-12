import '../css/loading.css'

const LoadingScreen = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <p style={{ color: 'white', marginTop: '12px' }}>Loading TuneMiner...</p>
    </div>
  )
}

export default LoadingScreen
