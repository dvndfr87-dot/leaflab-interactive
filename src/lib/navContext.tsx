import { createContext, useContext, ReactNode } from "react";

interface NavContextValue {
  goToScene: (scene: number) => void;
  reset: () => void;
}

const NavContext = createContext<NavContextValue | null>(null);

export const NavProvider = ({
  value,
  children,
}: {
  value: NavContextValue;
  children: ReactNode;
}) => <NavContext.Provider value={value}>{children}</NavContext.Provider>;

export const useNav = (): NavContextValue => {
  const ctx = useContext(NavContext);
  if (!ctx) {
    return { goToScene: () => {}, reset: () => {} };
  }
  return ctx;
};
