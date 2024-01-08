import { Grid, Typography } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

function AboutPage() {
  return (
    <>
      <ResponsiveAppBar />

      <Grid container marginTop={2}>
        <Grid item xs={1} md={3} />
        <Grid item md={6} xs={10}>
          <Typography variant="h3">About</Typography>
          <Typography variant="body1">
            Welcome to the innovative and interactive sidewalk in Vancouver, BC,
            Canada. This sidewalk is not just any ordinary sidewalk, but it is a
            masterpiece of creativity and technology. It is designed with lights
            underneath each of the glass squares, allowing them to light up and
            spell words. The best part is that anyone from anywhere in the world
            can change what the sidewalk says by simply connecting their wallet
            to the Polygon Network and making a small 1 MATIC donation.
            <br />
            <br />
            This sidewalk is a unique platform for expression and creativity.
            Whether you want to share a message of love, hope, or simply want to
            spread a smile, this sidewalk provides you with the opportunity to
            do so. However, please be mindful that vulgar profanity and hate
            speech will not be tolerated and will be taken down. This is a
            public space for everyone to enjoy, so please be respectful of all
            individuals and groups.
            <br />
            <br />
            All you have to do is connect your wallet, make a donation, and the
            sidewalk will display your message for the world to see. Your
            message will be protected for 1 minute and after that, the next
            message in the queue will be displayed. Your message will remain if
            there are no messages after yours or until someone requests a new
            message.
            <br />
            <br />
            By using this sidewalk, you are not only spreading your message but
            also supporting a good cause. All donations made through this
            platform will go towards the infrastructure of the DCTRL Hackerspace
            and the upkeep of this project. This is your chance to contribute to
            a unique and innovative project while expressing yourself in a
            unique way.
            <br />
            <br />
            So what are you waiting for? Connect your wallet, make a donation,
            and let your message light up the sidewalk! Just remember to be
            mindful and respectful of all individuals and groups while using
            this public space.
          </Typography>
        </Grid>
        <Grid item xs={1} md={3} />
      </Grid>
    </>
  );
}

export default AboutPage;
