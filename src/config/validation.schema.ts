import { z } from 'zod';

export const validationSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    // MONGODB_URI: z.string().min(1),
    MONGODB_URI: z
      .string()
      .min(1, 'MONGODB_URI is required')
      .refine(
        (uri) => /^mongodb(\+srv)?:\/\//.test(uri),
        'Invalid MongoDB URI',
      ),
    JWT_SECRET: z.string().min(32).optional(),
  })
  .refine(
    (config) => config.NODE_ENV !== 'production' || Boolean(config.JWT_SECRET),
    'JWT_SECRET is required in production',
  );

// export function validate(config: Record<string, unknown>) {
//   const result = validationSchema.safeParse(config);

//   if (!result.success) {
//     throw new Error(result.error.message);
//   }

//   return result.data;
// }
