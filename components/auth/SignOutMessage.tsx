"use client";

import { useEffect, useState } from "react";


export default function SignOutMessage() {
const [visible, setVisible] = useState(true);

useEffect(() => {
const timeout = window.setTimeout(() => {
setVisible(false);
}, 4000);

return () => window.clearTimeout(timeout);

}, []);

if (!visible) return null;

return (
<div
    className="fixed top-6 right-6 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-xl"
>
    <p className="font-semibold">You have been signed out.</p>
    <p className="mt-1 text-slate-600">
    Thank you for using SAMB&apos;s Laundry & Klinin Services.
    </p>
</div>
);

}