# Coolify: PostgreSQL + MinIO para Menu Fatboy

Este documento deja la configuracion base para mover el menu fuera de Supabase y usar servicios propios en Coolify:

- PostgreSQL para datos.
- MinIO para imagenes y archivos compatibles con S3.
- Un backend/API como intermediario entre el frontend y la base de datos.

Importante: una app React/Vite en el navegador no debe conectarse directo a PostgreSQL ni debe exponer llaves secretas de MinIO. La aplicacion publica solo debe hablar con una API propia. Esa API es la que usara `DATABASE_URL` y las credenciales S3.

## Estructura recomendada en Coolify

Crear un proyecto en Coolify, por ejemplo:

```text
fatboy-menu
```

Dentro del proyecto usar estos recursos:

```text
menu-web        Aplicacion React/Vite publica
menu-api        Backend/API futuro para reemplazar llamadas directas a Supabase
menu-postgres   Base de datos PostgreSQL
menu-minio      Servicio S3 compatible para imagenes
```

Dominios sugeridos:

```text
menu.tudominio.com          Frontend publico
api.tudominio.com           Backend/API
s3.tudominio.com            Endpoint publico S3 para imagenes
minio.tudominio.com         Consola privada de MinIO
```

No exponer PostgreSQL al internet salvo para una migracion controlada. Si el backend/API y PostgreSQL estan en la misma red de Coolify, usar la URL interna.

## Opcion recomendada

En Coolify puedes crear PostgreSQL como recurso de base de datos de un click y MinIO como servicio. Coolify documenta que las bases se pueden crear como recurso propio y que, si la app esta en la misma red, puede usar la URL interna; si no esta en la misma red, necesita URL publica.

Para MinIO, usar un servicio `Docker Compose Empty` si no aparece como servicio de un click.

## Docker Compose para servicio de datos

Si prefieres crear un solo servicio definido por ti en Coolify, puedes usar este `docker-compose.yml` como punto de partida.

Reemplaza todas las contrasenas antes de desplegar.

```yaml
services:
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-fatboy_menu}
      POSTGRES_USER: ${POSTGRES_USER:-fatboy_app}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      TZ: ${TZ:-America/Tijuana}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: quay.io/minio/minio:latest
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
      MINIO_SERVER_URL: ${MINIO_SERVER_URL}
      MINIO_BROWSER_REDIRECT_URL: ${MINIO_BROWSER_REDIRECT_URL}
      TZ: ${TZ:-America/Tijuana}
    volumes:
      - minio_data:/data
    expose:
      - "9000"
      - "9001"

  minio-init:
    image: quay.io/minio/mc:latest
    depends_on:
      - minio
    restart: "no"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
      S3_BUCKET: ${S3_BUCKET:-fatboy-menu}
    entrypoint: >
      /bin/sh -c "
      until mc alias set local http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD}; do sleep 2; done;
      mc mb -p local/$${S3_BUCKET} || true;
      mc anonymous set download local/$${S3_BUCKET} || true;
      "

volumes:
  postgres_data:
  minio_data:
```

Notas:

- `postgres_data` conserva la base de datos entre despliegues.
- `minio_data` conserva las imagenes entre despliegues.
- `minio-init` crea el bucket inicial y lo deja con lectura publica. Esto sirve para imagenes de productos/menu. Si despues subes archivos privados, usa otro bucket privado.
- Para produccion, despues de validar que todo funciona, conviene fijar versiones exactas de imagen en vez de `latest`.

## Variables del servicio en Coolify

Usar Developer View de variables de entorno en Coolify y pegar algo como esto:

```env
TZ=America/Tijuana

POSTGRES_DB=fatboy_menu
POSTGRES_USER=fatboy_app
POSTGRES_PASSWORD=CAMBIAR_PASSWORD_POSTGRES

MINIO_ROOT_USER=CAMBIAR_ADMIN_MINIO
MINIO_ROOT_PASSWORD=CAMBIAR_PASSWORD_MINIO_LARGO
MINIO_SERVER_URL=https://s3.tudominio.com
MINIO_BROWSER_REDIRECT_URL=https://minio.tudominio.com
S3_BUCKET=fatboy-menu
```

## Variables que necesitara el backend/API

Estas variables no van en el frontend. Van solamente en el backend/API.

Si el backend/API esta en la misma red del servicio:

