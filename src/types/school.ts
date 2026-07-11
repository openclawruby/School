export interface School {
  id: string;
  name_zh: string;
  name_en: string;
  type: 'DSS' | 'Private' | 'Government' | 'Aided' | 'International';
  category: string;
  district: string;
  gender: 'Boys' | 'Girls' | 'Co-ed';
  religion: string;
  medium_of_instruction: string;
  ranking_2026: number;
  ranking_note: string;
  tuition_annual_hkd: number;
  school_fees_note: string;
  application_open_date: string;
  application_deadline: string;
  interview_dates: string[];
  interview_format: string;
  admission_criteria: string;
  application_url: string;
  contact_phone: string;
  address: string;
  notable_features: string[];
  past_bands: string;
  past_cutoff_score: string;
  website_summary: string;
}

export interface SchoolsData {
  schools: School[];
}