# Plan de Autenticacion, Clientes, Roles y Puntos

## Objetivo

Implementar un sistema completo para que los clientes del menu puedan registrarse, iniciar sesion, consultar su panel personal, acumular puntos y ser administrados por usuarios con rol de administrador.

El sistema debe respetar la arquitectura de Fatboy POS:

- El backend es la unica fuente de verdad.
- El frontend solo presenta datos y ejecuta acciones autorizadas.
- La logica de puntos, permisos, bloqueos y pedidos debe vivir en el backend.
- No se debe duplicar logica existente de clientes, usuarios, roles o loyalty.

## Alcance

Este plan cubre:

- Registro de clientes.
- Inicio de sesion.
- Roles de usuario.
- Panel de cliente.
- Generacion y consulta de puntos.
- Panel administrador para gestionar usuarios.
- Edicion de informacion de usuarios/clientes.
- Ajuste manual de puntos.
- Bloqueo y desbloqueo de usuarios.
- Seguridad, auditoria y pruebas.

No debe implementarse como un sistema aislado. Debe integrarse con el backend real del POS y reutilizar los modelos existentes cuando sea posible.

## Principios Tecnicos

1. El backend es la unica fuente de verdad.
2. No calcular puntos en el frontend.
3. No decidir permisos solo desde React.
4. No duplicar modelos si ya existen `Customer`, `User`, `LoyaltyAccount` o equivalentes.
5. Mantener separacion entre UI, negocio, datos e infraestructura.
6. Toda accion administrativa sensible debe quedar registrada.
7. Un usuario bloqueado no debe poder iniciar sesion ni operar desde el menu.
8. El sistema debe ser compatible con uso tactil y operacion rapida.

## Fase 1: Auditoria Inicial

Antes de crear codigo nuevo, revisar si ya existen:

- Modelo de usuarios.
- Modelo de clientes.
- Modelo de roles.
- Sistema de autenticacion.
- JWT o sesiones.
- Guards de NestJS.
- Modulo de loyalty o puntos.
- Endpoints de clientes.
- Endpoints administrativos.
- Pantallas existentes de clientes o usuarios.

Archivos o areas probables a revisar:

- `backend/prisma/schema.prisma`
- `backend/src/auth`
- `backend/src/users`
- `backend/src/customers`
- `backend/src/loyalty`
- `backend/src/orders`
- `src/api`
- `src/pages`
- `src/components`
- `src/routes`

Resultado esperado de esta fase:

- Saber que modelos ya existen.
- Saber que endpoints se pueden reutilizar.
- Saber que falta crear.
- Evitar duplicar clientes, usuarios o logica de puntos.

## Fase 2: Modelo de Datos

### Roles Necesarios

Roles minimos:

- `CUSTOMER`: cliente del menu.
- `ADMIN`: administrador que gestiona clientes y usuarios.

Roles opcionales para crecimiento:

- `SUPER_ADMIN`: control total.
- `MANAGER`: gestion operativa sin control total.
- `CASHIER`: usuario de caja si se comparte autenticacion con POS.

### Usuario

Campos recomendados:

- `id`
- `name`
- `email`
- `phone`
- `passwordHash`
- `role`
- `status`
- `customerId`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

Estados recomendados:

- `ACTIVE`
- `BLOCKED`
- `INACTIVE`

### Cliente

Si ya existe `Customer`, reutilizarlo. El usuario del menu debe relacionarse con ese cliente.

Campos importantes:

- `id`
- `name`
- `phone`
- `email`
- `addresses`
- `loyaltyAccount`
- `orders`

### Cuenta de Puntos

Si ya existe `LoyaltyAccount`, reutilizarla.

Campos recomendados:

- `id`
- `customerId`
- `points`
- `createdAt`
- `updatedAt`

### Transacciones de Puntos

Cada movimiento de puntos debe quedar registrado.

Campos recomendados:

