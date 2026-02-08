/**
 * 武器カード
 *
 * 武器の画像・名前・本数を表示するカードコンポーネント。
 * ティアに応じた色分けと、高レアリティ武器のグラデーション背景を適用。
 *
 * @param name - 武器名（WeaponName型、例: 'S1', 'G2'）
 * @param count - 表示する本数
 * @param showDecimals - trueの場合、小数点以下も表示（期待値表示用）
 */
import {
  weaponImages,
  rarityColors,
  getWeaponDisplayName,
  getTier,
  type WeaponName,
} from '../../lib/weapons';

interface WeaponCardProps {
  name: WeaponName;
  count: number;
  showDecimals?: boolean;
}

export function WeaponCard({ name, count, showDecimals = false }: WeaponCardProps) {
  const displayName = getWeaponDisplayName(name);
  const tier = getTier(name);
  const color = rarityColors[tier];
  const isHighRarity = ['U', 'G', 'S'].includes(name.charAt(0));
  const image = weaponImages[name];

  const formattedCount = showDecimals
    ? count.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : count % 1 === 0
      ? count.toLocaleString()
      : count.toFixed(2);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-3 md:p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isHighRarity ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'}`}
      style={{ borderColor: `${color}30` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: color }}
      />

      {image && (
        <img
          src={image.src}
          alt={displayName}
          className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2 drop-shadow-sm mx-auto"
        />
      )}

      <div className="font-bold text-gray-800 mb-1 truncate w-full text-xs md:text-sm px-1">
        {displayName}
      </div>
      <div className="text-lg md:text-xl font-extrabold" style={{ color }}>
        {formattedCount}
        <span className="text-[10px] md:text-xs font-normal ml-1 text-gray-500">本</span>
      </div>
    </div>
  );
}
