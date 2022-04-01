import Cookies from 'js-cookie'

const getCookies = async (key: string) => {
  let data: any = []
  try {
    data = Cookies.get(key)
    return data
  } catch (error) {
    console.log('Storage Failed:', error)
  }
}

const setCookies = async (key: string, data: any, options = {}) => {
  try {
    Cookies.set(key, data, options)
  } catch (error) {
    console.log('Storage Failed:', error)
  }
}

const removeCookies = async (key: string) => {
  try {
    const removeProgress = Cookies.remove(key)
    return removeProgress
  } catch (error) {
    console.log('Storage Failed:', error)
  }
}

const get = async (key: string) => {
  let data: any = []
  try {
    data = localStorage.getItem(key)
    return data
  } catch (error) {
    console.log('Storage Failed:', error)
  }
}

const set = async (key: string, data: any) => {
  try {
    localStorage.setItem(key, data)
  } catch (error) {
    console.log('Storage Failed:', error)
  }
}

const remove = async (key: string) => {
  try {
    const removeProgress = localStorage.removeItem(key)
    return removeProgress
  } catch (error) {
    console.log('Storage Failed:', error)
  }
}
export {
  getCookies,
  setCookies,
  removeCookies,
  get,
  set,
  remove
}
