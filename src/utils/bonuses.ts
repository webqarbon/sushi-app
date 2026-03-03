/**
 * Shared utility for bonus calculation across webhook handlers.
 * Use this instead of duplicating logic in each webhook.
 */

export interface BonusItem {
  product?: {
    price?: number;
    bonus_percent?: number;
  };
  quantity?: number;
}

/**
 * Calculate total bonuses earned from a list of order items.
 */
export function calculateEarnedBonuses(items: BonusItem[]): number {
  return items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const bonusPercent = item.product?.bonus_percent || 0;
    const bonus = (price * bonusPercent) / 100;
    return acc + bonus * (item.quantity || 1);
  }, 0);
}
