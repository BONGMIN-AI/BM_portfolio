import { useState } from 'react';
import { Maximize2, X, Image as ImageIcon } from 'lucide-react';

const yoloPreprocessNb = '/assets/images/yolo_preprocess_nb.png';
const yoloMetricsGraphs = '/assets/images/yolo_metrics_graphs.png';
const yoloColabLogs = '/assets/images/yolo_colab_logs.png';
const yoloDetectionResult = '/assets/images/yolo_detection_result.png';

interface YoloDashboardProps {
  language?: 'ko' | 'en';
}

export default function YoloDashboard({ language = 'ko' }: YoloDashboardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const images = [
    {
      src: yoloPreprocessNb,
      title: language === 'ko' ? '01. 전처리 파이프라인 (HEIC ➡️ JPG 변환)' : '01. Preprocessing Pipeline (HEIC ➡️ JPG)',
      desc: language === 'ko' ? '스마트폰 원본 HEIC 포맷의 학습용 JPG 일괄 변환 파이프라인 구축 코드' : 'Batch conversion code for raw smartphone HEIC images to standard JPEG formats',
    },
    {
      src: yoloMetricsGraphs,
      title: language === 'ko' ? '02. 모델 학습 결과 수렴 곡선' : '02. Model Training Metrics & Curves',
      desc: language === 'ko' ? 'YOLOv8 모델 훈련 Epochs 경과에 따른 손실값 수렴 및 mAP 지표 변동 그래프' : 'Loss convergence curves and validation metrics (mAP50/mAP50-95) across training epochs',
    },
    {
      src: yoloColabLogs,
      title: language === 'ko' ? '03. Google Colab 훈련 로그' : '03. Google Colab Training Logs',
      desc: language === 'ko' ? '구글 코랩 NVIDIA Tesla T4 GPU 기반 학습 시그널 배치 운영 기록 로그' : 'Raw epoch logs showing GPU memory usage, loss gradients, and precision/recall stats',
    },
    {
      src: yoloDetectionResult,
      title: language === 'ko' ? '04. 실물 현장 추론 실증 결과 (best.pt)' : '04. Real-world Inference Result (best.pt)',
      desc: language === 'ko' ? '거실 테이블 위 실물 종이컵 대상을 정합해 97% 신뢰도로 검출 완료한 장면' : 'Successful detection of a paper cup with 97% confidence class rating on a wooden desk',
    }
  ];

  const handleOpenImage = (src: string, title: string) => {
    setSelectedImage(src);
    setSelectedTitle(title);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800" id="project-row-yolo-object-detection">
      {/* Title Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-mono text-slate-300 font-bold ml-2">
            {language === 'ko' ? 'YOLOv8 종이컵 식별 AI 모델 실증 및 훈련 분석 센터' : 'YOLOv8 Vision Intelligence Training and Inference Lab'}
          </span>
        </div>
        <span className="self-start sm:self-auto px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-black rounded-lg">
          {language === 'ko' ? '● 모델 실증 및 검증 완료' : '● SYSTEM VERIFIED'}
        </span>
      </div>

      {/* Grid of 4 Images */}
      <div className="p-5 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="yolo-images-grid">
          {images.map((img, i) => (
            <div 
              key={i} 
              className="bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/5"
              id={`yolo-image-card-${i}`}
            >
              {/* Card Header Info */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/30">
                <h4 className="text-xs sm:text-sm font-mono font-black text-blue-400 tracking-wider flex items-center gap-2">
                  <ImageIcon size={14} className="text-blue-500" />
                  {img.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {img.desc}
                </p>
              </div>

              {/* Image Preview Container */}
              <div className="relative aspect-[3/2] bg-slate-950 overflow-hidden flex items-center justify-center p-2 group/img">
                <img 
                  src={img.src} 
                  alt={img.title}
                  className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Hover Effect */}
                <div 
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                  onClick={() => handleOpenImage(img.src, img.title)}
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer">
                    <Maximize2 size={12} />
                    {language === 'ko' ? '원본 보기' : 'View Full Image'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full screen modal for image scaling */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col justify-center items-center p-4 md:p-8 select-none"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-4">
            <span className="hidden sm:inline text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              {selectedTitle}
            </span>
            <button 
              className="p-2 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition-colors cursor-pointer"
              onClick={() => setSelectedImage(null)}
              id="close-yolo-modal-btn"
            >
              <X size={20} />
            </button>
          </div>

          <div 
            className="relative max-w-5xl max-h-[80vh] flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Full viewport" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-800"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mt-4 text-xs font-mono text-slate-500 text-center">
            {language === 'ko' ? '클릭하여 닫을 수 있습니다.' : 'Click anywhere to close'}
          </div>
        </div>
      )}
    </div>
  );
}
