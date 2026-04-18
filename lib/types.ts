export interface FormAnswer {
  question: string;
  answer: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  answers: FormAnswer[];
}

export interface SubmitPayload extends FormData {
  submittedAt: string;
}

export interface SubmitResponse {
  success: boolean;
  error?: string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const TOTAL_STEPS: number = 8;
