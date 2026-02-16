const fs = require('fs').promises;
const path = require('path');

/**
 * FUNCIÓN UNIFICADA DE NETLIFY
 * Maneja todas las operaciones de escritura en data3.json:
 * - Registrar sesiones de login
 * - Registrar recuperaciones de contraseña
 * - Actualizar último acceso de usuarios
 * - Restablecer contraseñas
 */

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { action } = data;

    if (!action) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Acción no especificada' })
      };
    }

    // Leer data3.json
    const dbPath = path.join(process.cwd(), 'data3.json');
    const dbContent = await fs.readFile(dbPath, 'utf8');
    const database = JSON.parse(dbContent);

    let result = {};

    // Ejecutar acción correspondiente
    switch (action) {
      
      // ==========================================
      // ACCIÓN 1: REGISTRAR SESIÓN DE LOGIN
      // ==========================================
      case 'register_session':
        const { session_data } = data;
        
        if (!session_data || !session_data.id || !session_data.usuario_id) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Datos de sesión incompletos' })
          };
        }

        // Agregar sesión
        if (!database.sesiones) {
          database.sesiones = [];
        }
        database.sesiones.push(session_data);

        // Actualizar último acceso del usuario
        const userIndex = database.usuarios.findIndex(u => u.id === session_data.usuario_id);
        if (userIndex !== -1) {
          database.usuarios[userIndex].ultimo_acceso = session_data.fecha_inicio;
          database.usuarios[userIndex].updated_at = session_data.fecha_inicio;
        }

        result = {
          success: true,
          message: 'Sesión registrada correctamente',
          session_id: session_data.id,
          action: 'register_session'
        };

        console.log('✅ Sesión registrada:', session_data.id);
        break;

      // ==========================================
      // ACCIÓN 2: REGISTRAR RECUPERACIÓN DE CONTRASEÑA
      // ==========================================
      case 'register_recovery':
        const { recovery_data } = data;
        
        if (!recovery_data || !recovery_data.id || !recovery_data.usuario_id || !recovery_data.token) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Datos de recuperación incompletos' })
          };
        }

        // Agregar recuperación
        if (!database.recuperacion_password) {
          database.recuperacion_password = [];
        }
        database.recuperacion_password.push(recovery_data);

        result = {
          success: true,
          message: 'Recuperación registrada correctamente',
          recovery_id: recovery_data.id,
          token: recovery_data.token,
          action: 'register_recovery'
        };

        console.log('✅ Recuperación registrada:', recovery_data.id);
        break;

      // ==========================================
      // ACCIÓN 3: RESTABLECER CONTRASEÑA
      // ==========================================
      case 'reset_password':
        const { token, new_password } = data;
        
        if (!token || !new_password) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Token y nueva contraseña son requeridos' })
          };
        }

        // Buscar token de recuperación válido
        const recoveryIndex = database.recuperacion_password?.findIndex(r => 
          r.token === token && 
          r.usado === false &&
          new Date(r.fecha_expiracion) > new Date()
        );

        if (recoveryIndex === -1) {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Token inválido o expirado' })
          };
        }

        const recovery = database.recuperacion_password[recoveryIndex];

        // Buscar usuario
        const userIdx = database.usuarios.findIndex(u => u.id === recovery.usuario_id);
        
        if (userIdx === -1) {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Usuario no encontrado' })
          };
        }

        // Actualizar contraseña
        database.usuarios[userIdx].password = new_password;
        database.usuarios[userIdx].updated_at = new Date().toISOString();
        
        // Desactivar forzar cambio de password si estaba activo
        if (database.usuarios[userIdx].forzar_cambio_password) {
          database.usuarios[userIdx].forzar_cambio_password = false;
        }

        // Marcar token como usado
        database.recuperacion_password[recoveryIndex].usado = true;

        result = {
          success: true,
          message: 'Contraseña restablecida correctamente',
          usuario_id: recovery.usuario_id,
          action: 'reset_password'
        };

        console.log('✅ Contraseña restablecida para:', recovery.usuario_id);
        break;

      // ==========================================
      // ACCIÓN 4: CERRAR SESIÓN
      // ==========================================
      case 'logout':
        const { session_id } = data;
        
        if (!session_id) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'ID de sesión no especificado' })
          };
        }

        // Buscar y marcar sesión como inactiva
        const sessionIdx = database.sesiones?.findIndex(s => s.id === session_id);
        
        if (sessionIdx !== -1) {
          database.sesiones[sessionIdx].activa = false;
          database.sesiones[sessionIdx].fecha_cierre = new Date().toISOString();
        }

        result = {
          success: true,
          message: 'Sesión cerrada correctamente',
          session_id: session_id,
          action: 'logout'
        };

        console.log('✅ Sesión cerrada:', session_id);
        break;

      // ==========================================
      // ACCIÓN 5: INCREMENTAR INTENTOS FALLIDOS
      // ==========================================
      case 'increment_failed_attempts':
        const { usuario_id } = data;
        
        if (!usuario_id) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'ID de usuario no especificado' })
          };
        }

        const userFailedIdx = database.usuarios.findIndex(u => u.id === usuario_id);
        
        if (userFailedIdx !== -1) {
          database.usuarios[userFailedIdx].intentos_fallidos += 1;
          database.usuarios[userFailedIdx].updated_at = new Date().toISOString();

          // Bloquear si excede 5 intentos
          if (database.usuarios[userFailedIdx].intentos_fallidos >= 5) {
            database.usuarios[userFailedIdx].bloqueado = true;
          }
        }

        result = {
          success: true,
          message: 'Intentos fallidos actualizados',
          intentos: database.usuarios[userFailedIdx]?.intentos_fallidos || 0,
          bloqueado: database.usuarios[userFailedIdx]?.bloqueado || false,
          action: 'increment_failed_attempts'
        };

        console.log('⚠️ Intentos fallidos incrementados para:', usuario_id);
        break;

      // ==========================================
      // ACCIÓN 6: RESETEAR INTENTOS FALLIDOS
      // ==========================================
      case 'reset_failed_attempts':
        const { usuario_id: userId } = data;
        
        if (!userId) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'ID de usuario no especificado' })
          };
        }

        const userResetIdx = database.usuarios.findIndex(u => u.id === userId);
        
        if (userResetIdx !== -1) {
          database.usuarios[userResetIdx].intentos_fallidos = 0;
          database.usuarios[userResetIdx].updated_at = new Date().toISOString();
        }

        result = {
          success: true,
          message: 'Intentos fallidos reseteados',
          action: 'reset_failed_attempts'
        };

        console.log('✅ Intentos fallidos reseteados para:', userId);
        break;

      default:
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Acción no reconocida' })
        };
    }

    // Guardar cambios en data3.json
    await fs.writeFile(dbPath, JSON.stringify(database, null, 2), 'utf8');

    console.log('💾 Cambios guardados en data3.json');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('❌ Error en función unificada:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      })
    };
  }
};