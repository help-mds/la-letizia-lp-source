// 37 West - Static Asset URLs
// All images uploaded to webdev storage

export const ASSETS = {
  // Source photos
  interior: '/manus-storage/interior_59fc9801.png',
  
  // Showcase images (5 items)
  showcase: [
    { id: 'wagyu-chest', title: 'A5 Wagyu Treasure', subtitle: 'Presented in vintage chest with dry ice', image: '/manus-storage/wagyu-chest_a8aaaec8.png' },
    { id: 'wagyu-slab', title: 'Prime Cut Selection', subtitle: 'Hand-selected wagyu slab on bamboo', image: '/manus-storage/wagyu-slab_550fc5f6.png' },
    { id: 'sashimi', title: 'Wagyu Sashimi', subtitle: 'Thinly sliced with wasabi and shiso', image: '/manus-storage/showcase-sashimi_e6ed58da.png' },
    { id: 'grilled', title: 'Binchotan Grilled', subtitle: 'Seared over Japanese white charcoal', image: '/manus-storage/showcase-grilled_be06caeb.png' },
    { id: 'plated', title: 'Chef\'s Course', subtitle: 'Seasonal wagyu tasting plate', image: '/manus-storage/showcase-plated_be278002.png' },
  ],

  // Detail section seed image
  detailOverhead: '/manus-storage/detail-overhead_9065b8e9.png',
} as const;
