import { Grid, Typography } from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

function AboutPage() {
  return (
    <>
      <ResponsiveAppBar />

      <Grid container marginTop={2}>
        <Grid item xs={1} md={3} />
        <Grid item md={6} xs={10}>
          <Typography variant="h3">About</Typography>
          <Typography variant="body1">YVR Sidewalk is...</Typography>
        </Grid>
        <Grid item xs={1} md={3} />
      </Grid>
    </>
  );
}

export default AboutPage;
