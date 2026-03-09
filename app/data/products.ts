export interface Product {
    id: string;
    _id?: string;
    name: string;
    price: number;
    category: "Stationery" | "Electronics" | "Crockery" | "Disposable Items";
    image: string;
    description: string;
}

export const PRODUCTS: Product[] = [
    // Stationery
    {
        id: "s1",
        name: "Premium Fountain Pen",
        price: 25.99,
        category: "Stationery",
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&auto=format&fit=crop",
        description: "Elegant fountain pen with smooth ink flow for professional writing.",
    },
    {
        id: "s2",
        name: "Leather Bound Notebook",
        price: 18.50,
        category: "Stationery",
        image: "https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?q=80&w=800&auto=format&fit=crop",
        description: "High-quality leather notebook with thick, bleed-resistant pages.",
    },
    {
        id: "s3",
        name: "Desk Organizer Set",
        price: 35.00,
        category: "Stationery",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
        description: "Complete set to keep your workspace tidy and efficient.",
    },
    // Electronics
    {
        id: "e1",
        name: "Wireless Noise-Cancelling Headphones",
        price: 199.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        description: "Experience pure sound with advanced noise-cancelling technology.",
    },
    {
        id: "e2",
        name: "Mechanical Keyboard",
        price: 120.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop",
        description: "Tactile mechanical keyboard for enhanced typing and gaming.",
    },
    {
        id: "e3",
        name: "Portable Power Bank 20000mAh",
        price: 45.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop",
        description: "High-capacity power bank to keep your devices charged on the go.",
    },
    // Crockery
    {
        id: "c1",
        name: "Ceramic Dinner Set (16pcs)",
        price: 89.99,
        category: "Crockery",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
        description: "Elegant ceramic dinner set perfect for any formal or casual occasion.",
    },
    {
        id: "c2",
        name: "Crystal Glassware Set",
        price: 55.00,
        category: "Crockery",
        image: "https://images.unsplash.com/photo-1516919549054-e08258f29ea5?q=80&w=800&auto=format&fit=crop",
        description: "Sparkling crystal glasses for serving beverages in style.",
    },
    {
        id: "c3",
        name: "Porcelain Serving Bowls",
        price: 29.50,
        category: "Crockery",
        image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800&auto=format&fit=crop",
        description: "Beautifully crafted porcelain bowls for serving appetizers or sides.",
    },
    // Disposable Items
    {
        id: "d1",
        name: "Eco-Friendly Bamboo Plates",
        price: 15.00,
        category: "Disposable Items",
        image: "https://images.unsplash.com/photo-1594910411242-491c6e4e3fac?q=80&w=800&auto=format&fit=crop",
        description: "Biodegradable bamboo plates, a sustainable choice for your parties.",
    },
    {
        id: "d2",
        name: "Recyclable Paper Cups (50pcs)",
        price: 10.50,
        category: "Disposable Items",
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
        description: "Premium paper cups suitable for both hot and cold drinks.",
    },
    {
        id: "d3",
        name: "Compostable Cutlery Set",
        price: 12.00,
        category: "Disposable Items",
        image: "https://images.unsplash.com/photo-1616644203673-90d16be95908?q=80&w=800&auto=format&fit=crop",
        description: "Strong and sturdy compostable knives, forks, and spoons.",
    },
];