- `id`
- `customerId`
- `userId`
- `type`
- `points`
- `balanceBefore`
- `balanceAfter`
- `reason`
- `orderId`
- `createdByAdminId`
- `createdAt`

Tipos recomendados:

- `EARNED`
- `REDEEMED`
- `ADJUSTED_ADD`
- `ADJUSTED_REMOVE`
- `ADJUSTED_SET`
- `REVERSED`

## Fase 3: Backend de Autenticacion

Crear o reutilizar endpoints:

```txt
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
```

### Registro

El registro debe:

1. Validar nombre, telefono, email si aplica y password.
2. Verificar que no exista otro usuario con el mismo telefono o email.
3. Crear o vincular un `Customer`.
4. Crear el `User` con rol `CUSTOMER`.
5. Crear cuenta de puntos si no existe.
6. Devolver sesion/token.

### Inicio de Sesion

El login debe:

1. Buscar usuario por telefono o email.
2. Validar password con hash.
3. Rechazar usuarios bloqueados.
4. Generar token o sesion.
5. Actualizar `lastLoginAt`.
6. Devolver datos basicos del usuario y rol.

### Sesion Actual

`GET /auth/me` debe devolver:

- id de usuario
- nombre
- rol
- estado
- cliente relacionado
- permisos basicos

No debe devolver password hash ni datos sensibles.

## Fase 4: Permisos y Seguridad

Implementar o reutilizar:

- `JwtAuthGuard`
- `RolesGuard`
- decorador `@Roles()`
- validacion con DTOs
- hash de password
- sanitizacion de respuestas

Reglas:

- `CUSTOMER` solo puede consultar su propia informacion.
- `CUSTOMER` no puede editar puntos directamente.
- `CUSTOMER` no puede ver otros usuarios.
- `ADMIN` puede gestionar usuarios/clientes.
- `ADMIN` puede ajustar puntos con motivo obligatorio.
- Usuario bloqueado no puede iniciar sesion.
- Si un usuario ya tiene token y luego es bloqueado, el backend debe impedir operaciones sensibles.

## Fase 5: Backend de Panel de Cliente

Crear o reutilizar endpoints:

```txt
GET /customers/me
PATCH /customers/me
GET /customers/me/orders
GET /customers/me/loyalty
GET /customers/me/loyalty/transactions
GET /customers/me/addresses
POST /customers/me/addresses
PATCH /customers/me/addresses/:id
DELETE /customers/me/addresses/:id
```

### Panel del Cliente

Debe mostrar:

- Datos personales.
- Puntos disponibles.
- Historial de puntos.
- Pedidos anteriores.
- Direcciones guardadas si aplica.
- Recompensas o productos canjeables si existen.

El frontend no debe calcular el saldo. Debe mostrar el saldo devuelto por backend.

## Fase 6: Generacion de Puntos

La generacion de puntos debe ocurrir en backend cuando:

- Una orden se paga.
- Una orden se confirma segun la regla del negocio.
- Una venta queda finalizada.

No debe ocurrir solamente al crear la orden si todavia puede cancelarse.

Reglas a definir:

- Cuantos pesos equivalen a 1 punto.
- Si todos los productos generan puntos.
- Si promociones generan puntos.
- Si impuestos cuentan o no cuentan.
- Si delivery cuenta o no cuenta.
- Si propinas cuentan o no cuentan.
- Si productos canjeados generan puntos.

Ejemplo de configuracion:

```txt
Por cada 10 pesos pagados = 1 punto
No generar puntos sobre productos canjeados
No generar puntos si la orden fue cancelada
```

### Reversiones

Si una orden se cancela o se reembolsa:

1. Revisar si genero puntos.
2. Crear transaccion `REVERSED`.
3. Restar los puntos generados.
4. Mantener historial completo.

## Fase 7: Backend Administrativo

Crear modulo administrativo protegido por rol `ADMIN`.

Endpoints recomendados:

