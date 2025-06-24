export type TaskType = "single" | "daily" | "instance";

export interface BaseTaskFields {
  id: number;
  title: string;
  description: string;
  priority: "very low" | "low" | "medium" | "high" | "very high";
  smart_priority: boolean;
  postponed_count: number;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TaskRequest extends Omit<BaseTaskFields, 'id'> {
  due_date: string; // ISO 8601
}

export interface DailyTaskRequest extends Omit<BaseTaskFields, 'id'> {
  weekdays: string[]; // or `{ [key: string]: boolean }`
  is_active: boolean;
}

export interface TaskInstanceRequest extends Omit<BaseTaskFields, 'id'> {
  daily_task: number;
  date: string;
}


