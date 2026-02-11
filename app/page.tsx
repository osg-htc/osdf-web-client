"use client";

import { Box, Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";

import theme, {fonts} from "@chtc/web-components/themes/osg"
import { AuthenticatedClient, PelicanClientProvider } from "@pelicanplatform/components";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePageClient() {

  const [mounted, setMounted] =  React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PelicanClientProvider initialObjectUrl={"pelican://osg-htc.org/ospool/ap40"} enableAuth={true}>
      <Box component={"body"} sx={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ThemeProvider theme={theme}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <Container maxWidth="lg">
              <Box minHeight={"90vh"} margin={{sm: 0, lg: 4}} pt={1} width={"100%"} maxWidth={"1000px"} mx={"auto"}>
                {mounted && <AuthenticatedClient />}
              </Box>
            </Container>
          </Box>
          <Footer />
        </ThemeProvider>
      </Box>
    </PelicanClientProvider>
  );
}

