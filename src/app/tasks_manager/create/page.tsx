"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";
import { createTask } from "@/features/tasks/services/taskService";
import { TaskType, TaskRequest, DailyTaskRequest, TaskInstanceRequest } from "@/features/tasks/types";
import { Loader } from "@/components/ui/loader";

type FormData = {
    title: string;
    description: string;
    priority: "very low" | "low" | "medium" | "high" | "very high";
    due_date?: string;
    weekdays?: string[];
    daily_task?: number;
    date?: string;
};

const defaultForm: FormData = {
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    weekdays: [],
    daily_task: undefined,
    date: "",
};

const tabOptions: TaskType[] = ["single", "daily", "instance"];

export default function CreateTaskPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = (searchParams.get("taskType") || "single") as TaskType;

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<FormData>({ ...defaultForm });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type: inputType, checked } = e.target;

        if (inputType === "checkbox" && name === "weekdays") {
            const updated = checked
                ? [...(form.weekdays || []), value]
                : (form.weekdays || []).filter((day) => day !== value);
            setForm({ ...form, weekdays: updated });
        } else {
            setForm({ ...form, [name]: inputType === "number" ? Number(value) : value });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            let payload: TaskRequest | DailyTaskRequest | TaskInstanceRequest;

            if (typeParam === "single") {
                payload = {
                    ...form,
                    due_date: form.due_date || new Date().toISOString(),
                    postponed_count: 0,
                    smart_priority: false,
                    is_completed: false,
                };
            } else if (typeParam === "daily") {
                payload = {
                    ...form,
                    weekdays: (form.weekdays || []).map((day) => day.toLowerCase()),
                    is_active: true,
                    postponed_count: 0,
                    smart_priority: false,
                    is_completed: false,
                };
            } else {
                payload = {
                    daily_task: form.daily_task!,
                    date: form.date!,
                    title: form.title,
                    description: form.description,
                    priority: form.priority,
                    postponed_count: 0,
                    smart_priority: false,
                    is_completed: false,
                };
            }

            await createTask(typeParam, payload);
            alert("Task created successfully!");
            setForm({ ...defaultForm });
        } catch (error) {
            console.error(error);
            alert("Failed to create task.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (type: TaskType) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("taskType", type);
        router.push(`?${newParams.toString()}`, { scroll: false });
        setForm({ ...defaultForm });
    };

    return (
        <div className="p-6 w-screen h-screen bg-gray-50 text-black flex flex-col">
            <div className="mb-4">
                <Link href="/tasks_manager">
                    <ArrowBigLeft className="text-gray-700 hover:text-black" />
                </Link>
            </div>

            {/* Task Type Tabs */}
            <div className="max-w-md w-full mx-auto mb-4 flex gap-2 justify-center">
                {tabOptions.map((type) => (
                    <button
                        key={type}
                        className={`capitalize px-4 py-2 rounded ${typeParam === type
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        onClick={() => handleTabChange(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md w-full mx-auto space-y-4 bg-white shadow-sm p-4 rounded"
                >
                    <h2 className="text-2xl font-bold capitalize text-center">
                        Create {typeParam} Task
                    </h2>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="w-full border p-2 rounded"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="very high">Very High</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                        <option value="very low">Very Low</option>
                    </select>

                    {typeParam === "single" && (
                        <input
                            type="datetime-local"
                            name="due_date"
                            value={form.due_date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    )}

                    {typeParam === "daily" && (
                        <div className="grid grid-cols-3 gap-2">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                <label key={day} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="weekdays"
                                        value={day}
                                        checked={(form.weekdays || []).includes(day)}
                                        onChange={handleChange}
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    )}

                    {typeParam === "instance" && (
                        <>
                            <input
                                type="number"
                                name="daily_task"
                                value={form.daily_task || ""}
                                onChange={handleChange}
                                placeholder="Daily Task ID"
                                className="w-full border p-2 rounded"
                                required
                            />
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
}
