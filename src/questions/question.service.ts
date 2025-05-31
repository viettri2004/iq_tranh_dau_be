import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/questions/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private readonly repo: Repository<Question>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Question>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<Question>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  getRandom(limit: number, category?: string) {
    const query = this.repo
      .createQueryBuilder('q')
      .orderBy('RAND()')
      .limit(limit);
    if (category) query.where('q.category = :category', { category });
    return query.getMany();
  }
}
