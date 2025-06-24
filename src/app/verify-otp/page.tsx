import { Suspense } from "react";
import VerifyOtpPage from "./VerifyOtpPage";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading OTP screen...</div>}>
            <VerifyOtpPage />
        </Suspense>
    );
}
