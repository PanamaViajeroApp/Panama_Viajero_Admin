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
- Secciones funcionales para sitios, borradores, usuarios y permisos.
- Autenticacion conectada a la API mediante `/api/v1/auth/*`.
- En produccion, `functions/api/[[path]].js` requiere un Service Binding llamado
  `API_SERVICE` que apunte al Worker de Panama Viajero.
- En desarrollo, Vite envia `/api` a `http://127.0.0.1:8787`.
- Borradores, sitios publicados, provincias, actividades y basurero se
  sincronizan con D1 mediante `/api/v1/admin/*`.
- Los usuarios y permisos se sincronizan con D1. El panel permite crear
  usuarios con contrasena temporal, eliminar cuentas y guardar permisos
  individuales.
- Las secciones de usuarios y permisos muestran una vista restringida cuando
  la sesion no tiene la autorizacion correspondiente.
- La creacion y edicion de sitios permite subir fondos y galerias WebP a R2.
- Cada imagen puede pesar hasta 10 MB y cada sitio admite hasta 30 imagenes de
  galeria.
