'use client';

import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Storage, Close, DataObject } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";

import { usePelicanClient } from "@pelicanplatform/components";

import Title from "@/components/Header/Title";

const MobileHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    objectUrl,
    setObjectUrl,
    getObjectList
  } = usePelicanClient();

  const possibleCollections = [
    {name: "AP40", value: "pelican://osg-htc.org/ospool/ap40"},
    {name: "Collaborations", value: "pelican://osg-htc.org/ospool/uw-shared/collaborations"}
  ];

  const handleCollectionChange = (value: string) => {
    setObjectUrl(value);
    getObjectList(value);
    setDrawerOpen(false);
  };

  const selectedCollection = possibleCollections.filter(collection => objectUrl.startsWith(collection.value))[0];

  console.log(selectedCollection);

  return (
    <>
      <Toolbar
        onClick={() => setDrawerOpen(true)}
        disableGutters sx={{
        minHeight: {xs: 48, md: 56}
      }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box display={'flex'} flexDirection={"column"}>
            <Title />
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{
                flexGrow: 1,
                fontSize: {xs: '0.8rem', md: '1rem'},
                mt: -.5
              }}
            >
              {selectedCollection?.name}
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            aria-label="open object store menu"
            edge="end"
            size={"small"}
          >
            <DataObject />
          </IconButton>
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: '100vw' }}
          role="presentation"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: .4,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Typography variant="h6">Object Store</Typography>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ color: 'primary.contrastText' }}
            >
              <Close />
            </IconButton>
          </Box>
          <List>
            {possibleCollections.map((collection) => {
              const isSelected = objectUrl.startsWith(collection.value);
              return (
                <ListItem key={collection.value} disablePadding>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleCollectionChange(collection.value)}
                  >
                    <ListItemText primary={collection.name} />
                    {isSelected && <CheckIcon color="primary" />}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileHeader;
