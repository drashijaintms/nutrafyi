import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const CURRENCIES = {
  USD: { code: "USD", symbol: "$", label: "US Dollar (USD)", flag: "🇺🇸" },
  INR: { code: "INR", symbol: "₹", label: "Indian Rupee (INR)", flag: "🇮🇳" },
  EUR: { code: "EUR", symbol: "€", label: "Euro (EUR)", flag: "🇪🇺" },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem("selected_currency") || "USD";
  });

  // Rates relative to USD base
  const [rates, setRates] = useState({
    USD: 1.0,
    INR: 83.5, // sensible fallback
    EUR: 0.92, // sensible fallback
  });

  const fetchRates = async () => {
    const urls = [
      { url: "https://open.er-api.com/v6/latest/USD", type: "standard" },
      { url: "https://api.exchangerate-api.com/v4/latest/USD", type: "standard" },
      { url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", type: "fawaz" }
    ];

    for (const item of urls) {
      try {
        const res = await fetch(item.url);
        if (res.ok) {
          const data = await res.json();
          if (item.type === "standard" && data && data.rates) {
            setRates({
              USD: 1.0,
              INR: data.rates.INR || 83.5,
              EUR: data.rates.EUR || 0.92,
            });
            console.log("Successfully fetched rates from", item.url);
            return;
          } else if (item.type === "fawaz" && data && data.usd) {
            setRates({
              USD: 1.0,
              INR: data.usd.inr ? parseFloat(data.usd.inr) : 83.5,
              EUR: data.usd.eur ? parseFloat(data.usd.eur) : 0.92,
            });
            console.log("Successfully fetched rates from fallback", item.url);
            return;
          }
        }
      } catch (err) {
        console.error(`Failed to fetch exchange rates from ${item.url}:`, err);
      }
    }
  };

  const changeCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem("selected_currency", code);
      window.dispatchEvent(new Event("currency_changed"));
    }
  };

  useEffect(() => {
    fetchRates();

    const detectLocation = async () => {
      // Don't auto-detect if the user manually selected one
      if (localStorage.getItem("selected_currency")) return;

      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          const detectedCurrency = data.currency;
          if (CURRENCIES[detectedCurrency]) {
            changeCurrency(detectedCurrency);
          } else if (data.country_code === "IN" || data.country === "India") {
            changeCurrency("INR");
          } else if (
            ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "IE", "FI"].includes(
              data.country_code
            )
          ) {
            changeCurrency("EUR");
          }
        }
      } catch (err) {
        console.error("Failed to detect location:", err);
      }
    };

    detectLocation();
  }, []);

  /**
   * Formats price value dynamically with symbol based on selected currency.
   * @param {string|number} basePriceUSD - The standard USD price.
   * @param {object} productOverrides - Currency overrides e.g. { INR: { salePrice: '500', regularPrice: '600' } }
   * @param {boolean} forceRegularPrice - If true, ignores salePrice and returns regular price.
   */
  const formatPrice = (basePriceUSD, productOverrides = {}, forceRegularPrice = false) => {
    const cleanBasePrice = typeof basePriceUSD === "string"
      ? parseFloat(basePriceUSD.replace(/[^\d.]/g, ""))
      : parseFloat(basePriceUSD);

    if (isNaN(cleanBasePrice)) return "";

    const activeCurrency = CURRENCIES[currency];

    // 1. Check for overrides
    if (productOverrides && productOverrides[currency]) {
      const overrideVal = forceRegularPrice
        ? parseFloat(productOverrides[currency].regularPrice)
        : parseFloat(productOverrides[currency].salePrice || productOverrides[currency].regularPrice);

      if (!isNaN(overrideVal)) {
        return `${activeCurrency.symbol}${overrideVal.toFixed(2)}`;
      }
    }

    // 2. Otherwise convert
    const rate = rates[currency] || 1.0;
    const converted = cleanBasePrice * rate;
    return `${activeCurrency.symbol}${converted.toFixed(2)}`;
  };

  /**
   * Returns a raw numeric price, either from overrides or converted using exchange rates.
   */
  const getNumericPrice = (basePriceUSD, productOverrides = {}, forceRegularPrice = false) => {
    const cleanBasePrice = typeof basePriceUSD === "string"
      ? parseFloat(basePriceUSD.replace(/[^\d.]/g, ""))
      : parseFloat(basePriceUSD);

    if (isNaN(cleanBasePrice)) return 0;

    if (productOverrides && productOverrides[currency]) {
      const overrideVal = forceRegularPrice
        ? parseFloat(productOverrides[currency].regularPrice)
        : parseFloat(productOverrides[currency].salePrice || productOverrides[currency].regularPrice);

      if (!isNaN(overrideVal)) return overrideVal;
    }

    const rate = rates[currency] || 1.0;
    return cleanBasePrice * rate;
  };

  /**
   * Determines if a product currently has an active sale price,
   * checking both currency overrides and base USD prices.
   */
  const hasActiveSale = (product) => {
    if (!product) return false;
    
    // Check currency override first
    if (product.currencyOverrides && product.currencyOverrides[currency]) {
      const ov = product.currencyOverrides[currency];
      const saleVal = parseFloat(ov.salePrice);
      const regVal = parseFloat(ov.regularPrice);
      if (!isNaN(saleVal) && !isNaN(regVal) && saleVal > 0 && saleVal !== regVal) {
        return true;
      }
      if (!isNaN(regVal) && (isNaN(saleVal) || saleVal === 0)) {
        return false;
      }
    }

    // Fallback to base USD prices
    const toNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;
    const baseSale = toNum(product.salePrice);
    const baseReg = toNum(product.regularPrice || product.price);
    return baseSale > 0 && baseSale !== baseReg;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies: CURRENCIES,
        changeCurrency,
        formatPrice,
        getNumericPrice,
        hasActiveSale,
        symbol: CURRENCIES[currency].symbol,
        flag: CURRENCIES[currency].flag,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
