'use server'

import { supabase } from "@/lib/supabase/auth-admin"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
})

type FormData = z.infer<typeof loginSchema>

export async function createSuperAdmin(data: FormData) {
  const result = loginSchema.safeParse(data);
  
  if (!result.success) {
    return { success: false, error: "Invalid data format" };
  }

  const { email, password } = result.data

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      role: "super-admin",
      name: data.name
    },
    email_confirm: true
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: "Super admin creation failed. Please try again." }
  }

  // Send Super Admin creation email
  // try {
  //   const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/admin-login`;
  //   const emailHtml = getSuperAdminWelcomeEmailTemplate({
  //     adminEmail: email,
  //     adminPassword: password,
  //     loginUrl,
  //   });

  //   const { data: emailData, error: emailError } = await resend.emails.send({
  //     from: "Morganis <onboarding@resend.dev>", // TODO: Update with your verified domain
  //     to: email,
  //     subject: "Welcome to Morganis - Super Admin Access",
  //     html: emailHtml,
  //   });

  //   if (emailError) {
  //     console.error("Failed to send super admin welcome email:", emailError);
  //     return { success: false, error: emailError.message }
  //   } else {
  //     console.log("Super admin welcome email sent successfully:", emailData);
  //   }
  // } catch (err) {
  //   console.error("Error sending super admin welcome email:", err);
  //   return { success: false, error: "Failed to send super admin welcome email" }
  // }

  return { success: true };
}
