import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Meja Servis',description:'Kelola penerimaan laptop, kerusakan, pekerjaan servis, dan biaya pelanggan.',icons:{icon:'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="id"><body>{children}</body></html>}
