// src/modules/report/report.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/reports/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  findAll() {
    return this.reportRepository.find({
      relations: ['user', 'question'],
      order: { created_at: 'DESC' },
    });
  }

  findPending() {
    return this.reportRepository.find({
      where: { status: 'pending' },
      relations: ['user', 'question'],
    });
  }

  create(data: Partial<Report>) {
    return this.reportRepository.save(data);
  }

  review(id: number, status: 'reviewed' | 'rejected', note?: string) {
    return this.reportRepository.update(id, {
      status,
      reviewer_note: note,
      reviewed_at: new Date(),
    });
  }
}
