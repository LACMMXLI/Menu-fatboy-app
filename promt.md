Después configura Cloudflare Tunnel y DNS:

* Verifica túnel existente
* Verifica UUID y estado
* NO recrees el túnel si ya funciona
* Configura Public Hostnames correctamente
* Detecta automáticamente puertos reales
* Configura rutas públicas funcionales
* Revisa DNS en Cloudflare
* Evita conflictos con cPanel
* Mantén funcionando correo y registros MX

Ejemplos:

* panel.midominio.com
* menu.midominio.com
* api.midominio.com

Validación final obligatoria:

* HTTPS funcionando
* SSL funcionando
* DNS resolviendo
* túnel respondiendo
* acceso público funcionando
* sin errores 502/521/522/526
* revisar logs y corregir errores reales

Entregable final:

* contenedores detectados
* puertos detectados
* hostnames creados
* DNS modificados
* Dockerfile creado o no
* pruebas realizadas
* resultado final
* riesgos o pendientes encontrados

Prioridad absoluta:
Que la app quede pública, estable y funcionando correctamente usando la infraestructura existente.
