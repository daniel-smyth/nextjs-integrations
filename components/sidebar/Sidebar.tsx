import React from 'react';
import styled from '@emotion/styled';

import { spacing } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';

import { SidebarItems } from '../../types/sidebar';
import Footer from './SidebarFooter';
import SidebarNav from './SidebarNav';

const Box = styled(MuiBox)(spacing);

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Brand = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;

  ${(props) => props.theme.breakpoints.up('sm')} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

export interface SidebarProps {
  PaperProps: {
    style: {
      width: number;
    };
  };
  variant?: 'permanent' | 'persistent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
  items: {
    title: string;
    pages: SidebarItems[];
  }[];
  showFooter?: boolean;
}

function Sidebar({ items, showFooter = true, ...rest }: SidebarProps) {
  return (
    <Drawer variant="permanent" {...rest}>
      <Brand>
        <Box>
          <Typography variant="h3">Blinq • Integrations</Typography>
        </Box>
      </Brand>
      <SidebarNav items={items} />
      {!!showFooter && <Footer />}
    </Drawer>
  );
}

export default Sidebar;
