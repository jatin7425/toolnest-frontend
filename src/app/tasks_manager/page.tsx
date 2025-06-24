import { Suspense } from "react";
import TaskManagerPage from "./TaskManagerPage";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading task manager...</div>}>
            <TaskManagerPage />
        </Suspense>
    );
}
