'use client'

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Bug from "@mui/icons-material/BugReport";
import React from "react";

import {HeaderProps} from "@/src/components/Header";
import { Box as MuiBox, FormControl, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Title from "@/src/components/Header/Title";


const DesktopHeader = ({handleChange, collections, collection: selectedCollection, isStarred, onToggleStar }: HeaderProps) => {

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
              value={selectedCollection.prefix}
              label="Object Store"
              onChange={(e) => {
                const selectedPrefix = e.target.value;
                const newCollection = collections.find((c) => c.prefix === selectedPrefix);
                if(newCollection) {
                  handleChange(newCollection)
                }
              }}
              MenuProps={{style:{paddingBottom:0}}}
              SelectDisplayProps={{
                style: {
                  display: "flex",
                }
              }}
            >
              {collections.map((collection) => {
                const starred = isStarred(collection.prefix);
                return (
                  <MenuItem
                    key={collection.prefix}
                    value={collection.prefix}
                    sx={{ pr: 1, display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}
                  >
                    <ListItemText
                      sx={{ minWidth: 0, my: 0 }}
                      slotProps={{ primary: { noWrap: true } }}
                    >
                      {collection.name}
                    </ListItemText>
                    <MuiBox
                      component="span"
                      role="button"
                      aria-label={starred ? `Unstar ${collection.name}` : `Star ${collection.name}`}
                      title={starred ? "Unstar" : "Star"}
                      // Toggling the star must not select the store, so we swallow the
                      // click/keydown before the Select's MenuItem handler sees it.
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(collection.prefix);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          e.preventDefault();
                          onToggleStar(collection.prefix);
                        }
                      }}
                      tabIndex={0}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        ml: 2,
                        flexShrink: 0,
                        color: starred ? 'warning.main' : 'action.active',
                        cursor: 'pointer',
                      }}
                    >
                      {starred ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                    </MuiBox>
                  </MenuItem>
                );
              })}
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
