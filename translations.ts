export const translations = {
  vi: {
    nav: {
      home: 'TRANG CHỦ',
      shop: 'CỬA HÀNG',
      management: 'QUẢN LÝ',
      account: 'TÀI KHOẢN'
    },
    hero: {
      tag: 'Giai đoạn: Prototype Hoàn thiện',
      title: 'Trí tuệ hóa',
      subtitle: 'Ngôi nhà bạn.',
      desc: 'Hệ sinh thái SMARTLIFE – Thiết kế tối giản, công nghệ AI và sự bền bỉ tuyệt đối.',
      btnShop: 'Mua sắm ngay',
      btnManage: 'Quản lý ngay',
      completionLabel: 'Mức độ hoàn thành sản phẩm'
    },
    home: {
      advantages: 'Ưu điểm cốt lõi',
      ecosystemTitle: 'Hệ sinh thái SMARTLIFE',
      ecosystemSubtitle: 'Giải pháp toàn diện cho mọi nhu cầu trong ngôi nhà hiện đại.',
      ecosystemCategories: [
        { title: 'Đèn LED', desc: 'Tùy chỉnh 16 triệu màu Pantone, tự động điều chỉnh ánh sáng theo nhịp sinh học.' },
        { title: 'An ninh AI', desc: 'Giám sát 24/7 với công nghệ nhận diện chuyển động và cảnh báo tức thì qua smartphone.' },
        { title: 'Điều khiển', desc: 'Công tắc và cảm biến giúp tối ưu hóa kịch bản sống và tiết kiệm năng lượng.' },
        { title: 'Trung tâm Hub', desc: 'Bộ não của ngôi nhà, kết nối và điều phối hàng trăm thiết bị một cách mượt mà.' }
      ],
      starterTitle: 'Khởi đầu hoàn hảo',
      starterDesc: 'Tất cả những gì bạn cần để bắt đầu hành trình nhà thông minh.',
      starterInclude: 'Bao gồm: 1 Hub + 2 Đèn + 1 Công tắc',
      roadmapTitle: 'Lộ trình phát triển',
      roadmapSubtitle: 'Những siêu phẩm sắp ra mắt trong đầu năm 2027',
      comingSoon: 'Sắp ra mắt',
      saveLabel: 'Tiết kiệm',
      features: [
        { title: 'Tối giản', desc: 'Thiết kế tinh tế, hòa hợp với mọi không gian sống.' },
        { title: 'AI-Native', desc: 'Trí tuệ nhân tạo tích hợp sâu, học hỏi thói quen tự động.' },
        { title: 'Bền bỉ', desc: 'Tiêu chuẩn linh kiện cao cấp, bảo hành lên đến 24 tháng.' }
      ]
    },
    dashboard: {
      title: 'Bảng điều khiển',
      subtitle: 'Quản lý tập trung ngôi nhà thông minh của bạn',
      tabs: {
        devices: 'Thiết bị',
        automation: 'Kịch bản',
        energy: 'Năng lượng',
        family: 'Gia đình',
        ai: 'Trí tuệ AI'
      },
      charts: {
        mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6', sat: 'Thứ 7', sun: 'Chủ nhật',
        morning: 'Sáng', leave: 'Rời nhà', dinner: 'Bữa tối', sleep: 'Đi ngủ',
      },
      events: {
        coffee: 'Chu kỳ Cafe', commute: 'Chế độ Đi làm', relax: 'Ánh sáng Thư giãn', security: 'Chế độ An ninh'
      },
      automation: {
        title: 'Tự động hóa (IF-THEN)',
        desc: 'Thiết lập ngôi nhà tự vận hành theo thói quen của bạn.',
        btnCreate: 'Tạo kịch bản mới',
        modalTitle: 'Kịch bản thông minh',
        if: 'NẾU (Trigger)',
        then: 'THÌ (Hành động)',
        save: 'Lưu kịch bản',
        nameLabel: 'Tên kịch bản',
        triggerLabel: 'Chi tiết kích hoạt',
        actionLabel: 'Hành động thực hiện',
        manual: 'Thủ công',
        triggers: {
          time: 'Thời gian',
          location: 'Vị trí',
          device: 'Thiết bị',
          ai: 'Dự đoán AI'
        }
      },
      family: {
        title: 'Thành viên gia đình',
        desc: 'Chia sẻ quyền điều khiển với những người thân yêu.',
        btnInvite: 'Mời thành viên',
        btnContacts: 'Danh bạ',
        modalTitle: 'Thêm thành viên mới',
        inputName: 'Tên thành viên',
        inputPhone: 'Số điện thoại',
        role: 'Vai trò',
        roleMember: 'Thành viên',
        roleManager: 'Quản lý',
        sendInvite: 'Gửi lời mời'
      },
      energy: {
        title: 'Thống kê Năng lượng',
        subtitle: 'Báo cáo tiêu thụ điện năng thời gian thực',
        expected: 'Dự kiến tháng này',
        aiSuggest: 'AI Insight: Tiết kiệm 12% điện nếu chuyển sang Eco sau 11h đêm.'
      },
      ai: {
        masterSwitch: 'Điều chỉnh Adaptive AI',
        masterSwitchDesc: 'AI tự động tối ưu hóa thiết bị theo thói quen.',
        insightTitle: 'Mô hình lối sống AI',
        voiceTitle: 'Điều khiển giọng nói',
        voiceDesc: 'Tương tác tự nhiên bằng ngôn ngữ của bạn.',
        voiceActive: 'Đang lắng nghe...',
        predictiveTitle: 'Phân tích thói quen',
        anomalyTitle: 'Cảnh báo bất thường',
        viewLogs: 'Xem nhật ký',
        dismiss: 'Đóng thông báo',
        riskLabel: 'Mức độ rủi ro',
        startMic: 'Bật Mic'
      }
    },
    shop: {
      title: 'Sản phẩm SmartLife',
      tabs: {
        hardware: 'Phần cứng',
        services: 'Dịch vụ & Cloud'
      },
      categories: {
        lighting: 'Đèn LED',
        security: 'An ninh',
        control: 'Điều khiển',
        hub: 'Trung tâm',
        bundle: 'Gói Combo'
      },
      cost: 'Vốn',
      profit: 'Lợi nhuận',
      addToCart: 'Thêm vào giỏ',
      selectPlan: 'Chọn gói',
      bookService: 'Đặt dịch vụ',
      cloudTitle: 'Lưu trữ Cloud & AI',
      installTitle: 'Lắp đặt & Tư vấn',
      warrantyTitle: 'Bảo hành & AI Premium',
      storage: 'Lưu trữ',
      forBeginners: 'Dành cho người mới bắt đầu'
    },
    cart: {
      title: 'Giỏ hàng',
      empty: 'Giỏ hàng đang trống',
      total: 'Tổng cộng',
      checkout: 'Thanh toán ngay'
    },
    auth: {
      welcome: 'Chào mừng trở lại',
      desc: 'Đăng nhập để quản lý ngôi nhà thông minh',
      google: 'Tiếp tục với Google',
      apple: 'Tiếp tục với Apple',
      terms: 'Bằng việc đăng nhập, bạn đồng ý với Điều khoản của chúng tôi.'
    },
    account: {
      status: 'Trạng thái:',
      sections: [
        { title: 'Cài đặt hồ sơ', desc: 'Cập nhật thông tin cá nhân' },
        { title: 'Bảo mật', desc: 'Mật khẩu và xác thực 2 lớp' },
        { title: 'Thông báo', desc: 'Tùy chỉnh thông báo thiết bị' },
        { title: 'Thanh toán', desc: 'Quản lý phương thức thanh toán' },
        { title: 'Hỗ trợ kỹ thuật', desc: 'Liên hệ đội ngũ SmartLife' }
      ],
      support: {
        phone: '1900 8888',
        email: 'support@smartlife.vn',
        address: '1-1A Tạ Quang Bửu, Phường 4, Quận 8, TP. HCM'
      },
      payment: {
        title: 'Ví liên kết',
        momo: 'Ví MoMo (Mặc định)',
        bidv: 'Thẻ BIDV'
      },
      logout: 'Đăng xuất'
    },
    common: {
      addDevice: 'Thêm thiết bị',
      active: 'Đang hoạt động',
      offline: 'Ngoại tuyến',
      brightness: 'Độ sáng',
      color: 'Màu Pantone (16M)',
      connectedDevices: 'Thiết bị kết nối',
      stopStream: 'Dừng phát',
      liveStream: 'Phát trực tiếp'
    },
    modal: {
      addTitle: 'Thêm thiết bị mới',
      selectProduct: 'Chọn loại sản phẩm',
      deviceName: 'Tên thiết bị (Tùy chọn)',
      placeholder: 'Ví dụ: Đèn Ban Công',
      confirm: 'Xác nhận thêm'
    }
  },
  en: {
    nav: {
      home: 'HOME',
      shop: 'SHOP',
      management: 'DASHBOARD',
      account: 'ACCOUNT'
    },
    hero: {
      tag: 'Stage: Prototype Final',
      title: 'Intelligentize',
      subtitle: 'Your Home.',
      desc: 'SMARTLIFE Ecosystem – Minimalist design, AI technology, and absolute durability.',
      btnShop: 'Shop Now',
      btnManage: 'Go to Dashboard',
      completionLabel: 'Product Completion Status'
    },
    home: {
      advantages: 'Core Advantages',
      ecosystemTitle: 'SMARTLIFE Ecosystem',
      ecosystemSubtitle: 'A comprehensive solution for every need in the modern home.',
      ecosystemCategories: [
        { title: 'Lighting', desc: 'Customize 16 million Pantone colors, adjust lighting based on circadian rhythms.' },
        { title: 'AI Security', desc: '24/7 monitoring with AI motion detection and instant smartphone alerts.' },
        { title: 'Control', desc: 'Switches and sensors to optimize living scenarios and save energy.' },
        { title: 'Hub Central', desc: 'The brain of the home, smoothly connecting and coordinating hundreds of devices.' }
      ],
      starterTitle: 'Perfect Start',
      starterDesc: 'Everything you need to begin your smart home journey.',
      starterInclude: 'Includes: 1 Hub + 2 Bulbs + 1 Switch',
      roadmapTitle: 'Future Roadmap',
      roadmapSubtitle: 'Next generation products coming in early 2027',
      comingSoon: 'Coming Soon',
      saveLabel: 'Save',
      features: [
        { title: 'Minimalist', desc: 'Sleek design that blends perfectly with any space.' },
        { title: 'AI-Native', desc: 'Deep AI integration that learns from your habits.' },
        { title: 'Durable', desc: 'Premium components with up to 24-month warranty.' }
      ]
    },
    dashboard: {
      title: 'Control Center',
      subtitle: 'Centralized management for your smart ecosystem',
      tabs: {
        devices: 'Devices',
        automation: 'Automation',
        energy: 'Energy',
        family: 'Family',
        ai: 'AI Engine'
      },
      charts: {
        mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
        morning: 'Morning', leave: 'Leaving', dinner: 'Dinner', sleep: 'Sleeping',
      },
      events: {
        coffee: 'Coffee Cycle', commute: 'Commute Mode', relax: 'Relaxing Light', security: 'Security Mode'
      },
      automation: {
        title: 'Automation (IF-THEN)',
        desc: 'Set up your home to run automatically based on your habits.',
        btnCreate: 'Create New Scenario',
        modalTitle: 'Smart Scenario',
        if: 'IF (Trigger)',
        then: 'THEN (Action)',
        save: 'Save Scenario',
        nameLabel: 'Scenario Name',
        triggerLabel: 'Trigger Details',
        actionLabel: 'Action to Perform',
        manual: 'Manual',
        triggers: {
          time: 'Schedule',
          location: 'Location',
          device: 'Device State',
          ai: 'AI Prediction'
        }
      },
      family: {
        title: 'Family Members',
        desc: 'Share control with the people you love.',
        btnInvite: 'Invite Member',
        btnContacts: 'Contacts',
        modalTitle: 'Add New Member',
        inputName: 'Member Name',
        inputPhone: 'Phone Number',
        role: 'Role',
        roleMember: 'Member',
        roleManager: 'Manager',
        sendInvite: 'Send Invitation'
      },
      energy: {
        title: 'Energy Statistics',
        subtitle: 'Real-time power consumption reporting',
        expected: 'Estimated this month',
        aiSuggest: 'AI Insight: Save 12% energy by switching to Eco after 11 PM.'
      },
      ai: {
        masterSwitch: 'Adaptive AI Tuning',
        masterSwitchDesc: 'AI automatically optimizes devices based on lifestyle.',
        insightTitle: 'AI Lifestyle Modeling',
        voiceTitle: 'Voice Control',
        voiceDesc: 'Interact naturally using your own language.',
        voiceActive: 'Listening...',
        predictiveTitle: 'Habit Analytics',
        anomalyTitle: 'Anomaly Detection',
        viewLogs: 'View Logs',
        dismiss: 'Dismiss Alerts',
        riskLabel: 'Risk Level',
        startMic: 'Start Mic'
      }
    },
    shop: {
      title: 'SmartLife Products',
      tabs: {
        hardware: 'Hardware',
        services: 'Services & Cloud'
      },
      categories: {
        lighting: 'Lighting',
        security: 'Security',
        control: 'Control',
        hub: 'Hub',
        bundle: 'Bundle'
      },
      cost: 'Cost',
      profit: 'Margin',
      addToCart: 'Add to Cart',
      selectPlan: 'Select Plan',
      bookService: 'Book Service',
      cloudTitle: 'Cloud Storage & AI Plans',
      installTitle: 'Installation & Consult',
      warrantyTitle: 'Warranty & AI Premium',
      storage: 'Storage',
      forBeginners: 'Ideal for Beginners'
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout Now'
    },
    auth: {
      welcome: 'Welcome Back',
      desc: 'Login to manage your smart home',
      google: 'Continue with Google',
      apple: 'Continue with Apple',
      terms: 'By logging in, you agree to our Terms & Conditions.'
    },
    account: {
      status: 'Status:',
      sections: [
        { title: 'Profile Settings', desc: 'Update personal details' },
        { title: 'Security', desc: 'Password & 2FA' },
        { title: 'Notifications', desc: 'Customize device alerts' },
        { title: 'Payments', desc: 'Manage payment methods' },
        { title: 'Technical Support', desc: 'Contact SmartLife team' }
      ],
      support: {
        phone: '+84 1900 8888',
        email: 'support@smartlife.io',
        address: '1-1A Ta Quang Buu St, HCMC, Vietnam'
      },
      payment: {
        title: 'Linked Wallets',
        momo: 'MoMo Wallet (Default)',
        bidv: 'BIDV Card'
      },
      logout: 'Logout'
    },
    common: {
      addDevice: 'Add Device',
      active: 'Active',
      offline: 'Offline',
      brightness: 'Brightness',
      color: 'Pantone Color (16M)',
      connectedDevices: 'Connections',
      stopStream: 'Stop Stream',
      liveStream: 'Live Stream'
    },
    modal: {
      addTitle: 'Add New Device',
      selectProduct: 'Select Product Type',
      deviceName: 'Device Name (Optional)',
      placeholder: 'e.g., Balcony Light',
      confirm: 'Confirm Add'
    }
  }
};