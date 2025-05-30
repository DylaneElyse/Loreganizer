import { AuthContextProvider } from "@/_utils/auth-context";
import "./globals.css";

export const metadata = {
  title: "Loreganizer",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="fantasy" lang="en">
    <AuthContextProvider>
      <body>
        {children}
      </body>
    </AuthContextProvider>
    </html>
  );
}
