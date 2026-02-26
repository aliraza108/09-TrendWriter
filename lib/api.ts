const API = process.env.NEXT_PUBLIC_API_URL

type ApiOptions = RequestInit & { noJson?: boolean }

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!API) throw new Error('Missing NEXT_PUBLIC_API_URL')

  const { noJson, ...rest } = options
  const response = await fetch(`${API}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed (${response.status})`)
  }

  if (noJson) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  createUser: (data: unknown) => request('/users/', { method: 'POST', body: JSON.stringify(data) }),
  getUser: (id: string) => request(`/users/${id}`),
  updateUser: (id: string, data: unknown) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  generateContent: (data: unknown) => request('/content/generate', { method: 'POST', body: JSON.stringify(data) }),
  generateVariants: (data: unknown) => request('/content/variants', { method: 'POST', body: JSON.stringify(data) }),
  getUserPosts: (userId: string) => request(`/content/user/${userId}`),

  schedulePost: (data: unknown) => request('/schedule/post', { method: 'POST', body: JSON.stringify(data) }),
  getCalendar: (userId: string) => request(`/schedule/calendar?user_id=${userId}`),
  updateSchedule: (postId: string, data: unknown) => request(`/schedule/update/${postId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  publishPost: (data: unknown) => request('/publish/', { method: 'POST', body: JSON.stringify(data) }),
  getPublishStatus: (postId: string) => request(`/publish/status/${postId}`),

  getPostMetrics: (postId: string) => request(`/analytics/post/${postId}`),
  getEngagement: (userId: string, days = 30) => request(`/analytics/engagement/${userId}?days=${days}`),
  getGrowth: (userId: string) => request(`/analytics/growth/${userId}`),

  getStrategy: (userId: string) => request(`/strategy/recommendations/${userId}`),
  updateStrategy: (data: unknown) => request('/strategy/update', { method: 'POST', body: JSON.stringify(data) }),
}