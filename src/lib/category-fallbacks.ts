/**
 * Multiple fallback images per news category.
 * Using diverse Unsplash photos so that when multiple articles
 * on the same page lack an image, each gets a different fallback.
 */
export const CATEGORY_FALLBACK_POOLS: Record<string, string[]> = {
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // circuit board
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', // cybersecurity abstract
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // matrix/code screen
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80', // laptop on desk
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80', // code on monitor
  ],
  Business: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // analytics dashboard
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', // professional person
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // corporate buildings
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80', // business meeting
    'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800&q=80', // stock market
  ],
  World: [
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&q=80', // globe/world
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', // international flags
    'https://images.unsplash.com/photo-1503789146722-cf137a3c0fea?w=800&q=80', // world map
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', // earth from space
    'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800&q=80', // news microphone
  ],
  Science: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80', // lab equipment
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80', // microscope
    'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&q=80', // space/galaxy
    'https://images.unsplash.com/photo-1576319155264-99536e0be1ee?w=800&q=80', // DNA/molecule
    'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&q=80', // test tubes
  ],
  AI: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', // AI neural
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80', // robot hand
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', // AI brain
    'https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=800&q=80', // ChatGPT interface
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80', // robot
  ],
  Sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe145ab64c1?w=800&q=80', // stadium
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', // soccer ball
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', // basketball
    'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80', // running track
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80', // gym / sports
  ],
  Health: [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80', // stethoscope
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // fitness
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80', // hospital
    'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80', // healthy food
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80', // meditation
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80', // cinema
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', // music concert
    'https://images.unsplash.com/photo-1489599849927-2ee91cebe3ba?w=800&q=80', // movie theater
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', // music headphones
    'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=800&q=80', // TV/streaming
  ],
  Politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80', // government building
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80', // voting
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80', // parliament
    'https://images.unsplash.com/photo-1575908539614-ff89490f4a78?w=800&q=80', // diplomatic meeting
    'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80', // law/justice
  ],
  Default: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80', // newspaper
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80', // news broadcast
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80', // reading news
    'https://images.unsplash.com/photo-1557992260-ec58e38d363c?w=800&q=80', // tablet with news
    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80', // journalism
  ],
};

/**
 * Returns a deterministic fallback image for a given category and index.
 * Uses modulo so images cycle through the pool, ensuring variety on a page.
 *
 * @param category  The article's category string
 * @param index     A numeric index (e.g., article's position on the page, or hash of its ID)
 * @param size      The image size query param to append (default '800')
 */
export function getCategoryFallback(
  category: string,
  index: number = 0,
  size: string = '800'
): string {
  const pool = CATEGORY_FALLBACK_POOLS[category] ?? CATEGORY_FALLBACK_POOLS.Default;
  // Replace the w= param with the requested size
  return pool[Math.abs(index) % pool.length].replace(/w=\d+/, `w=${size}`);
}
