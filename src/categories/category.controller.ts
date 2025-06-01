// src/categories/category.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/common/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/common/dto/update-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  @ApiOperation({ summary: '📄 Lấy tất cả danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách tất cả danh mục' })
  getfindAll() {
    return this.categoryService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiBody({
    description: 'Tên danh mục cần tạo',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Lịch sử' },
      },
      required: ['name'],
    },
    examples: {
      default: {
        summary: 'Ví dụ tạo danh mục "Khoa học"',
        value: { name: 'Khoa học' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Danh mục đã được tạo thành công' })
  create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body.name);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục theo ID' })
  @ApiBody({
    description: 'Tên danh mục mới cần cập nhật',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Toán học nâng cao' },
      },
      required: ['name'],
    },
    examples: {
      example1: {
        summary: 'Cập nhật thành "Toán học nâng cao"',
        value: { name: 'Toán học nâng cao' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật danh mục thành công' })
  update(@Param('id') id: number, @Body() body: UpdateCategoryDto) {
    return this.categoryService.update(id, body.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: '🗑️ Xóa danh mục theo ID' })
  @ApiResponse({ status: 200, description: 'Xoá danh mục thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
