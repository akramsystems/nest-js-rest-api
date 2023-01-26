import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // starting logic
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  // ending logic
  afterAll(async () => {
    await app.close();
  });

  // test cases
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@email.com',
      password: 'abc123',
    };
    describe('Signup', () => {
      it('should throw if email empty', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password empty', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body', async () => {
        await pactum.spec().post('/auth/signup').withBody({}).expectStatus(400);
      });
      it('should signup', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email empty', async () => {
        await pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password empty', async () => {
        await pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body', async () => {
        await pactum.spec().post('/auth/signin').withBody({}).expectStatus(400);
      });
      it('should signin', async () => {
        await pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token'); // stores the access_token in userAt
      });
    });

    describe('User', () => {
      describe('Get Me', () => {
        it('should get current user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .inspect();
        });
      });
      describe('Edit User', () => {
        it('should edit user', () => {
          const dto: EditUserDto = {
            email: 'test@email.com',
            firstName: 'John',
            lastName: 'Doe',
          };
          return pactum
            .spec()
            .patch('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.lastName)
            .inspect();
        });
      });
    });

    describe('Bookmark', () => {
      describe('Get Empty Bookmarks', () => {
        it('Should Get Bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBody([])
            .inspect();
        });
      });
      describe('Create Bookmarks', () => {
        const dto: EditBookmarkDto = {
          title: 'First Bookmark',
          link: 'https://test.com',
          description: 'test description',
        };
        it('Should Create Bookmark', () => {
          return pactum
            .spec()
            .post('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(201)
            .stores('bookmarkId', 'id')
            .inspect();
        });
      });
      describe('Get Bookmarks', () => {
        it('Should Get Bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(1)
            .inspect();
        });
      });
      describe('Get Bookmark by Id', () => {
        it('Should Get Bookmark by Id', () => {
          return pactum
            .spec()
            .get('/bookmarks/{id}')
            .withPathParams({
              id: '$S{bookmarkId}',
            })
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBodyContains('$S{bookmarkId}');
        });
      });
      describe('Edit Bookmark', () => {
        const dto: EditBookmarkDto = {
          title: 'New Title',
        };

        it('Edit Get Bookmark by Id', () => {
          return pactum
            .spec()
            .patch('/bookmarks/{id}')
            .withPathParams({
              id: '$S{bookmarkId}',
            })
            .withBody(dto)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBodyContains(dto.title);
        });
      });
      describe('Delete Bookmark', () => {
        it('Should Delete a Bookmark', () => {
          return pactum
            .spec()
            .delete('/bookmarks/{id}')
            .withPathParams({
              id: '$S{bookmarkId}',
            })
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(204)
            .expectBody('')
            .inspect();
        });
        it('should get empyt bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(0);
        });
      });
    });
  });
});
