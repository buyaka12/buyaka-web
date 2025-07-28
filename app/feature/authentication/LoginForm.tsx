import { useForm } from "react-hook-form";
import {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import {Label} from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input";
import {useAuthentication} from "@/feature/authentication/AuthenticationProviderHook.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {ApiClient} from "@/feature/http/ApiClient.ts";


const formSchema = z.object({
  email: z.string().trim().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  attemptingLogin: boolean;
  setAttemptingLogin: (isAttempting: boolean) => void;
}

export function LoginForm({ attemptingLogin, setAttemptingLogin }: LoginFormProps) {
  const { attemptAuthentication, errors } = useAuthentication();
  const [passwordResetOpen, setPasswordResetOpen] = useState<boolean>(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState<boolean>(false);
  const [passwordResetSent, setPasswordResetSent] = useState<boolean>(false);
  const [passwordResetSending, setPasswordResetSending] = useState<boolean>(false);



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Add this line for real-time validation
  });

  async function onSubmit(values: LoginFormValues) {
    if (attemptingLogin) {
      return;
    }
    setAttemptingLogin(true); // Set loading state to true
    try {
      // Simulate an API call
       await attemptAuthentication({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setAttemptingLogin(false); // Set loading state to false
    }
  }


  async function submitPasswordReset() {
    setPasswordResetSending(true);

    await ApiClient.post('/identity/forgotPassword', {
      email: passwordResetEmail,
    });
    setPasswordResetSent(true);
    setPasswordResetSending(false);
  }


  useEffect(() => {
    if (passwordResetOpen) {
      setPasswordResetEmail(form.getValues("email"));
    } else {
      setPasswordResetEmail('');
      setPasswordResetSending(false);
      setPasswordResetSent(false);
    }

  }, [passwordResetOpen]);

  return (

    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
      <div className="space-y-2 flex flex-col">
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


        <Button className={'ml-auto'} variant={'link'} type={'button'} onClick={() => setPasswordResetOpen(true)}>Forgot password?</Button>
        <Dialog open={passwordResetOpen} onOpenChange={() => setPasswordResetOpen(false)}>


          { passwordResetSending ? (
            <>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset password</DialogTitle>
                  <DialogDescription>
                    Sending password reset request. Please wait.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>

            </>
          ) : (
            <>

              {passwordResetSent ? (

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset password</DialogTitle>
                    <DialogDescription>
                      Password reset request sent successfully, please follow instructions in email. Please check your junk mail.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant={'outline'} type={'button'} onClick={() => setPasswordResetOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
                ) : (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset password</DialogTitle>
                    <DialogDescription>
                      To reset your password, enter your email below.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Input placeholder={'email'} className={'text-card-foreground'} type={'email'} value={passwordResetEmail} onChange={e => setPasswordResetEmail(e.target.value)} />
                  </div>
                  <DialogFooter>
                    <Button variant={'outline'} type={'button'} onClick={() => setPasswordResetOpen(false)}>Cancel</Button>
                    <Button type={'button'} onClick={submitPasswordReset}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </>

          )


          }

        </Dialog>

      </div>

      {errors.map((e, index) => {
        return (
          <p key={index} className={'text-sm font-medium text-destructive'}>{e}</p>
        )
      })}

      {/* Add the disabled prop based on form validity */}
      <Button
        type="submit"
        className="w-full"
        disabled={!form.formState.isValid}
      >
        {attemptingLogin ? "Logging in..." : "Login"}
      </Button>
    </form>

  )
}