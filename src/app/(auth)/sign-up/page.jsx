import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
