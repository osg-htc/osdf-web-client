'use client'

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Bug from "@mui/icons-material/BugReport";
import React from "react";

import {HeaderProps} from "@/src/components/Header";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Title from "@/src/components/Header/Title";


const DesktopHeader = ({handleChange, collections, collection: selectedCollection }: HeaderProps) => {

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
            >
              {collections.map((collection) => (
                <MenuItem key={collection.prefix} value={collection.prefix}>{collection.name}</MenuItem>
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
