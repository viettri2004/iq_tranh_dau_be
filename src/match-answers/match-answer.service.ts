import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchAnswer } from 'src/match-answers/match-answer.entity';
import { Match } from 'src/matches/match.entity';
import { User } from 'src/users/user.entity';
import { CreateMatchAnswerDto } from 'src/common/dto/create-match-answer.dto';

@Injectable()
export class MatchAnswerService {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(MatchAnswer)
    private readonly answerRepo: Repository<MatchAnswer>,
  ) {}

  async create(data: CreateMatchAnswerDto) {
    const match = await this.matchRepo.findOneBy({ id: data.matchId });
    const user = await this.userRepo.findOneBy({ id: data.userId });

    if (!match || !user) throw new Error('Match or User not found');

    const existing = await this.answerRepo.findOne({
      where: {
        match: { id: data.matchId },
        user: { id: data.userId },
        question_id: data.questionId,
      },
      relations: ['match', 'user'],
    });

    if (existing) {
      throw new ConflictException(
        'Answer already exists for this question in this match by this user',
      );
    }

    const answer = this.answerRepo.create({
      match,
      user,
      question_id: data.questionId,
      selected_answer: data.selectedOption,
      is_correct: data.isCorrect,
    });

    return this.answerRepo.save(answer);
  }

  async findByMatch(matchId: number) {
    return this.answerRepo.find({ where: { match: { id: matchId } } });
  }

  async findByUserInMatch(matchId: number, userId: number) {
    return this.answerRepo.find({
      where: { match: { id: matchId }, user: { id: userId } },
    });
  }
}
