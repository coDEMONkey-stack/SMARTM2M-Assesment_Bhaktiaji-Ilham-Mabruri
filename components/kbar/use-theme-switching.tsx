import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'toggleMode',
      name: 'Toggle Mode',
      shortcut: ['t', 't'],
      section: 'Mode',
      perform: toggleMode
    },
  ];

  useRegisterActions(themeAction, [theme]);
};

export default useThemeSwitching;
