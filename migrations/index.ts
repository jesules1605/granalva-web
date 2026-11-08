import * as migration_20261107_214344_inicial from './20261107_214344_inicial';
import * as migration_20261107_214942_servicio_select from './20261107_214942_servicio_select';
import * as migration_20261108_112507_contenido_cms from './20261108_112507_contenido_cms';
import * as migration_20261108_160318_paginas_portada_secciones from './20261108_160318_paginas_portada_secciones';
import * as migration_20261108_171656_campanas_categorias_ajustes from './20261108_171656_campanas_categorias_ajustes';

export const migrations = [
  {
    up: migration_20261107_214344_inicial.up,
    down: migration_20261107_214344_inicial.down,
    name: '20261107_214344_inicial',
  },
  {
    up: migration_20261107_214942_servicio_select.up,
    down: migration_20261107_214942_servicio_select.down,
    name: '20261107_214942_servicio_select',
  },
  {
    up: migration_20261108_112507_contenido_cms.up,
    down: migration_20261108_112507_contenido_cms.down,
    name: '20261108_112507_contenido_cms',
  },
  {
    up: migration_20261108_160318_paginas_portada_secciones.up,
    down: migration_20261108_160318_paginas_portada_secciones.down,
    name: '20261108_160318_paginas_portada_secciones',
  },
  {
    up: migration_20261108_171656_campanas_categorias_ajustes.up,
    down: migration_20261108_171656_campanas_categorias_ajustes.down,
    name: '20261108_171656_campanas_categorias_ajustes'
  },
];
