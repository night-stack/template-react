import type {FC, ButtonHTMLAttributes} from 'react'
import cn from 'classnames'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  submitting?: boolean;
  className?: string;
  buttonType?: 'error'|'warning'|'primary'
}

const Button: FC<ButtonProps> = ({children, disabled, className, type, submitting, buttonType = 'primary'}) => {
  return (
    <div>
      <button
        className={
          cn({
            'bg-red-500': buttonType === 'error',
            'hover:bg-red-700': buttonType === 'error',
            'border-red-500': buttonType === 'error',
            'bg-teal-500': buttonType === 'primary',
            'hover:bg-teal-700': buttonType === 'primary',
            'border-teal-500': buttonType === 'primary',
            'bg-yellow-500': buttonType === 'warning',
            'hover:bg-yellow-700': buttonType === 'warning',
            'border-yellow-500': buttonType === 'warning',
            'relative px-4 py-2 disabled:bg-gray-200 disabled:text-gray-400 flex-shrink-0 text-sm text-white py-1 px-2 rounded': true
          }, className)
        }
        disabled={disabled || submitting}
        type={type}
      >
        <>
          {children}
        </>
      </button>
    </div>
  )
}

export default Button
