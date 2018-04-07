export interface ParseOptions {
  xmlSearchPatterns: string[]
  textSearchPatterns: string[]
  assetSearchPatterns: string[]
  locales: string[]
  rootElementName: string
  saveSourceFiles: boolean
  saveJSON: boolean
  archiveSourceFiles: boolean
  archiveJSON: boolean
  outputPath: string | null
  elementBlacklist: string[]
  logLevel: "none" | "standard" | "verbose"
}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {
  xmlSearchPatterns: [
    "mods/core.stormmod/base.stormdata/GameData/*Data.xml",
    "mods/heroesdata.stormmod/base.stormdata/GameData/*Data.xml",
    "mods/heromods/*.stormmod/base.stormdata/GameData/*.xml",
  ],
  textSearchPatterns: [
    "mods/core.stormmod/*.stormdata/LocalizedData/*.txt",
    "mods/heroesdata.stormmod/*/LocalizedData/*.txt",
    "mods/heromods/*/LocalizedData/*.txt",
  ],
  assetSearchPatterns: [
    "mods/core.stormmod/*.stormassets/*",
    "mods/heroes.stormmod/*.stormassets/*",
  ],
  locales: [] as string[],
  rootElementName: 'CHero',
  archiveSourceFiles: true,
  saveSourceFiles: false,
  archiveJSON: true,
  saveJSON: false,
  outputPath: null,
  elementBlacklist: [
    'Model',
    'HeroSelectCutsceneFile',
    'ScoreScreenCutsceneFile',
    'MiniPortraitCutsceneFile',
    'PreviewCutsceneFile',
    'TileCutsceneFile',
    'HomeScreenCutsceneFile',
    'InGameUnitStatusCutsceneFile',
    'DraftCutsceneFile',
    'DraftPickCutsceneFile',
    'EndOfMatchCutsceneFile',
    'LootChestRewardCutsceneFile',
    'ProgressionLootChestReward',
  ] as string[],
  logLevel: "standard"
}

export function buildParseOptions(options: Partial<ParseOptions>): ParseOptions {
  return Object.assign({}, DEFAULT_PARSE_OPTIONS, options)
}
