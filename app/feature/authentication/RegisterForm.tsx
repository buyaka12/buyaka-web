import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input";
import { useAuthentication } from "@/feature/authentication/AuthenticationProviderHook.tsx";
import {ApiClient} from "@/feature/http/ApiClient.ts";
import {TokenManager} from "@/feature/http/TokenManager.ts";

// Schema for registration form validation
const formSchema = z.object({
  fullName: z.string().trim().min(1, {
    message: "Please enter your full name.",
  }).refine(name => name.includes(' '), {
    message: "Full name must include a space.",
  }),
  email: z.string().trim().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Apply the error to the confirmPassword field
});

type RegisterFormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  attemptingRegister: boolean;
  setAttemptingRegister: (isAttempting: boolean) => void;
}

export function RegisterForm({ attemptingRegister, setAttemptingRegister }: RegisterFormProps) {
  // NOTE: Assumes your useAuthentication hook provides `attemptRegistration`
  const { errors, attemptAuthentication } = useAuthentication();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Real-time validation
  });

  async function onSubmit(values: RegisterFormValues) {
    if (attemptingRegister) {
      return;
    }
    setAttemptingRegister(true);
    try {

      const attempt = await ApiClient.post('/identity/create', {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      });

      // successful
      if (attempt.succeeded) {
        await attemptAuthentication({
          email: values.email,
          password: values.password,
        });
      }
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setAttemptingRegister(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="full name..."
          {...form.register("fullName")}
        />
        {form.formState.errors.fullName && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="example@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="password..."
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="confirm password..."
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Display any general errors from the authentication hook */}
      {errors.map((e, index) => (
        <p key={index} className={'text-sm font-medium text-destructive'}>{e}</p>
      ))}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!form.formState.isValid || attemptingRegister}
      >
        {attemptingRegister ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}