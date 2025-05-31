import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ReportDto } from 'src/common/dto/report.dto';
import { ReportService } from 'src/reports/report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  getAll() {
    return this.reportService.findAll();
  }

  @Get('pending')
  getPending() {
    return this.reportService.findPending();
  }

  @Post()
  create(@Body() data: ReportDto) {
    return this.reportService.create(data);
  }

  @Patch(':id/review')
  review(
    @Param('id') id: number,
    @Query('status') status: 'reviewed' | 'rejected',
    @Query('note') note?: string,
  ) {
    return this.reportService.review(id, status, note);
  }
}
