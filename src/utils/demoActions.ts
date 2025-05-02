import { DemoLoginFormSchema, FormState } from '@/lib/schemata'

// Log a demo user in: no real auth, just email and password validation checks. 
export const demoLogin = async (state: FormState, formData: FormData): Promise<FormState> => {
  // Validate form fields.
  const validateFields = DemoLoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // 1b. If any form fields are invalid, return early.
  if (!validateFields.success) return { errors: validateFields.error.flatten().fieldErrors }

  return { message: 'success' }
}
