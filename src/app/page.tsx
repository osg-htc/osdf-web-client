import fs from "fs";
import path from "path";
import {fetchFederation, list} from "@pelicanplatform/web-client";

import View from "./view"
import {Namespace} from "@/src/types";

const AUTHENTICATED_COLLECTIONS = [
  {name: "AP40", prefix: "/ospool/ap40", description: "AP40"},
  {name: "Collaborations", prefix: "/ospool/uw-shared/collaborations", description: "Shared data across multiple collaborations"},
]

export default async function Page() {

  const namespaces = await getValidPublicNamespaces();
  const collections = namespaces.map((n) => {
    return {
      name: n.path,
      prefix: n.path,
      description: n.path,
    }
  })

  const allCollections = [...collections, ...AUTHENTICATED_COLLECTIONS];
  const defaultCollection = allCollections[0];

  return (
    <View collections={allCollections} defaultCollection={defaultCollection} />
  )
}

const CACHE_FILE = path.join(process.cwd(), ".namespace-cache.json");
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function readFileCache(): Namespace[] | null {
  try {
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL_MS) {
      return data as Namespace[];
    }
  } catch {}
  return null;
}

function writeFileCache(data: Namespace[]) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), data }), "utf-8");
  } catch {}
}


const getValidPublicNamespaces = async () => {
  const cached = readFileCache();
  if (cached) {
    console.log("[Server] Returning namespaces from file cache");
    return cached;
  }

  const response = await fetch("https://osdf-director.osg-htc.org/api/v1.0/director_ui/namespaces");
  const allNamespaces = await response.json() as Namespace[];
  // Filter to keep namespaces with public read access
  const publicNamespaces =  allNamespaces.filter((ns: Namespace) => ns.capabilities.PublicRead);

  const federation = await fetchFederation("osg-htc.org")

  const validPublicNamespaces = await Promise.all(
    publicNamespaces.map(async (ns: Namespace) => {
      try {
        const objectList = await list(`pelican://osg-htc.org${ns.path}`, federation);
        return objectList.length > 1 ? ns : null;
      } catch (error) {
        return null;
      }
    })
  ).then(results => results.filter((ns): ns is Namespace => ns !== null));

  console.log("[Server] I retrieved the public namespaces");
  writeFileCache(validPublicNamespaces);

  return validPublicNamespaces;
}