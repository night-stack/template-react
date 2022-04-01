import type { NextPageContext } from 'next'
import styles from 'styles/Home.module.css'
import {useForm} from 'react-hook-form'
import Input from 'components/Form/Input'
import { useRouter } from 'next/router'
import {apiRegister, RegisterPropsType} from 'services/auth'
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
    email: yup.string()
      .required('field is required')
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email Format Invalid'),
    password: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    username: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    name: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    // username: yup.string().required('*Required')
    //   .matches(/^(^08|8)(\d{6,12}-?)$/, 'Use Phone Number Format Indonesai 08* or 8**')
  })
);

export async function getServerSideProps(ctx: NextPageContext) {
  const token = await unauthPage(ctx)
  // console.log('TOKEN ', token);
  return { props: {token} }
}

const Login = () => {
  const {push, locale} = useRouter()

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit
  } = useForm<RegisterPropsType>({
    resolver: validationSchema
  })

  const onSubmit = async (values: RegisterPropsType) => {
    const res = await apiRegister({
      name: values?.name,
      username: values?.username,
      email: values?.email,
      password: values?.password
    })
    if (res?.success) {
      toast.notify(res?.meta?.message, {
        title: 'Success',
        duration: 2,
        type: 'success'
      });
      push('/auth/login', '/auth/login', {locale})
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
      <div>Register</div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div>
          <Input
            type="text"
            id="name"
            name="name"
            label="Your Name"
            control={control}
            placeholder="Your Name"
            error={errors?.name?.message}
          />
        </div>
        <div>
          <Input
            type="text"
            id="email"
            name="email"
            label="Email"
            control={control}
            placeholder="Email"
            error={errors?.email?.message}
          />
        </div>
        <div>
          <Input
            type="text"
            id="username"
            name="username"
            label="Username"
            control={control}
            placeholder="Username"
            error={errors?.username?.message}
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
        </div>
        <div className="w-full flex items-center justify-center text-center text-xs mt-4">
          <div>Have account ?</div>
          <Link href="/auth/login">
            <a className="ml-1 font-bold underline text-xs">Sign In</a>
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