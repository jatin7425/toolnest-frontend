import { Dialog, Transition } from "@headlessui/react";
import { Calendar1Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskRequest, DailyTaskRequest, TaskInstanceRequest } from "@/features/tasks/types";
import { Fragment } from "react";

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
                                        size="default"
                                        variant="default"
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
const XIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

