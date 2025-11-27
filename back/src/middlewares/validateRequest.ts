import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if (!result.success) {
        return res.status(400).json({
            error: 'Validation Error',
            details: result.error.issues.map((e: any) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    return next();
};
