import { SignUp } from "../auth";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignUp forceRedirectUrl="/creator-profile" />
    </div>
  );
}