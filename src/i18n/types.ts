export type Locale = 'ja' | 'en';

export interface Translations {
  layout: {
    siteName: string;
    siteInfo: string;
    mobileTitle: string;
    home: string;
    weapons: string;
    weaponCatalog: string;
    goalCalculator: string;
    gachaSimulator: string;
  };
  home: {
    title: string;
    description: string;
    heroText: string;
    catalogTitle: string;
    catalogDescription: string;
    goalTitle: string;
    goalDescription: string;
    gachaTitle: string;
    gachaDescription: string;
    disclaimer: string;
  };
  catalog: {
    title: string;
    description: string;
    baseWeapon: string;
    baseWeaponNote: string;
  };
  goal: {
    title: string;
    description: string;
    goalSetting: string;
    targetWeapon: string;
    targetCount: string;
    predictionSettings: string;
    dailyL1Label: string;
    dailyL1Note: string;
    currentInventory: string;
    tapToToggle: string;
    inputting: string;
    totalRequired: string;
    owned: string;
    shortage: string;
    estimatedCompletion: string;
    l1Equivalent: string;
    undetermined: string;
    achieved: string;
    progressTitle: string;
    paceMessage: string;
    achievedMessage: string;
    inputPaceMessage: string;
    months: string;
  };
  gacha: {
    title: string;
    description: string;
    subtitle: string;
    simulationSettings: string;
    gachaLevel: string;
    gachaPulls: string;
    customPulls: string;
    gachaSettings: string;
    rubySpent: string;
    l1Equivalent: string;
    gachaDrops: string;
    cumulativeBonus: string;
    bonusNote: string;
    finalWeapons: string;
    finalWeaponsNote: string;
    noWeapons: string;
    rawBreakdown: string;
    noDropInfo: string;
    rateDetails: string;
  };
  common: {
    unit: string;
    pulls: string;
    days: string;
    man: string;
  };
}
