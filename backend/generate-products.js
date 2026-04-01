const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const categories = ['Groceries', 'Beverages', 'Fresh Food', 'Household', 'Personal Care', 'Snacks'];
const brands = {
  Groceries: ['Vinamilk', 'Th True Milk', 'Milo', 'Nestle', 'Ovaltine', 'Acecook', 'Vifon', 'Nam Nguyet', 'Kao', 'Kinh Do', 'Gạo', 'Mì', 'Noodles', 'Dầu', 'Nước mắm', 'Hàng nhập', 'Mè', 'Đường', 'Bột', 'Gia vị'],
  Beverages: ['Coca Cola', 'Pepsi', 'Sprite', 'Fanta', 'Red Bull', 'Sting', 'Nuoc suoi', 'Tra sua', 'Sinh to', 'Beer', 'Trà', 'Cà phê', 'Nước ngọt', 'Nước ép', 'Nước soda', 'Nước coco', 'Yogurt'],
  'Fresh Food': ['Rau cu', 'Thit heo', 'Ca', 'Ga', 'Trung', 'Rau xanh', 'Hoa qua', 'Nam', 'Mi tom', 'Hải sản', 'Rau củ', 'Thịt bò', 'Thịt gà', 'Thịt vịt', 'Cá hồi', 'Tôm', 'Mực'],
  Household: ['Omo', 'Tide', 'Comfort', 'Sunlight', 'My Hao', 'Grove', 'Gift', 'Vanish', 'Duck', 'Nectar', 'Nước lau sàn', 'Bột giặt', 'Nước xả', 'Nước rửa chén', 'Bàn chải', 'Khăn giẻ', 'Bình xịt'],
  'Personal Care': ['Head Shoulders', 'Pantene', 'Clear', 'Dove', 'Nivea', 'Lifebuoy', 'Colgate', 'CloseUp', 'Listerine', 'Gillette', 'Xà phòng', 'Sữa tắm', 'Kem đánh răng', 'Sữa dưỡng', 'Dầu gội', 'Sữa rửa mặt', 'Khẩu trang'],
  Snacks: ['KitKat', 'Milka', 'Oreo', 'Lays', 'CoCa', 'Snickers', 'MMs', 'Pringles', 'Tortilla', 'Honey Butter', 'Bánh quy', 'Kẹo', 'Snack', 'Chocolate', 'Bánh gạo', 'Kẹo chewing', 'Bánh pie']
};

const units = ['1kg', '500g', '1L', '500ml', '24pcs', '12pcs', '6pcs', '1 chai', '1 lon', '1 hop', '1 goi'];
const stores = ['store-001', 'store-002', 'store-003'];

function generatePrice() {
  return Math.floor(Math.random() * 500000) + 10000;
}

const products = [];

categories.forEach(category => {
  const categoryBrands = brands[category];
  categoryBrands.forEach((brand, idx) => {
    const productId = `prod-${String(products.length + 1).padStart(3, '0')}`;
    const basePrice = generatePrice();

    const prices = stores.map(storeId => ({
      storeId,
      regularPrice: basePrice + Math.floor(Math.random() * 20000 - 10000),
      salePrice: Math.random() > 0.7 ? Math.floor(basePrice * 0.8) : null,
      updatedAt: '2026-03-15'
    }));

    products.push({
      id: productId,
      name: `${brand} Product ${idx + 1}`,
      category,
      brand,
      unit: units[Math.floor(Math.random() * units.length)],
      image: `https://via.placeholder.com/200x200?text=${encodeURIComponent(brand)}`,
      prices,
      createdAt: '2026-03-01',
      updatedAt: '2026-03-15'
    });
  });
});

fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));
console.log(`Generated ${products.length} products`);
