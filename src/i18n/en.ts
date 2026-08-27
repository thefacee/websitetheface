import type { Dictionary } from './hy';

const en: Dictionary = {
  meta: {
    title: 'The Face — Sculpted Stone Tables from Armenia',
    description:
      'Handcrafted stone tables and sculptures. Every piece is carved from a single block — slowly, by hand, in Armenia.',
  },
  nav: {
    home: 'Home',
    catalog: 'Collection',
    custom: 'Custom order',
    story: 'Story',
    contact: 'Contact',
    admin: 'Admin',
  },
  hero: {
    kicker: 'THE FACE — SCULPTED SILENCE',
    title: 'Stone becomes form',
    titleAccent: 'Form becomes presence',
    subtitle:
      'Handcrafted stone tables and sculptures from Armenia. Not furniture — a presence in your home.',
    cta: 'View the collection',
    ctaSecondary: 'Commission a piece',
  },
  marquee: 'HANDCRAFTED · ARMENIA · NATURAL STONE · ONE OF ONE',
  featured: {
    kicker: 'Collection',
    title: 'Selected works',
    subtitle: 'Each one is singular. No two pieces are alike.',
    all: 'See everything',
  },
  philosophy: {
    kicker: 'Philosophy',
    title: 'Silence you can touch',
    body:
      'We do not manufacture furniture. We release the face already living inside the stone. Every line is carved by hand — without haste, without repetition. That is why each table has its own character: its own shadow, its own silence.',
    points: [
      { title: 'Natural stone', text: 'Travertine, tuff and basalt from Armenian quarries.' },
      { title: 'Hand carved', text: 'Every piece is shaped by hand over 2–6 weeks.' },
      { title: 'One of one', text: 'We never repeat a piece. Yours stays the only one.' },
      { title: 'Worldwide shipping', text: 'Across Armenia and abroad, crated and insured.' },
    ],
  },
  stones: {
    kicker: 'Material',
    title: 'The stones & their story',
    subtitle: 'Every stone comes from Armenian earth. Each has its own age, colour and character.',
    items: [
      {
        name: 'Travertine',
        origin: 'Armenian highlands',
        text: 'A porous limestone born of hot springs over thousands of years. Warm, honeyed and veined with life — a stone that breathes light.',
      },
      {
        name: 'Tuff',
        origin: 'Yerevan, Ani',
        text: 'The volcanic stone that ancient Armenia was built from. Rose, ochre and warm — it holds the sun for centuries.',
      },
      {
        name: 'Black tuff',
        origin: 'Gegharkunik',
        text: 'A rare dark rock of hardened lava. Deep, graphite and severe — a stone of silence and strength.',
      },
    ],
  },
  process: {
    kicker: 'How it is born',
    title: 'From quarry to your home',
    steps: [
      { n: '01', title: 'Choosing the stone', text: 'We select the block by colour, density and character.' },
      { n: '02', title: 'Sketch', text: 'The form comes from a dialogue with the stone, not with paper.' },
      { n: '03', title: 'Carving', text: 'By hand, layer after layer. The longest and quietest stage.' },
      { n: '04', title: 'Finishing', text: 'Sanding, protective sealing, glass top where the design calls for it.' },
      { n: '05', title: 'Delivery', text: 'Wooden crate, insurance, delivery to your address.' },
    ],
  },
  catalog: {
    title: 'Collection',
    subtitle: 'Stone tables, sculptures and objects.',
    empty: 'Nothing in this section yet.',
    filters: { all: 'All', category: 'Category', material: 'Material', reset: 'Reset' },
    categories: {
      table: 'Tables',
      sculpture: 'Sculptures',
      accessory: 'Accessories',
      lighting: 'Lighting',
    },
    status: { available: 'Available', made_to_order: 'Made to order', sold: 'Sold' },
    priceOnRequest: 'Price on request',
    from: 'from',
  },
  product: {
    back: 'Collection',
    details: 'Details',
    material: 'Material',
    dimensions: 'Dimensions',
    weight: 'Weight',
    status: 'Status',
    order: 'Order this piece',
    askPrice: 'Ask for the price',
    related: 'You may also like',
    notFound: 'Piece not found.',
    info: [
      {
        title: 'Delivery',
        text: 'Free within Yerevan, we carry and place it ourselves. Across Armenia and abroad: wooden crate, insurance, cost and timing quoted per address.',
      },
      {
        title: 'Care',
        text: 'Wipe with a soft dry cloth. The stone is porous, so wine, coffee and oil should be removed at once. Seal once a year with a natural stone sealer.',
      },
      {
        title: 'Payment and lead time',
        text: 'Cash or bank transfer; commissions start with a 30% deposit. In-stock pieces ship immediately, made-to-order takes 2 to 6 weeks.',
      },
    ],
  },
  form: {
    name: 'Name',
    contact: 'Phone / Email / Telegram',
    message: 'Message',
    submit: 'Send request',
    sending: 'Sending...',
    success: 'Thank you. We will get back to you within 24 hours.',
    error: 'Could not send. Please try again or write to us directly.',
    required: 'Please fill in your name and contact.',
  },
  custom: {
    kicker: 'Custom order',
    title: 'Your idea, in stone',
    subtitle:
      'Tell us what you have in mind — size, stone, shape. We’ll sketch it, quote it and carve it by hand. The rest is on us.',
    stone: 'Stone',
    stoneOptions: ['Travertine', 'Tuff', 'Basalt', 'Marble', 'Not sure yet'],
    size: 'Approximate size',
    sizeOptions: ['Small (up to 60 cm)', 'Medium (60–100 cm)', 'Large (100+ cm)', 'Not sure yet'],
    finish: 'Finish',
    finishOptions: ['Raw, natural', 'Semi-polished', 'Polished', 'With glass top', 'Not sure yet'],
    budget: 'Budget',
    budgetOptions: ['under 300,000 ֏', '300,000 – 700,000 ֏', '700,000 ֏ +', "Let's discuss"],
    idea: 'Your idea',
    ideaPlaceholder: 'Describe the form, the interior, the mood... You can send an Instagram link.',
    steps: 'How it works',
    stepsList: [
      'You send the request',
      'We discuss the idea and dimensions',
      'We send a sketch and a price',
      '30% deposit, work begins',
      '2–6 weeks of carving',
      'Delivery and installation',
    ],
  },
  story: {
    kicker: 'Story',
    title: 'The Face',
    lead: 'It started with one stone and one question: what is inside?',
    body: [
      'The Face was born in Armenia, in a workshop that holds more silence than sound. We do not draw a form on paper and then impose it on the stone. We do the opposite: we look at the block until a face appears in it.',
      'Every piece is made by hand. That means asymmetry, tool marks, a living surface. This is not a flaw — it is a signature.',
      'Our tables live in homes, cafés and offices from Yerevan to Europe. Each has its owner, and each is the only one.',
    ],
  },
  contact: {
    kicker: 'Contact',
    title: "Let's talk",
    subtitle: 'Write to us about anything: an order, shipping, a collaboration.',
    phone: 'Phone',
    email: 'Email',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    b2b: 'B2B & designers',
    b2bText: 'Dedicated terms and a trade catalogue for interior designers, restaurants and hotels.',
  },
  footer: {
    tagline: 'Sculpted Silence. Living Stone.',
    madeIn: 'Handcrafted in Armenia',
    rights: 'All rights reserved',
    nav: 'Sections',
    contacts: 'Contacts',
  },
};

export default en;
