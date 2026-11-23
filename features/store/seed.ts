import type { Product } from "./schema";
export const seedProducts: Product[] = [
  {
    slug: "itel-4kva-solar-system",
    name: "itel 4KVA solar system",
    category: "Solar & power",
    price: 145000000,
    image: "/products/itel-4kva.jpg",
    description:
      "A home-power package featuring an itel inverter, battery and solar panels. Speak with our team to confirm the configuration, installation requirements and current availability for your space.",
    specs: [
      "4KVA itel inverter",
      "2.5kWh battery",
      "Solar panels included in the advertised bundle",
      "Confirm panel configuration and installation scope before ordering",
    ],
  },
  {
    slug: "meco-portable-power-station",
    name: "MECO portable power station",
    category: "Solar & power",
    price: 56900000,
    image: "/products/meco-2kwh.jpg",
    description:
      "Portable backup power for work and everyday essentials. This standalone offer is a starting point: our team will confirm model details, current pricing and the right setup for your appliances.",
    specs: [
      "1200W rated output (advertised)",
      "AC / PV input",
      "Standalone power station",
      "Ask our team to confirm warranty terms",
    ],
  },
  {
    slug: "meco-solar-bundle",
    name: "MECO power station + solar",
    category: "Solar & power",
    price: 83800000,
    image: "/products/meco-solar-bundle.jpg",
    description:
      "Pair a portable power station with solar charging. Confirm the panel wattage, accessories and suitability for your intended load with Zhoppin before placing an order.",
    specs: [
      "2009Wh advertised capacity",
      "1200W rated output",
      "Solar panel bundle",
      "Runtime varies with load and conditions",
    ],
  },
  {
    slug: "itel-power-tank-500w",
    name: "itel Power Tank 500W",
    category: "Solar & power",
    price: 31000000,
    image: "/products/itel-power-tank.jpg",
    description:
      "A compact backup power option for your everyday devices. Contact Zhoppin for the latest stock, product specifications and a delivery quote to your location.",
    specs: [
      "1,000Wh LiFePO₄ battery (advertised)",
      "500W AC output",
      "Backup switchover advertised under 20ms",
      "Confirm supported appliances before purchase",
    ],
  },
  {
    slug: "itel-power-tank-solar-bundle",
    name: "itel Power Tank + solar panel",
    category: "Solar & power",
    price: 44900000,
    image: "/products/itel-solar-bundle.jpg",
    description:
      "Keep your everyday essentials powered with an itel Power Tank and solar panel combination. We will help confirm the panel specification, current price and delivery details before you buy.",
    specs: [
      "1,000Wh LiFePO₄ battery (advertised)",
      "500W AC output",
      "Solar panel bundle",
      "Confirm panel and warranty details with our team",
    ],
  },
].map((product) => ({
  ...product,
  category: "Solar & power",
  published: true,
  purchasable: false,
  stock: 0,
  featured: false,
}));
