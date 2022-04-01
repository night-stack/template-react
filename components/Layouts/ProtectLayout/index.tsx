import Header from'./Header'
// import Footer from './Footer'
import { FC } from 'react'
import styles from './layout.module.css'

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles?.main}>{children}</main>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
