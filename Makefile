
development: db.start app.start.dev
	
# app commands
app.start:
	npm run start
app.start.dev:
	npm run start:dev
app.build:
	npm run build
app.test:
	npm run test
# database commands
db.start:
	echo "Starting Postgres"
	docker-compose up -d
db.stop:
	echo "Stopping Postgres"
	docker-compose down
db.restart:
	echo "Restarting Postgres"
	docker-compose restart
# Prisma Commands for schema.prisma
prisma.studio:
	echo "Starting Prisma Studio"
	npx prisma studio

prisma.update:
	echo "Updating Prisma"
	npx prisma generate

prisma.migrate:
	echo "Migrating Prisma"
	npx prisma migrate dev