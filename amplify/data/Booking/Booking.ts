import { a } from '@aws-amplify/backend';
import { Activity } from './Activity';
export const Booking = a
  .model({
    activity: a.enum(Object.values(Activity)),
    date: a.date(),
    pdfUrl: a.string(),
  })
  .authorization((allow) => [allow.guest()]);