```txt
GET /admin/users
GET /admin/users/:id
PATCH /admin/users/:id
PATCH /admin/users/:id/block
PATCH /admin/users/:id/unblock
POST /admin/users/:id/reset-password
GET /admin/users/:id/orders
GET /admin/users/:id/loyalty
GET /admin/users/:id/loyalty/transactions
POST /admin/users/:id/loyalty/adjust
```

### Lista de Usuarios

Debe permitir:

- Buscar por nombre.
- Buscar por telefono.
- Buscar por email.
- Filtrar por rol.
- Filtrar por estado.
- Ver puntos actuales.
- Ver fecha de registro.
- Ver ultimo acceso.

### Detalle de Usuario

Debe mostrar:

- Informacion personal.
- Estado.
- Rol.
- Cliente relacionado.
- Puntos actuales.
- Historial de puntos.
- Historial de pedidos.
- Direcciones si aplica.
- Acciones administrativas.

### Ajuste Manual de Puntos

Operaciones:

- Agregar puntos.
- Quitar puntos.
- Establecer saldo exacto.

Campos requeridos:

- tipo de ajuste
- cantidad
- motivo
- administrador que ejecuta el cambio

El backend debe guardar:

- saldo anterior
- saldo nuevo
- motivo
- admin responsable
- fecha

## Fase 8: Frontend del Cliente

Pantallas necesarias:

- Login.
- Registro.
- Mi cuenta.
- Mis puntos.
- Historial de puntos.
- Mis pedidos.
- Mis direcciones si aplica.

### Reglas de UI

- Formularios compactos.
- Botones claros y tactiles.
- Estados de carga visibles.
- Errores claros.
- Sin scroll innecesario.
- Sin componentes gigantes.
- Mantener el menu rapido.

### Estado de Sesion

El frontend debe manejar:

- token o sesion
- usuario actual
- rol
- expiracion
- cierre de sesion
- redireccion si no esta autenticado

No debe manejar:

- calculo de permisos sensibles
- calculo de puntos
- autorizacion real

Eso corresponde al backend.

## Fase 9: Frontend Administrativo

Pantallas necesarias:

- Admin: Usuarios.
- Admin: Detalle de usuario.
- Admin: Editar informacion.
- Admin: Ajustar puntos.
- Admin: Bloquear/desbloquear.

### Vista de Usuarios

Debe ser una lista profesional y compacta:

- Buscador.
- Filtros.
- Estado del usuario.
- Rol.
- Puntos.
- Acciones rapidas.

Acciones:

- Ver detalle.
- Editar.
- Bloquear.
- Desbloquear.
- Ajustar puntos.

### Modal de Ajuste de Puntos

Debe incluir:

- saldo actual
- tipo de ajuste
- cantidad
- motivo obligatorio
- confirmacion clara

Despues de guardar:

- invalidar cache/lista
- refrescar detalle
- mostrar confirmacion

## Fase 10: Integracion con Pedidos del Menu

Cuando un cliente autenticado haga un pedido:

1. El frontend envia el pedido con la sesion activa.
2. El backend identifica el `customerId`.
3. La orden queda asociada al cliente.
4. El backend calcula puntos cuando corresponda.
5. El cliente puede ver el pedido en su historial.

El frontend no debe permitir cambiar `customerId` manualmente desde el cliente.

## Fase 11: Auditoria

Registrar eventos importantes:

- Registro de usuario.
- Login exitoso.
- Login fallido si se desea.
- Usuario bloqueado.
- Usuario desbloqueado.
- Cambio de rol.
- Edicion administrativa.
- Ajuste manual de puntos.
- Reset de password.

Campos recomendados:

- accion
- usuario afectado
- administrador responsable
- fecha
- datos anteriores si aplica
- datos nuevos si aplica
- motivo si aplica

## Fase 12: Pruebas

### Pruebas Backend

Casos minimos:

