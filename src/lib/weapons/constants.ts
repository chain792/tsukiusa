// レベル名（数値 → 日本語）
export const levelNames: Record<number, string> = {
  4: '下級',
  3: '中級',
  2: '上級',
  1: '最上級',
};

// ティア名（英語 → 日本語）
export const tierNames: Record<string, string> = {
  Legend: 'レジェンド',
  Star: 'スター',
  Galaxy: 'ギャラクシー',
  Universe: 'ユニバース',
};

// ティアの順序
export const tierOrder = ['Legend', 'Star', 'Galaxy', 'Universe'] as const;

// レア度カラーパレット
export const rarityColors: Record<string, string> = {
  Legend: '#F59E0B',
  Star: '#A855F7',
  Galaxy: '#06B6D4',
  Universe: '#22C55E',
};
