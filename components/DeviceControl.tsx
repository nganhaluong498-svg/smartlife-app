import React, { useRef, useState } from 'react';
import { Power, Sun, Camera, Cpu, ToggleRight, X, Video, VideoOff, Palette, Plus, AlertCircle } from 'lucide-react';
import { Device } from '../types';
import { translations } from '../translations';

interface DeviceControlProps {
  devices: Device[];
  onToggle: (id: string) => void;
  onAddClick: () => void;
  onUpdate: (id: string, updates: Partial<Device>) => void;
  language: 'vi' | 'en';
}

const PANTONE_COLORS = [
  '#FFFFFF', '#FFEBBF', '#F4C2C2', '#C2DFFF', '#B2FBA5', 
  '#E3A018', '#3A6AD6', '#FF4D4D', '#A14DFF', '#000000',
  '#FFD700', '#FF69B4', '#00CED1', '#ADFF2F', '#FF4500'
];

const DeviceControl: React.FC<DeviceControlProps> = ({ devices, onToggle, onAddClick, onUpdate, language }) => {
  const [activeCam, setActiveCam] = useState<string | null>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = translations[language].common;

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setActiveCam(null);
    setCamError(null);
  };

  const toggleCamera = async (deviceId: string) => {
    if (activeCam === deviceId) {
      stopCamera();
      return;
    }

    setCamError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser does not support camera access");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setActiveCam(deviceId);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Video play failed:", e));
          };
        }
      }, 300);
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCamError(language === 'vi' ? 'Quyền truy cập camera bị từ chối.' : 'Camera access denied.');
      } else if (err.name === 'NotFoundError') {
        setCamError(language === 'vi' ? 'Không tìm thấy camera.' : 'No camera found.');
      } else {
        setCamError(language === 'vi' ? 'Lỗi kết nối camera.' : 'Camera connection error.');
      }
      
      setTimeout(() => setCamError(null), 3000);
    }
  };

  const getContrastColor = (hexcolor: string) => {
    if (!hexcolor || hexcolor === 'transparent') return 'white';
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1F2020' : 'white';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isBulb = device.type === 'bulb';
          const iconBgColor = (isBulb && device.isOn && device.color) ? device.color : (device.isOn ? '#3A6AD6' : 'white');
          const iconTextColor = device.isOn ? (isBulb ? getContrastColor(device.color || '#3A6AD6') : 'white') : 'rgb(156 163 175)';
          const glowStyle = (isBulb && device.isOn && device.color) 
            ? { boxShadow: `0 10px 25px -5px ${device.color}66, 0 8px 10px -6px ${device.color}66` } 
            : (device.isOn ? { boxShadow: '0 10px 15px -3px rgba(58,106,214,0.3)' } : {});

          return (
            <div 
              key={device.id} 
              className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between shadow-sm relative group ${
                device.isOn ? 'bg-white border-[#CADCFC] shadow-blue-50' : 'bg-gray-50/50 border-gray-100 opacity-80'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div 
                  className="p-4 rounded-2xl transition-all duration-500"
                  style={{ 
                    backgroundColor: iconBgColor, 
                    color: iconTextColor,
                    ...glowStyle
                  }}
                >
                  {device.type === 'bulb' && <Sun size={24} />}
                  {device.type === 'cam' && <Camera size={24} />}
                  {device.type === 'switch' && <ToggleRight size={24} />}
                  {device.type === 'hub' && <Cpu size={24} />}
                </div>
                <button 
                  onClick={() => onToggle(device.id)}
                  className={`w-14 h-7 rounded-full relative transition-colors duration-500 ${
                    device.isOn ? 'bg-[#3A6AD6]' : 'bg-gray-200 shadow-inner'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-md ${
                    device.isOn ? 'left-8' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-[#1F2020] tracking-tight">{device.name}</h4>
                <p className={`text-[10px] font-black uppercase tracking-widest ${
                  device.isOn ? 'text-[#3A6AD6]' : 'text-gray-400'
                }`}>
                  {device.isOn ? t.active : t.offline}
                </p>
              </div>

              {device.isOn && (
                <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  {device.type === 'bulb' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span>{t.brightness}</span>
                        <span className="text-[#3A6AD6]">{device.brightness}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={device.brightness} 
                        onChange={(e) => onUpdate(device.id, { brightness: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#3A6AD6]"
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.color}</span>
                        <button 
                          onClick={() => setActiveColorPicker(activeColorPicker === device.id ? null : device.id)}
                          className="p-2 bg-gray-50 rounded-lg text-[#3A6AD6] hover:bg-gray-100"
                        >
                          <Palette size={16} />
                        </button>
                      </div>

                      {activeColorPicker === device.id && (
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl animate-in zoom-in-95">
                          {PANTONE_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                onUpdate(device.id, { color });
                                setActiveColorPicker(null);
                              }}
                              className={`w-6 h-6 rounded-full border border-white shadow-sm transition-transform hover:scale-125 ${
                                device.color === color ? 'ring-2 ring-[#3A6AD6] scale-110' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          <input 
                            type="color" 
                            value={device.color} 
                            onChange={(e) => onUpdate(device.id, { color: e.target.value })}
                            className="w-6 h-6 border-none bg-transparent cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {device.type === 'cam' && (
                    <button 
                      onClick={() => toggleCamera(device.id)}
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                        camError ? 'bg-red-50 text-red-500' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {camError ? (
                        <><AlertCircle size={16} /> {camError}</>
                      ) : (
                        activeCam === device.id ? <><VideoOff size={16} /> {t.stopStream}</> : <><Video size={16} /> {t.liveStream}</>
                      )}
                    </button>
                  )}

                  {device.type === 'hub' && (
                    <div className="p-4 bg-blue-50 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">{t.connectedDevices}</span>
                      <span className="text-lg font-black text-[#3A6AD6]">{device.connectedDevices}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <button 
          onClick={onAddClick}
          className="p-8 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 text-gray-300 hover:border-[#3A6AD6] hover:text-[#3A6AD6] hover:bg-[#CADCFC]/10 transition-all group"
        >
          <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-[#3A6AD6] group-hover:text-white transition-all">
            <Plus size={32} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{t.addDevice}</span>
        </button>
      </div>

      {activeCam && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-black rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full aspect-video object-cover" 
            />
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE STREAM - {activeCam}</span>
            </div>
            <button 
              onClick={stopCamera}
              className="absolute top-8 right-8 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceControl;