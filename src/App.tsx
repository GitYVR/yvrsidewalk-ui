import {
  Grid,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useSigner } from "wagmi";
import ReactPlayer from "react-player";
import { useCallback, useState } from "react";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { FixedSizeList } from "react-window";
import { useModal } from "connectkit";
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";

const MULTISIG_ADDRESS = "0xD5184c0d23f7551DB7c8c4a3a3c5F1685059A09c";

function App() {
  const { data: signer } = useSigner();
  const { setOpen } = useModal();
  const { enqueueSnackbar } = useSnackbar();

  const [sidewalkText, setSidewalkText] = useState("");
  const [paying, setPaying] = useState(false);

  const changeSidewalkText = useCallback(async () => {
    if (sidewalkText.length === 0) {
    }
    if (signer === undefined || signer === null) return;

    setPaying(true);
    enqueueSnackbar("Queuing sidewalk text", { variant: "info" });
    try {
      const tx = await signer.sendTransaction({
        to: MULTISIG_ADDRESS,
        value: parseUnits("1"),
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(sidewalkText)),
      });
      await tx.wait();
      enqueueSnackbar("Sidewalk text queued", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("Failed to queue", { variant: "error" });
    }
    setPaying(false);
  }, [signer, sidewalkText, enqueueSnackbar]);

  return (
    <>
      <ResponsiveAppBar />

      <Box>
        <ReactPlayer
          url={"https://www.youtube.com/watch?v=cj3ikJPhyR8"}
          playing={true}
          width="100%"
        />
      </Box>

      <Grid container marginTop={2}>
        <Grid item xs={1} md={3} />
        <Grid item md={6} xs={10}>
          <TextField
            onChange={(e) => {
              // Alphabets and spaces only
              setSidewalkText(
                e.target.value.replace(/[^a-zA-Z ]/g, "").slice(0, 64)
              );
            }}
            value={sidewalkText}
            variant="outlined"
            fullWidth
            placeholder="New sidewalk text (max 64 characters, alphabets and spaces only)"
          />
          <Button
            onClick={() => {
              console.log("signer", signer);
              if (signer === undefined || signer === null) {
                setOpen(true);
                return;
              }
              changeSidewalkText();
            }}
            disabled={paying}
            style={{ marginTop: "10px" }}
            fullWidth
            variant="contained"
          >
            {paying
              ? "Changing text..."
              : "Change sidewalk text (Cost: 1 MATIC)"}
          </Button>

          <Alert severity="info">Livestream lags by ~30 seconds</Alert>
        </Grid>
        <Grid item xs={1} md={3} />
      </Grid>

      <Grid container marginTop={2}>
        <Grid item xs={1} md={3} />
        <Grid item md={6} xs={10}>
          <Typography variant="h5">In Queue</Typography>
          <Box
            sx={{
              width: "100%",
              height: 400,
              bgcolor: "background.paper",
            }}
          >
            <FixedSizeList
              height={250}
              width={"100%"}
              itemSize={46}
              itemCount={10}
              overscanCount={5}
            >
              {({ index, style }) => (
                <ListItem
                  style={style}
                  key={index}
                  component="div"
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText primary={`Item ${index + 1}`} />
                  </ListItemButton>
                </ListItem>
              )}
            </FixedSizeList>
          </Box>
        </Grid>
        <Grid item xs={1} md={3} />
      </Grid>
    </>
  );
}

export default App;
