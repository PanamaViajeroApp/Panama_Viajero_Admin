# Panama Viajero Admin

Panel administrativo independiente para gestionar el contenido de Panama Viajero.

## Desarrollo

```bash
yarn
yarn dev
```

## Verificacion

```bash
yarn lint
yarn build
```

## Estado actual

- Interfaz responsive creada con React, Vite y Tailwind CSS.
- Tema oscuro activo por defecto y tema claro opcional.
- Secciones visuales para sitios, borradores, usuarios y permisos.
- Autenticacion conectada a la API mediante `/api/v1/auth/*`.
- En produccion, `functions/api/[[path]].js` requiere un Service Binding llamado
  `API_SERVICE` que apunte al Worker de Panama Viajero.
- En desarrollo, Vite envia `/api` a `http://127.0.0.1:8787`.
- Borradores, sitios publicados, provincias, actividades y basurero se
  sincronizan con D1 mediante `/api/v1/admin/*`.
- Los usuarios y permisos siguen siendo demostrativos hasta completar sus
  endpoints administrativos.
- La seleccion de imagenes permanece deshabilitada hasta conectar R2.
