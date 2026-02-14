import { Product } from './types';

export const COLORS = {
  primary: '#3A6AD6',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  dark: '#1F2020',
  accent: '#CADCFC',
};

export const PRODUCTS: Product[] = [
  {
    id: 'starter-kit-01',
    name: 'Starter Kit (Bundle)',
    description: 'Bộ sản phẩm khởi đầu hoàn hảo giúp bạn làm quen với ngôi nhà thông minh ngay lập tức.',
    features: ['1 SmartHub Z1', '2 SmartBulb S1', '1 SmartSwitch W1', 'Tiết kiệm 20%'],
    price: '1,499K',
    productionCost: '750K',
    margin: '50%',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'bundle',
    badge: 'forBeginners'
  },
  {
    id: 'bulb-s1',
    name: 'SmartBulb S1',
    description: 'Đèn LED thông minh điều khiển qua app, hỗ trợ RGB + Trắng ấm/lạnh.',
    features: ['Điều khiển qua app', 'RGB + White', 'Hẹn giờ', 'Nhịp điệu âm nhạc'],
    price: '199K - 299K',
    productionCost: '85K',
    margin: '57%',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
    category: 'lighting'
  },
  {
    id: 'cam-c1',
    name: 'SmartCam C1',
    description: 'Camera an ninh WiFi Full HD 1080p với góc quay rộng 130°.',
    features: ['Full HD 1080p', 'Night Vision', 'Đàm thoại 2 chiều', 'AI Motion Detection'],
    price: '1,290K',
    productionCost: '680K',
    margin: '47%',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&q=80',
    category: 'security'
  },
  {
    id: 'switch-w1',
    name: 'SmartSwitch W1',
    description: 'Công tắc thông minh thay thế truyền thống, không cần đi lại dây.',
    features: ['Điều khiển từ xa', 'Hẹn giờ thông minh', 'Lắp đặt dễ dàng', 'Phản hồi trạng thái'],
    price: '350K - 490K',
    productionCost: '165K',
    margin: '53%',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80',
    category: 'control'
  },
  {
    id: 'hub-z1',
    name: 'SmartHub Z1',
    description: 'Trung tâm điều khiển kết nối tất cả thiết bị trong hệ sinh thái.',
    features: ['Zigbee 3.0', 'WiFi & Bluetooth', 'Điều khiển tập trung', 'Ổn định cao'],
    price: '890K',
    productionCost: '420K',
    margin: '53%',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
    category: 'hub'
  }
];

export const STARTER_KIT = {
  name: 'Starter Kit (Bundle)',
  description: 'Gói giải pháp toàn diện cho người mới bắt đầu.',
  content: '1 Hub + 2 Đèn + 1 Công tắc',
  price: '1,499K',
  saving: '20%'
};

export const CLOUD_PACKAGES = [
  { name: 'Free', storage: '7 ngày', price: '0đ', cost: '15K', profit: 'Loss leader' },
  { name: 'Basic', storage: '30 ngày', price: '50K', cost: '18K', profit: '64%' },
  { name: 'Pro', storage: '90 ngày (5 cam)', price: '150K', cost: '45K', profit: '70%' },
  { name: 'Premium', storage: '365 ngày (unlimited)', price: '300K', cost: '95K', profit: '68%' },
];

export const INSTALLATION_SERVICES = [
  { name: 'Gói BASIC', level: 'Tự làm có hỗ trợ', price: 'MIỄN PHÍ', features: ['Video hướng dẫn', 'Hotline 24/7'] },
  { name: 'Gói STANDARD', level: 'Lắp đặt cơ bản', price: '500K - 800K', features: ['Kỹ thuật viên tận nhà', 'Lắp 5-10 thiết bị', 'Training 30p'] },
  { name: 'Gói PREMIUM', level: 'Tư vấn & Thiết kế', price: '2M - 10M', features: ['Survey tận nơi', 'Thiết kế tối ưu', 'Lắp 10-30 thiết bị'] },
  { name: 'Gói ENTERPRISE', level: 'B2B Dự án', price: '50M - 500M', features: ['Chung cư/Khách sạn', 'Thi công, bảo trì trọn gói'] },
];

export const PREMIUM_SERVICES = [
  { name: 'AI Premium Support', price: '99K/tháng', features: ['Ưu tiên xử lý AI', 'Tư vấn kịch bản riêng', 'Bảo mật nâng cao'] },
  { name: 'Extended Warranty', price: '490K', features: ['Bảo hành 24 tháng', '1 đổi 1 tận nhà', 'Hỗ trợ kỹ thuật 24/7'] },
  { name: 'Home Safety Audit', price: '200K', features: ['Kiểm tra an ninh', 'Tối ưu hóa năng lượng', 'Cập nhật firmware'] },
  { name: 'VIP Care Package', price: '1,200K/năm', features: ['Tất cả dịch vụ trên', 'Kỹ thuật viên riêng', 'Ưu đãi mua sắm 10%'] },
];

export const FUTURE_ROADMAP = [
  { name: 'SmartCurtain', desc: 'Rèm cửa tự động' },
  { name: 'SmartAC', desc: 'Điều hòa controller' },
  { name: 'SmartGarden', desc: 'Tưới cây thông minh' },
  { name: 'SmartPanel', desc: 'Trung tâm màn hình cảm ứng' },
];