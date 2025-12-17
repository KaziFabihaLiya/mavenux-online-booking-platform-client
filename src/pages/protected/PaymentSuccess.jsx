import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, Loader2, Download } from "lucide-react";
import { useVerifyPayment } from "../../hooks/usePayment";
import Confetti from "react-confetti";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const verifyPayment = useVerifyPayment();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (sessionId && !verified) {
      verifyPayment.mutate(sessionId, {
        onSuccess: () => setVerified(true),
      });
    }
  }, [sessionId]);

  if (verifyPayment.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
      />

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full blur-xl opacity-50 mx-auto animate-pulse" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed. Check your email for the ticket
            details.
          </p>

          {/* Transaction Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-sm text-gray-800">
                {sessionId?.substring(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-semibold">Completed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/user/bookings")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              View My Bookings
            </button>

            <button
              onClick={() => navigate("/dashboard/user/transactions")}
              className="w-full border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              View Transactions
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
