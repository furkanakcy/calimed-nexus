"use client"

import { useEffect } from 'react'

export function KeepAliveProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run in production environment (Render.com)
    if (typeof window === 'undefined' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
      return
    }

    let pingInterval: NodeJS.Timeout
    let lastActivity = Date.now()

    const ping = async () => {
      try {
        // Make a lightweight HEAD request to keep server awake
        await fetch('/', {
          method: 'HEAD',
          cache: 'no-cache'
        })
        console.log('Keep-alive ping sent')
      } catch (error) {
        console.warn('Keep-alive ping failed:', error)
      }
    }

    const updateActivity = () => {
      lastActivity = Date.now()
    }

    // Listen for user activity
    const events = ['mousemove', 'click', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // Start pinging every 10 minutes
    pingInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity
      
      // Only ping if user was active in the last 30 minutes
      if (timeSinceLastActivity < 30 * 60 * 1000) {
        ping()
      }
    }, 10 * 60 * 1000) // 10 minutes

    // Initial ping after 5 minutes
    const initialTimeout = setTimeout(ping, 5 * 60 * 1000)

    // Cleanup
    return () => {
      clearInterval(pingInterval)
      clearTimeout(initialTimeout)
      events.forEach(event => {
        document.removeEventListener(event, updateActivity)
      })
    }
  }, [])

  return <>{children}</>
}