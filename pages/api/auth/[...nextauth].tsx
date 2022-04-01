import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import axios from 'axios'
import https from 'https'

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const providers = [
  Providers.Credentials({
    id: 'login-credential',
    name: 'Login by Token Auth',
    authorize: async (credentials, req) => {
      try {
        console.log('MASUK KE SINI ', credentials)
        console.log('REQ  ', req)
        const res = await axios.post('https://quacodes.com:3000/auth/login', 
        {
          password: credentials.password,
          account: credentials.account
        }, {
          timeout: 30000,
          httpsAgent: agent,
          params: {},
          headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en'}
        })

        console.log('SUCCESS ', credentials)
        if (res) {
          return {status: 'success', data: res}
        } 
        return {
          status: 'error'
        }
        // const user = {
        //   name: 'Muhammad Al-Pandi'
        // }
        // return user
      } catch (error) {
        console.log('ERROR ', error?.response?.data?.message)
        throw new Error(error?.response?.data?.message || 'Login Error')
      }
    },
    credentials: {
      domain: { label: "Domain", type: "text ", placeholder: "CORPNET", value: "CORPNET" },
      account: { label: "Account", type: "text ", placeholder: "jsmith" },
      password: {  label: "Password", type: "password" }
    }
  })
]

const callbacks = {
  // Getting the JWT token from API response
  async jwt(token: any, user: any) {
    if (user) {
      token.accessToken = user.token
    }

    return token
  },

  async session(session: any, token: any) {
    session.accessToken = token.accessToken
    return session
  }
}

interface OptionsProps {
  providers: any[],
  callbacks: any,
  pages?: any
}

const options: OptionsProps = {
  providers,
  callbacks,
  pages: {
    error: '/auth/login' // Changing the error redirect page to our custom login page
  }
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)