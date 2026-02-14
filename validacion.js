<script>
(function() {
  const sessionData = sessionStorage.getItem('session_SAC') || localStorage.getItem('session_SAC_permanent');
  if (!sessionData) {
    localStorage.setItem('logout_motivo', 'Debes iniciar sesión para acceder');
    window.location.href = 'index.html?logout=1';
    return;
  }
  
  const session = JSON.parse(sessionData);
  const expira = new Date(session.expira);
  if (new Date() >= expira) {
    localStorage.setItem('logout_motivo', 'expired');
    window.location.href = 'index.html?logout=1';
    return;
  }
  
  // Validar rol permitido para este dashboard
  const allowedRoles = {
    'dashboard_admin.html': ['administrador'],
    'dashboard_tecnico_audiovisual.html': ['tecnico_audiovisual', 'administrador'],
    'dashboard_tecnico_sistemas.html': ['tecnico_sistemas', 'administrador'],
    'dashboard_tecnico_integral.html': ['tecnico_integral', 'administrador']
  };
  
  const page = window.location.pathname.split('/').pop();
  if (!allowedRoles[page]?.includes(session.rol)) {
    alert(`Acceso denegado. Tu rol (${session.rol}) no tiene permisos para este panel.`);
    window.location.href = ROLES_CONFIG[session.rol].dashboard;
  }
})();
</script>
