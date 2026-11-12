import { ShoppingItem } from "@/lib/types";
import { safeStorage } from "./storage";
import { ApiResponse, simulateNetworkDelay } from "./api-client";

const SHOPPING_STORAGE_KEY = "recipehub_shopping_items";

export const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
  { id: "v1", name: "Rau muống cọng non", amount: "1 bó", category: "rau-cu", checked: true, cost: 15000, subtext: "Luộc chấm mắm chanh tỏi", createdAt: "1 ngày trước" },
  { id: "v2", name: "Cà chua bi Đà Lạt", amount: "300g", category: "rau-cu", checked: true, cost: 20000, subtext: "Sốt đậu phụ, canh chua", createdAt: "1 ngày trước" },
  { id: "v3", name: "Dọc mùng (bạc hà)", amount: "200g", category: "rau-cu", checked: false, cost: 15000, subtext: "Canh chua cá lóc", freshBadge: "Tươi sạch", createdAt: "1 ngày trước" },
  { id: "v4", name: "Me chua chín ngào", amount: "100g", category: "rau-cu", checked: false, cost: 12000, subtext: "Canh chua Nam Bộ", createdAt: "1 ngày trước" },
  { id: "v5", name: "Hành hoa & ngò gai", amount: "1 bó nhỏ", category: "rau-cu", checked: true, cost: 10000, subtext: "Rau thơm nêm canh", createdAt: "1 ngày trước" },
  { id: "v6", name: "Giá đỗ đậu xanh", amount: "200g", category: "rau-cu", checked: false, cost: 8000, subtext: "Ăn kèm bún bò / canh chua", createdAt: "1 ngày trước" },

  { id: "m1", name: "Cá lóc tươi sống làm sạch", amount: "1 con (700g)", category: "thit-ca", checked: true, cost: 95000, freshBadge: "Đạm tươi", subtext: "Kho tộ Bến Tre & nấu canh chua", createdAt: "1 ngày trước" },
  { id: "m2", name: "Thịt thăn bò tươi mềm", amount: "300g", category: "thit-ca", checked: true, cost: 75000, subtext: "Phở tái lăn Hà Nội", createdAt: "1 ngày trước" },
  { id: "m3", name: "Tôm sú tươi nhảy", amount: "250g", category: "thit-ca", checked: false, cost: 65000, freshBadge: "Đạm tươi", subtext: "Gỏi cuốn tôm thịt", createdAt: "1 ngày trước" },
  { id: "m4", name: "Xương ống heo hầm nước dùng", amount: "500g", category: "thit-ca", checked: false, cost: 45000, subtext: "Ninh nước lèo bún", createdAt: "1 ngày trước" },
  { id: "m5", name: "Cá bống tươi kho tộ", amount: "300g", category: "thit-ca", checked: true, cost: 40000, subtext: "Kho tộ niêu đất", createdAt: "1 ngày trước" },

  { id: "s1", name: "Nước mắm cá cơm 40°N", amount: "1 chai nhỏ", category: "gia-vi", checked: false, cost: 42000, subtext: "Gia vị chuẩn truyền thống", createdAt: "1 ngày trước" },
  { id: "s2", name: "Tiêu đen xay Phú Quốc", amount: "50g", category: "gia-vi", checked: false, cost: 25000, createdAt: "1 ngày trước" },
  { id: "s3", name: "Đường phèn Quảng Ngãi", amount: "200g", category: "gia-vi", checked: true, cost: 18000, createdAt: "1 ngày trước" },
  { id: "s4", name: "Tỏi khô Lý Sơn", amount: "1 củ", category: "gia-vi", checked: true, cost: 15000, createdAt: "1 ngày trước" },
  { id: "s5", name: "Dầu ăn thực vật nguyên chất", amount: "1 lít", category: "gia-vi", checked: false, cost: 48000, createdAt: "1 ngày trước" },
];

class ShoppingService {
  async getShoppingItems(): Promise<ApiResponse<ShoppingItem[]>> {
    await simulateNetworkDelay();
    const items = safeStorage.getJSON<ShoppingItem[]>(SHOPPING_STORAGE_KEY, INITIAL_SHOPPING_ITEMS);
    return {
      data: items,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async saveShoppingItems(items: ShoppingItem[]): Promise<ApiResponse<boolean>> {
    safeStorage.setJSON(SHOPPING_STORAGE_KEY, items);
    return {
      data: true,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export const shoppingService = new ShoppingService();
