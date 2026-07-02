const stores = {}

export function rateLimit({ interval = 60000, max = 10 } = {}) {
  return {
    check: (key) => {
      const now = Date.now()
      if (!stores[key]) stores[key] = []
      const window = stores[key].filter(t => now - t < interval)
      if (window.length >= max) return false
      window.push(now)
      stores[key] = window
      return true
    }
  }
}
