// Keep-alive system to prevent Render.com from sleeping
export class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null
  private isActive = false

  constructor() {
    // Only run in production environment
    if (typeof window !== 'undefined' && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      this.start()
    }
  }

  start() {
    if (this.isActive) return

    this.isActive = true
    
    // Ping every 10 minutes (600,000 ms)
    this.intervalId = setInterval(() => {
      this.ping()
    }, 10 * 60 * 1000)

    // Initial ping after 5 minutes
    setTimeout(() => {
      this.ping()
    }, 5 * 60 * 1000)

    console.log('Keep-alive service started')
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isActive = false
    console.log('Keep-alive service stopped')
  }

  private async ping() {
    try {
      // Make a lightweight request to keep the server awake
      const response = await fetch('/', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      if (response.ok) {
        console.log('Keep-alive ping successful')
      }
    } catch (error) {
      console.warn('Keep-alive ping failed:', error)
    }
  }

  // Check if user is active (mouse movement, clicks, etc.)
  private setupUserActivityDetection() {
    let lastActivity = Date.now()
    
    const updateActivity = () => {
      lastActivity = Date.now()
    }

    // Listen for user activity
    document.addEventListener('mousemove', updateActivity)
    document.addEventListener('click', updateActivity)
    document.addEventListener('keypress', updateActivity)
    document.addEventListener('scroll', updateActivity)

    // Check activity every 5 minutes
    setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity
      
      // If user has been inactive for more than 30 minutes, reduce ping frequency
      if (timeSinceLastActivity > 30 * 60 * 1000) {
        console.log('User inactive, reducing keep-alive frequency')
        this.stop()
        
        // Restart with longer interval (20 minutes)
        this.intervalId = setInterval(() => {
          this.ping()
        }, 20 * 60 * 1000)
      }
    }, 5 * 60 * 1000)
  }
}

// Global instance
export const keepAliveService = new KeepAliveService()