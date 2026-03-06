// app/page.tsx
"use client";

import { useState } from 'react';
import { useMacroData } from '@/hooks/useMacroData';
// Chart.js を使う場合は 'react-chartjs-2' などをインポートします

export default function DashboardPage() {
  const { 
    btcData, globalData, fearGreed, fredData, 
    isLoading, lastUpdated, fredApiKey, saveApiKey, fetchAllData 
  } = useMacroData();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(fredApiKey);

  // フォーマット用のヘルパー関数群
  const formatCurrency = (val?: number) => val ? `$${val.toLocaleString()}` : '---';
  const formatPercent = (val?: number) => val ? `${val >= 0 ? '+' : ''}${val.toFixed(2)}%` : '---';

  const handleSaveSettings = () => {
    saveApiKey(tempApiKey);
    setIsSettingsOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans">
      {/* ヘッダーエリア */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">BTC Macro Dashboard</h1>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-slate-400">
            最終更新: {lastUpdated ? lastUpdated.toLocaleTimeString('ja-JP') : '---'}
          </span>
          <button 
            onClick={fetchAllData} 
            className={`p-2 bg-slate-800 rounded ${isLoading ? 'animate-spin' : ''}`}
          >
            🔄
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-slate-800 rounded"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* BTC サマリー */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-sm text-slate-400">BTC Price</h2>
          <p className="text-2xl font-bold">{formatCurrency(btcData?.price)}</p>
          <p className={`text-sm ${btcData?.change24h && btcData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatPercent(btcData?.change24h)}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-sm text-slate-400">Dominance</h2>
          <p className="text-2xl font-bold">{globalData?.btcDominance.toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-sm text-slate-400">Fear & Greed</h2>
          <p className="text-2xl font-bold">{fearGreed?.value || '---'}</p>
          <p className="text-sm text-slate-400">{fearGreed?.classification || '---'}</p>
        </div>
      </section>

      {/* FRED マクロデータ (APIキーがある場合のみ表示) */}
      {!fredApiKey ? (
        <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg text-yellow-200">
          FREDデータを表示するには、設定(⚙️)からAPIキーを入力してください。
        </div>
      ) : (
        <section className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Macro Indicators (FRED)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400">SOFR</p>
              <p className="text-xl">{fredData?.sofr[0]?.value.toFixed(2) || '---'}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">IORB</p>
              <p className="text-xl">{fredData?.iorb[0]?.value.toFixed(2) || '---'}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">DXY</p>
              <p className="text-xl">{fredData?.dxy[0]?.value.toFixed(2) || '---'}</p>
            </div>
          </div>
          {/* ここに react-chartjs-2 等を用いたチャートコンポーネントを配置します */}
        </section>
      )}

      {/* 設定モーダル */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">FRED API Key</label>
              <input 
                type="password" 
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                placeholder="abcdef1234567890..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                キャンセル
              </button>
              <button 
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
