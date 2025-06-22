"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListTodo, Repeat, Sparkles } from "lucide-react";

const taskMap = [
    { type: "single", label: "Single Task", icon: <ListTodo className="w-4 h-4" /> },
    { type: "daily", label: "Daily Task", icon: <Repeat className="w-4 h-4" /> },
    { type: "instance", label: "Task Instance", icon: <Sparkles className="w-4 h-4" /> },
] as const;

export default function TaskManagerPage() {
    const [sidebar, setSidebar] = useState<boolean>(true);
    const [taskType, setTaskType] = useState<(typeof taskMap)[number]["type"]>("single");

    return (
        <div>
            <Header heading="Task Manager" />
            <section
                className="bg-gray-50 text-black w-screen mt-[72px] flex"
                style={{ height: "calc(100vh - 72px)" }}
            >
                {/* Sidebar */}
                <div
                    className={`transition-all duration-300 ${sidebar ? "w-64" : "w-10"} overflow-hidden bg-white shadow-md relative`}
                >
                    {/* Toggle Button */}
                    <div className="w-full flex justify-end py-2 bg-gray-100 border-b">
                        <Button size="sm" variant="ghost" onClick={() => setSidebar((prev) => !prev)}>
                            {sidebar ? "◀" : "▶"}
                        </Button>
                    </div>

                    {/* Sidebar Options */}
                    <ul className="">
                        {taskMap.map(({ type, label, icon }) => (
                            <li
                                key={type}
                                className={`cursor-pointer flex items-center gap-2 p-3 border-b hover:bg-gray-100 whitespace-nowrap ${taskType === type ? "bg-purple-100 font-bold text-purple-700" : ""
                                    }`}
                                onClick={() => setTaskType(type)}
                            >
                                {icon}
                                {sidebar && <span>{label}</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex-col px-6 py-4">
                    <h2 className="text-xl font-semibold mb-4 capitalize">{taskType} Tasks</h2>
                    <div>
                        <div className="w-full bg-white shadow-md rounded overflow-hidden">hi</div>
                        
                    </div>
                </div>
            </section>
        </div>
    );
}
