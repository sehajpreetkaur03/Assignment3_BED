export const successResponse = <T>(
  data: T,
  message = "Success"
): { message: string; data: T } => {
  return { message, data };
};