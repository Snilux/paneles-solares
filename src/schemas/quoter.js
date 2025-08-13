import { z } from "zod";

const calculateQuoteSchema = z.object({
  rates: z.string().min(1, "La tarifa es requerida"),
  threads: z.number().min(1, "Debe seleccionar al menos un hilo"),
  distance: z.number().min(0, "La distancia debe ser un número positivo"),
  average: z.number().min(0, "El promedio debe ser un número positivo"),
});

const validateQuoteSchema = (data) => {
  return calculateQuoteSchema.safeParse(data);
};

export { validateQuoteSchema };
