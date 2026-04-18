import { MenuItem } from "../types";

export const MOCK_MENU: MenuItem[] = [
  {
    id: "m1",
    name: "Thieboudienne Penda Mbaye",
    description: "Le plat national sénégalais : riz rouge au poisson, légumes frais (manioc, carotte, chou) et tamarin.",
    price: 3500,
    category: "Sénégalais",
    stock: 25,
    green: true,
    rating: 4.9,
    imageUrl: "https://picsum.photos/seed/thieb/400/300",
    allergens: ["Poisson"]
  },
  {
    id: "m2",
    name: "Yassa au Poulet",
    description: "Poulet mariné au citron et oignons caramélisés. Servi avec riz blanc parfumé.",
    price: 2500,
    category: "Sénégalais",
    stock: 40,
    rating: 4.7,
    imageUrl: "https://picsum.photos/seed/yassa/400/300",
    allergens: ["Moutarde"]
  },
  {
    id: "m3",
    name: "Mafé à la Viande",
    description: "Bœuf mijoté dans une sauce onctueuse à la pâte d'arachide. Un classique réconfortant.",
    price: 2800,
    category: "Sénégalais",
    stock: 15,
    rating: 4.8,
    imageUrl: "https://picsum.photos/seed/mafe/400/300",
    allergens: ["Arachides"]
  },
  {
    id: "m4",
    name: "Thiou Viande",
    description: "Ragoût de viande à la tomate et aux petits légumes, saveurs authentiques du terroir.",
    price: 3000,
    category: "Sénégalais",
    stock: 12,
    rating: 4.5,
    imageUrl: "https://picsum.photos/seed/thiou/400/300"
  },
  {
    id: "m5",
    name: "Dibi Haoussa",
    description: "Agneau grillé au feu de bois avec épices du Niger, servi avec oignons et piment.",
    price: 4500,
    category: "Classic",
    stock: 10,
    rating: 4.9,
    imageUrl: "https://picsum.photos/seed/dibi/400/300"
  },
  {
    id: "m6",
    name: "Riz sauté Végétarien",
    description: "Riz aux petits légumes croquants, tofu mariné et herbes fraîches.",
    price: 2000,
    category: "Veggie",
    stock: 30,
    green: true,
    rating: 4.4,
    imageUrl: "https://picsum.photos/seed/veggie/400/300"
  },
  {
    id: "m7",
    name: "Sandwich Poulet Mayo",
    description: "Pain croustillant baguette, poulet rôti effiloché, crudités et sauce maison.",
    price: 1500,
    category: "Classic",
    stock: 50,
    rating: 4.2,
    imageUrl: "https://picsum.photos/seed/sandwich/400/300"
  },
  {
    id: "m8",
    name: "Jus de Bissap Royal",
    description: "Infusion d'hibiscus rouge, menthe fraîche et une touche de fleur d'oranger.",
    price: 500,
    category: "Dessert",
    stock: 100,
    rating: 4.9,
    imageUrl: "https://picsum.photos/seed/bissap/400/300"
  },
  {
    id: "m9",
    name: "Dégué au Lait",
    description: "Mila de petit mil au yaourt crémeux, servi bien frais.",
    price: 800,
    category: "Dessert",
    stock: 45,
    rating: 4.8,
    imageUrl: "https://picsum.photos/seed/degue/400/300",
    allergens: ["Lactose"]
  },
  {
    id: "m10",
    name: "Café Touba Épicé",
    description: "Café traditionnel aromatisé au poivre de Guinée (jar) pour un réveil tonique.",
    price: 300,
    category: "Dessert",
    stock: 200,
    rating: 5.0,
    imageUrl: "https://picsum.photos/seed/touba/400/300"
  }
];

export const MOCK_ANTI_GASPI: MenuItem[] = [
  {
    id: "w1",
    name: "Panier Surprise Anti-Gaspi",
    description: "Un mix de plats du jour à prix réduit pour éviter le gaspillage. Quantité limitée !",
    price: 1000,
    category: "Anti-Gaspi",
    stock: 5,
    green: true,
    rating: 4.9,
    imageUrl: "https://picsum.photos/seed/waste/400/300"
  }
];