```env
DATABASE_URL=postgresql://fatboy_app:CAMBIAR_PASSWORD_POSTGRES@postgres:5432/fatboy_menu?schema=public

S3_ENDPOINT=http://minio:9000
S3_PUBLIC_BASE_URL=https://s3.tudominio.com/fatboy-menu
S3_BUCKET=fatboy-menu
S3_REGION=us-east-1
S3_ACCESS_KEY=CAMBIAR_ADMIN_MINIO
S3_SECRET_KEY=CAMBIAR_PASSWORD_MINIO_LARGO
S3_FORCE_PATH_STYLE=true
```

Si el backend/API esta en otro recurso/red, usar las URLs internas que Coolify te muestre para PostgreSQL y MinIO, o exponerlos temporalmente con puerto publico solo para migracion.

## Variables que necesitara el frontend

El frontend no debe tener `DATABASE_URL`, `POSTGRES_PASSWORD`, `S3_SECRET_KEY` ni llaves root de MinIO.

Cuando exista el backend/API, el frontend deberia quedar asi:

```env
VITE_API_BASE_URL=https://api.tudominio.com
```

Actualmente el proyecto usa `@supabase/supabase-js` directamente en:

```text
src/integrations/supabase/client.ts
src/hooks/useProducts.ts
src/hooks/useCategories.ts
src/hooks/useOrders.ts
src/hooks/useBranches.ts
src/hooks/useReviews.ts
src/pages/Feedback.tsx
```

Para migrar correctamente, esos hooks deben dejar de llamar Supabase y pasar a llamar endpoints de la API propia.

## Tablas detectadas en el codigo actual

El codigo actual consulta o escribe estas tablas:

```text
branches
  id, name, phone

categories
  id, name, order, status

products
  id, name, price, category_id, status, description, order,
  is_promotion, short_description, image_url

orders
  id, branch_id, customer_name, customer_phone, payment_method,
  delivery_method, total, status, notes, created_at, printed_at,
  completed_at, cancelled_at

order_items
  id, order_id, product_id, name, quantity, price, notes

reviews
  id, branch, rating, comment, created_at, status, priority,
  source, device_hash
```

Antes de crear migraciones definitivas, exportar el schema real desde Supabase para no inventar tipos, constraints, indices, defaults o politicas que ya existan.

## Flujo de migracion recomendado

1. Crear `menu-postgres` y `menu-minio` en Coolify.
2. Confirmar volumen persistente en ambos servicios.
3. Crear o migrar el schema real de Supabase a PostgreSQL propio.
4. Importar datos de Supabase.
5. Subir imagenes a MinIO en el bucket `fatboy-menu`.
6. Guardar en `products.image_url` la URL publica final, por ejemplo:

```text
https://s3.tudominio.com/fatboy-menu/products/hamburguesa-clasica.webp
```

7. Crear backend/API con endpoints para productos, categorias, pedidos, sucursales y reviews.
8. Cambiar los hooks del frontend para usar `VITE_API_BASE_URL`.
9. Desactivar el cliente directo de Supabase cuando todas las rutas esten migradas.

## Reglas para imagenes

Para productos y promociones publicas:

- Bucket: `fatboy-menu`
- Lectura publica permitida.
- Escritura solamente desde backend/API o consola privada.
- Guardar en base de datos solo la URL o key del objeto, no el archivo binario.

Para uploads desde panel/admin:

- El frontend pide al backend una URL firmada o manda el archivo al backend.
- El backend sube a MinIO usando credenciales S3.
- El backend guarda `image_url` en PostgreSQL.

## Checklist en Coolify

- PostgreSQL con volumen persistente activo.
- MinIO con volumen persistente activo.
- `s3.tudominio.com` apuntando al puerto interno `9000`.
- `minio.tudominio.com` apuntando al puerto interno `9001`.
- Consola de MinIO protegida con password fuerte.
- PostgreSQL no publico, excepto si se necesita migracion temporal.
- Backups configurados para PostgreSQL.
- Backups o copia externa para volumen de MinIO.
- Variables secretas solo en backend/API.
- Variables publicas `VITE_*` solo para URLs no sensibles.

## Fuentes consultadas

- Coolify Services: https://coolify.io/docs/services/introduction
- Coolify Databases: https://coolify.io/docs/databases/
- Coolify Environment Variables: https://coolify.io/docs/knowledge-base/environment-variables
- Coolify Persistent Storage: https://coolify.io/docs/knowledge-base/persistent-storage
- Docker PostgreSQL guide: https://docs.docker.com/guides/postgresql/immediate-setup-and-data-persistence/
- MinIO container docs: https://min.io/docs/minio/container/index.html
