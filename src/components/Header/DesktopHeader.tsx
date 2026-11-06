'use client'

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Bug from "@mui/icons-material/BugReport";
import React from "react";

import {HeaderProps} from "@/src/components/Header";
import { Autocomplete, Box as MuiBox, ListItemText, TextField } from "@mui/material";
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
          <Autocomplete
            id="namespace"
            size="small"
            disableClearable
            autoHighlight
            options={collections}
            value={selectedCollection}
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.prefix}
            isOptionEqualToValue={(option, value) => option.prefix === value.prefix}
            filterOptions={(options, { inputValue }) => {
              const query = inputValue.trim().toLowerCase();
              if (!query) return options;
              return options.filter(
                (o) => o.name.toLowerCase().includes(query) || o.prefix.toLowerCase().includes(query)
              );
            }}
            onChange={(_, newCollection) => {
              if (newCollection) {
                handleChange(newCollection);
              }
            }}
            sx={{ minWidth: 300, my: 1 }}
            slotProps={{ listbox: { sx: { py: 0 } } }}
            renderInput={(params) => <TextField {...params} label="Namespace" />}
            renderOption={(props, collection) => {
              const { key, ...optionProps } = props;
              const starred = isStarred(collection.prefix);
              return (
                <li
                  key={key}
                  {...optionProps}
                  style={{ ...optionProps.style, display: 'flex', alignItems: 'center', flexWrap: 'nowrap', paddingRight: 8 }}
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
                    // Toggling the star must not select the namespace, so we swallow the
                    // mousedown/click/keydown before the Autocomplete option handler sees it.
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
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
                </li>
              );
            }}
          />
          <IconButton href={"https://github.com/PelicanPlatform/web-client/issues/new"} color={'secondary'}>
            <Bug />
          </IconButton>
        </Box>
			</Box>
		</Toolbar>
	);
};

export default DesktopHeader;
