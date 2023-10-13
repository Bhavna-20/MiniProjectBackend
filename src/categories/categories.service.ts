import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) { }
  create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.category.create({ data: createCategoryDto });
  }

  // findAll(query: Prisma.CategoryInclude) {
  //   return this.prismaService.category.findMany({
  //     include: query,
  //     orderBy: { updatedAt: 'desc' },
  //   });
  // }

  async findAll(page?: number, perPage?: number) {
    try {
      const skip = (page - 1) * perPage;
      const take = +perPage;
      return await this.prismaService.category.findMany({
        skip: skip ? skip : undefined,
        take: take ? take : undefined,
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Unable to retrieve categories: ${error.message}`);
    }
  }

  findOne(id: string) {
    return this.prismaService.category.findUnique({ where: { id } });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prismaService.category.update({
      data: updateCategoryDto,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.category.delete({ where: { id } });
  }
}
