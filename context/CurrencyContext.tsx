
import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = {
  code: string;
  symbol: string;
  label: string;
};

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD ($)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD ($)' },
  { code: 'CNY', symbol: '¥', label: 'CNY (¥)' },
  { code: 'BRL', symbol: 'R$', label: 'BRL (R$)' },
  { code: 'KRW', symbol: '₩', label: 'KRW (₩)' },
  { code: 'RUB', symbol: '₽', label: 'RUB (₽)' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrencyByCode: (code: string) => void;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    // 1. Check Local Storage
    const savedCode = localStorage.getItem('calcmaster_currency');
    if (savedCode) {
      const found = currencies.find(c => c.code === savedCode);
      if (found) {
        setCurrency(found);
        return;
      }
    }

    // 2. Detect via Browser Locale
    const locale = navigator.language || 'en-US';
    let defaultCode = 'USD';

    if (locale.includes('GB') || locale.includes('UK')) defaultCode = 'GBP';
    else if (locale.includes('IN')) defaultCode = 'INR';
    else if (locale.includes('JP')) defaultCode = 'JPY';
    else if (locale.includes('CN')) defaultCode = 'CNY';
    else if (locale.includes('RU')) defaultCode = 'RUB';
    else if (locale.includes('BR')) defaultCode = 'BRL';
    else if (locale.includes('KR')) defaultCode = 'KRW';
    else if (locale.includes('CA')) defaultCode = 'CAD';
    else if (locale.includes('AU')) defaultCode = 'AUD';
    else if (locale.includes('DE') || locale.includes('FR') || locale.includes('IT') || locale.includes('ES') || locale.includes('NL')) defaultCode = 'EUR';

    const detected = currencies.find(c => c.code === defaultCode);
    if (detected) setCurrency(detected);
  }, []);

  const setCurrencyByCode = (code: string) => {
    const found = currencies.find(c => c.code === code);
    if (found) {
      setCurrency(found);
      localStorage.setItem('calcmaster_currency', code);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyByCode, availableCurrencies: currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
