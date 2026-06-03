import { Project, SkillGroup, EducationItem, PresentationItem } from './types';

export const PERSONAL_INFO = {
  name: "김보민 (Bomin Kim)",
  profileImage: "/src/assets/images/robotics_profile_1780476013400.png",
  title: "AI & Physical Robot Integration",
  quote: "소프트웨어의 지능(AI)을 하드웨어(Physical Robot)에 완벽하게 녹여내는 메카트로닉스 엔지니어",
  description: "안녕하세요! 한국폴리텍대학 청주캠퍼스 스마트메카트로닉스과(AI 딥러닝 전공)에서 공부하고 있는 김보민입니다. 데이터를 학습하는 인공지능 인프라부터, 이를 바탕으로 현실 세계에서 움직이는 로봇 및 임베디드 시스템 제어까지 전 과정을 깊이 있게 탐구하고 있습니다.",
  email: "kbm000608@gmail.com",
  github: "https://github.com/BONGMIN-AI",
  linkedin: "",
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "ai-vision",
    category: "Artificial Intelligence & Vision",
    description: "시각 데이터를 기반으로 추론하고 엣지 디바이스에서 동작하는 경량화 모델링 기술",
    items: [
      { name: "YOLOv8", details: "엣지 모빌리티를 위한 맞춤형 데이터 모델링 및 신속한 물체 탐지", level: 90 },
      { name: "CNN & ViT", details: "합성곱 네트워크 분석 및 Vision Transformer 모델 가공 및 흐름 연구", level: 85 },
      { name: "Jetson AGX Orin & Nano", details: "하드웨어 한계를 고려한 경량화 네트워크 배포 및 최적화 기법", level: 80 },
      { name: "Roboflow", details: "맞춤형 학습 전수 데이터셋 가공, 데이터 증강(Augmentation) 및 라벨링", level: 90 },
      { name: "Google Colab", details: "클라우드 고성능 GPU 연동 클러스터링 및 대량 모델 학습 파이프라인", level: 88 }
    ]
  },
  {
    id: "embedded-robotics",
    category: "Embedded & Robotics Control",
    description: "물리적 공간을 정밀하게 분석하고 주변 요소들과 통신하며 제어하는 로보틱스 지능",
    items: [
      { name: "Arduino & ESP32", details: "임베디드 하드웨어 아키텍처 수립 및 센서 패킷 가공 제어", level: 95 },
      { name: "PLC Sequence Control", details: "KS/IEC 표준 제어 다이어그램 해석 및 정밀 공정 릴레이 배선 설계", level: 85 },
      { name: "Wokwi Simulator", details: "회로 디버깅, 가상 브레드보드 시뮬레이션 기반의 하드웨어 검증", level: 90 },
      { name: "Serial Protocols", details: "UART, I2C, SPI 통신 기반 디바이스 레벨 패킷 처리 및 신뢰적 전송", level: 88 },
      { name: "Sensors (Lidar/GPS/Camera)", details: "라이다 거리 맵핑, HI Edge GPS 수신 기법 및 뎁스 카메라 정합", level: 80 }
    ]
  },
  {
    id: "programming-design",
    category: "Programming & Manufacturing",
    description: "아이디어를 실제 규격과 코드로 형상화하는 기구 성형 및 설계 언어",
    items: [
      { name: "Python", details: "AI 추론 파이프라인, PyTorch/OpenCV 커스텀 시각 지능 개발 언어", level: 85 },
      { name: "C/C++", details: "포인터 제어, 비 메모리 오버헤드, 아두이노 디바이스 드라이버 로우레벨 제어", level: 92 },
      { name: "Ladder Logic", details: "산업용 PLC 전용 논리 스펙 설계 및 스키마 검증 프로그래밍", level: 82 },
      { name: "SolidWorks", details: "로봇 어셈블리 3D 기구 장치 레이아웃 정밀 공차 검토 및 모델링", level: 80 },
      { name: "3D Printing & CAD", details: "Bambu Lab 프린터 고유 특성 제정 및 2D AutoCAD 회로 레이아웃", level: 85 }
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "yolo-object-detection",
    title: "커스텀 YOLOv8 기반 종이컵 식별 AI 모델 개발",
    subtitle: "실시간 온디바이스 비전 디텍팅 모델 고도화",
    description: "종이컵 탐지를 위해 실제 종이컵 대상을 여러 각도와 조도에서 직접 촬영하여 학습 데이터를 마련하고, Roboflow를 통해 꼼꼼한 수동 바운딩 박스 라벨링을 마친 후, Google Colab GPU 환경에서 YOLOv8 모델을 정교하게 훈련시키고 최종적으로 전용 파이썬(Python) 기반 추론 코드를 구현하여 실물 종이컵 디텍팅(97% 이상 신뢰도)에 완벽 구동 성공한 실전 AI 비전 프로젝트입니다.",
    roleAndAchievements: [
      "다양한 실내외 배치 구조와 조명 변화 환경에서 '종이컵' 실물 사진을 한 장씩 집중 촬영해 오리지널 고화질 학습 데이터셋 직접 구축.",
      "Roboflow 플랫폼을 사용해 불필요한 배경 요소를 배제하고 기물의 경계면에 일치하는 고배율 수동 라벨링 및 모자이크 등의 데이터 증강(Augmentation) 파이프라인 형성.",
      "Google Colab의 가속화 GPU 리소스를 연동하여 PyTorch 환경 위에서 YOLOv8 아키텍처 기반의 훈련 Epoch 세팅 학습 제어 스크립트 작성.",
      "자체 가공 코드로 이루어진 Python 전용 추론 CLI 프로그램을 기동하여 'Pcup-detect-ver-2' 최종 가중치 파일을 통한 오프라인 환경 내 97% 이상의 종이컵 객체 바운딩 박스 실시간 탐지 확인 완료."
    ],
    techStack: ["Python", "YOLOv8", "Google Colab", "Roboflow", "Pytorch"],
    image: "/src/assets/images/project_yolo_1780476034757.png",
    number: "01",
    simulation: {
      type: "yolo",
      controls: [
        { label: "Confidence (신뢰임계치)", key: "conf", type: "slider", min: 10, max: 99, defaultValue: 50 },
        { label: "Class Target (검출대상)", key: "target", type: "select", options: ["종이컵", "캔", "페트병"], defaultValue: "종이컵" },
        { label: "Precision Weights (가중치)", key: "weights", type: "select", options: ["YOLOv8n (경량형)", "YOLOv8s (일반형)", "YOLOv8m (정밀형)"], defaultValue: "YOLOv8n (경량형)" }
      ],
      statusMessage: "온디바이스 가상 AI 추론 로직 시뮬레이터"
    }
  },
  {
    id: "pid-line-tracer",
    title: "인터럽트 제어 기반의 자율주행 라인트레이서 로봇",
    subtitle: "바깥 센서 인터럽트를 이용한 급곡선 즉각 대응 및 패턴 제어 주행 프로토타입",
    description: "적외선 센서 6개를 탑재하여 센서 캘리브레이션을 기반으로 주행 평균치를 계산하고, 주행 중에도 실시간으로 캘리브레이션을 지속하여 평균값을 동적으로 업데이트하며, 바깥 센서 회로에 인터럽트를 배치하여 급격한 코너에 즉각적으로 대응하도록 패턴 제어로 라인을 일정하게 유지하는 자율주행 시스템 설계 부문입니다.",
    roleAndAchievements: [
      "Arduino 환경에서 적외선 센서 6채널 아날로그 입력 평균화 및 부팅 시 하드웨어 센서 캘리브레이션 튜닝 구현.",
      "주행 중 센서 캘리브레이션을 정지하지 않고 지속하여 환경 편차(조도 등)에 유연하게 대응하도록 평균치 실시간 업데이트.",
      "가장 바깥쪽 IR 센서에 복수의 MCU 하드웨어 인터럽트(Interrupt) 핀을 활성시켜 급경사 탈선 발생 시 즉각 검출 및 예외 복귀.",
      "패턴 제어(Pattern Control) 방식을 결합하여 90도 직각 교차로 및 S자 커브 주행 시 라인을 흔들림 없이 복합 추적 제어."
    ],
    techStack: ["Arduino", "C/C++", "Interrupt Control", "6-Ch IR Sensor Array", "Pattern Algorithm", "Continuous Calibration"],
    image: "/src/assets/images/project_linetracer_1780476056047.png",
    number: "02",
    simulation: {
      type: "pid",
      controls: [
        { label: "Sensor Calibration (가중평균 강도)", key: "sensor_cal", type: "slider", min: 10, max: 200, defaultValue: 100 },
        { label: "Interrupt Response Gain (인터럽트 조향 강도)", key: "int_gain", type: "slider", min: 10, max: 100, defaultValue: 45 },
        { label: "Pattern Filter Weight (패턴 필터 가중치)", key: "pattern_weight", type: "slider", min: 1, max: 20, defaultValue: 8 },
        { label: "Base Driving Speed (기본 주행 속도)", key: "speed", type: "slider", min: 50, max: 250, defaultValue: 150 }
      ],
      statusMessage: "실시간 인터럽트 매핑 6채널 IR 센서 캘리브레이션 시뮬레이터"
    }
  },
  {
    id: "relay-sequence-control",
    title: "하드웨어 시퀀스 제어 및 로직 게이트 검증",
    subtitle: "KS/IEC 표준 기반 산업 자동화 기초 회로 엔지니어링",
    description: "물리적인 전기 부품인 푸시 버튼 스위치와 릴레이(Relay) 코일을 입구 결선 상태에 맞추어 유기적으로 연쇄 래치(Latch) 상태를 도출하는 논리 회로 세트 프로젝트입니다.",
    roleAndAchievements: [
      "푸시 스위치 셋과 릴레이 고정 단자들을 활용하여 AND, OR, NOR, NAND 등의 대칭 논리를 물리 회로 접점으로 직접 제작 설계.",
      "KS/IEC 시퀀스 도면에 수록된 동작 특성을 해석하고 오배선을 수정하기 위한 순차 트러블슈팅 경험 획득.",
      "수동식 비상 정지 회로 인터록(Interlock) 및 우선순위 자기유지 회로 논리 융합을 물리적으로 구현하며 신뢰 검증 설계.",
      "순수 하드웨어 스위칭 소자의 바운싱 오승인 억제 처리를 구현함으로써 PLC 이전 단계의 본질적인 전장 설계 기술 확보."
    ],
    techStack: ["Relay Circuit Board", "Sequence Control", "KS/IEC Standards", "Hardware Troubleshooting"],
    image: "/src/assets/images/project_sequence_1780476078083.png",
    number: "03",
    simulation: {
      type: "sequence",
      controls: [
        { label: "Input Switch A", key: "sw_a", type: "switch", defaultValue: false },
        { label: "Input Switch B", key: "sw_b", type: "switch", defaultValue: false },
        { label: "Logic Type selected (논리 게이트)", key: "gate", type: "select", options: ["AND (직렬)", "OR (병렬)", "NAND (반전직렬)", "NOR (반전병렬)"], defaultValue: "AND (직렬)" }
      ],
      statusMessage: "하드웨어 릴레이 접점 논리 및 자기유지 회로 실시간 에뮬레이션"
    }
  },
  {
    id: "smart-pomodoro-timer",
    title: "'U-poro-kororong' 스마트 뽀모도로 타이머",
    subtitle: "사용자 커스텀 사이클 기획형 하드웨어 피드백 IoT 타이머 개발",
    description: "Wokwi 가상 에뮬레이터를 이용한 소형 가전 임베디드 코딩을 선도 조율하고, I2C LCD 배선 및 멀티 스레딩 성격의 상태 처리를 딥 다이브한 타이머 임베디드 프로젝트입니다.",
    roleAndAchievements: [
      "Wokwi 개발 시뮬레이션 인터페이스를 기획하여 사전 브레드보드 컴포넌트 간의 가상 통신 연결 및 저항 풀레이팅 구획.",
      "I2C LCD LCD1602 기기에 시간 정보와 가독성 있는 프롬프트 뷰를 나타내기 위한 드라이버 커버 구축.",
      "시리얼 통신(UART) 디버그 라인을 통해 1초 주기 타이머 카운터 및 스위치 채터링 예방 루틴 정밀 제어.",
      "시간 만료 시 피에조 부저 유니크 플로우 트리거를 코드로 통합 설계하여 하드웨어 제어 논리 사이클 완결."
    ],
    techStack: ["Arduino UNO", "C/C++", "I2C LCD 1602", "Wokwi Prototyping", "State Machine Design"],
    image: "/src/assets/images/project_pomodoro_1780476099949.png",
    number: "04",
    simulation: {
      type: "pomodoro",
      controls: [
        { label: "Timer Interval set (분 설정)", key: "duration", type: "slider", min: 1, max: 50, defaultValue: 25 },
        { label: "Buzzer Warning Mode (부저)", key: "buzzer", type: "select", options: ["Melody (연속음)", "Short-Pulse (단음)", "Mute (무음)"], defaultValue: "Melody (연속음)" }
      ],
      statusMessage: "포모도로 주기 모니터링 시뮬레이션 콘솔"
    }
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    degree: "메카트로닉스과 (AI 딥러닝 전공)",
    institution: "한국폴리텍대학 청주캠퍼스",
    period: "2025.03 ~ 현재 재학 중",
    details: [
      "컴퓨터 비전 트렌드 연구: 합성곱 신경망(CNN)에서 고성능 트랜스포머 아키텍처(ViT)로의 발전 흐름 및 임베디드 제한 요소 학습.",
      "엣지 컴퓨팅 실습: Jetson 디바이스 계열에서 동작하는 최적의 AI 모델 추론 구조와 성능 트래픽 병목 기법 실증.",
      "공정 자동화 실무: PLC 기기 구성 및 래더 다이어그램 설계를 통한 자동 분류기, 컨베이어 이송 기구 조율.",
      "임베디드 하드웨어: Arduino 디바이스 코딩, 펌웨어 기초, 직렬 버스 처리, 입출력 포트 하드웨어 인터럽트 구사 방법 습득."
    ]
  }
];

