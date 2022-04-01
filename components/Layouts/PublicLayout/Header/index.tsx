import {memo} from 'react'
import Link from 'next/link'
import {useSessionContext} from 'providers'
import styles from './Header.module.css'

const Header = () => {
  const {session} = useSessionContext()
  return (
    <header className={styles.container}>
      <div>
        <Link href="/">
          <a>Next Auth</a>
        </Link>
      </div>
      <div>Header</div>
      <div>
        {
          session?.user ? (
            <>
              <Link href="/account">
                <a>{session.user.lastName}</a>
              </Link>
            </>
          ) : (
            <Link href="/auth/login">
              <a>Login</a>
            </Link>
          )
        }
      </div>
    </header>
  )
}

export default memo(Header)
