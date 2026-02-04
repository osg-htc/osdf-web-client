import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			component="footer"
			sx={{
				backgroundColor: 'primary.main',
				color: 'primary.contrastText',
				py: 4,
				mt: 'auto',
			}}
		>
			<Container maxWidth="lg">
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						justifyContent: 'space-between',
						alignItems: { xs: 'center', md: 'flex-start' },
						gap: 3,
					}}
				>
					<Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
						<Typography variant="h6" gutterBottom>
							Open Science Data Federation
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.9 }}>
							Part of the OSG
						</Typography>
					</Box>

					<Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
						<Typography variant="body2" sx={{ mb: 1 }}>
							<Link
								href="https://osg-htc.org"
								target="_blank"
								rel="noopener noreferrer"
								sx={{ color: 'inherit', textDecoration: 'underline' }}
							>
								OSG Consortium
							</Link>
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.9 }}>
							© {currentYear} OSG Consortium
						</Typography>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;

