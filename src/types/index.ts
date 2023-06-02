export interface Slide {
  id: number
  data: any
  style: { opacity: number }
}

export interface IconStartProps {
  color?: string
}

export interface AppApiResponse {
  status: string
  statusCode: number
  data: any
}

export interface AppApiErrorResponse {
  status: string
  statusCode: number
  message: string
}
