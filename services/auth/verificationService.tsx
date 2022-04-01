import { request } from '../utils/request'

const apiSendCode = async (type: 'email'|'phone') => {
  return request({
    url: `/auth/request-verify/${type}`,
    auth: true,
    method: 'post'
  })
}

type RequestVerifiyProps = {
  account: string|any,
  typeCode: 0|1|any, //<- 0: forgot, 1: registration
  typeAccount: 0|1|any, // <- 0: phone, 1: email
  code: string|any
}
const verificationCode = async (data: RequestVerifiyProps) => {
  // console.log('MASUK KE REQUEST ', data)
  return request({
    url: '/auth/verification',
    auth: false,
    data,
    method: 'post'
  })
}

const resendVerificationCode = async (data: any) => {
  return request({
    url: '/auth/resend/verification',
    auth: false,
    data,
    method: 'post'
  })
}

type TypeReqestCode = {
  firebase_token: string|any
}
const apiVerifyPhoneFirebase = async (data: TypeReqestCode) => {
  return request({
    url: '/auth/verif-phone',
    auth: true,
    data,
    method: 'put'
  })
}

export {
  verificationCode,
  resendVerificationCode,
  apiVerifyPhoneFirebase,
  apiSendCode
}
