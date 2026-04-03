.PHONY: install dev build docker-up docker-down db-migrate db-seed db-studio clean

install:
	npm install

dev:
	cp -n .env.example .env 2>/dev/null || true
	turbo run dev --parallel

build:
	turbo run build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose build

docker-logs:
	docker-compose logs -f

db-migrate:
	cd apps/api && npm run db:migrate:dev

db-seed:
	cd apps/api && npm run db:seed

db-studio:
	cd apps/api && npm run db:studio

type-check:
	turbo run type-check

clean:
	rm -rf apps/api/dist apps/web/dist packages/shared/dist
	find . -name "node_modules" -maxdepth 3 -type d -exec rm -rf {} + 2>/dev/null || true

setup: install db-migrate db-seed
	@echo "✅ Setup completo! Execute 'make dev' para iniciar."
