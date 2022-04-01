import type { NextPageContext } from 'next'
import styles from 'styles/Home.module.css'
import {useForm} from 'react-hook-form'
import Input from 'components/Form/Input'
import { useRouter } from 'next/router'
import {apiLogin, LoginPropsType} from 'services/auth'
import {setCookie} from 'nookies'
import {TOKEN} from 'constant'
import {PublicLayout as Layout} from 'components/Layouts'
import {unauthPage} from 'components/Middleware'
import { ReactElement } from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import Button from 'components/Form/Button'
import {toast} from 'components/Alert/Toast'
import Link from 'next/dist/client/link'

const validationSchema = yupResolver(
  yup.object({
    account: yup.string().required('*Required'),
    password: yup.string().required('*Required').min(6, 'Min 6 Characters')
  })
);

export async function getServerSideProps(ctx: NextPageContext) {
  const token = await unauthPage(ctx)
  // console.log('TOKEN ', token);
  return { props: {token} }
}

const Login = () => {
  const {query, push, locale} = useRouter()

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit
  } = useForm<LoginPropsType>({
    resolver: validationSchema
  })

  const onSubmit = async (values: LoginPropsType) => {
    const res = await apiLogin({
      account: values?.account,
      password: values?.password
    })
    if (res?.success) {
      setCookie(null, TOKEN, res?.data?.access_token , {
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      if (query?.redirect_to) {
        const url = String(query?.redirect_to)
        push(url, undefined, {locale})
        return
      }
      toast.notify(res?.meta?.message, {
        title: 'Success',
        duration: 2,
        type: 'success'
      });
      push('/', undefined, {locale})
      return
    }
    toast.notify(res?.message, {
      title: 'Error Login',
      duration: 5,
      type: 'error'
    });
    return
  }

  return (
    <div className={styles.container}>
      <div>Login</div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div>
          <Input
            type="text"
            id="account"
            name="account"
            label="Email/Phone"
            control={control}
            placeholder="Email or Phone Number"
            error={errors?.account?.message}
          />
        </div>
        <div>
          <Input
            type="password"
            id="password"
            name="password"
            label="Password"
            control={control}
            placeholder="Password"
            error={errors?.password?.message}
          />
        </div>
        <div className="mt-4">
          <Button className="w-full" type="submit" disabled={isSubmitting}>Login</Button>
          <Link href="/auth/forgot-password">
            <a className="ml-1 font-bold underline text-xs">Forgot Password</a>
          </Link>
        </div>
        <div className="w-full flex items-center justify-center text-center text-xs mt-4">
          <div>Don't have any account ?</div>
          <Link href="/auth/register">
            <a className="ml-1 font-bold underline text-xs">Register</a>
          </Link>
        </div>
      </form>
    </div>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Login