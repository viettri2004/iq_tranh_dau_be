export interface IUser {
  id: number;
  google_id: string;
  name: string;
  email: string;
  avatar_url: string;
  elo: number;
  exp: number;
  total_matches: number;
  wins: number;
  losses: number;
  created_at: Date;
}
