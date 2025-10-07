export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  colors: {
    name: string
    value: string
  }[]
  sizes: string[]
  category: string
}

export const products: Product[] = [
  {
    id: "predator-helios-gaming-laptop",
    name: "New Razer Blade 14",
    price: 89999.0,
    description:
      "Experience unmatched gaming performance with the New Razer Blade 14. Powered by Intel Core i9-13900HX processor and NVIDIA RTX 4070 graphics, featuring 32GB DDR5 RAM and 1TB NVMe SSD. The stunning 165Hz QHD display delivers buttery-smooth visuals. Compact 14-inch design with premium CNC aluminum chassis. Perfect for gamers who demand portability without compromising power.",
    images: [
      "https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/hbe/h38/9917794451486/blade-14-p11-black-2-500x500.png",
      "https://assets3.razerzone.com/J4UbBncdH2hU3ftUyVNBXMl6d9g=/767x511/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhc7%2Fh8f%2F9910383476766%2F250519-blade-14-p11-black-1500x1000-5.jpg",
    ],
    colors: [
      { name: "Black", value: "black" },
      { name: "Silver", value: "silver" },
    ],
    sizes: ["RTX 4060", "RTX 4070", "RTX 4090"],
    category: "laptops",
  },
  {
    id: "rog-strix-gaming-laptop",
    name: "ASUS ROG STRIX G18",
    price: 129999.0,
    description: "Dominate the battlefield with the ASUS ROG STRIX G18. This powerhouse features AMD Ryzen 9 7945HX processor and NVIDIA RTX 4080 graphics for uncompromising performance. Equipped with 32GB DDR5 RAM and massive 2TB NVMe SSD storage. The 18-inch 240Hz FHD display with G-SYNC technology ensures tear-free, ultra-smooth gameplay. ROG's signature design with customizable RGB lighting makes this the ultimate gaming machine.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h5a/h1c/9821720576030/basilisk-v3-pro-35k-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "White", value: "white" },
    ],
    sizes: ["RTX 4070", "RTX 4080", "RTX 4090"],
    category: "laptops",
  },
  {
    id: "legion-pro-gaming-laptop",
    name: "ROG Zephyrus G14 2025",
    price: 74999.0,
    description: "The ROG Zephyrus G14 2025 redefines portable gaming excellence. Featuring Intel Core i7-13700HX and NVIDIA RTX 4060, this sleek 14-inch powerhouse delivers exceptional performance in an ultra-portable form factor. With 16GB DDR5 RAM and 512GB NVMe SSD, plus a vibrant 144Hz FHD display, it's perfect for gamers on the go. Premium build quality with innovative AniMe Matrix display on the lid.",
    images: ["https://benstore.com.ph/38169-medium_default/asus-zenbook-s-16-um5606wa-16-touch-laptop-oled-ryzen-ai-9-365-amd-radeon-880m-24gb-lpddr5x-1tb-ssd-scandinavian-white-.jpg"],
    colors: [
      { name: "Gray", value: "gray" },
      { name: "Black", value: "black" },
    ],
    sizes: ["RTX 4050", "RTX 4060", "RTX 4070"],
    category: "laptops",
  },
  {
    id: "razer-deathadder-gaming-mouse",
    name: "Razer Basilisk V3 Pro 35K",
    price: 8499.0,
    description:
      "Elevate your aim with the Razer Basilisk V3 Pro 35K. Featuring the revolutionary Focus Pro 35K optical sensor with true 35,000 DPI, this wireless gaming mouse offers unparalleled precision. HyperPolling technology at 8000 Hz ensures zero latency. Customizable with 11 programmable buttons, RGB Chroma lighting, and up to 90 hours of battery life. The ergonomic thumb rest provides all-day comfort for competitive gaming.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h5a/h1c/9821720576030/basilisk-v3-pro-35k-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "White", value: "white" },
    ],
    sizes: ["Wireless", "Wired"],
    category: "mice",
  },
  {
    id: "logitech-g502-gaming-mouse",
    name: "Razer Viper V3 Pro - Faker Edition",
    price: 8999.0,
    description: "Dominate like Faker with the Razer Viper V3 Pro - Faker Edition. This ultra-lightweight wireless esports mouse weighs just 54g and features HyperPolling 8000 Hz technology for instantaneous response. The Focus Pro 30K optical sensor delivers pixel-perfect precision. Designed in collaboration with T1's legendary mid-laner, featuring exclusive Faker branding and colorway. Ambidextrous design with optical switches rated for 90 million clicks.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/hbc/hd3/9874162941982/viper-v3-pro-faker-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "White", value: "white" },
    ],
    sizes: ["Wireless", "Wired"],
    category: "mice",
  },
  {
    id: "steelseries-aerox-gaming-mouse",
    name: "Razer Naga V2 Pro",
    price: 7299.0,
    description: "Master every MMO and MOBA with the Razer Naga V2 Pro. This versatile wireless gaming mouse features 3 swappable side plates (2, 6, and 12-button configurations) to adapt to any game genre. The innovative HyperScroll Pro Wheel offers both tactile and free-spin modes. Focus Pro 30K optical sensor, up to 150 hours battery life, and tri-mode connectivity (2.4GHz, Bluetooth, wired). Perfect for MMO enthusiasts and multi-genre gamers.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/hb2/hb9/9529652379678/naga-v2-pro-2-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "White", value: "white" },
    ],
    sizes: ["Wireless", "Wired"],
    category: "mice",
  },
  {
    id: "secretlab-titan-gaming-chair",
    name: "Razer Fujin Pro",
    price: 30999.0,
    description:
      "Experience premium comfort with the Razer Fujin Pro. This fully adjustable mesh gaming chair features a breathable 3D knit mesh backrest for optimal airflow during marathon gaming sessions. Equipped with 4D armrests, adjustable lumbar support, and a synchronized tilt mechanism. The aluminum alloy base supports up to 299 lbs. Ergonomic design meets Razer's signature style with subtle RGB accents. Perfect for gamers who prioritize comfort and breathability.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h43/h20/9660298100766/fujin-pro-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "Blue", value: "blue" },
      { name: "Red", value: "red" },
    ],
    sizes: ["Small", "Regular", "XL"],
    category: "chairs",
  },
  {
    id: "dxracer-master-gaming-chair",
    name: "Razer Enki X - Kuromi Edition",
    price: 28199.0,
    description: "Embrace kawaii gaming with the Razer Enki X - Kuromi Edition. This officially licensed Sanrio collaboration features exclusive Kuromi-themed design with purple accents and embroidered details. Built on the Enki X platform with optimized lumbar arch, 152° recline, and plush cushioning for all-day comfort. Supports up to 299 lbs with a durable steel frame. The perfect blend of comfort, style, and pop culture for gaming enthusiasts.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h5b/hb6/9862441992222/enki-x-kuromi-2-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "Red", value: "red" },
      { name: "White", value: "white" },
    ],
    sizes: ["Standard", "Wide", "XL"],
    category: "chairs",
  },
  {
    id: "msi-raider-gaming-laptop",
    name: "ASUS TUF Gaming A14 (2024)",
    price: 146999.0,
    description: "The ASUS TUF Gaming A14 (2024) delivers military-grade durability with uncompromising performance. Powered by Intel Core i9-13980HX and NVIDIA RTX 4090, with massive 64GB DDR5 RAM and 4TB NVMe SSD. The stunning 240Hz QHD+ Mini LED display offers incredible brightness and contrast. MIL-STD-810H certified for durability, featuring advanced cooling and long battery life. Built to withstand the rigors of intense gaming and travel.",
    images: ["https://dlcdnwebimgs.asus.com/gain/8ef79421-e9c6-4c8b-8529-0e0dc2a09952/w800"],
    colors: [
      { name: "Black", value: "black" },
      { name: "Titanium", value: "gray" },
    ],
    sizes: ["RTX 4080", "RTX 4090"],
    category: "laptops",
  },
  {
    id: "alienware-x17-gaming-laptop",
    name: "ASUS Gaming V16 (V3607)",
    price: 124299.0,
    description: "The ASUS Gaming V16 (V3607) combines power and versatility in a sleek 16-inch form factor. Featuring Intel Core i9-12900HK and NVIDIA RTX 4080 graphics, with 32GB DDR5 RAM and 2TB NVMe SSD. The blazing-fast 360Hz FHD display ensures competitive advantage in esports titles. Premium build quality with efficient cooling system and long battery life. Perfect for gamers who need desktop-class performance in a portable package.",
    images: ["https://dlcdnwebimgs.asus.com/gain/00b917d5-55b6-4434-bc7a-20f548183955/w800"],
    colors: [
      { name: "Lunar Light", value: "white" },
      { name: "Dark Side", value: "black" },
    ],
    sizes: ["RTX 4070", "RTX 4080"],
    category: "laptops",
  },
  {
    id: "gigabyte-aorus-gaming-laptop",
    name: "ASUS ROG Zephyrus G14",
    price: 112999.0,
    description: "The ASUS ROG Zephyrus G14 represents the pinnacle of portable gaming. This 14-inch powerhouse features Intel Core i9-13900HX and NVIDIA RTX 4070, delivering desktop-class performance in an ultra-slim chassis. With 32GB DDR5 RAM, 1TB NVMe SSD, and a stunning 300Hz QHD display, it's perfect for competitive gaming anywhere. The innovative AniMe Matrix LED display on the lid adds personalization. Premium magnesium-aluminum alloy construction ensures durability.",
    images: ["https://benstore.com.ph/37034-medium_default/asus-rog-zephyrus-g14-ga403um-14-gaming-laptop-oled-120hz-ryzen-9-270-rtx-5060-8gb-16gb-lpddr5x-1tb-ssd-.jpg"],
    colors: [
      { name: "Black", value: "black" },
    ],
    sizes: ["RTX 4060", "RTX 4070", "RTX 4080"],
    category: "laptops",
  },
  {
    id: "corsair-darkcore-gaming-mouse",
    name: "Razer DeathAdder V4 Pro - White",
    price: 5029.0,
    description: "The Razer DeathAdder V4 Pro in White edition brings legendary ergonomics to wireless gaming. Weighing just 55g, this ultra-lightweight mouse features the Focus Pro 30K optical sensor and Gen-3 Optical Mouse Switches for unmatched precision and durability. The innovative Razer Optical Scroll Wheel provides tactile feedback without mechanical parts. HyperPolling 8000 Hz technology ensures zero latency. Up to 90 hours of battery life with stunning white finish.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/haa/hf2/9926511984670/deathadder-v4-pro-white-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
    ],
    sizes: ["Wireless", "Wired"],
    category: "mice",
  },
  {
    id: "glorious-model-o-gaming-mouse",
    name: "Glorious Model O Wireless",
    price: 79.0,
    description: "The Glorious Model O Wireless sets the standard for ultra-lightweight gaming. At just 69g, this honeycomb-shell mouse features the BAMF 19,000 DPI sensor for pixel-perfect tracking. Enjoy up to 71 hours of battery life with GLORIOUS RGB lighting. Ambidextrous design with Omron switches rated for 20 million clicks. The flexible Ascended Cable and PTFE feet ensure effortless gliding. Available in multiple colorways to match your setup.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/hf4/h3e/9834854580254/viper-v3-pro-sentinels-500x500.png"],
    colors: [
      { name: "Matte Black", value: "black" },
      { name: "Matte White", value: "white" },
      { name: "Glossy Black", value: "black" },
    ],
    sizes: ["Wireless", "Wired"],
    category: "mice",
  },
  {
    id: "finalmouse-ultralight-gaming-mouse",
    name: "Finalmouse UltralightX",
    price: 189.0,
    description: "The Finalmouse UltralightX represents the ultimate in lightweight gaming mice. Featuring an innovative magnesium alloy shell, this mouse weighs an incredible 47g while maintaining structural integrity. The PixArt 3370 sensor delivers flawless tracking up to 19,000 DPI. Premium PTFE feet and paracord cable ensure zero resistance. Limited production with exclusive colorways. Designed for professional esports players who demand the lightest, most responsive mouse available.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h95/h52/9198280966174/Deathadder-Essential-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "White", value: "white" },
    ],
    sizes: ["Small", "Medium"],
    category: "mice",
  },
  {
    id: "noblechairs-hero-gaming-chair",
    name: "Razer Iskur V2 - Dark Gray - Fabric",
    price: 449.0,
    description: "The Razer Iskur V2 in Dark Gray Fabric edition features revolutionary adaptive lumbar support that adjusts to your spine's natural curve. Premium fabric upholstery provides breathability and comfort during extended gaming sessions. Built with a steel frame supporting up to 299 lbs, featuring 4D armrests, 152° recline, and memory foam cushions. The dark gray fabric finish adds sophistication while maintaining Razer's gaming DNA. Engineered for all-day ergonomic support.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h95/heb/9719861182494/iskur-v2-dark-grey-2-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "White", value: "white" },
      { name: "Brown", value: "brown" },
    ],
    sizes: ["Standard", "XL"],
    category: "chairs",
  },
  {
    id: "corsair-tc100-gaming-chair",
    name: "Razer Enki - Black",
    price: 299.0,
    description: "The Razer Enki - Black edition delivers all-day comfort with its optimized lumbar arch design. Featuring ultra-wide seat base, plush cushioning, and 152° recline for maximum relaxation. Built with a steel frame supporting up to 299 lbs and durable synthetic leather upholstery. The minimalist black design with subtle Razer branding fits any gaming setup. Perfect for gamers who prioritize comfort during marathon sessions without sacrificing style.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h41/had/9250062794782/enki-black-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "Gray", value: "gray" },
    ],
    sizes: ["Standard"],
    category: "chairs",
  },
  {
    id: "andaseaT-kaiser-gaming-chair",
    name: "Razer Enki - Quartz",
    price: 479.0,
    description: "The Razer Enki - Quartz edition brings elegant pink aesthetics to premium gaming comfort. Built on the acclaimed Enki platform with optimized lumbar arch, ultra-wide seat base, and plush cushioning. Features 152° recline, 4D armrests, and durable synthetic leather in stunning Quartz Pink colorway. Steel frame supports up to 299 lbs. Perfect for gamers who want to add a touch of sophistication and personality to their gaming space while enjoying all-day comfort.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h9a/haa/9250062827550/enki-quartz-500x500.png"],
    colors: [
      { name: "Black", value: "black" },
      { name: "Blue", value: "blue" },
      { name: "Pink", value: "pink" },
    ],
    sizes: ["Standard", "XL", "XXL"],
    category: "chairs",
  },
  {
    id: "herman-miller-vantum-gaming-chair",
    name: "Razer Iskur V2 X - Light Gray - Fabric",
    price: 995.0,
    description: "The Razer Iskur V2 X in Light Gray Fabric offers essential ergonomic gaming at an accessible price. Features built-in lumbar support curve designed to match your spine's natural shape. Premium fabric upholstery ensures breathability and comfort. Equipped with 2D armrests, 139° recline, and high-density foam cushions. Steel frame supports up to 299 lbs. The light gray fabric finish adds a modern, professional look to any gaming setup. Perfect entry point to Razer's ergonomic seating.",
    images: ["https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h77/hba/9883860271134/iskur-v2-x-gray-500x500-v3.png"],
    colors: [
      { name: "Black", value: "black" },
    ],
    sizes: ["Universal"],
    category: "chairs",
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRelatedProducts(productId: string, limit = 5): Product[] {
  return products.filter((p) => p.id !== productId).slice(0, limit)
}
