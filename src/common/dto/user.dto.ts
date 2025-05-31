import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/user.entity';

@Exclude()
export class UserDto {
  @Expose()
  id!: number;

  @Exclude()
  google_id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  avatar_url!: string;

  @Expose()
  exp!: number;

  @Expose()
  wins!: number;

  @Exclude()
  losses!: number;

  @Exclude()
  password_hash!: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  // 🧠 Win Rate %
  @Expose()
  get winRate(): number {
    const total = this.wins + this.losses;
    if (total === 0) return 0.0;
    return parseFloat(((this.wins / total) * 100).toFixed(1));
  }

  // 🏅 Rank Name
  @Expose()
  get rank(): string {
    if (this.wins >= 50) return 'Master';
    if (this.wins >= 35) return 'Diamond';
    if (this.wins >= 20) return 'Platinum';
    if (this.wins >= 10) return 'Gold';
    if (this.wins >= 5) return 'Silver';
    return 'Bronze';
  }

  // 🧮 Rank Point %
  @Expose()
  get rankPoint(): number {
    if (this.wins >= 50) return 100;

    let currentTierMin = 0;
    let nextTierMax = 5;

    if (this.wins >= 35) {
      currentTierMin = 35;
      nextTierMax = 50;
    } else if (this.wins >= 20) {
      currentTierMin = 20;
      nextTierMax = 35;
    } else if (this.wins >= 10) {
      currentTierMin = 10;
      nextTierMax = 20;
    } else if (this.wins >= 5) {
      currentTierMin = 5;
      nextTierMax = 10;
    }

    return Math.floor(
      ((this.wins - currentTierMin) / (nextTierMax - currentTierMin)) * 100,
    );
  }

  // 🆙 Level calculation
  // Dùng cấp số nhân tăng dần theo EXP

  @Expose()
  get level(): number {
    let level = 1;
    let threshold = 100;

    while (this.exp >= threshold) {
      level++;
      threshold += level * 100;
    }

    return level;
  }

  // 📊 Progress toward next level
  @Expose()
  get levelProgress(): {
    currentExp: number;
    nextLevelExp: number;
    percent: number;
  } {
    let level = 1;
    let threshold = 100;

    while (this.exp >= threshold) {
      level++;
      threshold += level * 100;
    }

    const prevThreshold = threshold - level * 100;
    const currentExp = this.exp - prevThreshold;
    const nextLevelExp = threshold - prevThreshold;

    return {
      currentExp,
      nextLevelExp,
      percent: parseFloat(((currentExp / nextLevelExp) * 100).toFixed(1)),
    };
  }
}
