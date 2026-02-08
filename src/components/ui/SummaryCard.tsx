/**
 * サマリーカード
 *
 * 統計情報を表示するカードコンポーネント。
 * タイトル・メイン値・サブ値を縦に並べて表示する。
 *
 * @param title - カードのタイトル
 * @param value - メインの値（大きく表示）
 * @param subValue - サブの値（小さく表示、省略可）
 * @param color - テキストと背景のアクセントカラー（hex形式）
 * @param highlight - trueの場合、青系のハイライト背景を適用
 */
interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  color?: string;
  highlight?: boolean;
}

export function SummaryCard({
  title,
  value,
  subValue,
  color,
  highlight = false,
}: SummaryCardProps) {
  const baseClass = 'rounded-xl shadow-sm border p-3 md:p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow';
  const highlightClass = highlight ? 'border-blue-200 bg-blue-50' : 'border-gray-100';
  const bgStyle = color && !highlight ? { backgroundColor: `${color}08`, borderColor: `${color}40` } : undefined;

  return (
    <div
      className={`${baseClass} ${!color || highlight ? highlightClass : ''} ${!color ? 'bg-white' : ''}`}
      style={bgStyle}
    >
      <div className="text-xs md:text-sm font-medium mb-1 opacity-80 text-gray-500">
        {title}
      </div>
      <div
        className="text-lg md:text-2xl font-bold text-gray-800 break-all"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-[10px] md:text-xs mt-1 opacity-70 text-gray-500">
          {subValue}
        </div>
      )}
    </div>
  );
}