export const PRESENTATIONS_DATA: PresentationItem[] = [
  {
    title: "Visual Intelligence의 흐름과 Edge AI",
    subtitle: "기존 CNN에서 Vision Transformer (ViT)로 이어지는 실증 트렌드 및 최적화 기법",
    slides: [
      {
        title: "01. 기술적 변화 흐름 (CNN to ViT)",
        content: [
          "기존 Local receptive field 기반 CNN 구조 필터 연산의 공간적 국한 특징 극복 분석.",
          "Self-Attention 메커니즘을 시각 지능 영역에 적용하여 이미지 전체 맥락을 한 번에 파악하는 Vision Transformer 기술적 대전환 서술.",
          "연산 복잡도 가속 상태 및 대규모 매개변수로 인한 오버헤드 특성 연구."
        ]
      },
      {
        title: "02. 온디바이스 Edge AI 제약조건",
        content: [
          "경량 하드웨어(Jetson Nano, AGX Orin 등)의 제한된 전원 소비 전력(Thermal/Power Profile 15W-50W) 및 RAM 용량 분석.",
          "양자화(Quantization: FP32 -> INT8/FP16) 및 프루닝(Pruning: 뉴럴 시냅스 가지치기)을 통한 경량 패스 제작 필요성 제창.",
          "실시간 주사 성능(Frame Per Second, FPS) 극대화 전략 제시."
        ]
      }
    ]
  }
];

export const QUICK_STATS = [
  { label: "실행 검증 완료 프로젝트", value: "4+" },
  { label: "종이컵 실탐지 최고 신뢰도", value: "97%" },
  { label: "하드웨어 릴레이 검증", value: "100%" },
  { label: "정밀 PID 편차 오차율", value: "< 2.5%" }
];
