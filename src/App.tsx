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
import { useCallback, useEffect, useState } from "react";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { FixedSizeList } from "react-window";
import { useModal } from "connectkit";
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";

// Where funds should go
const RECIPIENT_ADDRESS = "0x9c327C46351a09abbBF440E1E756A3bea9fEc11c";

function App() {
  const { data: signer } = useSigner();
  const { setOpen } = useModal();
  const { enqueueSnackbar } = useSnackbar();

  const [queueInit, setQueueInit] = useState(false);
  const [queue, setQueue] = useState([]);
  const [sidewalkText, setSidewalkText] = useState("");
  const [paying, setPaying] = useState(false);

  const retrieveQueue = useCallback(async () => {
    const resp = await fetch("http://dctrl.asuscomm.com:4000/queue").then((x) =>
      x.json()
    );
    const { queue } = resp;
    setQueue(queue);
  }, []);

  useEffect(() => {
    if (queueInit) return;
    retrieveQueue();
    setInterval(() => retrieveQueue(), 30 * 1000);
    setQueueInit(true);
  }, [retrieveQueue, queueInit]);

  const changeSidewalkText = useCallback(async () => {
    if (sidewalkText.length === 0) {
    }
    if (signer === undefined || signer === null) return;

    setPaying(true);
    enqueueSnackbar("Queuing sidewalk text", { variant: "info" });
    try {
      const tx = await signer.sendTransaction({
        to: RECIPIENT_ADDRESS,
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
            {queue.length > 0 ? (
              <FixedSizeList
                height={250}
                width={"100%"}
                itemSize={32}
                itemCount={queue.length}
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
                      <ListItemText primary={`${queue[index]}`} />
                    </ListItemButton>
                  </ListItem>
                )}
              </FixedSizeList>
            ) : (
              "Nothing queued"
            )}
          </Box>
        </Grid>
        <Grid item xs={1} md={3} />
      </Grid>
    </>
  );
}

export default App;
