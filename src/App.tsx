import { AppBar, Toolbar, Typography, Grid, Container } from "@mui/material";
import { ConnectKitButton } from "connectkit";
import { useSigner } from "wagmi";
import ReactPlayer from "react-player";

function App() {
  const { data: signer, isLoading } = useSigner();

  return (
    <>
      <Grid container height={"64px"}>
        <AppBar>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              YVRSidewalk
            </Typography>
            <ConnectKitButton />
          </Toolbar>
        </AppBar>
      </Grid>

      <Grid
        marginTop={2}
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} style={{ width: "auto", height: "auto" }}>
          <ReactPlayer
            url={"https://www.youtube.com/watch?v=cj3ikJPhyR8"}
            playing={true}
            style={{
              width: "100%",
              position: "relative",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
