import { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setVolume } from '../features/player/nowPlayingSlice' // パスは調整

const VolumeControl = ({ volume }) => {
  const dispatch = useDispatch()
  const knobRef = useRef(null)

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value)
    dispatch(setVolume(value))

    const rotation = value * 270 - 135
    if (knobRef.current) {
      knobRef.current.style.transform = `rotate(${rotation}deg)`
    }
  }

  useEffect(() => {
    const rotation = volume * 270 - 135
    if (knobRef.current) {
      knobRef.current.style.transform = `rotate(${rotation}deg)`
    }
  }, [volume])

  return (
    <div className="volume-knob-wrapper">
      <div className="knob-markers"></div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      <div className="volume-knob-image" ref={knobRef}></div>
    </div>
  )
}

export default VolumeControl
