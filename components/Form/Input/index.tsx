import type {FC, InputHTMLAttributes, ReactNode} from 'react'
import { Controller } from 'react-hook-form'
import classNames from 'classnames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  control: ReactNode;
}

const InputComponent: FC<InputProps> = ({
  type = 'text',
  placeholder,
  name,
  id,
  error,
  control,
  validate,
  className,
  labelClassName,
  wrapperClassName,
  label,
  disabled,
  readOnly,
  maxLength,
  autoComplete,
}: any) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={validate}
      render={({ field: { onChange, onBlur, ...props } }: any) => {
        return (
          <div className={classNames('my-2', wrapperClassName)}>
            {
              label && (<label htmlFor={id} className={classNames('text-sm font-bold text-gray-600', labelClassName)}>{label}</label>)
            }
            <div className="w-full relative">
              <input
                name={name}
                id={id || name}
                placeholder={placeholder}
                type={type}
                onChange={onChange}
                onBlur={onBlur}
                className={classNames({
                  'bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500': true,
                  'invalid': error
                }, className)}
                disabled={disabled}
                readOnly={readOnly}
                maxLength={maxLength}
                autoComplete={autoComplete}
                {...props}
              />
              {
                error && (
                  <p className="text-red-500 text-xs italic">{error}</p>
                )
              }
            </div>
          </div>
        )
      }}
    />
  )
}

export default InputComponent
