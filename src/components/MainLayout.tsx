import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="layout-shell">
      <Sidebar />
      <div className="main-view">
        <HeaderBar />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
