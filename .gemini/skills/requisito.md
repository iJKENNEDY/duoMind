# DuoMind — Requisitos del Proyecto

Juego de memoria basado en encontrar el par de cartas, con estética de cartas Pokémon y emojis.

---

## 🃏 Juego Base

- Las imágenes están basadas en emojis existentes con contornos neón brillantes
- Presentación estilo cartas de Pokémon con efecto holográfico
- Emojis grandes con glow neón que cambia según el tema activo
- Fondos de colores suaves con bajo contraste para una experiencia visual premium
- Cada nivel genera cartas por múltiplos de 10 (10, 20, 30…)

## 👀 Vista Previa de Cartas

- Antes de comenzar cada nivel se muestran todas las cartas brevemente (1.5 segundos)
- El jugador puede memorizar posiciones antes de que se volteen
- El temporizador comienza después de la vista previa

## 🎮 Modos de Juego

### 2D — Todos los jugadores

Disponible para invitados y usuarios registrados.

**Geometrías de carta:**

| Forma      | Icono | Descripción         |
|------------|-------|---------------------|
| Rectángulo | 🃏    | Naipe (por defecto) |
| Cuadrado   | ⬜    | Proporción 1:1      |
| Pentágono  | ⬠    | 5 lados (clip-path) |
| Hexágono   | ⬡    | Panel de abeja      |
| Círculo    | ⚪    | Forma circular      |

### 3D — Solo usuarios registrados 🔒

Requiere cuenta registrada. Cada carta **es** su propia figura 3D individual (Three.js).

**Cada carta = 1 objeto 3D.** Ejemplo: 5 pares = 10 figuras 3D en la escena.

**Geometrías disponibles:**

| Figura   | Icono | Material                               |
|----------|-------|----------------------------------------|
| Cubo     | 📦    | Efecto vidrio (glass) con contorno neón |
| Esfera   | 🌐    | Efecto vidrio (glass) con contorno neón |
| Cilindro | 🥫    | Material estándar sólido (sin glass)   |

**Comportamiento 3D:**

- Las figuras se organizan en una grilla flotante en el espacio
- Fondo de galaxia aleatoria con 2000 estrellas y 3 nebulosas de colores
- Click en una figura para voltearla (detección pointerdown/pointerup)
- Figuras emparejadas brillan con glow cyan
- Figuras sin voltear tienen sutil animación de balanceo
- Cámara se ajusta automáticamente según cantidad de cartas
- Arrastrar para orbitar, scroll para zoom
- Renderizado con tone mapping ACES Filmic para alto contraste
- Contenedor amplio (750px) para mejor visualización

## 📊 Sistemas de Juego

### Puntuación

- Sistema de puntos por par encontrado (100 pts base)
- Bonus por combos consecutivos (+50 por combo)
- Bonus de tiempo al completar un nivel (+10 pts por segundo restante)

### Tiempo

- Temporizador de cuenta regresiva por nivel (60s base + 15s por nivel)
- Bonus de tiempo al encontrar un par (+3s)

### Vidas

- 5 vidas iniciales
- Se pierde una vida por cada intento fallido
- Se recupera 1 vida al pasar de nivel
- Al perder: se reinicia el nivel actual con todas las vidas restauradas

## 🔄 Flujo del Juego

1. **Menú principal** — Jugar, Login, Registro, Opciones
2. **Selección de modo** — Elegir 2D (5 formas) o 3D (3 geometrías)
3. **Vista previa** — Muestra rápida de todas las cartas
4. **Juego** — Encontrar los pares
5. **Pausa** — Pausar y reanudar
6. **Nivel completo** — Avanzar al siguiente nivel
7. **Game Over** — Reintentar nivel, juego nuevo, o volver al menú

## 👤 Sistema de Usuarios

| Tipo           | 2D | 3D | Guardar | Leaderboard |
|----------------|----|----|---------|-------------|
| **Invitado**   | ✅ | ❌ | ❌      | ❌          |
| **Registrado** | ✅ | ✅ | ✅      | ✅          |

## 💾 Persistencia

- Guardado de progreso (usuarios registrados)
- Leaderboard con mejores puntuaciones (top 20)

## 🎨 Temas Visuales

| Tema   | Icono | Estilo                          |
|--------|-------|---------------------------------|
| Dark   | 🌙    | Púrpura oscuro con acentos cyan |
| Light  | ☀️    | Fondo claro con acentos violeta |
| Summer | 🏖️    | Tonos cálidos naranja y amarillo|
| Autumn | 🍂    | Marrones y naranjas otoñales    |
| Winter | ❄️    | Azules fríos y grises           |
| Spring | 🌸    | Verdes y turquesas primaverales |

## ⚙️ Pantallas

- **Menú** — Jugar, Login/Registro, Opciones, Créditos
- **Selección de modo** — Grilla de formas 2D y geometrías 3D
- **Juego 2D** — Tablero con HUD, pausa, nivel completo
- **Juego 3D** — Escena Three.js con figuras individuales, galaxia de fondo, HUD, controles orbitales
- **Game Over** — Puntuación, reintentar nivel, juego nuevo
- **Opciones** — Sonido, música, selector de tema (grilla 3x2)
- **Leaderboard** — Ranking top 20 con medallas
- **Auth** — Formularios de login y registro
- **Créditos** — Información del proyecto

## 🛠️ Tech Stack

- **Vite** — Build tool
- **Vanilla JS** — Lógica del juego y UI 2D
- **Three.js** — Modo 3D (figuras individuales, OrbitControls, raycasting, texturas canvas, galaxia de fondo)
- **CSS Custom Properties** — Sistema de diseño con 6 temas
- **localStorage** — Persistencia client-side

## 🔊 Opcional

- Sistema de sonido (efectos)
- Sistema de música (fondo)
