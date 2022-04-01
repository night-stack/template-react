import type { NextPageContext } from 'next'
import styles from 'styles/AccountEdit.module.css'
import {useForm} from 'react-hook-form'
import Input from 'components/Form/Input'
import Image from 'components/Form/Image'
import { useRouter } from 'next/router'
import {apiUpdateProfile} from 'services/account'
import {ProtectLayout as Layout} from 'components/Layouts'
import {authPage} from 'components/Middleware'
import { ReactElement } from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import Button from 'components/Form/Button'
import {toast} from 'components/Alert/Toast'
import { useSessionContext } from 'providers'
import {uploadImage} from 'services/upload'

const validationSchema = yupResolver(
  yup.object({
    firstName: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    lastName: yup.string().required('*Required').min(6, 'Min 6 Characters'),
    email: yup.string()
      .required('field is required')
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email Format Invalid'),
    username: yup.string().required('*Required').min(6, 'Min 6 Characters')
  })
);

export async function getServerSideProps(ctx: NextPageContext) {
  const { session } = await authPage(ctx);
  return { props: {session} }
}

type InputProps = {
  username: string|null
  firstName: string|null
  lastName: string|null
  email: string|null
  image?: string|null
}
const ChangePassword = () => {
  const {back} = useRouter()
  const {session} = useSessionContext()

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit
  } = useForm<InputProps>({
    resolver: validationSchema,
    defaultValues: {
      image: session?.user?.image?.raw,
      firstName: session?.user?.firstName,
      lastName: session?.user?.lastName,
      email: session?.user?.email,
      username: session?.user?.username
    }
  })

  const onSubmit = async (values: InputProps) => {
    let image: string|null|undefined
    let imageRaw: string|null|undefined
    if (typeof values?.image === 'object') {
      const { url, raw } = await uploadImage('product', values?.image)
      image = url
      imageRaw = raw
    } else {
      image = values?.image
      imageRaw = session?.user?.image?.raw
    }

    const res = await apiUpdateProfile({
      firstName: values?.firstName,
      lastName: values?.lastName,
      username: values?.username,
      email: values?.email,
      image,
      imageRaw
    })

    if (res?.success) {
      toast.notify(res?.meta?.message, {
        title: 'Success',
        duration: 2,
        type: 'success'
      });
      return back()
    }

    toast.notify(res?.message, {
      title: 'Error',
      duration: 5,
      type: 'error'
    });
    return
  }

  return (
    <div className={styles.container}>
      <div className="mb-6">
        <div className="text-xl font-bold text-slate-800">Update Profile</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div>
          <Image
            id="image"
            name="image"
            label="Image"
            control={control}
            error={errors?.image?.message}
            className={styles.inputImage}
            iconClass={styles.inputImageIcon}
          />
        </div>
        <div>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            label="First Name"
            control={control}
            placeholder="First Name"
            autoComplete="off"
            error={errors?.firstName?.message}
          />
        </div>
        <div>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            label="Last Name"
            control={control}
            placeholder="Last Name"
            autoComplete="off"
            error={errors?.lastName?.message}
          />
        </div>
        <div>
          <Input
            type="text"
            id="email"
            name="email"
            label="E-Mail"
            control={control}
            placeholder="E-Mail"
            autoComplete="off"
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
            autoComplete="off"
            error={errors?.username?.message}
          />
        </div>
        <div className="mt-4">
          <Button className="w-full" type="submit" submitting={isSubmitting}>Update</Button>
        </div>
      </form>
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
