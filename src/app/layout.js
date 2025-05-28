// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Jan Peiro | Art Director & 3D Motion Designer',
  description: 'Art-director 2D / 3D motion design, visualization and interactive WebGL experiences.',
  openGraph: {
    images: [{ 
      url: 'https://www.jopl.de/images/ChromaLogo2.jpg', // ← Full URL
      width: 600,
      height: 450
    }],
  },
  twitter: {
    images: ['https://www.jopl.de/images/ChromaLogo2.jpg'], // ← Full URL
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}