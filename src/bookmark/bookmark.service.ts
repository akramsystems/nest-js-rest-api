import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  createBookmark(userId: number, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get bookmark by id

    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    // check if bookmark belongs to user

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this bookmark');
    }

    // update bookmark
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // get bookmark by id

    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    // check if bookmark belongs to user
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this bookmark');
    }

    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
