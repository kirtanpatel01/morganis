'use server'

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function signupAdmin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const headersList = await headers()
  const origin = headersList.get("origin")
  
  if (!email || !password || !fullName) {
    return { error: "Missing required fields" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/admin`,
      data: {
        full_name: fullName,
        role: "admin",
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
