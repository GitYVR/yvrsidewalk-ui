import {
  CircularProgress,
  Grid,
  Link,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { RECIPIENT_ADDRESS } from "../common/constants";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import { FixedSizeList } from "react-window";
import { ethers } from "ethers";
import { getENSNames, prettyAddress } from "../common/utils";

type PolygonscanTx = {
  blockHash: string;
  blockNumber: string;
  input: string;
  hash: string;
  from: string;
  to: string;
};

function HistoryPage() {
  const [ensNamesKV, setEnsNamesKV] = useState<null | {
    [key: string]: string;
  }>(null);
  const [historicalTxs, setHistoricalTxs] = useState<null | PolygonscanTx[]>(
    null
  );

  const getENS = useCallback(async () => {
    if (historicalTxs === null) return;
    const kv = await getENSNames(historicalTxs.map((x) => x.from));
    setEnsNamesKV(kv);
  }, [historicalTxs]);

  const getHistoricalTx = useCallback(async () => {
    const resp = await fetch(
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${RECIPIENT_ADDRESS}&startblock=39079318&endblock=99999999&page=1&offset=50&sort=desc&apikey=V19AV5Z8XEPZCD237SK6JXGG2CB9ZB6VRR`
    ).then((x) => x.json());
    const txs = resp.result;
    const txsNormalized = txs.map((x: PolygonscanTx) => {
      return {
        ...x,
        to: ethers.utils.getAddress(x.to),
        from: ethers.utils.getAddress(x.from),
      };
    });
    setHistoricalTxs(txsNormalized as PolygonscanTx[]);
  }, []);

  useEffect(() => {
    if (historicalTxs === null) getHistoricalTx();
    if (historicalTxs !== null && ensNamesKV === null) getENS();
  }, [historicalTxs, getHistoricalTx]);

  return (
    <>
      <ResponsiveAppBar />

      <Grid container marginTop={2}>
        <Grid item xs={1} md={3} />
        <Grid item md={6} xs={10}>
          <Typography variant="h3">History</Typography>
          <Typography variant="subtitle1">Last 50 messages</Typography>
          <div style={{ marginTop: "25px" }}></div>

          {historicalTxs !== null ? (
            <FixedSizeList
              height={500}
              width={"100%"}
              itemSize={50}
              itemCount={historicalTxs.length}
              overscanCount={5}
            >
              {({ index, style }) => {
                const curTx = historicalTxs[index];
                let maybeStr = "[ERROR DECODING]";
                try {
                  maybeStr = ethers.utils
                    .toUtf8String(historicalTxs[index].input)
                    .slice(0, 64);
                } catch (e) {}
                let displayName = curTx.from;
                if (ensNamesKV) {
                  const curEnsName =
                    ensNamesKV[ethers.utils.getAddress(displayName)];
                  if (curEnsName !== undefined && curEnsName !== "") {
                    displayName = curEnsName;
                  }
                }

                return (
                  <ListItem
                    style={style}
                    key={index}
                    component="div"
                    disablePadding
                  >
                    <ListItemButton>
                      <Link
                        href={`https://polygonscan.com/tx/${curTx.hash}`}
                        color="inherit"
                        style={{ textDecoration: "none" }}
                      >
                        <ListItemText
                          primary={`${index + 1}. [${prettyAddress(
                            displayName
                          )}]: ${maybeStr}`}
                        />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                );
              }}
            </FixedSizeList>
          ) : (
            <CircularProgress />
          )}
        </Grid>
        <Grid item xs={1} md={3} />
      </Grid>
    </>
  );
}

export default HistoryPage;
