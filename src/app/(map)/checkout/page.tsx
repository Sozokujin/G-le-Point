import dynamic from "next/dynamic";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const Checkout = dynamic(() => import("@/components/checkout"), {
  suspense: true,
});

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100svh] flex justify-center items-center">
          <BeatLoader color="#37b978" />
        </div>
      }
    >
      <Checkout />
    </Suspense>
  );
}
