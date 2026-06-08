import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

/**
 * /lp-input — LP Factory: 簡素化版LP作成フォーム
 * 入力は3項目のみ:
 *   1. 業種×グレード選択
 *   2. 店名
 *   3. GoogleマップURL
 */

// 業種×グレードの選択肢（コンテンツタブに対応）
const BUSINESS_TYPE_OPTIONS = [
  { value: 'cafe-casual', label: 'カフェ（カジュアル）', available: true },
  { value: 'cafe-premium', label: 'カフェ（高級）', available: false },
  { value: 'yakiniku-casual', label: '焼肉（カジュアル）', available: true },
  { value: 'yakiniku-premium', label: '焼肉（高級）', available: true },
] as const;

export default function LpInput() {
  const [submitted, setSubmitted] = useState(false);
  const [resultSlug, setResultSlug] = useState('');
  const [resultId, setResultId] = useState(0);

  // Form state — 3項目のみ
  const [businessTypeGrade, setBusinessTypeGrade] = useState('yakiniku-premium');
  const [storeName, setStoreName] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  const createLead = trpc.leads.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      toast.error('店名を入力してください');
      return;
    }
    if (!googleMapsUrl.trim()) {
      toast.error('GoogleマップURLを入力してください');
      return;
    }

    // 業種×グレードからbusiness_typeを分解
    const [businessType] = businessTypeGrade.split('-');

    try {
      const result = await createLead.mutateAsync({
        store_name: storeName.trim(),
        area: 'auto', // GoogleマップURLから自動取得
        business_type: businessType as 'restaurant' | 'salon',
        business_subtype: businessTypeGrade,
        google_maps_url: googleMapsUrl.trim(),
        template: businessTypeGrade,
      });

      setResultSlug(result.slug);
      setResultId(result.id);
      setSubmitted(true);
      toast.success('LP作成完了！');
    } catch (err: any) {
      toast.error(err.message || 'LP作成に失敗しました');
    }
  };

  if (submitted) {
    const lpUrl = `${window.location.origin}/lp/${resultSlug}`;
    return (
      <div className="min-h-screen bg-[#0E0D0C] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-sans">
              LP Factory
            </p>
            <h1 className="text-3xl font-light text-white/90 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              LP作成完了
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <p className="text-white/60 text-sm">LP URL:</p>
            <a
              href={lpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B0552F] hover:text-[#D4723F] text-lg break-all transition-colors"
            >
              {lpUrl}
            </a>
            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => navigator.clipboard.writeText(lpUrl).then(() => toast.success('コピーしました！'))}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded transition-colors"
              >
                URLコピー
              </button>
              <button
                onClick={() => { setSubmitted(false); setResultSlug(''); setStoreName(''); setGoogleMapsUrl(''); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded transition-colors"
              >
                もう1件作成
              </button>
            </div>
          </div>

          <p className="text-white/30 text-xs">
            ID: {resultId} • 素材は業種×グレードから自動割り当て済み
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#0E0D0C]/40 text-xs tracking-[0.3em] uppercase mb-2">
            LP Factory
          </p>
          <h1
            className="text-3xl font-light text-[#0E0D0C] italic"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            新規LP作成
          </h1>
          <p className="text-[#0E0D0C]/50 text-sm mt-3">
            3項目を入力するだけでLPが即座に生成されます
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. 業種×グレード */}
          <div>
            <label className="block text-xs text-[#0E0D0C]/60 uppercase tracking-wider mb-2 font-medium">
              業種 × グレード
            </label>
            <div className="space-y-2">
              {BUSINESS_TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    businessTypeGrade === opt.value
                      ? 'border-[#B0552F] bg-[#B0552F]/5'
                      : 'border-[#0E0D0C]/10 bg-white hover:border-[#0E0D0C]/20'
                  } ${!opt.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="businessTypeGrade"
                    value={opt.value}
                    checked={businessTypeGrade === opt.value}
                    onChange={(e) => setBusinessTypeGrade(e.target.value)}
                    disabled={!opt.available}
                    className="w-4 h-4 text-[#B0552F] accent-[#B0552F]"
                  />
                  <span className="text-sm text-[#0E0D0C]/80">{opt.label}</span>
                  {!opt.available && (
                    <span className="ml-auto text-[10px] text-[#0E0D0C]/40 bg-[#0E0D0C]/5 px-2 py-0.5 rounded">
                      素材未登録
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* 2. 店名 */}
          <div>
            <label className="block text-xs text-[#0E0D0C]/60 uppercase tracking-wider mb-2 font-medium">
              店名 <span className="text-[#B0552F]">*</span>
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="例: La Letizia"
              className="w-full px-4 py-3 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm focus:outline-none focus:border-[#B0552F]/40 transition-colors"
            />
            <p className="text-[10px] text-[#0E0D0C]/40 mt-1">
              LP上のヘッダー・ローディング画面に表示されます
            </p>
          </div>

          {/* 3. GoogleマップURL */}
          <div>
            <label className="block text-xs text-[#0E0D0C]/60 uppercase tracking-wider mb-2 font-medium">
              GoogleマップURL <span className="text-[#B0552F]">*</span>
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-3 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm focus:outline-none focus:border-[#B0552F]/40 transition-colors"
            />
            <p className="text-[10px] text-[#0E0D0C]/40 mt-1">
              Accessセクションの地図埋め込みに使用されます
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={createLead.isPending || !BUSINESS_TYPE_OPTIONS.find(o => o.value === businessTypeGrade)?.available}
              className="w-full py-4 bg-[#0E0D0C] text-white rounded-lg text-sm uppercase tracking-[0.2em] hover:bg-[#1a1918] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {createLead.isPending ? '作成中...' : 'LP発行'}
            </button>
          </div>
        </form>

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#0E0D0C]/30 mt-8">
          素材（動画・画像）は業種×グレードに応じて自動で割り当てられます。<br />
          テキストは全て「xxxxxx」固定です。
        </p>
      </div>
    </div>
  );
}
