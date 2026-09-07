"use client";

import { useRouter } from "next/navigation";

export default function OutOfHeartsModal({ onRefill }: { onRefill: () => void }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-6">
      <div className="text-center max-w-sm animate-bounceIn">
        <div className="text-7xl mb-4">💔</div>
        <h2 className="text-2xl font-extrabold text-duo-text mb-2">Out of hearts!</h2>
        <p className="text-duo-grayDark font-semibold mb-8">
          You've run out of hearts. Practice to refill them for free, or use gems for an instant refill.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={onRefill} className="duo-btn-blue w-full">
            Refill hearts (350 💎 or free practice)
          </button>
          <button onClick={() => router.push("/")} className="duo-btn-outline w-full">
            Back to path
          </button>
        </div>
      </div>
    </div>
  );
}
