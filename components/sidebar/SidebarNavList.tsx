import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { SidebarItems } from '../../types/sidebar';
import SidebarNavListItem from './SidebarNavListItem';

interface ReduceChildRoutesProps {
  depth: number;
  page: SidebarItems;
  items: JSX.Element[];
  currentRoute: string;
}

const reduceChildRoutes = (props: ReduceChildRoutesProps) => {
  const { items, page, depth, currentRoute } = props;

  if (page.children) {
    const open = currentRoute.includes(page.href);

    items.push(
      <SidebarNavListItem
        depth={depth}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        open={!!open}
        title={page.title}
        href={page.href}
      >
        <SidebarNavList depth={depth + 1} pages={page.children} />
      </SidebarNavListItem>
    );
  } else {
    items.push(
      <SidebarNavListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        title={page.title}
      />
    );
  }

  return items;
};

interface SidebarNavListProps {
  depth: number;
  pages: SidebarItems[];
}

function SidebarNavList(props: SidebarNavListProps) {
  const { pages, depth } = props;
  const { pathname } = useRouter();

  const childRoutes = pages.reduce(
    (items, page) =>
      reduceChildRoutes({ items, page, currentRoute: pathname, depth }),
    [] as JSX.Element[]
  );

  return childRoutes as unknown as ReactElement<any, any>;
}

export default SidebarNavList;
