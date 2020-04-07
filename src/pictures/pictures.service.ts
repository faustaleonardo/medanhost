import {
  Req,
  Res,
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from '../model/picture.entity';
import { RoomsService } from '../rooms/rooms.service';
import { getConnection } from 'typeorm';

const s3Config = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture) private readonly repo: Repository<Picture>,
    private readonly roomsService: RoomsService,
  ) {}

  _upload = multer({
    storage: multerS3({
      s3: s3Config,
      bucket: process.env.S3_BUCKET,
      acl: 'public-read',
      key(req: string, file: any, cb: Function) {
        cb(null, `${new Date().getTime()}-${file.originalname}`);
      },
    }),
  }).array('images');

  async create(
    roomId: number,
    @Req() req: any,
    @Res() res: any,
  ): Promise<Picture[]> {
    const createPicturePromise = (): Promise<Picture[]> => {
      return new Promise((resolve, reject) => {
        this._upload(req, res, async (error: any) => {
          if (error) reject(error);

          const data = [];
          const room = await this.roomsService.findOne(roomId);
          const paths = req.files.map(
            (file: { location: string }) => file.location,
          );
          for (const path of paths) {
            data.push({ path, room });
          }

          await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Picture)
            .values(data)
            .execute();

          const pictures = await this.repo.find({ room });
          resolve(pictures);
        });
      });
    };

    try {
      const pictures = await createPicturePromise();
      console.log(pictures);
      return res.status(200).json({ pictures });
    } catch (err) {
      console.log(err);
      new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Picture[]> {
    return await this.repo.find({ relations: ['room'] });
  }

  async findOne(id: number): Promise<Picture> {
    const picture = await this.repo.findOne(id, { relations: ['room'] });
    if (!picture) throw new NotFoundException();

    return picture;
  }

  async delete(id: number): Promise<void> {
    const picture = await this.repo.findOne(id);
    if (!picture) throw new NotFoundException();

    // DELETING IMAGE - PENDING
    this.repo.delete(picture);
  }
}
