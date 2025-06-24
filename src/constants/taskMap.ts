import { ListTodo, Repeat, Sparkles } from "lucide-react";

export const taskMap = [
    { type: "single", label: "Single Task", icon: <ListTodo className="w-4 h-4" /> },
    { type: "daily", label: "Daily Task", icon: <Repeat className="w-4 h-4" /> },
    { type: "instance", label: "Task Instance", icon: <Sparkles className="w-4 h-4" /> },
] as const;
