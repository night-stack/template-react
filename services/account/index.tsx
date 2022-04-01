import { request } from '../utils/request'

type RequestChangePasswordProps = {
  new_password?: string,
  oldPassword?: string,
  password?: string
}
export const apiChangePassword = async (data: RequestChangePasswordProps) => {
  return request({
    url: '/auth/change-password',
    auth: true,
    data,
    method: 'post'
  })
}


type RequestChangeProfileProps = {
  image?: string|null
  imageRaw?: string|null
  firstName?: string|null
  lastName?: string|null
  username?: string|null
  email?: string|null
}
export const apiUpdateProfile = async (data: RequestChangeProfileProps) => {
  return request({
    url: '/auth/edit-profile',
    auth: true,
    data,
    method: 'put'
  })
}
