
import { GoogleGenAI } from "@google/genai";

/**
 * Hàm xử lý chính cho trợ lý SMARTLIFE.
 * Có tích hợp DEMO_MODE để chạy thử nghiệm nhanh không tốn API key.
 */
export const getAIResponse = async (userMessage: string, language: 'vi' | 'en') => {
  
  const DEMO_MODE = true; // Set to false to use real Gemini API

  if (DEMO_MODE) {
    // Giả lập độ trễ phản hồi của AI
    await new Promise(r => setTimeout(r, 800));

    const msg = userMessage.toLowerCase();

    // Logic Demo theo yêu cầu
    if (msg.includes("đèn")) {
      return language === 'vi' 
        ? "💡 Ok nha, mình đã điều chỉnh hệ thống đèn LED theo ý bạn rồi." 
        : "💡 Got it, I've adjusted the LED lighting system for you.";
    }

    if (msg.includes("camera") || msg.includes("an ninh")) {
      return language === 'vi' 
        ? "📹 Hệ thống Camera SmartCam C1 đang hoạt động bình thường, an ninh được đảm bảo." 
        : "📹 SmartCam C1 system is operating normally, security is guaranteed.";
    }

    if (msg.includes("thư giãn")) {
      return language === 'vi'
        ? "✨ Đã kích hoạt kịch bản 'Thư giãn': Đèn LED chuyển sang màu vàng ấm 30%, nhạc lofi đã sẵn sàng."
        : "✨ 'Relax' scenario activated: LED lights set to 30% warm yellow, lofi music is ready.";
    }

    return language === 'vi' 
      ? "🤖 Trợ lý SmartLife đã ghi nhận yêu cầu của bạn. Bạn cần hỗ trợ gì thêm không?" 
      : "🤖 SmartLife assistant has received your request. Do you need anything else?";
  }

  // AI THẬT (Chạy khi DEMO_MODE = false)
  // Create instance right before API call as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `Bạn là trợ lý ảo chính thức của SMARTLIFE.
Phong cách: Ngắn gọn, thân thiện, trả lời như đang chat message.
Ngôn ngữ: ${language === 'vi' ? 'TIẾNG VIỆT' : 'ENGLISH'}.
Sản phẩm: SmartBulb S1, SmartSwitch W1, SmartHub Z1, SmartCam C1.`,
        temperature: 0.7,
      },
    });

    const textOutput = response.text;
    return textOutput ? textOutput.trim() : (language === 'vi' ? "Mình đang bận chút, thử lại sau nhé!" : "I'm a bit busy, try again later!");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'vi' ? "Lỗi kết nối với trí tuệ nhân tạo." : "AI connection error.";
  }
};
