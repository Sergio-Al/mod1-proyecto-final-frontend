import React, { ReactNode } from 'react';
import { Header } from '../components/Header';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  onLogout
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header title={title} onLogout={onLogout} />
      
      <main className="flex-grow p-4">
        <div className="container mx-auto max-w-6xl">
          {children}
        </div>
      </main>
      
      <footer className="bg-base-200 p-4 mt-8">
        <div className="container mx-auto text-center text-sm opacity-70">
          © {new Date().getFullYear()} Gestor de tareas - Proyecto para la maestria
        </div>
      </footer>
    </div>
  );
};
