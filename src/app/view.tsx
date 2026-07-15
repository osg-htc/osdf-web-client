"use client";

import { Box, Container } from "@mui/material";
import React from "react";


import { AuthenticatedClient, PelicanClientProvider, usePelicanClient } from "@pelicanplatform/components";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import {Collection} from "@/src/types";
import {useStarredStores} from "@/src/hooks/useStarredStores";

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

  const {hydrated, isStarred, toggleStar, addStar} = useStarredStores();

  // Capture the ?url deep link exactly once, at first client render — before AuthenticatedClient
  // mounts and starts mirroring objectUrl back into ?url. Re-reading window.location later would
  // see that mirrored value, making an empty landing look like a deep link to the default store.
  const initialUrlRef = React.useRef<string | null | undefined>(undefined);
  if (initialUrlRef.current === undefined) {
    initialUrlRef.current =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("url")
        : null;
  }

  // Given an object path, pick the longest configured prefix it sits under. Shared by the active
  // collection derivation and the deep-link auto-star so both resolve a path to a collection the
  // same way.
  const matchCollection = React.useCallback(
    (path: string | null | undefined) =>
      [...collections]
        .filter((c) => path === c.prefix || path?.startsWith(c.prefix))
        .sort((a, b) => b.prefix.length - a.prefix.length)[0],
    [collections]
  );

  // The active collection is derived from the client's current objectUrl (via objectPath) — the
  // single source of truth owned by the provider — rather than a local copy. A deep link like
  // ?url=.../ospool/ap40/foo still resolves to its collection. Falls back to the default before
  // the first namespace resolves.
  const selectedCollection = matchCollection(objectPath) ?? defaultCollection;

  // Starred stores float to the top of the list, keeping their relative order otherwise
  // (Array.prototype.sort is stable). This is the order handed to the Header dropdowns.
  const orderedCollections = React.useMemo(
    () =>
      [...collections].sort(
        (a, b) => (isStarred(a.prefix) ? 0 : 1) - (isStarred(b.prefix) ? 0 : 1)
      ),
    [collections, isStarred]
  );

  // Landing on a prepopulated ?url deep link auto-stars the store it points at. Gated on
  // `hydrated` so we add to the persisted set rather than an empty pre-hydration one. An empty
  // landing (no ?url) intentionally stars nothing — we never auto-star the default store.
  React.useEffect(() => {
    if (!hydrated) return;
    const url = initialUrlRef.current;
    if (!url) return;
    let path: string | null = null;
    try {
      path = new URL(url).pathname;
    } catch {}
    const match = matchCollection(path);
    if (match) addStar(match.prefix);
  }, [hydrated, matchCollection, addStar]);

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

  // Seed objectUrl exactly once, *before* mounting AuthenticatedClient. Priority: a ?url deep link,
  // then the user's top starred store (so stars show up by default), then the default collection.
  // AuthenticatedClient mirrors objectUrl back into ?url as soon as it mounts; if it mounted before
  // we set objectUrl, that mirror would overwrite the deep link before its own seed effect could
  // read it. Gating the mount on `ready` guarantees objectUrl already holds the right value by then.
  // We wait for `hydrated` so the starred set is known before choosing the no-deep-link default.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (!hydrated || ready) return;
    const url = initialUrlRef.current;
    if (url) {
      setObjectUrl(url);
    } else {
      const topStarred = collections.find((c) => isStarred(c.prefix));
      setObjectUrl(`pelican://osg-htc.org${(topStarred ?? defaultCollection).prefix}`);
    }
    setReady(true);
  }, [hydrated, ready, collections, isStarred, defaultCollection, setObjectUrl]);

  return (
    <Box component={"body"} sx={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        handleChange={handleCollectionChange}
        collections={orderedCollections}
        collection={selectedCollection}
        isStarred={isStarred}
        onToggleStar={toggleStar}
      />
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
