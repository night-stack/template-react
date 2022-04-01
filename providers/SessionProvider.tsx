import { createContext, useContext } from 'react'

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

export type SessionContextType = {
  session: {
    user?: UserDataContext|null,
    token?: string|null
  }
}

const initialData = {
  session: {
    user: null,
    token: null
  }
}
const SessionContext = createContext<SessionContextType>(initialData)

export const useSessionContext = () => useContext(SessionContext)

export default SessionContext