import { z } from "zod";

export type GuideStatus = "pending" | "ready" | "failed";

const place = z.object({
  name: z.string().min(1),
  distance: z.string().min(1),
  description: z.string().min(1),
});

const essential = place.extend({
  type: z.enum(["pharmacy", "market", "hospital"]),
});

export const experienceGuideSchema = z.object({
  welcomeMessage: z.string().min(1),
  restaurants: z.array(place).min(1),
  attractions: z.array(place).min(1),
  essentials: z.array(essential).min(1),
  seasonalTips: z.string().min(1),
});

export type ExperienceGuide = z.infer<typeof experienceGuideSchema>;
