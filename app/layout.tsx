import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'MejaServis — Pencatatan Servis Laptop',description:'Kelola penerimaan laptop, kerusakan, pekerjaan servis, dan biaya pelanggan.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="id"><body>{children}</body></html>}
