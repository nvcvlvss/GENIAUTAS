export type SessionStatus = 'draft' | 'active' | 'paused' | 'closed';
export type AgentType = 'constructivista' | 'cognitivista' | 'neutro';

export interface Profile {
  id: string;
  full_name: string | null;
  school_id: string | null;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  created_at: string;
}

export interface Session {
  id: string;
  teacher_id: string;
  school_id: string;
  grade: string;
  title: string;
  pedagogical_objective: string;
  agent_config: AgentType;
  status: SessionStatus;
  last_activity_at: string;
  created_at: string;
}

export interface RoadmapTask {
  id: string;
  session_id: string;
  title: string;
  order_index: number;
  created_at: string;
}
