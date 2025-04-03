
export type UserRole = "student" | "instructor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  section?: string;
  year?: string;
  rollNumber?: string;
  designation?: string;
  createdAt: Date;
}

export interface GDSession {
  id: string;
  topic: string;
  details: string;
  groupName: string;
  groupNumber: string;
  date: Date;
  participants: string[]; // roll numbers of participants
  evaluators: string[]; // roll numbers of evaluators
  createdBy: string; // instructor id
  createdAt: Date;
}

export interface EvaluationCriteria {
  articulation: number; // 1-10
  relevance: number; // 1-10
  leadership: number; // 1-10
  nonVerbalCommunication: number; // 1-10
  impression: number; // 1-10
}

export interface Evaluation {
  id: string;
  gdSessionId: string;
  studentId: string; // student being evaluated
  evaluatorId: string; // evaluator (student or instructor)
  evaluatorRole: UserRole;
  criteria: EvaluationCriteria;
  createdAt: Date;
}

export interface GDSessionWithEvaluations extends GDSession {
  evaluations: Evaluation[];
}
