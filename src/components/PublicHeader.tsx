import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function PublicHeader() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <img src="https://static.vecteezy.com/system/resources/thumbnails/022/791/223/small/blog-site-blogger-png.png" alt="logo" width="32" />
          <Typography variant="h6">BlogApp</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}