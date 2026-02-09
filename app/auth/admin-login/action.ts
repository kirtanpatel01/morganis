'use server'

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { redirect } from "next/navigation"

// Define the shape of the data we expect
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.string()
})

type LoginData = z.infer<typeof loginSchema>

export async function loginAdmin(data: LoginData) {
  const result = loginSchema.safeParse(data)
  
  if (!result.success) {
    return { error: "Invalid data format" }
  }

  const { email, password, role } = result.data

  const supabase = await createClient()

  // 1. Sign in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Login failed. Please try again." }
  }

  // 2. Verify Role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single()

  if (profileError || !profile) {
    await supabase.auth.signOut()
    return { error: "Error verifying profile." }
  }

  if (profile.role !== role) {
    await supabase.auth.signOut()
    return { error: `Unauthorized: You are not a ${role === 'super-admin' ? 'Super Admin' : 'Admin'}.` }
  }

  // Success - Redirect on server side
  if (role === 'super-admin') {
    redirect('/super-admin')
  } else {
    redirect('/admin')
  }
}
