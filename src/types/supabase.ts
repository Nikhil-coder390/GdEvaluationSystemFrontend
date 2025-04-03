// Use specific types instead of trying to reference the generated types
export type UserRole = 'student' | 'instructor';

// Define the basic structure for each table row
export type ProfileRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  section: string | null;
  year: string | null;
  roll_number: string | null;
  designation: string | null;
  created_at: string;
};

export type GDSessionRow = {
  id: string;
  topic: string;
  details: string;
  group_name: string;
  group_number: string;
  date: string;
  created_by: string;
  created_at: string;
};

export type GDParticipantRow = {
  id: string;
  gd_session_id: string;
  student_id: string;
  created_at: string;
};

export type GDEvaluatorRow = {
  id: string;
  gd_session_id: string;
  evaluator_id: string;
  created_at: string;
};

export type EvaluationRow = {
  id: string;
  gd_session_id: string;
  student_id: string;
  evaluator_id: string;
  articulation: number;
  relevance: number;
  leadership: number;
  non_verbal_communication: number;
  impression: number;
  created_at: string;
};

// Define insert types
export type ProfileInsert = Omit<ProfileRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
export type GDSessionInsert = Omit<GDSessionRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
export type GDParticipantInsert = Omit<GDParticipantRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
export type GDEvaluatorInsert = Omit<GDEvaluatorRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
export type EvaluationInsert = Omit<EvaluationRow, 'id' | 'created_at'> & { id?: string; created_at?: string };

// Define update types
export type ProfileUpdate = Partial<Omit<ProfileRow, 'id'>> & { id?: string };
export type GDSessionUpdate = Partial<Omit<GDSessionRow, 'id'>> & { id?: string };
export type GDParticipantUpdate = Partial<Omit<GDParticipantRow, 'id'>> & { id?: string };
export type GDEvaluatorUpdate = Partial<Omit<GDEvaluatorRow, 'id'>> & { id?: string };
export type EvaluationUpdate = Partial<Omit<EvaluationRow, 'id'>> & { id?: string };
