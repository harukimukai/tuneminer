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
      try {
        const res = await refresh().unwrap()
        dispatch(setCredentials(res))
      } catch (err) {
        console.error('[PersistLogin] ❌ refresh failed:', err?.data?.message)
      } finally {
        setRefreshDone(true)
      }
    }

    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      if (!token && persist) {
        verifyRefreshToken()
      } else {
        setRefreshDone(true)
      }
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  if (persist && !token && !refreshDone) {
    return <p>Loading...</p>
  }

  return <Outlet />
}

export default PersistLogin