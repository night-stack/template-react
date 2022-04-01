import axios from 'axios'
import getConfig from 'next/config'
import { parseCookies  } from 'nookies'
import https from 'https'
import { TOKEN } from 'constant'
import { getCookies } from './storage'

const { publicRuntimeConfig } = getConfig()
// axios.defaults.httpsAgent = new https.Agent({
//   rejectUnauthorized: true
// })
// At request level
const agent = new https.Agent({  
  rejectUnauthorized: false
});

type Params = {
  fullUrl?: boolean,
  url: string,
  method: 'post'|'get'|'put'|'delete',
  data?: any,
  auth: boolean,
  type?: string,
  requiredToken?: boolean,
  responseHtml?: boolean,
  headers?: any,
  params?: Object,
  context?: any
}

export async function request({
  fullUrl = false,
  url,
  data,
  auth = false,
  requiredToken = false,
  responseHtml = false,
  headers = {
    'Content-Type': 'application/json',
    'Accept-Language': 'en'
  },
  params = {},
  type = 'json',
  method,
  context
}: Params) {
  const useUrl = (fullUrl ? url : `${publicRuntimeConfig.API_URL}${url}`)
  const timeout: number | undefined = Number(publicRuntimeConfig?.REQUEST_TIMEOUT) || 10000
  let token: string
  if (context) {
    token = parseCookies(context)[TOKEN]
  } else {
    token = await getCookies(TOKEN)
  }

  switch (type) {
    case 'json': {
      headers = {
        'Content-Type': 'application/json',
        'Accept-Language': 'en'
      }
      break
    }
    case 'form-data': {
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Language': 'en'
      }
      break
    }
    default:
  }

  if ((!token && auth && !requiredToken) || (typeof token === 'object' && auth && !requiredToken)) {
    return {
      success: false,
      message: 'Unauthenticated'
    }
  }

  if (auth && !!token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: any = {}

  try {
    switch (method) {
      case 'get': {
        response = await axios.get(`${useUrl}`, { timeout, httpsAgent: agent, maxContentLength: 2000, params: { ...data, ...params }, headers })
        break
      }
      case 'post': {
        response = await axios.post(`${useUrl}`, data, { timeout: 30000, httpsAgent: agent, params, headers })
        break
      }
      case 'put': {
        response = await axios.put(`${useUrl}`, data, { timeout: 30000, httpsAgent: agent, headers })
        break
      }
      case 'delete': {
        response = await axios.delete(`${useUrl}`, { timeout, httpsAgent: agent, data, headers })
        break
      }
      default:
    }
    if (responseHtml) {
      return Promise.resolve({
        success: true,
        data: response.data
      })
    }

    return Promise.resolve({
      success: true,
      ...response.data
    })
  } catch (error) {
    const { response } = error
    let msg
    let dat
    let statusCode
    let detailData = ''
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      const { detail } = data
      detailData = detail
      msg = data.message || statusText
      dat = {
        ...data
      } || {}
    } else {
      statusCode = 600
      if (Object.prototype.hasOwnProperty.call(error, 'message')) {
        msg = error.message || 'Request Failed'
      } else {
        msg = error
      }
    }
    return {
      success: false,
      detail: detailData,
      statusCode,
      message: msg,
      data: dat
    }
  }
}