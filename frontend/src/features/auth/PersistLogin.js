import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken, setCredentials } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const dispatch = useDispatch()
  const effectRan = useRef(false)
  const [refreshDone, setRefreshDone] = useState(false)

  const [refresh, { isLoading }] = useRefreshMutation()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log('[PersistLogin] ⏳ verifying refresh token')
      try {
        const res = await refresh().unwrap()
        console.log('[PersistLogin] ✅ refresh success:', res)
        dispatch(setCredentials(res))
      } catch (err) {
        console.log('[PersistLogin] ❌ refresh failed:', err?.data?.message)
      } finally {
        console.log('[PersistLogin] 🔚 finished refresh attempt')
        setRefreshDone(true)
      }
    }

    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      if (!token && persist) {
        console.log('[PersistLogin] 🔄 token missing & persist=true → try refresh')
        verifyRefreshToken()
      } else {
        console.log('[PersistLogin] ✅ token exists or persist=false → skip refresh')
        setRefreshDone(true)
      }
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  console.log('[PersistLogin] 状態:', { token, persist, refreshDone, isLoading })

  if (persist && !token && !refreshDone) {
    console.log('[PersistLogin] 🔒 waiting for refresh...')
    return <p>Loading...</p>
  }

  console.log('[PersistLogin] 🚪 rendering <Outlet />')
  return <Outlet />
}

export default PersistLogin