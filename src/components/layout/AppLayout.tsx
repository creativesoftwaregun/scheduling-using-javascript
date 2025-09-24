import { ChronoHeader } from '@/components/calendar/ChronoHeader';
interface AppLayoutProps {
  children: React.ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-muted/30">
      <ChronoHeader />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}