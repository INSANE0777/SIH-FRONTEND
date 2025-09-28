// src/components/MapLoader.tsx

"use client"; // This is the most important line. It marks this as a Client Component.

import dynamic from 'next/dynamic';
import { CircularProgress, Box, Typography } from "@mui/material";

// The dynamic import is now safely inside a Client Component.
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false, // This is allowed here
  loading: () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ height: '70vh' }}
    >
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading Map...</Typography>
    </Box>
  ),
});

// This component simply returns the dynamically loaded MapView
export default function MapLoader() {
  return <MapView />;
}