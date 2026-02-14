"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createSuperAdmin } from "./action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import Link from "next/link"

const formSchema = z.object({
  name: z.string(),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

type FormData = z.infer<typeof formSchema>

export default function Page() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<FormData | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (!createdCredentials) return
    const text = `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast.success("Credentials copied!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const onSubmit = async (data: FormData) => {
    const result = await createSuperAdmin(data)
    if (result.success) {
      toast.success("Super admin created successfully.")
      setCreatedCredentials(data)
      form.reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle>Create Super Admin</CardTitle>
          <CardDescription>
            Enter credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {createdCredentials && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border relative">
              <h3 className="font-semibold mb-2 text-sm text-foreground">Created Credentials</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Email:</span> {createdCredentials.email}</p>
                <p><span className="font-medium text-foreground">Password:</span> {createdCredentials.password}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 cursor-pointer"
                onClick={handleCopy}
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy credentials</span>
              </Button>
            </div>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          Already have credentials ? <Link href="/auth/admin-login"><Button variant={"link"}className="cursor-pointer">Login</Button></Link>
        </CardFooter>
      </Card>
    </div>
  )
}