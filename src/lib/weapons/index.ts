// 型・定数
export {
  weapons,
  weaponNames,
  synthesisRules,
  getWeapon,
  isWeaponName,
  type WeaponName,
  type WeaponTier,
  type GachaLevel,
  type GachaRate,
  type GachaResult,
  type GachaSimulationResult,
  type ExpectationAnalysisResult,
} from './types';

// 画像
export { weaponImages } from './images';

// 定数
export { levelNames, tierNames, tierOrder, rarityColors } from './constants';

// 武器データ
export { allWeapons, getWeaponInfo, type WeaponInfo } from './data';

// 合成関連
export {
  getSynthesisRule,
  getInputCount,
  getRequiredL1,
  performSynthesis,
  type SynthesisInput,
  type SynthesisResult,
} from './synthesis';

// ガチャ関連
export {
  gachaRates,
  getGachaRate,
  calculateActualProbabilities,
  simulateGachaExpectation,
} from './gacha';

// ユーティリティ関数
export { getWeaponDisplayName, getTier } from './utils';
