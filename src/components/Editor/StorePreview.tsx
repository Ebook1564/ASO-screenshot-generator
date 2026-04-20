import React from 'react';
import { useStore } from '../../store/useStore';
import {
  X,
  Star,
  ChevronRight,
  Apple,
  Smartphone,
} from 'lucide-react';

interface StorePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorePreview: React.FC<StorePreviewProps> = ({ isOpen, onClose }) => {
  const { currentProject, currentPlatform } = useStore();

  if (!isOpen || !currentProject) return null;

  const getBackgroundStyle = (screenshot: typeof currentProject.screenshots[0]) => {
    const bg = screenshot.background;
    if (bg.type === 'solid') {
      return { backgroundColor: bg.value };
    } else if (bg.type === 'gradient') {
      return { background: bg.value };
    }
    return { backgroundColor: '#667eea' };
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b22] rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-hidden border border-[#30363d]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Store Header */}
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentPlatform === 'ios' ? (
              <Apple className="w-5 h-5 text-[#e6edf3]" />
            ) : (
              <Smartphone className="w-5 h-5 text-[#238636]" />
            )}
            <span className="text-sm font-medium text-[#8b949e]">
              {currentPlatform === 'ios' ? 'App Store Preview' : 'Play Store Preview'}
            </span>
          </div>
        </div>

        {/* App Info */}
        <div className="p-4 flex items-start gap-4">
          {/* App Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">📱</span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#e6edf3]">{currentProject.appName}</h1>
            <p className="text-sm text-[#8b949e] mt-1">Developer Name</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#8b949e]">4.5 (1.2K)</span>
            </div>
          </div>

          {/* Get Button */}
          <button className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-full font-semibold text-sm transition-colors">
            GET
          </button>
        </div>

        {/* Screenshots Carousel */}
        <div className="px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {currentProject.screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                className="flex-shrink-0 w-32 aspect-[9/19.5] rounded-xl overflow-hidden shadow-lg"
                style={getBackgroundStyle(screenshot)}
              >
                {/* Mini preview */}
                <div className="w-full h-full relative transform scale-[0.07] origin-top-left" style={{ width: '1290px', height: '2796px' }}>
                  {screenshot.elements.map((element) => {
                    if (element.type === 'text') {
                      return (
                        <div
                          key={element.id}
                          style={{
                            position: 'absolute',
                            left: element.x,
                            top: element.y,
                            width: element.width,
                            height: element.height,
                            fontSize: element.fontSize,
                            fontWeight: element.fontWeight,
                            color: element.color,
                            textAlign: element.textAlign,
                          }}
                        >
                          {element.content}
                        </div>
                      );
                    }
                    if (element.type === 'device') {
                      return (
                        <div
                          key={element.id}
                          style={{
                            position: 'absolute',
                            left: element.x,
                            top: element.y,
                            width: element.width,
                            height: element.height,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: '40px',
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            
            {/* Placeholder if no screenshots */}
            {currentProject.screenshots.length === 0 && (
              <div className="flex-shrink-0 w-32 aspect-[9/19.5] bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400 text-xs">No screenshots</span>
              </div>
            )}
          </div>
        </div>

        {/* Description Preview */}
        <div className="p-4 border-t border-[#30363d]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-[#e6edf3]">Description</h2>
            <ChevronRight className="w-5 h-5 text-[#8b949e]" />
          </div>
          <p className="text-sm text-[#8b949e] line-clamp-3">
            {currentProject.appDescription || 'Your app description will appear here. Add a compelling description to increase downloads.'}
          </p>
        </div>

        {/* What's New */}
        <div className="p-4 border-t border-[#30363d]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-[#e6edf3]">What's New</h2>
            <span className="text-sm text-[#8b949e]">Version 1.0</span>
          </div>
          <p className="text-sm text-[#8b949e]">
            Initial release
          </p>
        </div>

        {/* Ratings & Reviews */}
        <div className="p-4 border-t border-[#30363d]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#e6edf3]">Ratings & Reviews</h2>
            <ChevronRight className="w-5 h-5 text-[#8b949e]" />
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#e6edf3]">4.5</div>
              <div className="text-xs text-[#8b949e]">out of 5</div>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-2 h-2 ${star <= rating ? 'fill-gray-400 text-gray-400' : 'text-[#30363d]'}`}
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8b949e] rounded-full"
                      style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '5%' : '2%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
