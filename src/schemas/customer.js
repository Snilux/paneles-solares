import { z } from "zod";

const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/,
      "El nombre solo debe contener letras y espacios"
    ),

  email: z.string().trim().email("El correo electrónico no es válido"),

  phone: z
    .string()
    .trim()
    .regex(
      /^[0-9+\-()\s]{7,20}$/,
      "El teléfono debe tener entre 7 y 20 caracteres y solo números, espacios o símbolos (+, -, () )"
    ),

  address: z
    .string()
    .trim()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(200, "La dirección no puede tener más de 200 caracteres")
    .regex(
      /^[\w\s\.,#\-ºª<>]+$/,
      "La dirección contiene caracteres no válidos"
    ),
});

const validateCostumerSchema = (data) => {
  return customerSchema.safeParse(data);
};

const emailSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/,
      "El nombre solo debe contener letras y espacios"
    ),

  email: z.string().trim().email("El correo electrónico no es válido"),

  phone: z
    .string()
    .trim()
    .regex(
      /^[0-9+\-()\s]{7,20}$/,
      "El teléfono debe tener entre 7 y 20 caracteres y solo números, espacios o símbolos (+, -, () )"
    ),

  message: z
    .string()
    .trim()
    .min(7, "El mensaje debe tener al menos 7 caracteres")
    .max(200, "El mensaje no puede tener más de 200 caracteres")
    .regex(/^[\w\s\.,#\-ºª<>]+$/, "El mensaje contiene caracteres no válidos"),
});

const validateEmailSchema = (data) => {
  return emailSchema.safeParse(data);
};

export { validateCostumerSchema, validateEmailSchema };
