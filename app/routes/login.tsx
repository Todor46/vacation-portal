import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, useActionData } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';
import { z } from 'zod';
import { authenticator } from '~/services/auth.server';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(19, 'Password must be at most 19 characters'),
});

type ActionData = {
  errors: {
    formErrors: string[];
    fieldErrors: {
      email?: string[];
      password?: string[];
    };
  };
};

export default function Login() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center">
      <Form
        method="post"
        className="flex flex-col gap-4 w-[300px]"
      >
        <h1 className="text-2xl font-medium text-center mb-4">Login</h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Your email"
            name="email"
          />
          <div className="text-sm text-red-500">
            {actionData?.errors.fieldErrors.email?.[0]}
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            name="password"
          />
          <div className="text-sm text-red-500">
            {actionData?.errors.fieldErrors.password?.[0]}
          </div>
        </div>
        <div className="text-sm text-red-500">
          {actionData?.errors.formErrors?.[0]}
        </div>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const result = loginSchema.safeParse(payload);

  if (!result.success) {
    return json<ActionData>(
      { errors: result.error.flatten() },
      { status: 400 },
    );
  }

  try {
    return await authenticator.authenticate('form', clonedRequest, {
      successRedirect: '/',
      context,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return json<ActionData>({
        errors: {
          formErrors: [error.message || 'Authentication failed'],
          fieldErrors: {},
        },
      });
    }

    console.error(error);
    return json<ActionData>(
      {
        errors: {
          formErrors: ['An unexpected error occurred'],
          fieldErrors: {},
        },
      },
      { status: 500 },
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
}
