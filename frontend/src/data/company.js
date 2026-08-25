/**
 * Company facts. Single source for the navbar, footer, contact page, schema
 * markup and metadata — change an address here and it changes everywhere.
 *
 * Values are the business's real details as recorded in the CMS settings.
 */
export const COMPANY = {
  name: 'NSK Computer Zone',
  legalName: 'NSK Computer Zone Pvt Ltd.',
  tagline: 'Build better. Perform faster.',
  foundingYear: 2005,
  experienceYears: 20,

  address: {
    street: 'No. 117B, Heber Road, Bhima Nagar, Sangillyandapuram',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    postalCode: '620001',
    country: 'India',
    get full() {
      return `${this.street}, ${this.city}, ${this.state} ${this.postalCode}`;
    },
  },

  phone: '+91 97914 30774',
  phoneHref: 'tel:+919791430774',
  whatsapp: '919791430774',
  get whatsappHref() {
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(
      'Hello NSK Computer Zone, I would like a recommendation for a PC build.',
    )}`;
  },
  email: 'nskcomputer@gmail.com',
  emailHref: 'mailto:nskcomputer@gmail.com',

  hours: {
    display: '8:00 AM – 9:00 PM',
    days: 'Monday to Saturday',
    note: 'Sunday by appointment',
    schemaFormat: 'Mo-Sa 08:00-21:00',

    /*
     * The same hours in a form code can compare against, so the live
     * open/closed badge does not have to parse the schema string.
     *
     * `timeZone` matters more than it looks: the shop is open 08:00–21:00 in
     * Trichy regardless of where the visitor's browser clock is set. Comparing
     * against local device time would tell someone in London the counter is
     * shut when it is mid-morning in Tamil Nadu.
     */
    timeZone: 'Asia/Kolkata',
    opensAt: 8,               // 24-hour, shop-local
    closesAt: 21,
    openDays: [1, 2, 3, 4, 5, 6], // Mon–Sat; 0 is Sunday
  },

  /** Numbers shown in the hero stat band. Kept honest — no invented metrics. */
  stats: [
    { value: '20+',  label: 'Years in hardware' },
    { value: '10',   label: 'Hardware departments' },
    { value: '48h',  label: 'Build and test' },
    { value: 'Free', label: 'Fitting at counter' },
  ],

  /** Why-choose-us — §7 of the page spec. */
  differentiators: [
    {
      id: 'tested',
      title: 'Tested before it leaves',
      body: 'Every module, drive and card is bench-tested in a live board before it reaches you. Nothing ships on the assumption that it works.',
      icon: 'ShieldCheck',
    },
    {
      id: 'specified',
      title: 'Specified, not upsold',
      body: 'We match parts to the work you actually do. If a cheaper component is the right answer, that is the one we quote.',
      icon: 'Target',
    },
    {
      id: 'counter',
      title: 'Fitted at the counter',
      body: 'Bring the machine in. Upgrades are installed and verified while you wait, at no extra charge.',
      icon: 'Wrench',
    },
    {
      id: 'trade',
      title: 'Trade and wholesale',
      body: 'Resellers and service shops get counter pricing and stock visibility. Ask for a trade quote.',
      icon: 'Package',
    },
  ],
};
