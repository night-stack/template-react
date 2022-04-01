import type { NextPageContext } from 'next'
import styles from 'styles/Home.module.css'
import {useForm} from 'react-hook-form'
import Input from 'components/Form/Input'
import { useRouter } from 'next/router'
import {apiChangePassword} from 'services/account'
import {ProtectLayout as Layout} from 'components/Layouts'
import {authPage} from 'components/Middleware'
import { ReactElement } from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import Button from 'components/Form/Button'
import {toast} from 'components/Alert/Toast'

const validationSchema = yupResolver(
  yup.object({
    old_password: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    password: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    confirm_password: yup.string().required('*Required').min(6, 'Min 6 Characters')
    .oneOf([yup.ref('password'), null], 'Password must match')
  })
);

export async function getServerSideProps(ctx: NextPageContext) {
  const { session } = await authPage(ctx);
  // console.log('TOKEN ', token);
  return { props: {session} }
}

type InputProps = {
  old_password: string,
  password: string,
  confirm_password: string
}
const ChangePassword = () => {
  const {back} = useRouter()

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit
  } = useForm<InputProps>({
    resolver: validationSchema
  })

  const onSubmit = async (values: InputProps) => {
    const res = await apiChangePassword({
      oldPassword: values?.old_password,
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
            id="old_password"
            name="old_password"
            label="Current Password"
            control={control}
            placeholder="Currnet Password"
            error={errors?.old_password?.message}
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
        <div>
          <Input
            type="password"
            id="confirm_password"
            name="confirm_password"
            label="Confirm Password"
            control={control}
            placeholder="Confirm Password"
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