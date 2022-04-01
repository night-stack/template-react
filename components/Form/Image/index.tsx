import React, { useState } from 'react'
import { useEffect } from 'react'
import { Controller, Control, FieldValue, FieldValues } from 'react-hook-form'
import cn from 'classnames'
import styles from './Image.module.css'

interface ImageFieldProps<FieldValue> {
  name: string,
  id: string,
  error?: string,
  label?: string,
  control: Control<FieldValue>,
  validate?: any,
  className?: string,
  disabled?: boolean,
  placeholder?: string,
  labelClass?: string
  iconClass?: string
}

const ImageField = ({
  name,
  id,
  error,
  control,
  validate,
  className,
  label,
  disabled,
  labelClass,
  iconClass
}: ImageFieldProps<FieldValue<FieldValues>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={validate}
      render={({ field }: any) => {
        const [image, setImage] = useState<any>(field?.value)

        useEffect(() => {
          if (field?.value && typeof field?.value === 'string') {
            setImage(field?.value)
          }
        }, [field?.value])

        const handleChange = (e: any) => {
          field?.onChange(e?.target?.files[0])
          const file = e?.target.files[0]
          setImage(URL.createObjectURL(file))
        }

        return (
          <div className={cn('relative flex flex-col justify-center')}>
            {
              label && (<div className={cn('text-sm font-bold text-gray-600', labelClass)}>{label}</div>)
            }
            <div className={cn('bg-slate-200', styles.imgWrapper, className)}>
              {image ? (
                <img className={cn(styles.imageFile)} src={image} alt="profile" />
              ) : (
                <img className={cn(styles.imageDefault)} src="/images/empty.png" alt="profile" />
              )}
              <input
                // {...field}
                id={id}
                type="file"
                onChange={handleChange}
                className={cn('hidden')}
                accept="image/jpeg, image/jpg, image/png, image/JPG, image/JPEG"
                disabled={disabled}
              />
              {
                error && (
                  <div>{error}</div>
                )
              }
            </div>
            {
              !disabled && (
                <label className={cn('absolute flex justify-center items-center text-white', styles.icon, iconClass)} htmlFor={id}>
                  <i className="material-icons">add_a_photo</i>
                </label>
              )
            }
          </div>
        )
      }}
    />
  )
}

export default ImageField
