"use client";

import { Box, Container } from "@mui/material";
import React, {useState} from "react";


import { parseObjectUrl } from "@pelicanplatform/web-client";
import { AuthenticatedClient, usePelicanClient } from "@pelicanplatform/components";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import {Collection} from "@/src/types";

interface Props {
  collections: Collection[]
  defaultCollection: Collection
}

export default function HomePageClient({collections, defaultCollection}: Props) {

  const {
    setObjectUrl
  } = usePelicanClient()

  const [collection, setCollection] = useState<Collection>(defaultCollection);
  const handleCollectionChange = (collection: Collection) => {
    setCollection(collection);
    const params = new URLSearchParams(window.location.search);
    params.delete("url");
    const newSearch = params.toString();
    window.history.replaceState({}, "", newSearch ? `?${newSearch}` : window.location.pathname);
    setObjectUrl(`pelican://osg-htc.org${collection.prefix}`)
  }

  const [mounted, setMounted] =  React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If there is already a url in the query params we should probably navigate to it instead of the default collection
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
    if(url) {
      const {objectPath} = parseObjectUrl(url);
      const urlCollection = collections.find(collection => objectPath.startsWith(collection.prefix));
      if(urlCollection) {
        setCollection(urlCollection)
      }
    }
  }, [])

  return (
    <Box component={"body"} sx={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header handleChange={handleCollectionChange} collections={collections} collection={collection} />
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg">
          <Box minHeight={"90vh"} margin={{sm: 0, lg: 4}} pt={1} width={"100%"} maxWidth={"1000px"} mx={"auto"}>
            {mounted && <AuthenticatedClient key={collection.prefix} />}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

