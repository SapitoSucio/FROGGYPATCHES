window.NEWS_DATA = [
  {
    id: 'patch-2-4-1-eclage',
    tag: 'update',
    title: 'Parche 2.4.1 — Nuevas instancias de Eclage',
    excerpt: 'Se añaden dos nuevas mazmorras de instancia en Eclage con drops exclusivos y equipo épico nivel 4.',
    createdAt: '2026-04-06T09:00:00-06:00',
    published: true,
    cardImage: 'https://blog.gravityus.com/wp-content/uploads/2012/06/rosdposter02.png',
    images: [
      'https://blog.gravityus.com/wp-content/uploads/2012/06/rosdposter02.png'
    ],
    body: `
      <p>El parche 2.4.1 introduce dos nuevas mazmorras de instancia ambientadas en el reino aéreo de Eclage. Diseñadas para grupos de 5 a 12 jugadores de nivel 185+.</p>
      <p class="modal-detail"><strong style="color:var(--gold-dim)">Nuevas instancias:</strong><br>
      — <em>Cielo Fracturado</em>: 3 pisos con boss final Ariel el Ángel Corrompido. Drop único: Alas de Eclage [1].<br>
      — <em>Cripta de la Raíz</em>: Mazmorra lineal con límite de 45 min. Drop único: Raíz del Yggdrasil Antiguo.</p>
      <p>Ambas tienen cooldown de 23 h por personaje. Entradas en Eclage (ecl_in01 168, 42).</p>
    `
  },
  {
    id: 'festival-primavera',
    tag: 'event',
    title: 'Festival de Primavera de Rune-Midgarts',
    excerpt: '¡Consigue el set completo de Sakura recolectando pétalos en Prontera hasta el 20 de Abril!',
    createdAt: '2026-04-01T10:00:00-06:00',
    published: true,
    body: `
      <p>Durante todo Abril los campos de Prontera se llenan de cerezos. Recolecta <em>Pétalos de Sakura</em> derrotando monstruos de nivel 50-120 en mapas abiertos.</p>
      <p class="modal-detail"><strong style="color:var(--gold-dim)">Recompensas:</strong><br>
      — 50 pétalos: Diadema de Sakura (cosmético, STR +1)<br>
      — 150 pétalos: Kimono de Primavera (set completo)<br>
      — 300 pétalos: Mascota exclusiva Conejo de Flor de Cerezo<br>
      — 500 pétalos: Montura Dragón Rosa (30 días)</p>
      <p>El NPC <em>Hanami</em> estará en Prontera (prt_fild01 150, 180) hasta el 20 de Abril a las 23:59 GMT-6.</p>
    `
  },
  {
    id: 'mantenimiento-8-abril',
    tag: 'maint',
    title: 'Ventana de mantenimiento programado',
    excerpt: 'El servidor estará fuera de línea el Miércoles 8 de Abril, de 2:00 AM a 6:00 AM (GMT-6).',
    createdAt: '2026-03-28T13:00:00-06:00',
    published: true,
    body: `
      <p>El Miércoles 8 de Abril realizaremos un mantenimiento de 4 horas. El servidor estará completamente fuera de línea en ese período.</p>
      <p class="modal-detail"><strong style="color:var(--gold-dim)">Cambios incluidos:</strong><br>
      — Migración del servidor de mapas a hardware nuevo (−15 ms de latencia estimada)<br>
      — Actualización del emulador rAthena a build 2026.03.28<br>
      — Corrección de memoria en el módulo de instancias<br>
      — Rebalanceo de spawns en mapas de leveo 100-150</p>
      <p>Como compensación, todos los personajes recibirán una <em>Caja de Compensación</em> al conectarse tras el mantenimiento.</p>
    `
  },
  {
    id: 'balance-royal-guard-warlock',
    tag: 'update',
    title: 'Balance de clases — Royal Guard y Warlock',
    excerpt: 'Se ajustan coeficientes de daño en PvP y se corrigen tres habilidades con comportamiento incorrecto en WoE.',
    createdAt: '2026-03-22T16:00:00-06:00',
    published: true,
    body: `
      <p>Tras análisis de datos de combate en WoE y BG de las últimas 6 semanas, aplicamos los siguientes ajustes:</p>
      <p class="modal-detail"><strong style="color:var(--gold-dim)">Royal Guard:</strong><br>
      — Overbrand: reducción de daño en PvP del 12% (sin cambios en PvE)<br>
      — Earth Drive: corrección del bug que ignoraba reducción de elemento Tierra<br>
      — Prestige: ahora aplica correctamente la reducción a habilidades de Ranger</p>
      <p class="modal-detail"><strong style="color:var(--gold-dim)">Warlock:</strong><br>
      — Tetra Vortex: corregido el cálculo de MATK con equipo de mano izquierda<br>
      — Reading Spellbook: el cooldown se reinicia correctamente al morir<br>
      — Jack Frost: normalizado el hitbox en celdas de esquina</p>
    `
  },
  {
    id: 'mvp-ranking-temporada-3',
    tag: 'event',
    title: 'MVP Ranking — Temporada 3',
    excerpt: 'El top 10 de cazadores de MVP al final de mes recibirá recompensas exclusivas de temporada.',
    createdAt: '2026-03-15T12:30:00-06:00',
    published: true,
    body: `
      <p>La Temporada 3 del MVP Ranking ya está en curso. Cada MVP eliminado suma puntos según su dificultad. Consulta el ranking con el comando <code style="font-family:'JetBrains Mono';font-size:12px;color:var(--gold)">/mvprank</code>.</p>
      <p class="modal-detail"><strong style="color:var(--gold-dim)">Premios (fin de Abril):</strong><br>
      — 1° lugar: Arma MVP exclusiva + título "Asesino de Dioses"<br>
      — 2°-3° lugar: 500 Vanaheim Coins + cosmético de temporada<br>
      — 4°-10° lugar: 200 Vanaheim Coins + título "Cazador de Élite"</p>
      <p>Los puntos se acumulan solo en mapas abiertos. Los MVPs en instancias privadas no cuentan.</p>
    `
  },
  {
    id: 'migracion-postgresql-completada',
    tag: 'maint',
    title: 'Migración de base de datos completada',
    excerpt: 'La migración a PostgreSQL 17 fue exitosa. Se espera una mejora del 30% en latencia de transacciones.',
    createdAt: '2026-03-10T11:15:00-06:00',
    published: true,
    body: `
      <p>Completamos exitosamente la migración de MariaDB 10.6 a PostgreSQL 17. El proceso duró 3 horas con cero pérdida de datos.</p>
      <p class="modal-detail"><strong style="color:var(--gold-dim)">Mejoras medidas post-migración:</strong><br>
      — Latencia de escritura de inventario: −31%<br>
      — Tiempo de consulta de mercado (Vending): −44%<br>
      — Carga de personaje al conectarse: −18%<br>
      — Conexiones simultáneas soportadas: +60%</p>
      <p>Si encuentras algún problema con tu cuenta o gremio, abre un ticket en Discord en el canal <em>#soporte-tecnico</em>.</p>
    `
  }
];
