import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
 
})

/**
 * @template T
 * @param {import('axios').AxiosRequestConfig} config
 * @returns {Promise<T>}
 */
export async function apiRequest(config) {
  try {
    const response = await apiClient(config)
    const body = response.data

    if (body?.success === false) {
      throw new Error(body.message || 'Request failed')
    }

    return body
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Request failed'
    throw new Error(message)
  }
}

/** @param {{ data?: unknown }} body */
export function unwrapData(body) {
  return body.data
}
