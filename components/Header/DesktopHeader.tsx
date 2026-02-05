'use client'

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Bug from "@mui/icons-material/BugReport";
import React from "react";

import { usePelicanClient } from "@pelicanplatform/components";

import Title from "@/components/Header/Title";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";


const DesktopHeader = () => {

  const {
    objectUrl,
    setObjectUrl,
    getObjectList
  } = usePelicanClient();

  const possibleCollections = [
    {name: "AP40", value: "pelican://osg-htc.org/ospool/ap40"},
    {name: "Collaborations", value: "pelican://osg-htc.org/ospool/uw-shared/collaborations"}
  ]

  const currentCollection = possibleCollections.filter(x => objectUrl.startsWith(x.value))[0] || possibleCollections[0];

	return (
		<Toolbar disableGutters>
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				{/* Left: title */}
				<Box alignItems={'center'} display={'flex'}>
					<Title />
				</Box>

				{/* Right: spacer column to balance the left (so centering looks right). */}
				<Box gap={1} alignItems={"center"} display={'flex'}>
          <FormControl margin={'dense'} size={"small"} sx={{ minWidth: 200, mb: 0 }}>
            <InputLabel id="object-store-label">Object Store</InputLabel>
            <Select
              labelId="object-store-label"
              id="object-store"
              value={currentCollection.value}
              label="Object Store"
              onChange={(x) => {
                setObjectUrl(x.target.value)
                getObjectList(x.target.value);
              }}
              MenuProps={{style:{paddingBottom:0}}}
            >
              {possibleCollections.map((collection) => (
                <MenuItem key={collection.value} value={collection.value}>{collection.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton href={"https://github.com/PelicanPlatform/web-client/issues/new"} color={'secondary'}>
            <Bug />
          </IconButton>
        </Box>
			</Box>
		</Toolbar>
	);
};

export default DesktopHeader;
