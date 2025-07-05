// import { ApolloProvider } from '@/components/ApolloProvider'
import LayoutWithSidebar from '@/components/LayoutWithSidebar'
import { ThemeProvider } from '@/components/theme-provider'
import AuthContext from '@/context/AuthContext'
import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthContext>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* <ApolloProvider> */}
              <LayoutWithSidebar>
                {children}
              </LayoutWithSidebar>
            {/* </ApolloProvider> */}
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  )
}