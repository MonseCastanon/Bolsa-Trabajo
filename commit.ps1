$branch = git branch --show-current
if ($branch -notmatch "feature/diego-admin") {
    git checkout -b feature/diego-admin
}
git add backend/app/empresas/routes.py backend/app/admin/routes.py frontend/src/services/api.js frontend/src/main.js
git commit -m "feat: Implementar endpoints y servicios para Empresas y Admin"

#Segundo commit 4/5/2026
git add frontend/src/pages/admin/ frontend/src/pages/Empresas.js frontend/src/pages/EmpresaDetalle.js frontend/src/pages/PerfilEmpresa.js frontend/src/main.js frontend/src/pages/Login.js backend/app/admin/routes.py
git commit -m "feat: Páginas frontend de administrador y corrección de bugs en backend/admin"

#Tercer commit 4/7/2026
git add .
git commit -m "feat: Implementar endpoints y servicios para Empresas y Admin y corrección de bugs en backend/admin y frontend"


