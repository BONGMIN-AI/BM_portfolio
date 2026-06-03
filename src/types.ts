export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  roleAndAchievements: string[];
  techStack: string[];
  image: string;
  number: string;
  simulation?: {
    type: 'yolo' | 'pid' | 'sequence' | 'pomodoro';
    controls: {
      label: string;
      key: string;
      type: 'slider' | 'switch' | 'select';
      min?: number;
      max?: number;
      options?: string[];
      defaultValue: any;
    }[];
    statusMessage: string;
  };
}

export interface SkillItem {
  name: string;
  details: string;
  level: number; // 0 to 100 for visual progress
}

export interface SkillGroup {
  id: string;
  category: string;
  enCategory?: string;
  description: string;
  items: SkillItem[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

export interface PresentationItem {
  title: string;
  subtitle: string;
  slides: {
    title: string;
    content: string[];
  }[];
}
