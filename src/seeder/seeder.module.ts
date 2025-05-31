/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/questions/question.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedQuestions();
    await this.seedUsers();
  }

  async seedQuestions() {
    const count = await this.questionRepository.count();
    if (count > 0) return;

    const sampleQuestions = [
      {
        content: 'What is the capital of France?',
        options: [
          { label: 'A', text: 'Paris' },
          { label: 'B', text: 'London' },
          { label: 'C', text: 'Berlin' },
          { label: 'D', text: 'Rome' },
        ],
        answer: 'A',
        category: 'geography',
      },
      {
        content: 'What is 2 + 2?',
        options: [
          { label: 'A', text: '3' },
          { label: 'B', text: '4' },
          { label: 'C', text: '5' },
          { label: 'D', text: '22' },
        ],
        answer: 'B',
        category: 'math',
      },
    ];

    await this.questionRepository.save(sampleQuestions);
  }

  async seedUsers() {
    const count = await this.userRepository.count();
    if (count > 0) return;

    const sampleUsers = [
      {
        google_id: 'user_google_001',
        name: 'Alice',
        email: 'alice@example.com',
        elo: 1300,
        exp: 100,
        avatar_url: '',
      },
      {
        google_id: 'user_google_002',
        name: 'Bob',
        email: 'bob@example.com',
        elo: 1250,
        exp: 80,
        avatar_url: '',
      },
    ];

    await this.userRepository.save(sampleUsers);
  }
}
