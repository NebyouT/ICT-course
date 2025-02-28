import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVerifyPaymentMutation } from '@/features/api/purchaseApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const VerifyPayment = () => {
  const { tx_ref } = useParams();
  const navigate = useNavigate();
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await verifyPayment(tx_ref).unwrap();
        if (result.status === 'success') {
          toast.success('Payment verified successfully');
          navigate(`/course-progress/${result.courseId}`);
        } else {
          toast.error('Payment verification failed');
          navigate(`/course-detail/${result.courseId}`);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        const courseId = error.data?.courseId || tx_ref.split('-')[1];
        toast.error(error.data?.message || 'Failed to verify payment');
        navigate(`/course-detail/${courseId}`);
      }
    };

    verify();
  }, [tx_ref, verifyPayment, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="mt-4 text-lg">Verifying your payment...</p>
    </div>
  );
};

export default VerifyPayment;
