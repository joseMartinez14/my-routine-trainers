export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    clients: '/dashboard/clients',
    exercises: '/dashboard/exercises',
    routines: '/dashboard/routines',
    profile: '/dashboard/profile',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
