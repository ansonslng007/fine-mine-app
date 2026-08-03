/** DB `items.platform` values for externally imported posts. */
export const ITEM_PLATFORM_FACEBOOK = "facebook" as const;
export const ITEM_PLATFORM_THREADS = "threads" as const;

/** External platform source tag background. */
export const ITEM_PLATFORM_TAG_BG = "#0866FF";
export const ITEM_PLATFORM_THREADS_TAG_BG = "#000000";

export type ItemPlatform =
  | typeof ITEM_PLATFORM_FACEBOOK
  | typeof ITEM_PLATFORM_THREADS;

/** i18n key under `platform.*`, e.g. platform.facebook → "Facebook". */
export function platformLabelKey(
  platform: string | null | undefined,
): string | null {
  if (platform === ITEM_PLATFORM_FACEBOOK) return "platform.facebook";
  if (platform === ITEM_PLATFORM_THREADS) return "platform.threads";
  return null;
}

/** Resolve platform for UI (DB field, or facebook when source_post_url exists). */
export function getEffectiveItemPlatform(item: {
  platform?: string | null;
  sourcePostUrl?: string | null;
}): string | null {
  const p = item.platform?.trim();
  if (p) return p;
  if (item.sourcePostUrl?.trim()) return ITEM_PLATFORM_FACEBOOK;
  return null;
}

/** Display label such as Facebook. */
export function formatPlatformTag(
  platform: string | null | undefined,
  t: (key: string) => string,
): string | null {
  const key = platformLabelKey(platform);
  if (!key) return null;
  const label = t(key);
  if (!label || label === key) return null;
  return label;
}

export function formatItemPlatformTag(
  item: {
    platform?: string | null;
    sourcePostUrl?: string | null;
  },
  t: (key: string) => string,
): string | null {
  return formatPlatformTag(getEffectiveItemPlatform(item), t);
}

export function isFacebookImport(item: {
  platform?: string | null;
  sourcePostUrl?: string | null;
}): boolean {
  return (
    getEffectiveItemPlatform(item) === ITEM_PLATFORM_FACEBOOK &&
    Boolean(item.sourcePostUrl?.trim())
  );
}

export function itemPlatformTagBackground(item: {
  platform?: string | null;
  sourcePostUrl?: string | null;
}): string {
  return getEffectiveItemPlatform(item) === ITEM_PLATFORM_THREADS
    ? ITEM_PLATFORM_THREADS_TAG_BG
    : ITEM_PLATFORM_TAG_BG;
}

export function isExternalImport(item: {
  platform?: string | null;
  sourcePostUrl?: string | null;
}): boolean {
  return Boolean(getEffectiveItemPlatform(item) && item.sourcePostUrl?.trim());
}
