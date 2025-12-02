import { AlertTriangle } from "lucide-react";

const VerificationBanner = ({ status }: { status: string }) => {
  if (status === "approve") return null;
  return (
  
    <div className="w-full bg-yellow-100 border-t border-yellow-300 text-yellow-800 text-center py-3 px-4 shadow-sm flex items-center justify-center gap-2">
      <AlertTriangle className="w-5 h-5 text-yellow-700" />
      <p className="text-sm font-semibold">
        {status === "pending"
          && "First complete your profile, then your account will move to under review. Once the admin approves it, you will get full access."}
      </p>
    </div>
  );
};

export default VerificationBanner;
