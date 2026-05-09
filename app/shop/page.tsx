import { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, Package, Truck, RefreshCw, ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Shop — Toilet Book Merch",
  description: "Official Toilet Book merchandise. Tees, polos, stickers and more. Wear the world's #1 bathroom rating community.",
}

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Tee",
    desc: "Heavyweight cotton. Front chest logo. Back QR code to toilet-book.com.",
    price: "$29",
    emoji: "👕",
    tag: "Bestseller",
    tagColor: "bg-sky-100 text-sky-700",
    colors: ["#FFFFFF", "#F5F0E8", "#1A1A2E"],
    printfulLink: "https://www.printful.com",
    sizes: "XS — 3XL",
  },
  {
    id: 2,
    name: "Branded Polo",
    desc: "Pique cotton polo. Embroidered chest logo. QR code on back collar.",
    price: "$49",
    emoji: "🏌️",
    tag: "Your everyday",
    tagColor: "bg-emerald-100 text-emerald-700",
    colors: ["#FFFFFF", "#F5F0E8", "#1E3A5F"],
    printfulLink: "https://www.printful.com",
    sizes: "XS — 2XL",
  },
  {
    id: 3,
    name: "Die-Cut Sticker",
    desc: "Waterproof vinyl. Perfect for laptops, water bottles, bathroom doors.",
    price: "$4",
    emoji: "🏷️",
    tag: "Best promo",
    tagColor: "bg-amber-100 text-amber-700",
    colors: ["#FFFFFF"],
    printfulLink: "https://www.printful.com",
    sizes: '3" × 3"',
  },
  {
    id: 4,
    name: "Sticker Pack (5)",
    desc: "5 assorted Toilet Book stickers. Mix of logo, toilet, and tagline designs.",
    price: "$14",
    emoji: "📦",
    tag: "Great gift",
    tagColor: "bg-violet-100 text-violet-700",
    colors: ["#FFFFFF"],
    printfulLink: "https://www.printful.com",
    sizes: 'Mixed sizes',
  },
  {
    id: 5,
    name: "Tote Bag",
    desc: "Heavy canvas tote. Large front logo print. Perfect for grocery runs.",
    price: "$22",
    emoji: "🛍️",
    tag: "Eco friendly",
    tagColor: "bg-emerald-100 text-emerald-700",
    colors: ["#F5F0E8", "#FFFFFF"],
    printfulLink: "https://www.printful.com",
    sizes: "One size",
  },
  {
    id: 6,
    name: "Mug",
    desc: "11oz ceramic mug. Dishwasher safe. For the bathroom connoisseur.",
    price: "$18",
    emoji: "☕",
    tag: "Fan fave",
    tagColor: "bg-sky-100 text-sky-700",
    colors: ["#FFFFFF"],
    printfulLink: "https://www.printful.com",
    sizes: "11oz",
  },
]

function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300">

      {/* Product illustration */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 h-52 flex flex-col items-center justify-center">

        {/* Tag */}
        <div className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${product.tagColor}`}>
          {product.tag}
        </div>

        {/* Big emoji product preview */}
        <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {product.emoji}
        </div>

        {/* Mock design preview */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-700 rounded-lg px-3 py-1.5 shadow-sm border border-slate-200/60 dark:border-slate-600">
            <span className="text-sm">🚽</span>
            <span className="text-xs font-bold tracking-wider text-slate-700 dark:text-slate-200">TOILET BOOK</span>
          </div>
          <span className="text-xs text-slate-400">toilet-book.com</span>
        </div>

        {/* Color swatches */}
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {product.colors.map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
          <span className="text-lg font-bold text-sky-600 dark:text-sky-400">{product.price}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">{product.desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{product.sizes}</span>
          <a
            href={product.printfulLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Order <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Header */}
      <div className="border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">🚽</span>
            <span className="text-slate-900 dark:text-white">Toilet Book</span>
          </Link>
          <span className="text-sm text-slate-400">Official Merch</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 rounded-full px-4 py-1.5 text-sm text-sky-700 dark:text-sky-400 mb-4">
            <ShoppingBag className="h-3.5 w-3.5" />
            Print on demand — no inventory needed
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Wear the movement 🚽
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Official Toilet Book merch. Every piece helps spread the word — and the QR code on the back drives new users straight to the app.
          </p>
        </div>

        {/* QR polo callout */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 p-6 sm:p-8 mb-10 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-6xl">🏌️</div>
            <div className="flex-1">
              <div className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-1">Signature piece</div>
              <h2 className="text-xl font-bold mb-2">The Branded Polo</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Embroidered chest logo. QR code on the back collar that links directly to toilet-book.com. Every time someone asks about it — it's a conversation and a new user.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-sky-400">$49</span>
                <a
                  href="https://www.printful.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl"
                >
                  Order on Printful <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* How it works — Printful explainer */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 mb-10">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-sky-500" />
            How ordering works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: ShoppingBag, step: "01", title: "Choose your item", desc: "Pick a product above and click Order — it takes you to Printful to customise size and quantity." },
              { icon: Package,     step: "02", title: "Printful prints it", desc: "Printful prints your order on demand and ships directly to you. No minimum order. No inventory." },
              { icon: Truck,       step: "03", title: "It arrives at your door", desc: "Standard shipping 5-7 days. Express available. Ships worldwide." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-sky-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-500 mb-1">{step}</div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticker promo */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-sky-50 dark:from-amber-950/20 dark:to-sky-950/20 border border-amber-200/60 dark:border-amber-800/40 p-6 text-center mb-10">
          <div className="text-4xl mb-3">🏷️</div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Stickers = free marketing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            At $4 each, stickers are the highest ROI marketing you can do. Stick them in bathrooms, on water bottles, laptops — every sticker is a potential new user.
          </p>
          <a
            href="https://www.printful.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-xl"
          >
            Order stickers <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 px-4 py-3">
          <RefreshCw className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            All orders are fulfilled by Printful — a print-on-demand service. Toilet Book takes no payment directly. Once your Printful store is set up, orders are fully automated. Returns and exchanges are handled by Printful directly.
          </p>
        </div>

      </div>
    </div>
  )
}
