import { a } from '@aws-amplify/backend';
export const Customer = a
  .model({
    name: a.string(),
    surname: a.string(),
    dni: a.string(),
  })
  .authorization((allow) => [allow.guest()]);
