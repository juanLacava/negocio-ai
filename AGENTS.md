# AGENTS.md

## Objetivo del repositorio
Este repositorio contiene una plataforma SaaS modular para pequeños negocios y emprendedores, con foco inicial en:
- servicios profesionales
- compraventas de autos

La plataforma se compone de tres apps separadas pero integrables:
1. atención al cliente
2. administración
3. automatización de marketing

## Modelo de trabajo
El desarrollo se organiza como un sistema multiagente de IA.

Hay un agente coordinador y varios agentes especializados.
Cada agente trabaja con alcance limitado.
Toda tarea debe ser pequeña, concreta, revisable y con bajo riesgo.

## Agente coordinador
### `codex-coordinator`
Responsabilidades:
- entender el objetivo general
- dividir trabajo en tareas concretas
- asignar tareas a agentes especializados
- revisar cambios
- detectar solapamientos
- decidir integración final

Reglas:
- no hacer cambios grandes directamente si una tarea puede delegarse
- priorizar tareas pequeñas y desacopladas
- pedir evidencia de validación antes de considerar una tarea terminada

## Agentes especializados

### `backend-agent`
Responsabilidades:
- APIs
- lógica de negocio
- validaciones
- auth
- servicios internos
- acciones del servidor

Puede tocar:
- `apps/*`
- `packages/core`
- `packages/database`
- `packages/config`

No debe tocar:
- UI compleja en `packages/ui`
- prompts en `packages/ai`
- integraciones externas salvo que la tarea lo pida explícitamente

### `frontend-agent`
Responsabilidades:
- pantallas
- componentes
- formularios
- navegación
- dashboards
- inbox y vistas de usuario

Puede tocar:
- `apps/customer-service`
- `apps/admin`
- `apps/marketing`
- `packages/ui`
- `packages/config`

No debe tocar:
- migraciones
- lógica profunda de backend
- prompts
- webhooks externos

### `ai-conversation-agent`
Responsabilidades:
- prompts
- clasificación de intención
- extracción de datos
- respuestas automáticas
- flujos conversacionales

Puede tocar:
- `packages/ai`
- documentación relacionada en `docs/`

No debe tocar:
- UI
- migraciones
- rutas backend salvo contratos muy acotados y acordados

### `qa-agent`
Responsabilidades:
- lint
- typecheck
- tests
- validación funcional básica
- detección de regresiones

Puede tocar:
- `tests/`
- configs de testing/lint si es necesario
- pequeños fixes justificados para que una validación pase

No debe:
- rediseñar arquitectura
- cambiar comportamiento del producto sin pedido explícito
- introducir features nuevas

## Reglas globales
- No tocar archivos fuera del alcance de la tarea.
- No renombrar archivos sin necesidad clara.
- No introducir dependencias nuevas sin justificarlo.
- Mantener cambios pequeños y fáciles de revisar.
- Priorizar claridad sobre complejidad.
- Evitar refactors amplios junto con features nuevas.
- Si una tarea requiere cambios en múltiples áreas, dividir en subtareas por agente.

## Convenciones de entrega
Toda entrega debe incluir:

1. Resumen breve de lo hecho
2. Archivos tocados
3. Riesgos detectados
4. Validaciones ejecutadas
5. Pendientes si los hubiera

## Checklist mínimo antes de cerrar una tarea
- compila
- no rompe tipos
- respeta el alcance
- no introduce secretos
- mantiene consistencia de nombres
- deja el proyecto en estado entendible

## Estructura general del repo
- `apps/customer-service`: app de atención al cliente
- `apps/admin`: app de administración
- `apps/marketing`: app de automatización de marketing
- `apps/workers`: jobs, colas y automatizaciones
- `packages/ui`: componentes compartidos
- `packages/database`: esquema, migraciones y acceso a datos
- `packages/core`: lógica de negocio compartida
- `packages/ai`: prompts, clasificación y extracción
- `packages/integrations`: conectores externos
- `packages/config`: configuraciones compartidas
- `docs/`: documentación técnica y funcional

## Estilo de trabajo
- primero hacer funcionar
- después mejorar
- siempre dejar rastro claro de qué se cambió y por qué
- evitar magia implícita
- preferir contratos explícitos y nombres claros

## Primer objetivo técnico
Construir la base del sistema multiagente:
- estructura del monorepo
- apps base
- package shared de IA
- validación mínima
- flujo claro para ramas, worktrees y revisión
