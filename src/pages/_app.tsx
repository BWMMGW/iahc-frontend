import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'   

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className='flex flex-col min-h-screen'>
        <Header />                        
        <main className='flex-grow'>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
