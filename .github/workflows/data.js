const MENU_ITEMS = [
  // ── VEG ──
  { id:1,  name:"Paneer Butter Masala",  cat:"veg",    price:220, rating:4.8, tag:"Best Seller",
    desc:"Rich creamy paneer in buttery tomato gravy",
    img:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80" },

  { id:2,  name:"Dal Tadka",             cat:"veg",    price:140, rating:4.6, tag:"",
    desc:"Yellow lentils tempered with cumin & spices",
    img:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80" },

  { id:3,  name:"Veg Biryani",           cat:"veg",    price:180, rating:4.7, tag:"Popular",
    desc:"Aromatic basmati rice with fresh vegetables",
    img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80" },

  { id:4,  name:"Palak Paneer",          cat:"veg",    price:200, rating:4.5, tag:"",
    desc:"Cottage cheese in smooth spinach gravy",
    img:"https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&q=80" },

  { id:5,  name:"Masala Dosa",           cat:"veg",    price:120, rating:4.9, tag:"Best Seller",
    desc:"Crispy rice crepe with spiced potato filling",
    img:"https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80" },

  { id:6,  name:"Veg Spring Rolls",      cat:"veg",    price:110, rating:4.4, tag:"",
    desc:"Crispy golden rolls with veggie filling",
    img:"https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80" },

  { id:7,  name:"Aloo Gobi",             cat:"veg",    price:130, rating:4.3, tag:"",
    desc:"Spiced potato and cauliflower stir fry",
    img:"https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500&q=80" },

  { id:8,  name:"Paneer Tikka",          cat:"veg",    price:190, rating:4.7, tag:"Popular",
    desc:"Grilled cottage cheese with tandoori spices",
    img:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80" },

  // ── NON-VEG ──
  { id:9,  name:"Butter Chicken",        cat:"nonveg", price:280, rating:4.9, tag:"Best Seller",
    desc:"Tender chicken in creamy tomato gravy",
    img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80" },

  { id:10, name:"Chicken Biryani",       cat:"nonveg", price:320, rating:4.9, tag:"Best Seller",
    desc:"Aromatic basmati rice with spiced chicken",
    img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80" },

  { id:11, name:"Mutton Curry",          cat:"nonveg", price:380, rating:4.7, tag:"Popular",
    desc:"Slow-cooked mutton in rich spice blend",
    img:"https://images.unsplash.com/photo-1545247181-516773cae754?w=500&q=80" },

  { id:12, name:"Chicken 65",            cat:"nonveg", price:180, rating:4.8, tag:"Popular",
    desc:"Spicy deep-fried chicken bites",
    img:"https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=500&q=80" },

  { id:13, name:"Prawn Masala",          cat:"nonveg", price:340, rating:4.6, tag:"",
    desc:"Juicy prawns in spiced coconut gravy",
    img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80" },

  { id:14, name:"Seekh Kebab",           cat:"nonveg", price:220, rating:4.5, tag:"",
    desc:"Minced meat skewers with aromatic spices",
    img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80" },

  { id:15, name:"Fish Fry",              cat:"nonveg", price:260, rating:4.6, tag:"Popular",
    desc:"Crispy spiced fish fry with chutney",
    img:"https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=500&q=80" },

  { id:16, name:"Egg Curry",             cat:"nonveg", price:160, rating:4.4, tag:"",
    desc:"Boiled eggs in tangy onion-tomato gravy",
    img:"https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500&q=80" },

  // ── SWEETS — local images ──
  { id:17, name:"Gulab Jamun",           cat:"sweets", price:80,  rating:4.9, tag:"Best Seller",
    desc:"Soft milk dumplings soaked in rose syrup",
    img:"images/gulab-jamun.png" },

  { id:18, name:"Rasgulla",              cat:"sweets", price:75,  rating:4.7, tag:"Popular",
    desc:"Spongy cottage cheese balls in sugar syrup",
    img:"images/rasgulla.png" },

  { id:19, name:"Kaju Katli",            cat:"sweets", price:450, rating:4.8, tag:"Premium",
    desc:"Diamond-shaped cashew fudge (250g box)",
    img:"images/kaju-katli.png" },

  { id:20, name:"Halwa",                 cat:"sweets", price:90,  rating:4.5, tag:"",
    desc:"Semolina halwa with ghee and dry fruits",
    img:"images/halwa.jpg" },

  { id:21, name:"Ladoo",                 cat:"sweets", price:120, rating:4.6, tag:"Popular",
    desc:"Besan ladoo with cardamom and ghee",
    img:"images/ladoo.png" },

  { id:22, name:"Chocolate Cake",        cat:"sweets", price:350, rating:4.8, tag:"Popular",
    desc:"Rich moist chocolate cake (500g)",
    img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" },

  // ── JUICES ──
  { id:23, name:"Mango Lassi",           cat:"juices", price:80,  rating:4.9, tag:"Best Seller",
    desc:"Thick creamy mango yogurt drink",
    img:"images/Mango Lassi.png" },

  { id:24, name:"Fresh Orange Juice",    cat:"juices", price:70,  rating:4.7, tag:"Popular",
    desc:"Freshly squeezed orange juice",
    img:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80" },

  { id:25, name:"Watermelon Juice",      cat:"juices", price:60,  rating:4.6, tag:"",
    desc:"Chilled fresh watermelon juice",
    img:"images/Watermelon.png" },

  { id:26, name:"Masala Lemonade",       cat:"juices", price:50,  rating:4.5, tag:"",
    desc:"Tangy spiced lemon soda",
    img:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80" },

  { id:27, name:"Coconut Water",         cat:"juices", price:55,  rating:4.8, tag:"Healthy",
    desc:"Fresh tender coconut water",
    img:"images/coconut-water.png" },

  { id:28, name:"Strawberry Shake",      cat:"juices", price:90,  rating:4.7, tag:"Popular",
    desc:"Thick creamy strawberry milkshake",
    img:"images/Starwberry shake.png" },

  // ── DESSERTS ──
  { id:29, name:"Kulfi",                 cat:"desserts", price:70,  rating:4.8, tag:"Best Seller",
    desc:"Traditional Indian ice cream on a stick",
    img:"images/kulfi.jpg" },

  { id:30, name:"Kheer",                 cat:"desserts", price:90,  rating:4.7, tag:"Popular",
    desc:"Creamy rice pudding with cardamom",
    img:"images/kheer.jpg" },

  { id:31, name:"Brownie + Ice Cream",   cat:"desserts", price:150, rating:4.9, tag:"Best Seller",
    desc:"Warm fudgy brownie with vanilla ice cream",
    img:"https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&q=80" },

  { id:32, name:"Mango Sorbet",          cat:"desserts", price:110, rating:4.6, tag:"",
    desc:"Refreshing mango sorbet, dairy-free",
    img:"https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&q=80" },

  { id:33, name:"Phirni",                cat:"desserts", price:85,  rating:4.5, tag:"",
    desc:"Chilled ground rice pudding in clay pot",
    img:"images/phirni.jpg" },

  { id:34, name:"Waffle + Nutella",      cat:"desserts", price:160, rating:4.8, tag:"Popular",
    desc:"Crispy waffle with Nutella and fruits",
    img:"https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80" },
];
