import type { Metadata } from "next";

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import theme, {fonts} from "@chtc/web-components/themes/osg"

import "./globals.css"
import PelicanSwRegistrar from "@/src/components/PelicanSwRegistrar";

export const metadata: Metadata = {
  title: "OSDF Object Browser",
  description: "Browse and interact with data stored in the Open Science Data Framework (OSDF).",
	metadataBase: new URL(`https://osdf-client.osg-htc.org`),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.map(font => font.className).join(' ')}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <PelicanSwRegistrar />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
