import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Me } from '../auth/guards/me.guard';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { isEmpty } from '../util';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Me() { id }, @Body() createPostDto: CreatePostDto) {
    const categories = createPostDto.categories?.map((category) => ({
      id: category,
    }));
    return this.postsService.create({
      ...createPostDto,
      author: { connect: { id } },
      categories: { connect: categories },
    });
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('categoryId') categoryId: string,
  ) {
    return this.postsService.findAll(
      isEmpty(userId) ? null : userId,
      isEmpty(categoryId) ? null : categoryId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const categories = updatePostDto.categories?.map((category) => ({
      id: category,
    }));
    return this.postsService.update(id, {
      ...updatePostDto,
      categories: { set: categories },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
