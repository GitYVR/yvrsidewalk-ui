import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ElderlyIcon from '@mui/icons-material/Elderly';

import { ConnectKitButton } from 'connectkit';
import { Link } from 'react-router-dom';
import { FormControl, InputLabel, Select } from '@mui/material';
import { Currency, useCurrency } from '../common/currency';
import BonkImage from './token-icons/bonk.png';
import { ReactComponent as MaticIcon } from './token-icons/matic.svg';
import { ReactComponent as SOLIcon } from './token-icons/sol.svg';
import { ReactComponent as USDCIcon } from './token-icons/usdc.svg';

const pages = ['History', 'About'];

const TOKENS = {
  [Currency.BONK]: {
    label: 'Bonk',
    icon: <img alt="Bonk" height={20} src={BonkImage} width={20} />,
    network: 'Solana',
  },
  [Currency.MATIC]: {
    label: 'Matic',
    icon: <MaticIcon height={20} width={20} />,
    network: 'Polygon',
  },
  [Currency.SOL]: {
    label: 'SOL',
    icon: <SOLIcon height={20} width={20} />,
    network: 'Solana',
  },
  [Currency.USDC]: {
    label: 'USDC',
    icon: <USDCIcon height={20} width={20} />,
    network: 'Solana',
  },
};

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { currency, setCurrency } = useCurrency();

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ElderlyIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            YVRSidewalk
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <Link
                  to={`/${page.toLowerCase()}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <ElderlyIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              YVRSW
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link
                to={`/${page.toLowerCase()}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 0,
              gap: 2,
            }}
          >
            <FormControl size="small">
              <InputLabel id="currency-select-label">Pay with</InputLabel>
              <Select
                label="Choose a token"
                labelId="currency-select-label"
                onChange={function (e) {
                  setCurrency(e.target.value as Currency);
                }}
                renderValue={(currency) => (
                  <Box gap={1} display="flex" alignItems="center">
                    {TOKENS[currency].icon} {TOKENS[currency].label}
                  </Box>
                )}
                value={currency}
              >
                {Object.entries(TOKENS).map(
                  ([currency, { icon, label, network }]) => (
                    <MenuItem value={currency} key={currency}>
                      <Box gap={1} display="flex" alignItems="center">
                        {icon} {label} ({network})
                      </Box>
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>{' '}
            <Tooltip title="Web3 Acccount">
              <ConnectKitButton />
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
