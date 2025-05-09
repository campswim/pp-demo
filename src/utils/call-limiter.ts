// Cache to store the last call time for each user.
const userCallCache = new Map<string, number>()

// Time-to-live for the call cache (30 seconds).
const CALL_TTL_MS = 30 * 1000 // 30 seconds

// Check if the user can initiate a call.
export function canInitiateCall(userId: string): boolean {
  const lastCallTime = userCallCache.get(userId)
  const now = Date.now()

  if (lastCallTime && now - lastCallTime < CALL_TTL_MS) {
    return false
  }

  userCallCache.set(userId, now)
  return true
}

// Clear the call cache for a specific user.
export function clearCallCacheForUser(userId: string): void {
  userCallCache.delete(userId)
}
