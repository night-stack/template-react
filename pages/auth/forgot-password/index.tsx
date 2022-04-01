// import type { NextPageContext } from 'next'
import styles from 'styles/Home.module.css'
import {useForm} from 'react-hook-form'
import Input from 'components/Form/Input'
import { useRouter } from 'next/router'
import {apiForgotPassword} from 'services/auth'
import {PublicLayout as Layout} from 'components/Layouts'
// import {authPage} from 'components/Middleware'
import { ReactElement } from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import Button from 'components/Form/Button'
import {toast} from 'components/Alert/Toast'
import { set } from 'services/utils/storage'
import moment from 'moment'
import {FORGOT_EXPIRED_CODE} from 'constant'
import getConfig from 'next/config'

const validationSchema = yupResolver(
  yup.object({
    email: yup.string()
      .required('field is required')
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email Format Invalid'),
  })
);

const { publicRuntimeConfig } = getConfig()

type InputProps = {
  email: string
}
const ChangePassword = () => {
  const {push} = useRouter()

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit
  } = useForm<InputProps>({
    resolver: validationSchema
  })

  const onSubmit = async (values: InputProps) => {
    const res = await apiForgotPassword('email', {account: values?.email})
    if (res?.success) {
      toast.notify(res?.meta?.message, {
        title: 'Success',
        duration: 2,
        type: 'success'
      });
      // back()
      await set(FORGOT_EXPIRED_CODE, moment(`${res?.data?.expired}${publicRuntimeConfig?.TIMEZONE_SERVER}`).format('YYYY-MM-DD H:mm:ss'))
      push({
        pathname: '/auth/forgot-password/verification',
        query: { email: values?.email }
      })
      return
    }
    toast.notify(res?.message, {
      title: 'Error',
      duration: 5,
      type: 'error'
    });
  }

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
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
        <div className="mt-4">
          <Button className="w-full" type="submit" disabled={isSubmitting}>Send</Button>
        </div>
      </form>
      {/* <ToastContainer /> */}
    </div>
  )
}

ChangePassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default ChangePassword