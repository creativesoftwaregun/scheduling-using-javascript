import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon } from 'lucide-react';
interface ThemeToggleProps {
  className?: string;
}
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}