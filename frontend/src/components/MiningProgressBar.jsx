import { useEffect, useRef } from "react"

const MiningProgressBar = ({ audioRef, highlight }) => {
    const progressBarRef = useRef(null)
    const progressRef = useRef(null)
    const rafIdRef = useRef(null)

    const { start, end } = highlight
    const duration = end - start

    const updateProgress = () => {
        if (audioRef.current && !audioRef.current.paused) {
            const currentTime = audioRef.current.currentTime
            const progress = ((currentTime - start) / duration) * 100
            if (progressRef.current) {
                progressRef.current.style.width = `${Math.max(0, Math.min(progress, 100))}%`
            }
        }
        rafIdRef.current = requestAnimationFrame(updateProgress)
    }

    useEffect(() => {
        rafIdRef.current = requestAnimationFrame(updateProgress)
        return () => cancelAnimationFrame(rafIdRef.current)
    }, [highlight])

    const handleSeek = (e) => {
        if (!audioRef.current || !duration) return

        const rect = progressBarRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percent = Math.min(Math.max(clickX / rect.width, 0), 1)
        const newTime = start + percent * duration

        audioRef.current.currentTime = newTime
    }

    return (
        <div
        ref={progressBarRef}
        onClick={handleSeek}
        style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#ccc',
            borderRadius: '5px',
            overflow: 'hidden',
            marginTop: '10px',
            position: 'relative',
            cursor: 'pointer'
        }}
        >
        <div
            ref={progressRef}
            style={{
            height: '100%',
            backgroundColor: '#f43f5e',
            width: '0%',
            transition: 'none', // ← ここ重要（requestAnimationFrameと競合させない）
            }}
        />
        </div>
    )
}

export default MiningProgressBar