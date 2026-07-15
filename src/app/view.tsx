"use client";

import { Box, Container } from "@mui/material";
import React from "react";


import { AuthenticatedClient, PelicanClientProvider, usePelicanClient } from "@pelicanplatform/components";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import {Collection} from "@/src/types";

interface Props {
  collections: Collection[]
  defaultCollection: Collection
}

export default function HomePageClient({collections, defaultCollection}: Props) {
  // The provider lives here (not in the server page) so its objectUrl is seeded on the client,
  // letting us keep the page statically rendered — no ?url searchParams read on the server. It
  // starts empty on purpose: HomePageContent sets the one correct objectUrl (a ?url deep link, or
  // the default) in an effect, so we never seed the default first and fire a throwaway fetch.
  return (
    <PelicanClientProvider enableAuth={true}>
      <HomePageContent collections={collections} defaultCollection={defaultCollection} />
    </PelicanClientProvider>
  );
}

function HomePageContent({collections, defaultCollection}: Props) {

  const {
    objectPath,
    setObjectUrl
  } = usePelicanClient()

  // The active collection is derived from the client's current objectUrl (via objectPath) — the
  // single source of truth owned by the provider — rather than a local copy. Pick the longest
  // configured prefix the path sits under, so a deep link like ?url=.../ospool/ap40/foo still
  // resolves to its collection. Falls back to the default before the first namespace resolves.
  const selectedCollection =
    [...collections]
      .filter((c) => objectPath === c.prefix || objectPath?.startsWith(c.prefix))
      .sort((a, b) => b.prefix.length - a.prefix.length)[0] ?? defaultCollection;

  // Switching a collection only moves the client's objectUrl; AuthenticatedClient reacts to the
  // change (refetches the listing and mirrors it back into ?url for deep-linking). Drop any stale
  // ?url deep link first so we land at the namespace root instead of a lingering deep path.
  const handleCollectionChange = (collection: Collection) => {
    const params = new URLSearchParams(window.location.search);
    params.delete("url");
    const newSearch = params.toString();
    window.history.replaceState({}, "", newSearch ? `?${newSearch}` : window.location.pathname);
    setObjectUrl(`pelican://osg-htc.org${collection.prefix}`)
  }

  // Seed objectUrl exactly once, *before* mounting AuthenticatedClient — from a ?url deep link if
  // present, otherwise the default collection. AuthenticatedClient mirrors objectUrl back into
  // ?url as soon as it mounts; if it mounted before we set objectUrl, that mirror would overwrite
  // the deep link before its own seed effect could read it. Gating the mount on `ready` guarantees
  // objectUrl already holds the right value by then (both setState calls commit together). It also
  // keeps AuthenticatedClient (which touches window) off the server render.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const url = new URLSearchParams(window.location.search).get("url");
    setObjectUrl(url ?? `pelican://osg-htc.org${defaultCollection.prefix}`);
    setReady(true);
  }, [setObjectUrl, defaultCollection]);

  return (
    <Box component={"body"} sx={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header handleChange={handleCollectionChange} collections={collections} collection={selectedCollection} />
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg">
          <Box minHeight={"90vh"} margin={{sm: 0, lg: 4}} pt={1} width={"100%"} maxWidth={"1000px"} mx={"auto"}>
            {ready && <AuthenticatedClient />}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
