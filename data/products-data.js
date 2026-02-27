// Products Data
const PRODUCTS = [
    {
        id: 'P001',
        title: 'Apple iPhone 15 (Black, 128 GB)',
        category: 'Mobiles',
        price: 79900,
        mrp: 79900,
        discount: 0,
        rating: 4.6,
        reviewCount: 3421,
        image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=400&hei=400&fmt=jpeg&qlt=90',
        images: [
            'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=400&hei=400&fmt=jpeg&qlt=90'
        ],
        description: 'Apple iPhone 15 features a 48MP camera, A16 Bionic chip, Dynamic Island, and USB-C connectivity. 128GB storage with Super Retina XDR display.',
        specifications: {
            'Brand': 'Apple',
            'Model': 'iPhone 15',
            'Storage': '128 GB',
            'RAM': '6 GB',
            'Display': '6.1 inch Super Retina XDR',
            'Processor': 'A16 Bionic',
            'Battery': '3349 mAh',
            'OS': 'iOS 17'
        },
        inStock: true,
        isBestSeller: true
    },
    {
        id: 'P002',
        title: 'Samsung Galaxy S23 5G (Green, 256 GB)',
        category: 'Mobiles',
        price: 64999,
        mrp: 95999,
        discount: 32,
        rating: 4.5,
        reviewCount: 1205,
        image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg',
        images: [
            'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg'
        ],
        description: 'Samsung Galaxy S23 5G with Snapdragon 8 Gen 2 processor, 50MP camera, and 256GB storage. Premium glass design with IP68 water resistance.',
        specifications: {
            'Brand': 'Samsung',
            'Model': 'Galaxy S23',
            'Storage': '256 GB',
            'RAM': '8 GB',
            'Display': '6.1 inch Dynamic AMOLED 2X',
            'Processor': 'Snapdragon 8 Gen 2',
            'Battery': '3900 mAh',
            'OS': 'Android 13'
        },
        inStock: true,
        isBestSeller: true
    },
    {
        id: 'P003',
        title: 'ASUS Vivobook 15 Core i5 11th Gen',
        category: 'Electronics',
        price: 38990,
        mrp: 60990,
        discount: 36,
        rating: 4.3,
        reviewCount: 854,
        image: 'assets/images/products/p003_1.jpg',
        images: [
            'assets/images/products/p003_1.jpg'
        ],
        description: 'ASUS Vivobook 15 with Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 15.6" FHD display. Lightweight and portable for everyday computing.',
        specifications: {
            'Brand': 'ASUS',
            'Model': 'Vivobook 15',
            'Processor': 'Intel Core i5-1135G7',
            'RAM': '8 GB DDR4',
            'Storage': '512 GB SSD',
            'Display': '15.6 inch FHD',
            'Graphics': 'Intel Iris Xe',
            'OS': 'Windows 11'
        },
        inStock: true,
        isBestSeller: false
    },
    {
        id: 'P004',
        title: 'Canon EOS 3000D DSLR Camera',
        category: 'Cameras',
        price: 29999,
        mrp: 35495,
        discount: 15,
        rating: 4.4,
        reviewCount: 642,
        image: 'https://m.media-amazon.com/images/I/71EWRyqzw0L._SX522_.jpg',
        images: [
            'https://m.media-amazon.com/images/I/71EWRyqzw0L._SX522_.jpg'
        ],
        description: 'Canon EOS 3000D 18MP DSLR Camera with 18-55mm lens. Wi-Fi connectivity, Full HD video recording, and easy-to-use interface for beginners.',
        specifications: {
            'Brand': 'Canon',
            'Model': 'EOS 3000D',
            'Resolution': '18 MP',
            'Sensor': 'APS-C CMOS',
            'Lens': '18-55mm f/3.5-5.6',
            'Video': '1080p Full HD',
            'Connectivity': 'Wi-Fi',
            'Weight': '436g'
        },
        inStock: true,
        isBestSeller: false
    },
    {
        id: 'P005',
        title: 'Nike Revolution 6 Next Nature Running Shoes',
        category: 'Fashion',
        price: 2495,
        mrp: 3695,
        discount: 32,
        rating: 4.2,
        reviewCount: 2190,
        image: 'https://placehold.co/400x400/222/fff?text=Nike+Revolution+6',
        images: [
            'https://placehold.co/400x400/222/fff?text=Nike+Revolution+6'
        ],
        description: 'Nike Revolution 6 lightweight running shoes with cushioned midsole and breathable mesh upper. Perfect for everyday running and gym workouts.',
        specifications: {
            'Brand': 'Nike',
            'Type': 'Running Shoes',
            'Material': 'Mesh & Synthetic',
            'Sole': 'Rubber',
            'Closure': 'Lace-Up',
            'Color': 'Black/White'
        },
        inStock: true,
        isBestSeller: true
    },
    {
        id: 'P006',
        title: 'Realme 11 Pro 5G (Sunrise Beige, 256 GB)',
        category: 'Mobiles',
        price: 21999,
        mrp: 27999,
        discount: 21,
        rating: 4.3,
        reviewCount: 1870,
        image: 'https://placehold.co/400x400/FFD700/333?text=Realme+11+Pro+5G',
        images: [
            'https://placehold.co/400x400/FFD700/333?text=Realme+11+Pro+5G'
        ],
        description: 'Realme 11 Pro 5G with 100MP ProLight Camera, MediaTek Dimensity 7050, 256GB storage, and 67W SUPERVOOC fast charging.',
        specifications: {
            'Brand': 'Realme',
            'Model': '11 Pro 5G',
            'Storage': '256 GB',
            'RAM': '8 GB',
            'Display': '6.7 inch FHD+ AMOLED',
            'Processor': 'MediaTek Dimensity 7050',
            'Battery': '5000 mAh',
            'OS': 'Android 13'
        },
        inStock: true,
        isBestSeller: false
    },
    {
        id: 'P007',
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        category: 'Electronics',
        price: 26990,
        mrp: 34990,
        discount: 23,
        rating: 4.7,
        reviewCount: 987,
        image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX522_.jpg',
        images: [
            'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX522_.jpg'
        ],
        description: 'Sony WH-1000XM5 industry-leading noise cancellation headphones with 30-hour battery life, multipoint connection, and crystal clear hands-free calling.',
        specifications: {
            'Brand': 'Sony',
            'Model': 'WH-1000XM5',
            'Type': 'Over-Ear Wireless',
            'Driver': '30mm',
            'Battery': '30 hours',
            'Connectivity': 'Bluetooth 5.2',
            'Noise Cancelling': 'Yes (Active)',
            'Weight': '250g'
        },
        inStock: true,
        isBestSeller: true
    },
    {
        id: 'P008',
        title: 'Prestige Iris 750 Watt Mixer Grinder',
        category: 'Appliances',
        price: 2249,
        mrp: 3745,
        discount: 40,
        rating: 4.1,
        reviewCount: 3520,
        image: 'https://placehold.co/400x400/f5f5f5/333?text=Prestige+Iris+Mixer',
        images: [
            'https://placehold.co/400x400/f5f5f5/333?text=Prestige+Iris+Mixer'
        ],
        description: 'Prestige Iris 750 Watt mixer grinder with 3 stainless steel jars, powerful motor, and multifunctional blades for grinding, mixing and blending.',
        specifications: {
            'Brand': 'Prestige',
            'Model': 'Iris',
            'Power': '750 Watt',
            'Jars': '3 Stainless Steel',
            'Speed': '3 Speed + Pulse',
            'Color': 'White',
            'Warranty': '2 Years'
        },
        inStock: true,
        isBestSeller: false
    }
];
