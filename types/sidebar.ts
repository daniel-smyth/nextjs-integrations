export declare type SidebarItems = {
  href: string;
  title: string;
  icon: React.FC<any>;
  children: SidebarItems[];
  badge?: string;
};
