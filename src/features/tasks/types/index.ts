export interface BaseTaskFields {
  title: string;
  description: string;
  priority: "very low" | "low" | "medium" | "high" | "very high";
  smart_priority: boolean;
  postponed_count: number;
  is_completed: boolean;
}

export interface TaskRequest extends BaseTaskFields {
  due_date: string; // ISO 8601
}

export interface DailyTaskRequest extends BaseTaskFields {
  weekdays: string[]; // or `{ [key: string]: boolean }`
  is_active: boolean;
}

export interface TaskInstanceRequest extends BaseTaskFields {}
