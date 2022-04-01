import {memo} from 'react'
import type { AppProps } from 'next/app'
import { AppStoreProvider, SessionProvider } from 'providers'
import { useRouter } from 'next/dist/client/router'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import {ToastContainer} from 'components/Alert/Toast'
import { Provider as ReduxProvider } from 'react-redux'
import store from 'redux/store'
import '../styles/globals.css'

const MemoizedToastContaineer = memo(ToastContainer)

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const {asPath} = useRouter()
  const getLayout = Component.getLayout ?? ((page) => page)

  return (

    <ReduxProvider store={store}>
      <SessionProvider.Provider value={{
        session: {
          user: pageProps?.session?.user,
          token: pageProps?.session?.token
        }
      }}>
        <AppStoreProvider>
          <>
            {
              getLayout(
                <>
                  <Component {...pageProps} key={asPath}/>
                  <MemoizedToastContaineer />
                </>
              )
            }
          </>
        </AppStoreProvider>
      </SessionProvider.Provider>
    </ReduxProvider>
  )
}

export default MyApp
