import { Schema, SchemaType } from './../../lib/validator';
import validator from 'validator';
import { phones } from './phones';

export const pageOptionsSchema = Schema.object({
  page: Schema.string().optional(),
  limit: Schema.string().optional(),
  include: Schema.string().optional(),
});

// Shared contact validator
export const contactSchema = Schema.notEmptyString().refine(
  (contact) => Object.values(phones).some((regex) => validator.matches(contact, regex)),
  {
    message: 'invalid phone number',
  },
);

// DTOs from shared schemas
export type PageOptionsDto = SchemaType<typeof pageOptionsSchema>;
