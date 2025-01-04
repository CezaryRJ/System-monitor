// App.js
import React from 'react';
import { Grid2,Box, CssBaseline, Paper, AppBar, Toolbar, Typography } from '@mui/material';
import CustomDrawer from './components/sidebar';
import MainContent from './components/box';


function App() {
  return (

    <Box sx={{ display: 'flex' }}>
      <Grid2 container spacing={2}> 
        <Grid2 item xs={12} sm={6} md={4}>
        <CssBaseline />
        <CustomDrawer />
        </Grid2>
      
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Component 1</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Component 2</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Component 3</Typography>
            </Paper>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default App;
