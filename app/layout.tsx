import type { Metadata } from "next";

import {Box} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import theme, {fonts} from "@chtc/web-components/themes/osg"

import "./globals.css"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: "Website Template",
  description: "Website template for CHTC projects",
	metadataBase: new URL(`https://${process.env.HOSTNAME}`),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.map(font => font.className).join(' ')}>
			{ process.env.NEXT_PUBLIC_MATOMO_URL && process.env.NEXT_PUBLIC_MATOMO_SITE_ID &&
				<Analytics url={process.env.NEXT_PUBLIC_MATOMO_URL} siteId={process.env.NEXT_PUBLIC_MATOMO_SITE_ID} />
			}
      <AppRouterCacheProvider>
        <Box component={"body"} sx={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <ThemeProvider theme={theme}>
						<Header />
						<Box component="main" sx={{ flex: 1 }}>
							{children}
						</Box>
						<Footer />
          </ThemeProvider>
        </Box>
      </AppRouterCacheProvider>
    </html>
  );
}
