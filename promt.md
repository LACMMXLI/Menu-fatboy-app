Adapta el proyecto actual del menú web para agregar recepción de pedidos por sucursal en un panel administrativo interno.

Contexto:
El proyecto ya tiene menú web, productos, sucursales y despliegue conectado. No rehagas el menú desde cero. Usa la estructura existente del proyecto.

Objetivo:
Cuando un cliente haga un pedido desde el menú web, el pedido debe guardarse en la base de datos y aparecer en tiempo real en el panel correspondiente a la sucursal seleccionada.

Sucursales:

* Venecia
* San Marcos

Flujo cliente:

* El cliente NO inicia sesión.
* El cliente selecciona sucursal o usa la sucursal que ya maneje el menú actual.
* Agrega productos al carrito.
* Confirma pedido.
* El pedido se guarda en la base de datos.
* El cliente no necesita ver seguimiento del pedido.
* El cliente no necesita saber si el pedido fue finalizado, impreso o atendido.

Flujo negocio:
Crear o adaptar panel administrativo interno para pedidos:

/admin/pedidos/venecia
/admin/pedidos/san-marcos

Cada panel debe:

* Mostrar solo pedidos de su sucursal.
* Recibir pedidos nuevos en tiempo real.
* Mostrar una notificación visual y sonora cuando llegue un pedido nuevo.
* Mostrar pedidos como tarjetas grandes y claras.
* Permitir imprimir el pedido en el negocio.
* Permitir marcar el pedido como finalizado.
* Permitir cancelar pedido si es necesario.
* Separar pedidos activos de pedidos finalizados.

Estados mínimos del pedido:

* nuevo
* impreso
* finalizado
* cancelado

Reglas:

* Un pedido nuevo entra como “nuevo”.
* Al imprimir, puede cambiar a “impreso”.
* Al finalizar, cambia a “finalizado”.
* Los pedidos finalizados ya no deben mostrarse como activos.
* El cliente no debe recibir actualización de estado.
* El estado es solo para operación interna.

Datos mínimos del pedido:

* id
* sucursal / branch_id
* nombre del cliente
* teléfono si existe
* productos
* cantidades
* modificadores o notas si existen
* notas generales
* total
* método de entrega si ya existe
* fecha y hora
* estado
* impreso_en si aplica
* finalizado_en si aplica

Realtime:
Usar la integración actual con Supabase o el mecanismo existente del proyecto.
El panel de Venecia solo debe escuchar pedidos de Venecia.
El panel de San Marcos solo debe escuchar pedidos de San Marcos.
Evitar listeners duplicados o suscripciones múltiples innecesarias.

Impresión:
Agregar botón “Imprimir pedido”.
La impresión debe generar un ticket claro con:

* Nombre de sucursal
* Fecha y hora
* Número de pedido
* Nombre cliente
* Teléfono si existe
* Lista de productos
* Cantidades
* Notas por producto
* Notas generales
* Total

La impresión puede hacerse inicialmente con window.print(), vista imprimible o el sistema de impresión existente del proyecto, según convenga.
Dejar la estructura preparada para futura impresión automática/local.

Panel visual:

* Diseño limpio, claro y operativo.
* Tarjetas grandes.
* Botones grandes.
* Colores por estado.
* Notificación llamativa para pedido nuevo.
* Sonido al recibir pedido.
* Debe funcionar bien en una computadora del negocio abierta todo el día.

Seguridad:

* No exponer el panel al cliente.
* Proteger rutas admin con el sistema actual si ya existe.
* Si no existe, implementar protección simple con PIN o login básico.
* No permitir que el cliente modifique estados del pedido.

Base de datos:
Adaptar las tablas actuales si ya existen.
No duplicar tablas innecesariamente.
Si no existen tablas de pedidos, crear las necesarias:

* orders
* order_items

Considerar campos para:

* branch_id
* status
* printed_at
* completed_at
* cancelled_at

Entregable:

* Implementación completa integrada al proyecto existente.
* Migraciones o SQL necesario.
* Componentes del panel admin.
* Hook o servicio realtime.
* Función de guardado de pedido desde el menú.
* Función de impresión.
* Manejo de estados.
* Validaciones necesarias.
* README breve explicando cómo abrir cada panel por sucursal.
* No romper el flujo actual del menú.
