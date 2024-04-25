import Head from 'next/head'
import AuthPage from '@/components/tempelates/AuthPage/AuthPage'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'

function Auth() {
  const { shouldLoadContent } = useRedirectByUserCheck(true)
  return (
    <>
      <Head>
        <title> Mebel.kz | {shouldLoadContent ? 'Авторизация' : ''}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          type="image/svg"
          sizes="32x32"
          href="/img/white-fon-logo.svg"
        />
      </Head>
      {shouldLoadContent && <AuthPage />}
    </>
  )
}
export default Auth
