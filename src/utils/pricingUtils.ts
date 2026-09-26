import { Accoutrement, PriceLine, PriceSummarySnapshot, Service } from '../types';
import { toPersianDigits } from './dateUtils';

export type { PriceLine, PriceSummarySnapshot };

export interface DiscountInfo {
  hasDiscount: boolean;
  realPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercent: number;
}

/**
 * Returns clean discount metrics for any service.
 * Supports services where realPrice > price, or discountedPrice is set.
 */
export function getDiscountInfo(service: Service | null | undefined): DiscountInfo {
  if (!service) {
    return {
      hasDiscount: false,
      realPrice: 0,
      discountedPrice: 0,
      discountAmount: 0,
      discountPercent: 0,
    };
  }

  const payablePrice = Number.isFinite(service.price) ? service.price : 0;
  // If realPrice is explicitly specified, use it. Otherwise if discountedPrice is set and < realPrice/price, use that.
  const realPrice = Number.isFinite(service.realPrice) && (service.realPrice ?? 0) > 0
    ? (service.realPrice as number)
    : payablePrice;

  const hasDiscount = Boolean(realPrice > payablePrice && payablePrice > 0);
  const discountAmount = hasDiscount ? realPrice - payablePrice : 0;
  const discountPercent = hasDiscount && realPrice > 0
    ? Math.round((discountAmount / realPrice) * 100)
    : 0;

  return {
    hasDiscount,
    realPrice,
    discountedPrice: payablePrice,
    discountAmount,
    discountPercent,
  };
}

export interface PriceSummary {
  lines: PriceLine[];
  serviceBase: number;
  serviceRealPrice: number;
  discountAmount: number;
  discountPercent: number;
  hasDiscount: boolean;
  addOnsTotal: number;
  total: number;
  originalTotal: number;
}

/**
 * Single source of truth for booking totals with itemized discount lines.
 * Live during the flow — the caller freezes a snapshot at confirmation.
 */
export const calculateBookingTotal = (
  service: Service | null | undefined,
  accoutrements: Accoutrement[] | undefined
): PriceSummary => {
  const lines: PriceLine[] = [];
  const discountInfo = getDiscountInfo(service);
  const serviceBase = discountInfo.discountedPrice;
  const serviceRealPrice = discountInfo.realPrice;

  if (service) {
    lines.push({
      id: `svc-${service.id}`,
      label: service.name,
      amount: serviceBase,
      originalAmount: discountInfo.hasDiscount ? serviceRealPrice : undefined,
      discountAmount: discountInfo.hasDiscount ? discountInfo.discountAmount : undefined,
      kind: 'service',
    });
  }

  let addOnsTotal = 0;
  for (const a of accoutrements ?? []) {
    if (!a.selected) continue;
    const amount = a.price ?? 0;
    addOnsTotal += amount;
    lines.push({
      id: `add-${a.id}`,
      label: a.name,
      amount,
      kind: 'addon',
    });
  }

  if (discountInfo.hasDiscount && discountInfo.discountAmount > 0) {
    lines.push({
      id: `disc-${service?.id}`,
      label: `تخفیف ویژه سالن (${toPersianDigits(discountInfo.discountPercent)}٪)`,
      amount: -discountInfo.discountAmount,
      discountAmount: discountInfo.discountAmount,
      kind: 'discount',
    });
  }

  const total = serviceBase + addOnsTotal;
  const originalTotal = serviceRealPrice + addOnsTotal;

  return {
    lines,
    serviceBase,
    serviceRealPrice,
    discountAmount: discountInfo.discountAmount,
    discountPercent: discountInfo.discountPercent,
    hasDiscount: discountInfo.hasDiscount,
    addOnsTotal,
    total,
    originalTotal,
  };
};
