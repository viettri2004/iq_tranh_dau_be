import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/matches/match.entity';
import { User } from 'src/users/user.entity';
import { MatchAnswer } from 'src/match-answers/match-answer.entity';
import { SubmittedAnswer } from 'src/common/types/matches.interface';
import { Question } from 'src/questions/question.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,

    @InjectRepository(MatchAnswer)
    private readonly matchAnswerRepo: Repository<MatchAnswer>,
  ) {}

  findAll() {
    return this.matchRepo.find({ relations: ['player1', 'player2'] });
  }

  findById(id: number) {
    return this.matchRepo.findOne({
      where: { id },
      relations: ['player1', 'player2'],
    });
  }

  create(data: Partial<Match>) {
    return this.matchRepo.save(data);
  }

  update(id: number, data: Partial<Match>) {
    return this.matchRepo.update(id, data);
  }

  remove(id: number) {
    return this.matchRepo.delete(id);
  }

  async startMatch(
    player1: User,
    player2: User,
    questions: any[],
    roomId: string,
  ) {
    const match = this.matchRepo.create({
      player1,
      player2,
      questions,
      player1_score: 0,
      player2_score: 0,
      created_at: new Date(),
    });

    await this.matchRepo.save(match);

    return match;
  }

  async submitAnswers(matchId: number, userId: number, answers: any[]) {
    const match = await this.matchRepo.findOne({
      where: { id: matchId },
      relations: ['player1', 'player2'],
    });
    if (!match) throw new NotFoundException('Match not found');

    // Save answer to DB
    await this.matchAnswerRepo.save({ match, userId, answers });

    // Kiểm tra cả 2 người chơi đã nộp chưa

    const total = await this.matchAnswerRepo.count({
      where: {
        match: { id: match.id },
      },
    });

    if (total < 2) return { message: 'Waiting for opponent' };

    // Cả hai đã nộp → tính điểm
    const [p1Ans, p2Ans] = await Promise.all([
      this.matchAnswerRepo.find({
        where: { match: { id: matchId }, user: { id: match.player1.id } },
      }),
      this.matchAnswerRepo.find({
        where: { match: { id: matchId }, user: { id: match.player2.id } },
      }),
    ]);

    const p1Answers = p1Ans.map(ans => ({
      questionId: ans.question_id,
      selectedAnswer: ans.selected_answer,
      isCorrect: ans.is_correct,
    }));

    const p2Answers = p2Ans.map(ans => ({
      questionId: ans.question_id,
      selectedAnswer: ans.selected_answer,
      isCorrect: ans.is_correct,
    }));

    const allQuestions = match.questions;

    const { player1Score, player2Score } = await this.calculateScores(
      match.id,
      match.player1.id,
      match.player2.id,
      p1Answers,
      p2Answers,
      allQuestions,
    );

    const result = this.getMatchResult(player1Score, player2Score);

    match.ended_at = new Date();
    match.result = result;
    match.player1_score = player1Score;
    match.player2_score = player2Score;
    match.elo_change = 10;
    match.exp_gain = 20;
    await this.matchRepo.save(match);

    return match;
  }

  async calculateScores(
    matchId: number,
    player1Id: number,
    player2Id: number,
    player1Answers: SubmittedAnswer[],
    player2Answers: SubmittedAnswer[],
    allQuestions: Question[],
  ): Promise<{ player1Score: number; player2Score: number }> {
    const player1Score = player1Answers.filter(a => a.isCorrect).length;
    const player2Score = player2Answers.filter(a => a.isCorrect).length;

    return { player1Score, player2Score }; // ✅
  }

  private getMatchResult(
    p1Score: number,
    p2Score: number,
  ): 'win' | 'lose' | 'draw' {
    if (p1Score > p2Score) return 'win';
    if (p1Score < p2Score) return 'lose';
    return 'draw';
  }

  async getMatch(id: number): Promise<Match> {
    const match = await this.matchRepo.findOne({
      where: { id },
      relations: ['player1', 'player2'],
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  checkAnswer(
    match: Match,
    questionId: number,
    selectedOption: string,
  ): boolean {
    const question = match.questions.find((q: any) => q.id === questionId);
    if (!question) throw new Error('Câu hỏi không tồn tại trong trận đấu');

    return question.correctAnswer === selectedOption;
  }

  async recordAnswer(
    match: Match,
    user: User,
    questionId: number,
    selectedOption: string,
    isCorrect: boolean,
  ) {
    // Kiểm tra trùng (tránh người chơi trả lời 2 lần cùng câu)
    const existing = await this.matchAnswerRepo.findOne({
      where: {
        match: { id: match.id },
        user: { id: user.id },
        question_id: questionId,
      },
      relations: ['match', 'user'],
    });

    if (existing) return; // không ghi đè

    // Lưu đáp án
    const answer = this.matchAnswerRepo.create({
      match,
      user,
      question_id: questionId,
      selected_answer: selectedOption,
      is_correct: isCorrect,
    });

    await this.matchAnswerRepo.save(answer);

    // Cập nhật điểm
    if (isCorrect) {
      if (user.id === match.player1.id) {
        match.player1_score += 1;
      } else if (user.id === match.player2.id) {
        match.player2_score += 1;
      }
      await this.matchRepo.save(match);
    }
  }

  async getLiveScores(matchId: number) {
    const match = await this.matchRepo.findOne({
      where: { id: matchId },
      select: ['id', 'player1_score', 'player2_score', 'player1', 'player2'],
      relations: ['player1', 'player2'],
    });

    if (!match) throw new Error('Match not found');

    return {
      matchId: match.id,
      player1: {
        id: match.player1.id,
        score: match.player1_score,
      },
      player2: {
        id: match.player2.id,
        score: match.player2_score,
      },
    };
  }

  async countAnswers(matchId: number): Promise<number> {
    return this.matchAnswerRepo.count({
      where: { match: { id: matchId } },
    });
  }

  calculateResult(match: Match): 'win' | 'loss' | 'draw' {
    if (match.player1_score > match.player2_score) return 'win';
    if (match.player1_score < match.player2_score) return 'loss';
    return 'draw';
  }

  async saveMatch(match: Match) {
    await this.matchRepo.save(match);
  }
}
