import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import React from "react";

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import {HeaderProps} from "@/src/components/Header";

const Header = ({handleChange, collections, collection, isStarred, onToggleStar}: HeaderProps) => {
	return (
		<AppBar position="sticky" elevation={0}>
			<Container maxWidth="lg">
				<Box sx={{ display: { xs: 'block', md: 'none' } }}>
					<MobileHeader collection={collection} handleChange={handleChange} collections={collections} isStarred={isStarred} onToggleStar={onToggleStar} />
				</Box>
				<Box sx={{ display: { xs: 'none', md: 'block' } }}>
					<DesktopHeader collection={collection} handleChange={handleChange} collections={collections} isStarred={isStarred} onToggleStar={onToggleStar} />
				</Box>
			</Container>
		</AppBar>
	)
}

export default Header;
