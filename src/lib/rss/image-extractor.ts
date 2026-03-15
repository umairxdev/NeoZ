import { Category } from '@/types';

/**
 * Extracts an image URL from an RSS item using a priority chain:
 * 1. media:content
 * 2. media:thumbnail
 * 3. media:group
 * 4. enclosure
 * 5. HTML parsing (content:encoded / description)
 * Returns null if no real image is found (fallback is handled by UI components).
 */
export function extractImage(item: any, category: Category | string): string | null {
  // 1. media:content (object or array)
  if (item['media:content']) {
    const mc = item['media:content'];
    if (Array.isArray(mc)) {
      const img = mc.find((m: any) => m?.$ && m?.$.url && (m.$.medium === 'image' || !m.$.medium));
      if (img) return img.$.url;
      const first = mc.find((m: any) => m?.$ && m?.$.url);
      if (first) return first.$.url;
    } else if (mc?.$ && mc.$.url) {
      return mc.$.url;
    }
  }

  // 2. media:thumbnail
  if (item['media:thumbnail']) {
    const mt = item['media:thumbnail'];
    if (Array.isArray(mt)) {
      const first = mt.find((m: any) => m?.$ && m?.$.url);
      if (first) return first.$.url;
    } else if (mt?.$ && mt.$.url) {
      return mt.$.url;
    }
  }

  // 3. media:group (some feeds wrap media in a group element)
  if (item['media:group']) {
    const mg = item['media:group'];
    const mcInGroup = mg['media:content'] || mg['media:thumbnail'];
    if (mcInGroup) {
      const el = Array.isArray(mcInGroup) ? mcInGroup[0] : mcInGroup;
      if (el?.$ && el.$.url) return el.$.url;
    }
  }

  // 4. enclosure (RSS 2.0 standard)
  if (item.enclosure) {
    const enc = item.enclosure;
    if (enc.url && (!enc.type || enc.type.startsWith('image/'))) {
      return enc.url;
    }
    if (enc.$ && enc.$.url && (!enc.$.type || enc.$.type.startsWith('image/'))) {
      return enc.$.url;
    }
  }

  // 5. Parse from content HTML
  const content = item['content:encoded'] || item.content || item.description || '';
  if (content) {
    const imgMatch = content.match(/<img[^>]+src=["']([^"'\s>]+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }

  // No real image found — return null so UI can use its varied fallback pool
  return null;
}
