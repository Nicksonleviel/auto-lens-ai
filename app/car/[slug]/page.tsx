import { ArrowLeft, MapPin, Gauge, Fuel, Zap, Car } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const carDatabase: Record<
  string,
  {
    name: string
    year: string
    make: string
    model: string
    bodyType: string
    origin: string
    image: string
    specs: {
      horsepower: string
      acceleration: string
      topSpeed: string
      fuelType: string
      engine: string
      transmission: string
    }
    description: string
  }
> = {
  "bmw-m3-coupe-2012": {
    name: "BMW M3 Coupe",
    year: "2012",
    make: "BMW",
    model: "M3 Coupe",
    bodyType: "Coupe",
    origin: "Germany",
    image: "/bmw-m3-coupe-2012-silver.jpg",
    specs: {
      horsepower: "414 HP",
      acceleration: "4.1s (0-60 mph)",
      topSpeed: "155 mph",
      fuelType: "Gasoline",
      engine: "4.0L V8",
      transmission: "6-Speed Manual / 7-Speed DCT",
    },
    description:
      "The BMW M3 Coupe represents the pinnacle of BMW's sports car engineering. With its high-revving V8 engine and precision handling, it delivers an exhilarating driving experience while maintaining everyday usability.",
  },
  "bmw-335i-coupe-2012": {
    name: "BMW 335i Coupe",
    year: "2012",
    make: "BMW",
    model: "335i Coupe",
    bodyType: "Coupe",
    origin: "Germany",
    image: "/bmw-335i-coupe-2012-black.jpg",
    specs: {
      horsepower: "300 HP",
      acceleration: "5.4s (0-60 mph)",
      topSpeed: "155 mph",
      fuelType: "Gasoline",
      engine: "3.0L Twin-Turbo I6",
      transmission: "6-Speed Manual / 7-Speed DCT",
    },
    description:
      "The BMW 335i Coupe delivers an exceptional balance of performance and luxury. Its twin-turbocharged inline-six engine provides smooth, effortless power while maintaining the refined character expected of a BMW.",
  },
  "audi-r8-2008": {
    name: "Audi R8",
    year: "2008",
    make: "Audi",
    model: "R8",
    bodyType: "Coupe",
    origin: "Germany",
    image: "/audi-r8-2008-red.jpg",
    specs: {
      horsepower: "420 HP",
      acceleration: "4.4s (0-60 mph)",
      topSpeed: "187 mph",
      fuelType: "Gasoline",
      engine: "4.2L V8",
      transmission: "6-Speed Manual / R tronic",
    },
    description:
      "The Audi R8 is a mid-engine supercar that combines everyday drivability with exotic performance. Its aluminum space frame construction and quattro all-wheel drive make it a true all-weather sports car.",
  },
  "audi-s5-coupe-2012": {
    name: "Audi S5 Coupe",
    year: "2012",
    make: "Audi",
    model: "S5 Coupe",
    bodyType: "Coupe",
    origin: "Germany",
    image: "/audi-s5-coupe-2012-white.jpg",
    specs: {
      horsepower: "333 HP",
      acceleration: "4.9s (0-60 mph)",
      topSpeed: "155 mph",
      fuelType: "Gasoline",
      engine: "3.0L Supercharged V6",
      transmission: "7-Speed S tronic",
    },
    description:
      "The Audi S5 Coupe combines elegant design with spirited performance. Its supercharged V6 engine and quattro all-wheel drive deliver confident handling in all conditions.",
  },
  "audi-tt-rs-2012": {
    name: "Audi TT RS",
    year: "2012",
    make: "Audi",
    model: "TT RS",
    bodyType: "Coupe",
    origin: "Germany",
    image: "/audi-tt-rs-2012-blue.jpg",
    specs: {
      horsepower: "360 HP",
      acceleration: "4.1s (0-60 mph)",
      topSpeed: "174 mph",
      fuelType: "Gasoline",
      engine: "2.5L Turbo I5",
      transmission: "6-Speed Manual",
    },
    description:
      "The Audi TT RS features a legendary turbocharged five-cylinder engine that produces a distinctive exhaust note. Its compact dimensions and powerful drivetrain make it a thrilling driver's car.",
  },
  "chevrolet-corvette-zr1-2012": {
    name: "Chevrolet Corvette ZR1",
    year: "2012",
    make: "Chevrolet",
    model: "Corvette ZR1",
    bodyType: "Coupe",
    origin: "USA",
    image: "/chevrolet-corvette-zr1-2012-yellow.jpg",
    specs: {
      horsepower: "638 HP",
      acceleration: "3.4s (0-60 mph)",
      topSpeed: "205 mph",
      fuelType: "Gasoline",
      engine: "6.2L Supercharged V8",
      transmission: "6-Speed Manual",
    },
    description:
      "The Corvette ZR1 is America's supercar, featuring a supercharged LS9 V8 engine and advanced carbon fiber construction. It represents the pinnacle of American performance engineering.",
  },
  "chevrolet-camaro-ss-2010": {
    name: "Chevrolet Camaro SS",
    year: "2010",
    make: "Chevrolet",
    model: "Camaro SS",
    bodyType: "Coupe",
    origin: "USA",
    image: "/chevrolet-camaro-ss-2010-orange.jpg",
    specs: {
      horsepower: "426 HP",
      acceleration: "4.7s (0-60 mph)",
      topSpeed: "155 mph",
      fuelType: "Gasoline",
      engine: "6.2L V8",
      transmission: "6-Speed Manual",
    },
    description:
      "The Chevrolet Camaro SS revived the iconic muscle car nameplate with aggressive retro styling and modern performance. Its LS3 V8 delivers exhilarating acceleration and a soundtrack to match.",
  },
  "ferrari-458-italia-2012": {
    name: "Ferrari 458 Italia",
    year: "2012",
    make: "Ferrari",
    model: "458 Italia",
    bodyType: "Coupe",
    origin: "Italy",
    image: "/ferrari-458-italia-2012-red.jpg",
    specs: {
      horsepower: "562 HP",
      acceleration: "3.4s (0-60 mph)",
      topSpeed: "202 mph",
      fuelType: "Gasoline",
      engine: "4.5L V8",
      transmission: "7-Speed Dual-Clutch",
    },
    description:
      "The Ferrari 458 Italia is a masterpiece of Italian engineering and design. Its naturally aspirated V8 engine produces one of the most iconic sounds in automotive history while delivering blistering performance.",
  },
  "ferrari-california-2012": {
    name: "Ferrari California",
    year: "2012",
    make: "Ferrari",
    model: "California",
    bodyType: "Convertible",
    origin: "Italy",
    image: "/ferrari-california-2012-red-convertible.jpg",
    specs: {
      horsepower: "453 HP",
      acceleration: "3.8s (0-60 mph)",
      topSpeed: "193 mph",
      fuelType: "Gasoline",
      engine: "4.3L V8",
      transmission: "7-Speed Dual-Clutch",
    },
    description:
      "The Ferrari California introduced a new era of grand touring for the prancing horse brand. Its retractable hardtop and front-mounted V8 make it a versatile exotic for any occasion.",
  },
  "porsche-911-turbo-2012": {
    name: "Porsche 911 Turbo",
    year: "2012",
    make: "Porsche",
    model: "911 Turbo",
    bodyType: "Coupe",
    origin: "Germany",
    image: "/porsche-911-turbo-2012-silver.jpg",
    specs: {
      horsepower: "500 HP",
      acceleration: "3.2s (0-60 mph)",
      topSpeed: "195 mph",
      fuelType: "Gasoline",
      engine: "3.8L Twin-Turbo Flat-6",
      transmission: "7-Speed PDK",
    },
    description:
      "The Porsche 911 Turbo is the ultimate expression of the iconic 911 platform. With its twin-turbocharged flat-six engine and all-wheel drive, it offers supercar performance with everyday practicality.",
  },
  "porsche-panamera-2012": {
    name: "Porsche Panamera",
    year: "2012",
    make: "Porsche",
    model: "Panamera",
    bodyType: "Sedan",
    origin: "Germany",
    image: "/porsche-panamera-2012-black.jpg",
    specs: {
      horsepower: "400 HP",
      acceleration: "4.8s (0-60 mph)",
      topSpeed: "175 mph",
      fuelType: "Gasoline",
      engine: "4.8L V8",
      transmission: "7-Speed PDK",
    },
    description:
      "The Porsche Panamera combines four-door practicality with Porsche's legendary sports car DNA. Its powerful V8 and agile handling make it a true sports sedan.",
  },
  "mercedes-benz-sl63-amg-2012": {
    name: "Mercedes-Benz SL63 AMG",
    year: "2012",
    make: "Mercedes-Benz",
    model: "SL63 AMG",
    bodyType: "Roadster",
    origin: "Germany",
    image: "/mercedes-benz-sl63-amg-2012-silver.jpg",
    specs: {
      horsepower: "530 HP",
      acceleration: "4.2s (0-60 mph)",
      topSpeed: "186 mph",
      fuelType: "Gasoline",
      engine: "5.5L Twin-Turbo V8",
      transmission: "7-Speed AMG Speedshift",
    },
    description:
      "The Mercedes-Benz SL63 AMG is the ultimate open-top grand tourer. Its hand-built AMG V8 delivers effortless performance while the retractable hardtop provides year-round versatility.",
  },
  "lamborghini-gallardo-2012": {
    name: "Lamborghini Gallardo",
    year: "2012",
    make: "Lamborghini",
    model: "Gallardo LP 560-4",
    bodyType: "Coupe",
    origin: "Italy",
    image: "/lamborghini-gallardo-2012-orange.jpg",
    specs: {
      horsepower: "552 HP",
      acceleration: "3.7s (0-60 mph)",
      topSpeed: "202 mph",
      fuelType: "Gasoline",
      engine: "5.2L V10",
      transmission: "6-Speed E-Gear",
    },
    description:
      "The Lamborghini Gallardo combines stunning Italian design with a screaming V10 engine. Its all-wheel drive system and aggressive styling make it an icon of exotic car culture.",
  },
  "ford-mustang-gt-2012": {
    name: "Ford Mustang GT",
    year: "2012",
    make: "Ford",
    model: "Mustang GT",
    bodyType: "Coupe",
    origin: "USA",
    image: "/ford-mustang-gt-2012-blue.jpg",
    specs: {
      horsepower: "420 HP",
      acceleration: "4.4s (0-60 mph)",
      topSpeed: "155 mph",
      fuelType: "Gasoline",
      engine: "5.0L V8",
      transmission: "6-Speed Manual",
    },
    description:
      "The Ford Mustang GT is an American muscle car icon. Its naturally aspirated 5.0L V8 delivers classic V8 performance with modern technology and handling.",
  },
  "dodge-challenger-srt8-2011": {
    name: "Dodge Challenger SRT8",
    year: "2011",
    make: "Dodge",
    model: "Challenger SRT8",
    bodyType: "Coupe",
    origin: "USA",
    image: "/dodge-challenger-srt8-2011-black.jpg",
    specs: {
      horsepower: "470 HP",
      acceleration: "4.5s (0-60 mph)",
      topSpeed: "175 mph",
      fuelType: "Gasoline",
      engine: "6.4L HEMI V8",
      transmission: "6-Speed Manual",
    },
    description:
      "The Dodge Challenger SRT8 is a modern interpretation of the classic American muscle car. Its 392 HEMI V8 delivers brutal acceleration while its retro styling turns heads wherever it goes.",
  },
  "nissan-gt-r-2012": {
    name: "Nissan GT-R",
    year: "2012",
    make: "Nissan",
    model: "GT-R",
    bodyType: "Coupe",
    origin: "Japan",
    image: "/nissan-gt-r-2012-silver.jpg",
    specs: {
      horsepower: "530 HP",
      acceleration: "2.9s (0-60 mph)",
      topSpeed: "196 mph",
      fuelType: "Gasoline",
      engine: "3.8L Twin-Turbo V6",
      transmission: "6-Speed Dual-Clutch",
    },
    description:
      "The Nissan GT-R, nicknamed 'Godzilla', is a technological tour de force. Its advanced all-wheel drive system and twin-turbo V6 deliver supercar-slaying performance at a fraction of the price.",
  },
  "toyota-supra-2002": {
    name: "Toyota Supra",
    year: "2002",
    make: "Toyota",
    model: "Supra",
    bodyType: "Coupe",
    origin: "Japan",
    image: "/toyota-supra-2002-orange.jpg",
    specs: {
      horsepower: "320 HP",
      acceleration: "4.6s (0-60 mph)",
      topSpeed: "155 mph",
      fuelType: "Gasoline",
      engine: "3.0L Twin-Turbo I6",
      transmission: "6-Speed Manual",
    },
    description:
      "The Toyota Supra is a legendary Japanese sports car known for its bulletproof 2JZ engine. Its combination of style, performance, and tuning potential has made it an icon of automotive culture.",
  },
  "honda-nsx-2005": {
    name: "Honda NSX",
    year: "2005",
    make: "Honda",
    model: "NSX",
    bodyType: "Coupe",
    origin: "Japan",
    image: "/honda-nsx-2005-red.jpg",
    specs: {
      horsepower: "290 HP",
      acceleration: "5.0s (0-60 mph)",
      topSpeed: "168 mph",
      fuelType: "Gasoline",
      engine: "3.2L V6 VTEC",
      transmission: "6-Speed Manual",
    },
    description:
      "The Honda NSX revolutionized the supercar world by offering exotic performance with everyday reliability. Its mid-mounted VTEC V6 and aluminum construction make it a timeless driver's car.",
  },
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const car = carDatabase[slug]

  if (!car) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900/80 rounded-2xl ring-1 ring-white/10 shadow-lg shadow-primary/10">
          <h1 className="text-2xl font-bold text-foreground mb-4">Car Not Found</h1>
          <Link href="/browse">
            <Button className="shadow-lg shadow-primary/20">Browse All Cars</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/browse"
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors ring-1 ring-white/10"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">{car.name}</h1>
              <p className="text-xs text-muted-foreground">
                {car.year} • {car.origin}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-border shadow-xl shadow-primary/10 ring-1 ring-white/10">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/80 rounded-2xl p-6 border border-primary/40 shadow-xl shadow-primary/20 ring-1 ring-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{car.name}</h2>
                  <p className="text-lg text-muted-foreground">
                    {car.make} • {car.bodyType}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium ring-1 ring-primary/20">
                  {car.year}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{car.origin}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-medium">Horsepower</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{car.specs.horsepower}</p>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Gauge className="h-5 w-5" />
                  <span className="text-sm font-medium">0-60 mph</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{car.specs.acceleration}</p>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Car className="h-5 w-5" />
                  <span className="text-sm font-medium">Top Speed</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{car.specs.topSpeed}</p>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Fuel className="h-5 w-5" />
                  <span className="text-sm font-medium">Fuel Type</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{car.specs.fuelType}</p>
              </div>
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-6 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Powertrain</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engine</span>
                  <span className="font-medium text-foreground">{car.specs.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transmission</span>
                  <span className="font-medium text-foreground">{car.specs.transmission}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-6 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
