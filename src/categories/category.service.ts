// src/categories/category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(name: string) {
    const category = this.categoryRepo.create({ name });
    return await this.categoryRepo.save(category);
  }

  async update(id: number, name: string) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');

    category.name = name;
    return this.categoryRepo.save(category);
  }

  async delete(id: number) {
    const result = await this.categoryRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Category not found');
    return { message: 'Category deleted successfully' };
  }

  findAll() {
    return this.categoryRepo.find();
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryRepo.findOne({ where: { name } });
  }
}
