import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);

const PIN_CODE = "1234";

export function AppProvider({ children }) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinCallback, setPinCallback] = useState(null);

  const requestPin = useCallback((onSuccess) => {
    setPinCallback(() => onSuccess);
    setPinModalOpen(true);
  }, []);

  const submitPin = useCallback((pin) => {
    if (pin === PIN_CODE) {
      if (pinCallback) pinCallback();
      setPinCallback(null);
      setPinModalOpen(false);
      return true;
    }
    return false;
  }, [pinCallback]);

  const cancelPin = useCallback(() => {
    setPinCallback(null);
    setPinModalOpen(false);
  }, []);

  const toggleBalance = useCallback(() => {
    if (!balanceVisible) {
      requestPin(() => setBalanceVisible(true));
    } else {
      setBalanceVisible(false);
    }
  }, [balanceVisible, requestPin]);

  return (
    <AppContext.Provider value={{
      balanceVisible,
      toggleBalance,
      pinModalOpen,
      submitPin,
      cancelPin,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
