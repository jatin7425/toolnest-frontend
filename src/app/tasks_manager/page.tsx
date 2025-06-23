"use client";

import Link from 'next/link';
import { useState, useEffect, Fragment } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tittle } from "@/components/ui/tittle";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllTasks, updateTask } from "@/features/tasks/services/taskService"
import { Calendar1Icon, ListTodo, Plus, Repeat, Sparkles } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { TaskRequest, DailyTaskRequest, TaskInstanceRequest } from '@/features/tasks/types'
import { Dialog, Transition } from "@headlessui/react";

const TOOLNAME = "Task Manager";

export const taskMap = [
    { type: "single", label: "Single Task", icon: <ListTodo className="w-4 h-4" /> },
    { type: "daily", label: "Daily Task", icon: <Repeat className="w-4 h-4" /> },
    { type: "instance", label: "Task Instance", icon: <Sparkles className="w-4 h-4" /> },
] as const;

const priority = ["very high", "high", "medium", "low", "very low"]

export default function TaskManagerPage() {
    const [taskListLoading, setTaskListLoading] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [sidebar, setSidebar] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const taskType = (searchParams.get("taskType") || "single") as (typeof taskMap)[number]["type"];
    const [tasks, setTasks] = useState<any[]>([]);
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
                const data = await getAllTasks(taskType, page, ordering, { signal: controller.signal });
                setTasks(data.results);
                setHasNext(Boolean(data.next));
                setHasPrev(Boolean(data.previous));
                extractKeysFromResults(data.results);
            } catch (error: any) {
                if (error.name !== "CanceledError") {
                    console.error("Failed to fetch paginated tasks:", error);
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
            await updateTask(taskType, taskId, { priority: newPriority });
            setTasks(prev =>
                prev.map(task =>
                    task.id === taskId ? { ...task, priority: newPriority } : task
                )
            );
        } catch (err) {
            console.error("Failed to update priority", err);
        } finally {
            setTaskListLoading(false)
        }
    };


    const extractKeysFromResults = (results: any[]) => {
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
                    className={`transition-all duration-300 h-full z-50 ${sidebar ? "w-64" : "w-10 max-md:w-0"
                        } overflow-hidden bg-white shadow-md relative max-md:fixed top-0`}
                >
                    {/* Toggle Button */}
                    <div className="w-full flex justify-end py-2 bg-gray-100 border-b">
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`max-md:fixed left-2 max-md:top-3 ${sidebar && "left-64"}`}
                            onClick={() => setSidebar((prev) => !prev)}
                        >
                            {sidebar ? "◀" : "▶"}
                        </Button>
                        {sidebar && (
                            <div className="w-full py-5 flex items-center justify-center md:hidden">
                                <Tittle heading={TOOLNAME} />
                            </div>
                        )}
                    </div>

                    <ul>
                        {taskMap?.map(({ type, label, icon }) => (
                            <li
                                key={type}
                                className={`cursor-pointer flex items-center gap-2 p-3 border-b hover:bg-gray-100 whitespace-nowrap ${taskType === type ? "bg-purple-100 font-bold text-purple-700" : ""
                                    }`}
                                onClick={() => router.push(`/tasks_manager?taskType=${type}`)}
                            >
                                {icon}
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
                                    {tasks ? (tasks.map((task: any) => (
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
                                    ))):(
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

type Props = {
    dets: TaskRequest | DailyTaskRequest | TaskInstanceRequest;
    onClose: () => void;
};

export const TaskDetsModal = ({ dets, onClose }: Props) => {
    const isCompleted = dets.is_completed;

    return (
        <Transition show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay with subtle completion status indication */}
                <Transition.Child as={Fragment} {...transitionProps}>
                    <div
                        className={`fixed inset-0 ${isCompleted ? 'bg-green-500/10' : 'bg-rose-500/10'
                            }`}
                        aria-hidden="true"
                    />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4">
                        <Transition.Child as={Fragment} {...transitionProps}>
                            <Dialog.Panel
                                className={`relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-100 text-black
                                    ${isCompleted ? 'ring-green-200' : 'ring-rose-200'}
                                `}
                            >
                                {/* Status indicator bar */}
                                <div className={`absolute top-0 left-0 h-1 w-full rounded-t-xl ${isCompleted ? 'bg-green-400' : 'bg-rose-400'
                                    }`} />

                                <div className="flex justify-between items-start mb-4">
                                    <Dialog.Title className="text-xl font-bold text-gray-800">
                                        Task Details
                                    </Dialog.Title>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XIcon className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <Field label="Title">
                                        <span className="font-medium text-gray-900">
                                            {dets.title}
                                        </span>
                                    </Field>

                                    <Field label="Description">
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {dets.description || "—"}
                                        </p>
                                    </Field>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Priority">
                                            <PriorityBadge priority={dets.priority} />
                                        </Field>

                                        <Field label="Smart Priority">
                                            <span className="font-medium">
                                                {dets.smart_priority ? "Enabled" : "Disabled"}
                                            </span>
                                        </Field>
                                    </div>

                                    <Field label="Status">
                                        <StatusPill completed={isCompleted} />
                                    </Field>

                                    <Field label="Postponed">
                                        <span className="font-medium">
                                            {dets.postponed_count} time{dets.postponed_count === 1 ? '' : 's'}
                                        </span>
                                    </Field>

                                    {"due_date" in dets && (
                                        <Field label="Due Date">
                                            <div className="flex items-center gap-2">
                                                <Calendar1Icon className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">
                                                    {new Date(dets.due_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </Field>
                                    )}

                                    {"weekdays" in dets && (
                                        <Field label="Schedule">
                                            <WeekdayPills
                                                weekdays={Array.isArray(dets.weekdays) ? dets.weekdays : []}
                                            />
                                        </Field>
                                    )}

                                    {"is_active" in dets && (
                                        <Field label="Active">
                                            <span className={`font-medium ${dets.is_active ? 'text-green-600' : 'text-gray-600'
                                                }`}>
                                                {dets.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </Field>
                                    )}
                                </div>

                                <div className="mt-8 text-right">
                                    <Button
                                        size="md"
                                        variant="primary"
                                        onClick={onClose}
                                        className="px-5"
                                    >
                                        Close Details
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// Helper components
const transitionProps = {
    enter: "ease-out duration-200",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in duration-100",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
        <div className="text-sm">{children}</div>
    </div>
);

const StatusPill = ({ completed }: { completed: boolean }) => (
    <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${completed
                ? 'bg-green-100 text-green-800'
                : 'bg-rose-100 text-rose-800'}
        `}>
        {completed ? (
            <CheckCircleIcon className="h-4 w-4 mr-1.5" />
        ) : (
            <ClockIcon className="h-4 w-4 mr-1.5" />
        )}
        {completed ? 'Completed' : 'Pending'}
    </span>
);

const WeekdayPills = ({ weekdays }: { weekdays: string[] }) => {
    if (!weekdays.length) return <span className="text-gray-500">—</span>;

    return (
        <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => (
                <span
                    key={day}
                    className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md"
                >
                    {day}
                </span>
            ))}
        </div>
    );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    const priorityColors: Record<string, string> = {
        "very high": "bg-red-600/10 text-red-700",
        "high": "bg-red-400/10 text-red-600",
        "medium": "bg-yellow-200/20 text-yellow-800",
        "low": "bg-blue-200/20 text-blue-700",
        "very low": "bg-gray-200/20 text-gray-700",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${priorityColors[priority.toLowerCase()] || 'bg-gray-100 text-gray-800'}
        `}>
            {priority}
        </span>
    );
};

// Icons (assuming you're using Heroicons)
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

