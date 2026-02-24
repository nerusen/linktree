// Generate a client-side identifier based on browser fingerprint
export async function getClientIdentifier(): Promise<string> {
  const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(fingerprint)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
