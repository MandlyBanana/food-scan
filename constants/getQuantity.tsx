import fetchProductData from "./fetchProductData";
// Product type: quantity may be any shape coming from the API
type Product = { quantity?: unknown;[key: string]: unknown };

function tryParseNumber(value: unknown): number | undefined {
    if (value == null) return undefined;
    if (typeof value === 'number') return Number.isFinite(value) ? (value as number) : undefined;
    if (typeof value === 'string') {
        // strip non-digit except dot and comma, allow comma as decimal
        const cleaned = value.replace(/[^0-9.,-]+/g, '').replace(',', '.');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : undefined;
    }
    if (Array.isArray(value)) {
        for (const v of value) {
            const n = tryParseNumber(v);
            if (n !== undefined) return n;
        }
        return undefined;
    }
    if (typeof value === 'object') {
        // try common keys first
        const obj = value as Record<string, unknown>;
        const candidates = ['quantity', 'value', 'amount', 'qty', 'unit', 'count'];
        for (const key of candidates) {
            if (key in obj) {
                const n = tryParseNumber(obj[key]);
                if (n !== undefined) return n;
            }
        }
        // otherwise scan values for first numeric-looking entry
        for (const v of Object.values(obj)) {
            const n = tryParseNumber(v);
            if (n !== undefined) return n;
        }
        return undefined;
    }
    return undefined;
}


async function getQuantity(barcode: string) {
    try {
        //const barcode = value;
        // fetchProductData may return a single product object or an array of products
        const res = await fetchProductData(barcode) as unknown;
        let first: Product | undefined;

        if (Array.isArray(res)) {
            first = res[0] as Product | undefined;
        } else if (res && typeof res === 'object') {
            // Sometimes the fetch returns a single product object
            first = res as Product;
        }

        if (!first) {
            console.warn('No product returned');
            return undefined;
        }

        // The product object in test.json uses either `quantity` (eg "500g")
        // or `product_quantity`/`product_quantity_unit`. Try both.
        const candidates: unknown[] = [first.quantity, (first as any).product_quantity, (first as any).product_quantity_unit];

        // Prefer `quantity` field if present
        const rawQty = first.quantity ?? ((first as any).product_quantity ? `${(first as any).product_quantity}${(first as any).product_quantity_unit ?? ''}` : undefined);

        const quantity = tryParseNumber(rawQty ?? candidates.find(c => c !== undefined));
        console.log('raw quantity:', rawQty);
        console.log('parsed quantity:', quantity);
        return quantity;
    } catch (error) {
        console.error('Error getting quantity:', error);
        return undefined;
    }
}


export default getQuantity;