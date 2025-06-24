export interface BaseTaskFields {
  id: number;
  title: string;
  description: string;
  priority: "very low" | "low" | "medium" | "high" | "very high";
  postponed_count: number;
  smart_priority: boolean;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Task extends BaseTaskFields {
  due_date: string;
}

export interface DailyTask extends BaseTaskFields {
  weekdays: string[];
  is_active: boolean;
}

export interface TaskInstance extends BaseTaskFields {
  daily_task: number;
  date: string;
}

// Creation request types (no `id`)
export type TaskRequest = Omit<Task, "id" | "created_at" | "updated_at">;
export type DailyTaskRequest = Omit<DailyTask, "id" | "created_at" | "updated_at">;
export type TaskInstanceRequest = Omit<TaskInstance, "id" | "created_at" | "updated_at">;

// This is what you should use for tasks with ID
export type TaskUnion = Task | DailyTask | TaskInstance;
