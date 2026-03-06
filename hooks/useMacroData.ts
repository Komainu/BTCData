// hooks/useMacroData.ts
import { useState, useEffect, useCallback } from 'react';
import type { BTCData, GlobalData, FearGreed, FredData, FredObservation } from '@/types/dashboard';

export function useMacroData() {
  const [fredApiKey, setFredApiKey] = useState<string>('');
  const [btcData, setBtcData] = useState<BTCData | null>(null);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreed | null>(null);
  const [fredData, setFredData] = useState<FredData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 初回マウント時にlocalStorageからAPIキーを復元
  useEffect(() => {
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('fredApiKey') : null;
    if (savedKey) setFredApiKey(savedKey);
  }, []);

  const saveApiKey = (key: string) => {
    setFredApiKey(key);
    if (key) {
      localStorage.setItem('fredApiKey', key);
    } else {
      localStorage.removeItem('fredApiKey');
    }
  };

  const fetchFredSeries = async (seriesId: string, apiKey: string, limit = 90): Promise<FredObservation[]> => {
    const url = `/api/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`FRED API error: ${res.status}`);
    const data = await res.json();
    return data.observations
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({ date: obs.date, value: parseFloat(obs.value) }));
  };

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // CoinGecko API
      const [btcRes, globalRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true'),
        fetch('https://api.coingecko.com/api/v3/global')
      ]);
      const btcJson = await btcRes.json();
      const globalJson = await globalRes.json();
      
      setBtcData({
        price: btcJson.bitcoin.usd,
        marketCap: btcJson.bitcoin.usd_market_cap,
        volume24h: btcJson.bitcoin.usd_24h_vol,
        change24h: btcJson.bitcoin.usd_24h_change,
      });
      setGlobalData({ btcDominance: globalJson.data.market_cap_percentage.btc });

      // Fear & Greed API
      const fgRes = await fetch('https://api.alternative.me/fng/?limit=1&format=json');
      const fgJson = await fgRes.json();
      setFearGreed({
        value: parseInt(fgJson.data[0].value, 10),
        classification: fgJson.data[0].value_classification,
      });

      // FRED API (キーがある場合のみ)
      if (fredApiKey) {
        const [sofr, iorb, effr, dgs10, dxy] = await Promise.all([
          fetchFredSeries('SOFR', fredApiKey, 120),
          fetchFredSeries('IORB', fredApiKey, 120),
          fetchFredSeries('EFFR', fredApiKey, 120),
          fetchFredSeries('DGS10', fredApiKey, 10),
          fetchFredSeries('DTWEXBGS', fredApiKey, 10),
        ]);
        setFredData({ sofr, iorb, effr, dgs10, dxy });
      }
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, [fredApiKey]);

  // 初回取得と定期更新
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  return {
    btcData, globalData, fearGreed, fredData, isLoading, lastUpdated,
    fredApiKey, saveApiKey, fetchAllData
  };
}
