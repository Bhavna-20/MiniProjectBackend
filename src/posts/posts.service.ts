import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}
  async create(createPostDto: Prisma.PostCreateInput) {
    try {
      return await this.prismaService.post.create({
        data: createPostDto,
      });
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async findAll(page?: number, perPage?: number) {
    try {
      const skip = (page - 1) * perPage;
      const take = +perPage;
      return await this.prismaService.post.findMany({
        skip: skip ? skip : undefined,
        take: take ? take : undefined,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          body: true,
          author: true,
          categories: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.post.findUnique({
        where: { id },
        include: {
          author: true,
          categories: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch post with ID ${id}: ${error.message}`);
    }
  }

  async update(id: string, updatePostDto: Prisma.PostUpdateInput) {
    try {
      return this.prismaService.post.update({
        data: updatePostDto,
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to update post with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      return this.prismaService.post.delete({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to delete post with ID ${id}: ${error.message}`);
    }
  }
}
