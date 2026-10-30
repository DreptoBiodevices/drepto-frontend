import { ProductOffer } from '../types';

export interface CalculatedOfferPricing {
    originalTotal: number;
    finalTotal: number;
    discount: number;
    paidUnits: number;
    freeUnits: number;
    effectiveUnitPrice: number;
    offerTitle: string;
    hint?: string;
    hasOffer: boolean;
}

/**
 * Normalizes an offer from an item (either structured offer object or legacy offerDescription)
 */
export function resolveItemOffer(item: { offer?: ProductOffer; offerDescription?: string }): ProductOffer | null {
    if (item.offer && item.offer.isActive !== false) {
        return item.offer;
    }
    if (item.offerDescription && item.offerDescription.trim().length > 0) {
        const text = item.offerDescription.trim();
        const bogoMatch = text.match(/buy\s*(\d+)\s*get\s*(\d+)/i);
        if (bogoMatch) {
            return {
                title: text,
                type: 'BOGO',
                buyQuantity: parseInt(bogoMatch[1], 10),
                getFreeQuantity: parseInt(bogoMatch[2], 10),
                isActive: true,
            };
        }
        const pctMatch = text.match(/(\d+)%\s*off/i);
        if (pctMatch) {
            return {
                title: text,
                type: 'PERCENTAGE',
                discountPercentage: parseInt(pctMatch[1], 10),
                isActive: true,
            };
        }
        const flatMatch = text.match(/(?:rs\.?|₹)\s*(\d+)\s*off/i);
        if (flatMatch) {
            return {
                title: text,
                type: 'FLAT',
                flatDiscount: parseInt(flatMatch[1], 10),
                isActive: true,
            };
        }
        // Default legacy string to BOGO 2+1
        return {
            title: text,
            type: 'BOGO',
            buyQuantity: 2,
            getFreeQuantity: 1,
            isActive: true,
        };
    }
    return null;
}

/**
 * Calculates accurate modified price and savings for a given item and quantity
 */
export function calculateItemOfferPricing(
    item: { price: number | string; offer?: ProductOffer; offerDescription?: string },
    quantity: number
): CalculatedOfferPricing {
    const rawPrice = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
        : Number(item.price || 0);
    const unitPrice = isNaN(rawPrice) ? 0 : rawPrice;
    const safeQty = Math.max(0, quantity);
    const originalTotal = unitPrice * safeQty;

    const offer = resolveItemOffer(item);

    if (!offer || safeQty === 0) {
        return {
            originalTotal,
            finalTotal: originalTotal,
            discount: 0,
            paidUnits: safeQty,
            freeUnits: 0,
            effectiveUnitPrice: unitPrice,
            offerTitle: '',
            hasOffer: false,
        };
    }

    const type = offer.type || 'BOGO';

    if (type === 'BOGO') {
        const buyQty = Math.max(1, Number(offer.buyQuantity) || 2);
        const freeQty = Math.max(1, Number(offer.getFreeQuantity) || 1);
        const bundle = buyQty + freeQty;

        const completeBundles = Math.floor(safeQty / bundle);
        const remainder = safeQty % bundle;

        // Items earned free:
        const freeFromBundles = completeBundles * freeQty;
        const freeFromRemainder = Math.max(0, remainder - buyQty);
        const freeUnits = freeFromBundles + freeFromRemainder;
        const paidUnits = safeQty - freeUnits;

        const discount = freeUnits * unitPrice;
        const finalTotal = paidUnits * unitPrice;
        const effectiveUnitPrice = safeQty > 0 ? finalTotal / safeQty : unitPrice;

        let hint: string | undefined;
        if (freeUnits > 0) {
            hint = `${freeUnits} FREE product${freeUnits > 1 ? 's' : ''} automatically included in your order!`;
        } else if (remainder > 0 && remainder < buyQty) {
            const need = buyQty - remainder;
            hint = `Add ${need} more item${need > 1 ? 's' : ''} to get ${freeQty} FREE automatically!`;
        }

        return {
            originalTotal,
            finalTotal,
            discount,
            paidUnits,
            freeUnits,
            effectiveUnitPrice,
            offerTitle: offer.title || `Buy ${buyQty} Get ${freeQty} Free`,
            hint,
            hasOffer: true,
        };
    }

    if (type === 'PERCENTAGE') {
        const pct = Math.min(100, Math.max(0, Number(offer.discountPercentage) || 0));
        const minQty = Math.max(1, Number(offer.minQuantity) || 1);

        if (safeQty >= minQty) {
            const discount = Math.round(originalTotal * (pct / 100));
            const finalTotal = Math.max(0, originalTotal - discount);
            return {
                originalTotal,
                finalTotal,
                discount,
                paidUnits: safeQty,
                freeUnits: 0,
                effectiveUnitPrice: safeQty > 0 ? finalTotal / safeQty : unitPrice,
                offerTitle: offer.title || `${pct}% OFF`,
                hasOffer: true,
            };
        } else {
            const need = minQty - safeQty;
            return {
                originalTotal,
                finalTotal: originalTotal,
                discount: 0,
                paidUnits: safeQty,
                freeUnits: 0,
                effectiveUnitPrice: unitPrice,
                offerTitle: offer.title || `${pct}% OFF`,
                hint: `Add ${need} more to unlock ${pct}% OFF!`,
                hasOffer: true,
            };
        }
    }

    if (type === 'FLAT') {
        const flat = Math.max(0, Number(offer.flatDiscount) || 0);
        const minQty = Math.max(1, Number(offer.minQuantity) || 1);

        if (safeQty >= minQty) {
            const discount = Math.min(originalTotal, flat * safeQty);
            const finalTotal = Math.max(0, originalTotal - discount);
            return {
                originalTotal,
                finalTotal,
                discount,
                paidUnits: safeQty,
                freeUnits: 0,
                effectiveUnitPrice: safeQty > 0 ? finalTotal / safeQty : unitPrice,
                offerTitle: offer.title || `₹${flat} OFF`,
                hasOffer: true,
            };
        } else {
            const need = minQty - safeQty;
            return {
                originalTotal,
                finalTotal: originalTotal,
                discount: 0,
                paidUnits: safeQty,
                freeUnits: 0,
                effectiveUnitPrice: unitPrice,
                offerTitle: offer.title || `₹${flat} OFF`,
                hint: `Add ${need} more to unlock ₹${flat} OFF!`,
                hasOffer: true,
            };
        }
    }

    return {
        originalTotal,
        finalTotal: originalTotal,
        discount: 0,
        paidUnits: safeQty,
        freeUnits: 0,
        effectiveUnitPrice: unitPrice,
        offerTitle: '',
        hasOffer: false,
    };
}

/**
 * Calculates how many automatic free units should be added when adding items to cart
 */
export function getAutoFreeUnitsToAdd(
    item: { offer?: ProductOffer; offerDescription?: string },
    currentQty: number,
    addingQty: number
): number {
    const offer = resolveItemOffer(item);
    if (!offer || offer.type !== 'BOGO') return 0;
    const buyQty = Math.max(1, Number(offer.buyQuantity) || 2);
    const freeQty = Math.max(1, Number(offer.getFreeQuantity) || 1);
    const bundle = buyQty + freeQty;

    const previousBundles = Math.floor(currentQty / bundle);
    const currentPaid = previousBundles * buyQty + Math.min(buyQty, currentQty % bundle);
    const newPaid = currentPaid + addingQty;
    const newBundles = Math.floor(newPaid / buyQty);
    const freeEarnedTotal = newBundles * freeQty;
    const currentFree = currentQty - currentPaid;
    return Math.max(0, freeEarnedTotal - currentFree);
}
