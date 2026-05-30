import './globals.css'

export const metadata = {
  title: 'Top Up Game Otomatis',
  description: 'Website top-up game instan dengan QRIS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
