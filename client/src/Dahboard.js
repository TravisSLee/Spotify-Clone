import React from 'react'
import useAuth from './useAuth'

export default function Dahboard({ code }) {
    const accessToken = useAuth(code)
    return (
        <div>
            { code }
        </div>
    )
}

