import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId, disabled }) => {
  const [createCheckoutSession, {data, isLoading, isSuccess, isError, error }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    if (!courseId) {
      toast.error("Invalid course ID");
      return;
    }
    
    try {
      console.log("Attempting to create checkout session for course:", courseId);
      await createCheckoutSession(courseId);
    } catch (err) {
      console.error("Error creating checkout session:", err);
      toast.error("Failed to initiate checkout process");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.url) {
        console.log("Redirecting to payment URL:", data.url);
        window.location.href = data.url; // Redirect to payment gateway
      } else {
        console.error("Invalid response from server:", data);
        toast.error("Invalid response from server.");
      }
    } 
    if (isError) {
      console.error("Checkout error:", error);
      toast.error(error?.data?.message || "Failed to create checkout session");
    }
  }, [data, isSuccess, isError, error]);

  return (
    <Button
      disabled={isLoading || disabled}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
