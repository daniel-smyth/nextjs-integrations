import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import List from '@mui/material/List';

import { SidebarItems } from '../../types/sidebar';
import SidebarNavSection from './SidebarNavSection';

const baseScrollbar = (props: any) => css`
  background-color: ${props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-grow: 1;
`;

const Scrollbar = styled.div`
  ${baseScrollbar}
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)};
  padding-bottom: ${(props) => props.theme.spacing(2.5)};
`;

interface SidebarNavProps {
  items: {
    title: string;
    pages: SidebarItems[];
  }[];
}

function SidebarNav({ items }: SidebarNavProps) {
  return (
    <Scrollbar>
      <List disablePadding>
        <Items>
          {items &&
            items.map((item) => (
              <SidebarNavSection
                component="div"
                key={item.title}
                pages={item.pages}
                title={item.title}
              />
            ))}
        </Items>
      </List>
    </Scrollbar>
  );
}

export default SidebarNav;
