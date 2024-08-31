import { a } from '@aws-amplify/backend';
export const Customer = a
  .model({
    name: a.string(),
    surname: a.string(),
    dni: a.string(),
    bookingId: a.id(),
    booking: a.belongsTo('Booking', 'bookingId'),
  })
  .authorization((allow) => [allow.guest()]);
