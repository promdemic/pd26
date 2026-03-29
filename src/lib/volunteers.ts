export const VOLUNTEER_ROLES = {
  "Ferry Chaperones": 2,
  "Shuttle Drivers": 4,
  "Food Service": 4,
  "Breakfast Cooks": 2,
  "Cleanup Crew": 4,
} as const;

export type VolunteerRole = keyof typeof VOLUNTEER_ROLES;
