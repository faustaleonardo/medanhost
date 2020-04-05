import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../model/bookmark.entity';
import { CreateBookmarkDto } from '../dto/bookmarks.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) private readonly repo: Repository<Bookmark>,
    private readonly usersServ: UsersService,
    private readonly roomsServ: RoomsService,
  ) {}

  async create(bookmark: CreateBookmarkDto): Promise<Bookmark> {
    const { userId, roomId } = bookmark;

    const newBookmark = new Bookmark();

    const user = await this.usersServ.findOne(userId);
    // newBookmark.user = user;

    return await this.repo.save(newBookmark);
  }

  async findAll(): Promise<Bookmark[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Bookmark> {
    const bookmark = await this.repo.findOne(id);
    if (!bookmark) throw new NotFoundException();

    return bookmark;
  }

  async delete(id: number): Promise<void> {
    const bookmark = await this.repo.findOne(id);
    if (!bookmark) throw new NotFoundException();

    this.repo.remove(bookmark);
  }
}
