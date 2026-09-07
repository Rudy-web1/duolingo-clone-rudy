export interface UserOut {
  id: number;
  username: string;
  display_name: string;
  avatar_color: string;
  xp_total: number;
  xp_today: number;
  daily_goal_xp: number;
  streak_count: number;
  longest_streak: number;
  last_activity_date: string | null;
  hearts: number;
  max_hearts: number;
  gems: number;
}

export interface LessonBrief {
  id: number;
  order_index: number;
  xp_reward: number;
}

export interface SkillOut {
  id: number;
  title: string;
  icon: string;
  order_index: number;
  max_crowns: number;
  crowns: number;
  is_unlocked: boolean;
  is_completed: boolean;
  lessons: LessonBrief[];
}

export interface UnitOut {
  id: number;
  title: string;
  description: string;
  color_hex: string;
  order_index: number;
  skills: SkillOut[];
}

export interface CourseOut {
  id: number;
  name: string;
  language_code: string;
  flag_emoji: string;
  units: UnitOut[];
}

export interface PathResponse {
  course: CourseOut;
  user: UserOut;
}

export type ExerciseType = "multiple_choice" | "translate" | "match_pairs" | "fill_blank" | "type_answer";

export interface ExerciseOut {
  id: number;
  order_index: number;
  type: ExerciseType;
  prompt: string;
  data: any;
}

export interface LessonDetail {
  id: number;
  skill_id: number;
  skill_title: string;
  order_index: number;
  xp_reward: number;
  exercises: ExerciseOut[];
}

export interface AnswerResult {
  correct: boolean;
  correct_answer: any;
  hearts_remaining: number;
}

export interface LessonCompleteResponse {
  xp_earned: number;
  xp_total: number;
  streak_count: number;
  crowns: number;
  is_skill_completed: boolean;
  newly_unlocked_skill_ids: number[];
  leveled_up_achievement: string | null;
}

export interface HeartsRefillResponse {
  hearts: number;
  gems: number;
  message: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  display_name: string;
  avatar_color: string;
  xp_total: number;
  is_current_user: boolean;
}

export interface AchievementOut {
  code: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at: string | null;
}

export interface ProfileResponse {
  user: UserOut;
  total_lessons_completed: number;
  skills_completed: number;
  achievements: AchievementOut[];
}
