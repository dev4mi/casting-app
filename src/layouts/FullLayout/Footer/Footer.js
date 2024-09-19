import React from 'react'
import {
    Box,
    Link,
    Typography,
    
  } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite'; 
const Footer = () => {
    return ( 
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography>Sand Casting © {new Date().getFullYear()}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography>Developed with  <FavoriteIcon sx={{ color: 'red', mx: 0.5 }} /> By 4m!</Typography>
                </Box>
            </Box>
        </>
     );
}
 
export default Footer;