import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks = async (userId: number) => {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  };

  getBookmarkById = async (
    userId: number,
    bookmarkId: number,
  ) => {
    const bookmark =
      this.prisma.bookmark.findFirst({
        where: {
          userId,
          id: bookmarkId,
        },
      });

    return bookmark;
  };

  createBookmark = async (
    userId: number,
    dto: CreateBookmarkDto,
  ) => {
    const bookmark = this.prisma.bookmark.create({
      data: {
        userId: userId,
        ...dto,
      },
    });

    return bookmark;
  };

  editBookmarkById = async (
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) => {
    const bookmark =
      await this.prisma.bookmark.findFirst({
        where: {
          userId,
          id: bookmarkId,
        },
      });
    if (!bookmark) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  };

  deleteBookById = async (
    userId: number,
    bookmarkId: number,
  ) => {
    const bookmark =
      await this.prisma.bookmark.findFirst({
        where: {
          userId,
          id: bookmarkId,
        },
      });
    if (!bookmark) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  };
}
