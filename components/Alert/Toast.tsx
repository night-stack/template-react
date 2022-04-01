import { FC } from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'

type PropsToast = {
  title?: string|null;
  message: string;
  transitionPercentage: number;
  color?: 'gray'|'red'|'green'|'orange';
  duration: number;
  slideIn?: boolean
}
// Hey, I am toast component 
const Toast: FC<PropsToast> = (props) => {
  return (
    <div className="toast-message-container">
      <div className={cn({
        'w-full border-t-4 rounded-b px-4 py-3 shadow-md': true,
        'bg-gray-100': props.color === 'gray',
        'border-gray-500': props.color === 'gray',
        'text-gray-900': props.color === 'gray',
        'bg-red-100': props.color === 'red',
        'border-red-500': props.color === 'red',
        'text-red-900': props.color === 'red',
        'bg-green-100': props.color === 'green',
        'border-green-500': props.color === 'green',
        'text-green-900': props.color === 'green',
        'bg-yellow-100': props.color === 'orange',
        'border-yellow-500': props.color === 'orange',
        'text-yellow-900': props.color === 'orange',
        })
      }
        role="alert"
      >
        <div className="flex">
          {/* <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div> */}
          <div>
            {
              props.title && (
                <p className="font-bold">{props.title}</p>
              )
            }
            <p className="text-sm">{props.message}</p>
          </div>
        </div>
      </div>
      {/* Static Styling */}
      <style jsx>{`
        .toast-message {
          flex:1;
          background-color: #fff;
          padding: 15px 10px;
          border-radius: 4px;
          font-family: 'Open Sans', sans-serif;
        }
        .side-bar{
          padding: 10px;
          border-radius: 4px;
        }
    `}</style>
      {/* Dynamic Styling */}
      <style jsx>{`
        @keyframes SlideInOut {
          0%{
            transform: translateY(0);
            opacity:0;
          }
          ${ props.transitionPercentage }% {
            transform: translateY(-40px);
            opacity:1;
          }
          ${ (100-props.transitionPercentage)}% {
            transform: translateY(-40px);
            opacity:1;
          }
          100% {
            transform: translateY(0px);
            opacity:0;
          }
        }
        .toast-message-container {
          // color: ${ props.color || 'grey' };
          max-width: 400px;
          // background: ${ props.color || 'grey' };
          // box-shadow: 0px 0px 30px #0000001f;
          margin: 0px auto;
          // border-radius: 4px;
          display: flex;
          animation: SlideInOut ${props.duration}s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export const ToastContainer = () => {
  return (
    <div id="toast-container" className="toast-container">
      <style jsx>{`
        .toast-container {
          position: fixed;
          width: 100%;
          bottom: 20px;
          left: 0px;
        }
      `}</style>
    </div>
  )
}

type OptionsNotifyProps = {
  title?: string;
  duration: number;
  type: 'info'|'success'|'error'|'warn';
}

type ToastProps = {
  remove: () => void;
  currentToast: boolean;
  timeout: any;
  notify: (message: string, options: OptionsNotifyProps) => void;
}
export const toast: ToastProps = {
  remove: () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('toast-container') as HTMLElement)
    toast.currentToast = false
    if(toast.timeout){
      clearTimeout(toast.timeout)
      toast.timeout = null
    }
  },
  currentToast: false,
  timeout: null,
  notify: (message, options) =>{
    let duration = 5
    let color: 'gray'|'red'|'green'|'orange'|null = 'gray'
    if( options ){
      if( options.duration)
        duration = options.duration
      if( options.type === "info") 
        color = 'gray'
      if( options.type === "success") 
        color = 'green'
      if( options.type === "error") 
        color = 'red'
      if( options.type === 'warn') 
        color = 'orange'
    } 

    if(toast.currentToast) { 
      toast.remove()
    }

    let trasitionPercentage = 0.3*(100/duration)

    ReactDOM.render(<Toast
      title={options.title || null}
      message={message} 
      slideIn={true} 
      color={color || null}
      transitionPercentage={trasitionPercentage} 
      duration={duration} />, document.getElementById('toast-container'));
    toast.currentToast = true
    toast.timeout = setTimeout( toast.remove, duration*1000)
  }
}