import styles from 'styles/Home.module.css'
import {useForm} from 'react-hook-form'
import Input from 'components/Form/Input'
import { useRouter } from 'next/router'
import {apiResetPassword} from 'services/auth/forgotPassword'
import {ProtectLayout as Layout} from 'components/Layouts'
import { ReactElement } from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import Button from 'components/Form/Button'
import {toast} from 'components/Alert/Toast'

const validationSchema = yupResolver(
  yup.object({
    password: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    confirm_password: yup.string().required('*Required').min(6, 'Min 6 Characters')
    .oneOf([yup.ref('password'), null], 'Password must match')
  })
);

type InputProps = {
  password: string,
  confirm_password: string
}
const ChangePassword = () => {
  const {back, query} = useRouter()

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit
  } = useForm<InputProps>({
    resolver: validationSchema
  })

  const onSubmit = async (values: InputProps) => {
    const res = await apiResetPassword('email', {
      account: query?.email,
      password: values?.password
    })
    if (res?.success) {
      toast.notify(res?.meta?.message, {
        title: 'Success',
        duration: 2,
        type: 'success'
      });
      back()
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
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div>
          <Input
            type="password"
            id="password"
            name="password"
            label="New Password"
            control={control}
            placeholder="New Password"
            error={errors?.password?.message}
          />
        </div>
        <div>
          <Input
            type="password"
            id="confirm_password"
            name="confirm_password"
            label="Confirm New Password"
            control={control}
            placeholder="Confirm New Password"
            error={errors?.confirm_password?.message}
          />
        </div>
        <div className="mt-4">
          <Button className="w-full" type="submit" disabled={isSubmitting}>Change</Button>
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