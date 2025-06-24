"use client";

import Link from 'next/link';
import { useState, useEffect, Fragment } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tittle } from "@/components/ui/tittle";
import { taskMap } from "@/constants";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getAllTasks, updateTask } from "@/features/tasks/services/taskService"
import { ListTodo, LucideHome, PanelLeftClose, PanelLeftOpen, Plus, Repeat, Sparkles } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { TaskRequest, DailyTaskRequest, TaskInstanceRequest, TaskUnion } from '@/features/tasks/types'
import { TaskDetsModal } from '@/components/TaskDetsModal';

const TOOLNAME = "Task Manager";

const priority = ["very high", "high", "medium", "low", "very low"]

const iconMap = {
    ListTodo: <ListTodo className="w-4 h-4" />,
    Repeat: <Repeat className="w-4 h-4" />,
    Sparkles: <Sparkles className="w-4 h-4" />,
} as const;

export default function TaskManagerPage() {
    const [taskListLoading, setTaskListLoading] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [sidebar, setSidebar] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const taskType = (searchParams.get("taskType") || "single") as (typeof taskMap)[number]["type"];
    const [tasks, setTasks] = useState<TaskUnion[]>([]);
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    const [page, setPage] = useState(1);
    const [orderOptions, setOrderOptions] = useState<string[]>([])
    const [ordering, setOrdering] = useState<string | null>(null)
    const [activeTask, setActiveTask] = useState<TaskRequest | DailyTaskRequest | TaskInstanceRequest | null>(null);

    // Set screen width and sidebar state on mount + resize
    useEffect(() => {
        const updateWidth = () => {
            const width = window.innerWidth;
            setScreenWidth(width);
            setSidebar(width > 720); // Optional: auto-collapse on small screens
        };

        updateWidth(); // Initial
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                setTaskListLoading(true);
                const data = await getAllTasks(taskType, page, ordering);
                setTasks(data.results);
                setHasNext(Boolean(data.next));
                setHasPrev(Boolean(data.previous));
                extractKeysFromResults(data.results);
            } catch (err: unknown) {
                if (
                    err &&
                    typeof err === "object" &&
                    "response" in err &&
                    "name" in err &&
                    typeof (err as any).name === "string"
                ) {
                    if ((err as any).name !== "CanceledError") {
                        console.error("Failed to fetch paginated tasks:", err);
                    }
                }
            } finally {
                setTaskListLoading(false);
            }
        }, 200); // Delay by 200ms

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [taskType, page, ordering]);


    const handlePriorityChange = async (taskId: number, newPriority: string) => {
        const current = tasks.find(task => task.id === taskId)?.priority;
        if (current === newPriority) return;

        try {
            setTaskListLoading(true)
            await updateTask(taskType, taskId, { priority: newPriority as TaskUnion["priority"] });
            setTasks(prev =>
                prev.map(task =>
                    task.id === taskId ? { ...task, priority: newPriority as TaskUnion["priority"] } : task
                )
            );
        } catch (err) {
            console.error("Failed to update priority", err);
        } finally {
            setTaskListLoading(false)
        }
    };


    const extractKeysFromResults = (results: TaskUnion[]) => {
        const allKeys = new Set<string>();

        results.forEach((item) => {
            Object.keys(item).forEach((key) => allKeys.add(key));
        });

        setOrderOptions(Array.from(allKeys));
    };

    return (
        <div>
            <div className="max-md:hidden">
                <Header heading={TOOLNAME} />
            </div>
            {activeTask && (
                <TaskDetsModal
                    dets={activeTask}
                    onClose={() => setActiveTask(null)}
                />
            )}

            <section
                className="bg-gray-50 text-black w-screen md:mt-[72px] flex"
                style={{ height: `${screenWidth >= 769 ? 'calc(100svh -  72px)' : '100svh'}` }}
            >
                {/* Sidebar */}
                <div
                    className={`transition-all duration-300 h-full max-md:z-50 ${sidebar ? "w-64" : "w-10 max-md:w-0"
                        } overflow-hidden bg-white shadow-md relative max-md:fixed top-0`}
                >
                    {/* Toggle Button */}
                    <div className="w-full flex justify-end py-2 bg-gray-100 border-b md:-mt-5">
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`transition-all duration-300 fixed max-md:top-3 top-21 ${sidebar ? "left-64 md:left-70" : "md:left-14 left-3"}`}
                            onClick={() => setSidebar((prev) => !prev)}
                        >
                            {sidebar ? <PanelLeftClose className='size-10x' /> : <PanelLeftOpen className='size-10x' />}
                        </Button>
                        {sidebar && (
                            <div className="w-full py-5 flex items-center justify-center md:hidden">
                                <Tittle heading={TOOLNAME} />
                            </div>
                        )}
                    </div>
                    <ul>
                        <li
                            className={`cursor-pointer flex items-center gap-2 p-3 border-b hover:bg-gray-100 whitespace-nowrap ${pathname === "/" ? "bg-purple-100 font-bold text-purple-700" : ""
                                }`}
                            onClick={() => router.push(`/`)}
                        >
                            <LucideHome className='w-4 h-4' /> {sidebar && <span>Dashboard</span>}
                        </li>

                        {taskMap.map(({ type, label, iconName }) => (
                            <li
                                key={type}
                                className={`cursor-pointer flex items-center gap-2 p-3 border-b hover:bg-gray-100 whitespace-nowrap ${taskType === type ? "bg-purple-100 font-bold text-purple-700" : ""
                                    }`}
                                onClick={() => router.push(`/tasks_manager?taskType=${type}`)}
                            >
                                {iconMap[iconName]}
                                {sidebar && <span>{label}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Main Content */}
                <div className="flex-1 flex-col px-6 py-4">
                    <div className="flex justify-between px-4">
                        <h2 className="text-xl font-semibold mb-4 capitalize ml-4">{taskType} Tasks</h2>
                        <Link href={`/tasks_manager/create?taskType=${taskType}`}>
                            <Plus />
                        </Link>
                    </div>
                    <div
                        className="w-full flex flex-col gap-2"
                        style={{ height: `calc(100% - ${screenWidth <= 720 ? "50px" : "0"})` }}
                    >
                        <div data-section="content" className="h-full bg-white shadow-md rounded overflow-hidden border relative">
                            {taskListLoading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Loader />
                                </div>
                            ) : (
                                <div className="h-full bg-white shadow-md rounded overflow-auto border p-4 space-y-2">
                                    {/* Top fade */}
                                    <div className="h-4 absolute top-0 left-0 w-full bg-white z-10 pointer-events-none" />

                                    {/* Task list */}
                                    {tasks ? (tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="border p-3 rounded shadow-sm bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                                        >
                                            <div>
                                                <h3
                                                    className="text-lg font-semibold cursor-pointer hover:underline"
                                                    onClick={() => setActiveTask(task)}
                                                >{task.title}</h3>
                                                <p className="text-sm text-gray-600">{task.description}</p>
                                            </div>

                                            <div className="text-xs text-purple-700 flex items-center">
                                                <span className="mr-1 font-medium">Priority:</span>
                                                <select
                                                    value={task.priority}
                                                    onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                                                    className="ml-1 border border-purple-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                >
                                                    {priority.map((p, i) => (
                                                        <option key={i} value={p}>
                                                            {p}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))) : (
                                        <div className='w-full h-full flex items-center justify-center'>
                                            <p className='text-gray-500 font-xl'>No Task Available</p>
                                        </div>
                                    )}

                                    {/* Bottom fade */}
                                    <div className="h-4 absolute bottom-0 left-0 w-full bg-white z-10 pointer-events-none" />
                                </div>
                            )}
                        </div>
                        <div data-section="pagination" className="flex gap-2 mx-auto" >
                            {orderOptions && (<div className="">
                                <select
                                    id="field-select"
                                    value={ordering ?? ""}
                                    onChange={(e) => setOrdering(e.target.value || null)}
                                    className="border border-gray-300 px-4 py-2 rounded-md shadow-sm w-full"
                                >
                                    <option value=''>
                                        Order by
                                    </option>
                                    {Array.isArray(orderOptions) &&
                                        orderOptions.map((field) => (
                                            <Fragment key={field}>
                                                <option value={field}>↑ {field}</option>
                                                <option value={`-${field}`}>↓ {field}</option>
                                            </Fragment>
                                        ))
                                    }
                                </select>
                            </div>)}
                            <Button
                                size="sm"
                                variant="ghost"
                                className={`p-2 bg-purple-600 hover:bg-purple-700 text-white ${!hasPrev && "opacity-50 cursor-not-allowed"}`}
                                onClick={() => hasPrev && setPage((p) => p - 1)}
                            >
                                Prev
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                                className={`p-2 bg-purple-600 hover:bg-purple-700 text-white ${!hasNext && "opacity-50 cursor-not-allowed"}`}
                                onClick={() => hasNext && setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}