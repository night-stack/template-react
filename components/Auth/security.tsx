import { NextComponentType, NextPageContext } from "next"
import { getSession, GetSessionOptions } from "next-auth/client"
import { Component } from "react"

type LayoutingComponent = NextComponentType & {
  Layout?: any
  // getLayout?: (page: any) => void
}

const getDisplayName = (Components: NextComponentType) => Components.displayName || Components.name || 'Component'

export const withAuthSync = (WrappedComponent: LayoutingComponent) => class extends Component {
  static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`
  static Layout = WrappedComponent?.Layout || null

  // static async getInitialProps (ctx: NextPageContext) {
  //   // console.log('Initial Server ', ctx)
  //   const componentProps = WrappedComponent.getInitialProps
  //   && (await WrappedComponent.getInitialProps(ctx))

  //   console.log('ININTAL PROPS ', componentProps)
  //   // let topNotifVerifiedAccount: boolean = false
  //   // const { token, user } = await auth(ctx)
  //   // if (!user?.emailVerified && !user?.phoneVerified) {
  //   //   topNotifVerifiedAccount = true
  //   // }
  //   // return { ...componentProps, token, user, topNotifVerifiedAccount }
  // }

  // static async getServerSideProps (context: GetSessionOptions | any) {
  //   const session = await getSession(context)
  //   console.log('getServerSideProps ', context?.resolvedUrl);
  //   if (!session) {
  //     return {
  //       redirect: {
  //         destination: `/auth/login?redirect_to=${context?.resolvedUrl}`,
  //         permanent: false
  //       }
  //     }
  //   }
  //   return {
  //     props: { session }
  //   }
  // }

  constructor (props: any) {
    super(props)
  }

  render () {
    return <WrappedComponent {...this.props} />
  }
}

