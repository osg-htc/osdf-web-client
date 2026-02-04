'use client'

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import React from "react";

import Title from "@/components/Header/Title";
import {NavigationItem} from "@/components/Header";

const DesktopHeader = () => {
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
				<Box>
					<Title />
				</Box>

				{/* Right: spacer column to balance the left (so centering looks right). */}
				<Box>
          <Button href={"https://github.com/PelicanPlatform/web-client/issues/new"} color={'secondary'} variant="outlined">
            Report Issue/Request Feature
          </Button>
        </Box>
			</Box>
		</Toolbar>
	);
};

export default DesktopHeader;
