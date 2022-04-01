import {SESSION_USER} from './types'
import {ActionTypeReducers} from './types'

export default function userAuthReducer(state: any, action: ActionTypeReducers) {
  switch (action?.type) {
    case SESSION_USER:
      return {
        ...state,
        user: action?.payload?.user,
        error: {
          message: action?.payload?.errorMessage
        }
      };
    default:
      return state;
  }
}