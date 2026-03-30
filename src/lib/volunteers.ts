export const VOLUNTEER_ROLES = {
  "Friday Shuttle Drivers": 2,
  "Saturday Shuttle Drivers": 3,
  "Food Service": 4,
  "Breakfast Cooks": 2,
  "Cleanup Crew": 4,
} as const;

export type VolunteerRole = keyof typeof VOLUNTEER_ROLES;
