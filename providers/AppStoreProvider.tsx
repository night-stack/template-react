import { createContext, useReducer, useContext, Dispatch } from 'react'
import {userAuthReducer} from 'reducers'

type ImageUrlType = {
  url?: string|undefined,
  raw?: string|undefined
}

export interface UserDataContext {
  ktpNumber?: string|undefined,
  ktpImage?: ImageUrlType,
  ktpOwner?: ImageUrlType,
  address?: string,
  banned?: string,
  bannedUntil?: null,
  createdAt?: string,
  createdBy?: string | null,
  deletedAt?: string | null,
  deletedBy?: string | null,
  cityId?: number | null,
  countryId?: number | null,
  email?: string,
  emailVerified?: boolean,
  gender?: 1|0,
  id?: number,
  image?: ImageUrlType,
  lastLogin?: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  phoneVerified?: boolean,
  provider?: string | null,
  provider_id?: string | null,
  roleId?: number,
  status?: string,
  updatedAt?: string,
  updatedBy?: number,
  username?: string,
  nickname?: string,
  inGameId?: string,
  loginBy?: string,
  point?: number,
  codeArea?: string,
  birth?: string,
  admin?: boolean,
  emailVisible?: boolean,
  phoneVisible?: boolean
}

export type UserContext = {
  user: UserDataContext | null,
  error: { message: string|null }
}
export type StateAppStoreContextType = {
  userAuth: UserContext
}

const initialData: StateAppStoreContextType = {
  userAuth: {
    user: null,
    error: {
      message: null
    }
  }
}
interface InitialContextProps {
  state: StateAppStoreContextType,
  dispatch: Dispatch<any>
}
const initialContext = {
  state: initialData,
  dispatch: () => null
}

const AppContext = createContext<InitialContextProps>(initialContext)
AppContext.displayName = "AppContext"

const mainReducer = ({userAuth}: any, action: any) => ({
  userAuth: userAuthReducer(userAuth, action),
});

const AppStoreProvider = ({children}: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(mainReducer, initialData);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStoreContext = () => useContext(AppContext)

export default AppStoreProvider