- Registrar cliente nuevo.
- Evitar registro duplicado.
- Iniciar sesion correctamente.
- Rechazar password incorrecto.
- Rechazar usuario bloqueado.
- Cliente consulta solo sus datos.
- Cliente no puede consultar datos de otro cliente.
- Admin consulta usuarios.
- Admin bloquea usuario.
- Admin desbloquea usuario.
- Admin ajusta puntos.
- Ajuste de puntos crea historial.
- Orden pagada genera puntos.
- Orden cancelada no genera puntos o revierte puntos.

### Pruebas Frontend

Casos minimos:

- Login correcto.
- Registro correcto.
- Error visible en login fallido.
- Panel muestra puntos reales.
- Historial carga correctamente.
- Admin lista usuarios.
- Admin edita datos.
- Admin bloquea usuario.
- Admin ajusta puntos.
- Usuario bloqueado no puede entrar.

### Pruebas Manuales de Flujo Completo

1. Registrar cliente desde el menu.
2. Iniciar sesion.
3. Crear pedido.
4. Confirmar/pagar pedido.
5. Ver puntos generados.
6. Entrar como admin.
7. Buscar cliente.
8. Ajustar puntos.
9. Bloquear cliente.
10. Intentar login con cliente bloqueado.
11. Desbloquear cliente.
12. Verificar que puede iniciar sesion otra vez.

## Orden Recomendado de Implementacion

1. Auditar modelos y endpoints existentes.
2. Definir roles y permisos.
3. Ajustar Prisma si faltan campos o relaciones.
4. Crear migracion de base de datos.
5. Implementar autenticacion.
6. Implementar guards y roles.
7. Vincular usuario con cliente.
8. Implementar endpoints `me` del cliente.
9. Implementar consulta de puntos.
10. Implementar panel de cliente.
11. Implementar endpoints administrativos.
12. Implementar lista administrativa de usuarios.
13. Implementar detalle administrativo de usuario.
14. Implementar bloqueo/desbloqueo.
15. Implementar ajuste manual de puntos.
16. Integrar generacion de puntos con pedidos.
17. Agregar auditoria.
18. Agregar pruebas backend.
19. Agregar pruebas frontend.
20. Probar flujo completo.

## Checklist de Entrega

- [ ] Cliente puede registrarse.
- [ ] Cliente puede iniciar sesion.
- [ ] Cliente puede cerrar sesion.
- [ ] Cliente puede ver su perfil.
- [ ] Cliente puede ver sus puntos.
- [ ] Cliente puede ver historial de puntos.
- [ ] Cliente puede ver pedidos anteriores.
- [ ] Pedido queda asociado al cliente autenticado.
- [ ] Backend genera puntos.
- [ ] Backend revierte puntos cuando aplique.
- [ ] Admin puede ver usuarios.
- [ ] Admin puede buscar usuarios.
- [ ] Admin puede editar informacion.
- [ ] Admin puede bloquear usuarios.
- [ ] Admin puede desbloquear usuarios.
- [ ] Admin puede ajustar puntos.
- [ ] Ajustes de puntos quedan auditados.
- [ ] Usuario bloqueado no puede iniciar sesion.
- [ ] Cliente no puede ver datos de otros clientes.
- [ ] Frontend no duplica logica de negocio.
- [ ] Pruebas principales pasan.

## Riesgos a Cuidar

- Duplicar `User` y `Customer` sin necesidad.
- Calcular puntos en frontend.
- Permitir que el cliente modifique su propio saldo.
- Bloquear visualmente en frontend pero no en backend.
- Generar puntos antes de que la venta sea valida.
- No revertir puntos en cancelaciones.
- Crear pantallas administrativas demasiado grandes o lentas.
- Romper el flujo existente del POS.

## Resultado Esperado

Al terminar, el menu tendra:

- Clientes con cuenta propia.
- Inicio de sesion seguro.
- Panel personal de cliente.
- Sistema de puntos conectado al backend.
- Roles claros.
- Administrador con control de usuarios.
- Bloqueo/desbloqueo de cuentas.
- Ajuste manual de puntos con historial.
- Integracion real con pedidos y clientes del POS.

