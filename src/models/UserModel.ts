export type UserRoles = 'user' | 'reviewer-basic' | 'reviewer-plus' | 'admin'

export interface UserModel {
  _id: string
  name: string
  email: string
  photo: string
  role: UserRoles
  active: boolean
  slug: string
  youTubeChannelId: string
  createdAt: number
}
