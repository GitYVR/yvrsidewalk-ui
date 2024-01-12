import {
  Grid,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useSigner } from 'wagmi';
// import ReactPlayer from "react-player";
import { useCallback, useMemo, useState } from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { FixedSizeList } from 'react-window';
import { useModal } from 'connectkit';
import { parseUnits } from '@ethersproject/units';
import { ethers } from 'ethers';
import { TwitchPlayer } from 'react-twitch-embed';
import { RECIPIENT_ADDRESS } from './common/constants';
import { Currency, useCurrency } from './common/currency';
import environment from './environment';
import useSWR from 'swr';

const QUEUE_URL = (() => {
  const url = new URL(environment.REACT_APP_BACKEND_BASE_URL);
  url.pathname = '/queue';
  return url;
})();

function getPriceUrl(currency: Currency) {
  if (currency === Currency.MATIC || currency === Currency.USDC) {
    return;
  }
  const url = new URL(environment.REACT_APP_BACKEND_BASE_URL);
  url.pathname = '/price';
  url.search = '?token=' + currency;
  return url.toString();
}

function App() {
  const { data: signer } = useSigner();
  const { setOpen } = useModal();
  const { enqueueSnackbar } = useSnackbar();

  const [sidewalkText, setSidewalkText] = useState('');
  const [paying, setPaying] = useState(false);
  const { currency } = useCurrency();

  const {
    data: { queue },
  } = useSWR(QUEUE_URL, {
    fallbackData: { queue: [] },
    refreshInterval: 30_000,
  });

  const changeSidewalkText = useCallback(async () => {
    if (sidewalkText.length === 0) {
      return;
    }
    setPaying(true);
    enqueueSnackbar('Queuing sidewalk text', { variant: 'info' });
    try {
      switch (currency) {
        case Currency.MATIC: {
          if (signer === undefined || signer === null) return;
          try {
            const tx = await signer.sendTransaction({
              to: RECIPIENT_ADDRESS,
              value: parseUnits('1'),
              data: ethers.utils.hexlify(
                ethers.utils.toUtf8Bytes(sidewalkText),
              ),
            });
            await tx.wait();
            enqueueSnackbar('Sidewalk text queued', { variant: 'success' });
          } catch (e) {
            enqueueSnackbar('Failed to queue', { variant: 'error' });
          }
          break;
        }
        default:
          throw new Error('unimplemented');
      }
    } finally {
      setPaying(false);
    }
  }, [currency, sidewalkText, signer, enqueueSnackbar]);

  const handleDonateClick = useCallback(() => {
    switch (currency) {
      case Currency.MATIC: {
        console.log('signer', signer);
        if (signer === undefined || signer === null) {
          setOpen(true);
          return;
        }
        changeSidewalkText();
        break;
      }
      default:
        throw new Error('unimplemented');
    }
  }, [changeSidewalkText, currency, setOpen, signer]);

  const donationAmount = useMemo(() => {
    if (currency == null) {
      return;
    }
    switch (currency) {
      case Currency.MATIC:
        return 1;
      default:
        currency satisfies never;
    }
  }, [currency]);

  const donationDisplayAmount = useMemo(() => {
    if (currency == null || donationAmount == null) {
      return <LinearProgress variant="indeterminate" sx={{ width: 100 }} />;
    } else {
      switch (currency) {
        case Currency.MATIC:
          return `${donationAmount} MATIC`;
        default:
          currency satisfies never;
      }
    }
  }, [currency, donationAmount]);

  return (
    <>
      <ResponsiveAppBar />

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* For Youtube */}
        {/* <ReactPlayer
          url={"https://player.twitch.tv/?channel=yvrsidewalk&parent=streamernews.example.com"}
          playing={true}
          width="100%"
        /> */}
        <TwitchPlayer
          channel="yvrsidewalk"
          parent="streamernews.example.com"
          autoplay={true}
        />
      </Box>

      <Grid container marginTop={2}>
        <Grid item xs={1} md={3} />
        <Grid item md={6} xs={10}>
          <TextField
            onChange={(e) => {
              // Alphabets and spaces only
              setSidewalkText(
                e.target.value.replace(/[^a-zA-Z ]/g, '').slice(0, 64),
              );
            }}
            value={sidewalkText}
            variant="outlined"
            fullWidth
            placeholder="New sidewalk text (max 64 characters, alphabets and spaces only)"
          />
          <Button
            onClick={handleDonateClick}
            disabled={paying || donationAmount == null || sidewalkText === ''}
            style={{ marginTop: '10px' }}
            fullWidth
            variant="contained"
          >
            {paying ? (
              'Changing text...'
            ) : (
              <>
                <span>Change sidewalk text (Donate:</span>
                {'\xa0'}
                <span>{donationDisplayAmount}</span>
                <span>)</span>
              </>
            )}
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
              width: '100%',
              height: 400,
              bgcolor: 'background.paper',
            }}
          >
            {queue.length > 0 ? (
              <FixedSizeList
                height={250}
                width={'100%'}
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
                      <ListItemText primary={`${index + 1}. ${queue[index]}`} />
                    </ListItemButton>
                  </ListItem>
                )}
              </FixedSizeList>
            ) : (
              'Nothing queued'
            )}
          </Box>
        </Grid>
        <Grid item xs={1} md={3} />
      </Grid>
    </>
  );
}

export default App;
