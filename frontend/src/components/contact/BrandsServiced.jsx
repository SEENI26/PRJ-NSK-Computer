import { motion } from 'framer-motion';
import { BrandMark, hasBrandMark } from '@/components/common';
import { stagger, staggerItem, revealViewport } from '@/animations';

/**
 * The brands we supply and service.
 *
 * Every competing repair shop in Trichy publishes this list, and NSK's site
 * did not. It is trust and search intent at once: people do not search for
 * "computer repair", they search for "HP laptop service Trichy". Naming the
 * makes is how that query finds a page.
 *
 * Confined to what the site already claims elsewhere — the professional page
 * lists these six as the lines NSK supplies. Nothing new is asserted here, and
 * Apple is deliberately absent despite competitors listing MacBook, because
 * nothing in this project says NSK services it.
 *
 * Marks render white with the same glow as the gaming tier cards, from the
 * CC0 Simple Icons set. They are trademarks of their owners.
 */

const SERVICED = [
  { slug: 'dell',   name: 'Dell' },
  { slug: 'hp',     name: 'HP' },
  { slug: 'lenovo', name: 'Lenovo' },
  { slug: 'asus',   name: 'ASUS' },
  { slug: 'acer',   name: 'Acer' },
  { slug: 'msi',    name: 'MSI' },
];

export function BrandsServiced() {
  return (
    <motion.ul
      variants={stagger(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.08]
                 bg-white/[0.06] sm:grid-cols-6"
    >
      {SERVICED.filter((b) => hasBrandMark(b.slug)).map((brand) => (
        <motion.li
          key={brand.slug}
          variants={staggerItem}
          className="group flex items-center justify-center bg-base-900 px-4 py-7
                     transition-colors duration-300 hover:bg-base-800"
        >
          <span
            className="h-4 text-white transition-transform duration-300 group-hover:scale-105"
            style={{
              filter:
                'drop-shadow(0 0 5px rgb(255 255 255 / 0.35)) drop-shadow(0 0 14px rgb(255 255 255 / 0.18))',
            }}
          >
            <BrandMark slug={brand.slug} title={brand.name} />
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
