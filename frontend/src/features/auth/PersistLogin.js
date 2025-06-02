import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken, setCredentials } from "./authSlice";

import React from 'react'

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)
    const dispatch = useDispatch()

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    const res = await refresh().unwrap()
                    console.log('refresh response:', res)
                    dispatch(setCredentials(res)) // accessTokenとuserをReduxに保存
                    setTrueSuccess(true)
                } catch (error) {
                    console.error(error)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) { // persist: no
        console.log('No persist')
        content = <Outlet />
    } else if (isLoading) { // persist: yes, token: no
        console.log('Loading')
        content = <p>Loading...</p>
    } else if (isError) { // persist: yes, token: no
        console.log('Error')
        content = (
            <p className="errmsg">
                {`${error?.data?.message} - `}
                <Link to='/login'>Please login again.</Link>
            </p>
        )
    } else if (isSuccess && trueSuccess) { // persist: yes, token: yes
        console.log('Success')
        content = <Outlet />
    } else if (token && isUninitialized) { // persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }
 
    return content
}

export default PersistLogin
