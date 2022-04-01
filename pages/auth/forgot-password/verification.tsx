// import type { NextPageContext } from 'next'
import styles from 'styles/Home.module.css'
import {useForm} from 'react-hook-form'
import Input from 'components/Form/Input'
import { useRouter } from 'next/router'
import {verificationCode} from 'services/auth/verificationService'
import {PublicLayout as Layout} from 'components/Layouts'
// import {authPage} from 'components/Middleware'
import { ReactElement } from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import Button from 'components/Form/Button'
import {toast} from 'components/Alert/Toast'
import { set } from 'services/utils/storage'
import moment from 'moment'
import {FORGOT_EXPIRED_CODE, TYPE_ACCOUNT_EMAIL, TYPE_CODE_FORGOT} from 'constant'
import getConfig from 'next/config'

const validationSchema = yupResolver(
  yup.object({
    code: yup.string().required('*Required').min(6, 'Min 6 Character').max(6, 'Max 6 Character')
  })
);

const { publicRuntimeConfig } = getConfig()

type InputProps = {
  code: string
}
const ChangePassword = () => {
  const {push} = useRouter()
  const router = useRouter()

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit
  } = useForm<InputProps>({
    resolver: validationSchema
  })

  const onSubmit = async (values: InputProps) => {
    const { query } = router
    const res = await verificationCode({
      code: values?.code,
      account: query.email,
      typeCode: TYPE_CODE_FORGOT,
      typeAccount: TYPE_ACCOUNT_EMAIL,
    })
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
        query: { email: values?.code }
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
      <h2>Verification Code</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div>
          <Input
            type="text"
            id="code"
            name="code"
            label="Code"
            control={control}
            placeholder="Code"
            error={errors?.code?.message}
          />
        </div>
        <div className="mt-4">
          <Button className="w-full" type="submit" disabled={isSubmitting}>Verification</Button>
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