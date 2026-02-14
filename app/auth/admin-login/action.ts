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

  const { email, password } = result.data

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

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error(userError)
    return { error: userError.message }
  }

  const userRole = user.user.user_metadata.role;

  if (!userRole) {
    return { error: "User role not found" }
  }

  if(userRole !== data.role) {
    return { error: "User role does not match" }
  }
  
  // Success - Redirect on server side
  if (userRole === 'super-admin') {
    redirect('/super-admin')
  } else {
    redirect('/admin')
  }
}

export async function getCurrentAdmin() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    name: user.user_metadata.name || 'Admin',
    email: user.email || '',
    avatar: user.user_metadata.avatar_url, // Might be undefined, handled in component
    role: user.user_metadata.role
  }
}

export async function logoutAdmin() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/admin-login')
}
