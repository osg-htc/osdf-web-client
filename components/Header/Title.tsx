import Link from "@mui/material/Link";
import Icon from "@/components/Header/Icon";
import Typography from "@mui/material/Typography";
import React from "react";

const Title = () => (
	<Link href={"/"} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={{lg: 3, xs: 1}} component={'a'}>
		<Typography variant={"h4"} sx={{color: 'primary.contrastText', fontSize: {xs: '1.2rem', lg: '2rem'}, fontWeight: 'bold'}}>
			OSDF Object Browser
		</Typography>
	</Link>
)

export default Title;
