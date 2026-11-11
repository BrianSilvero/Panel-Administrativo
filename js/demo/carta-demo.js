/* Carta de ejemplo para el demo: platos y precios del menú de Fredy (PDF),
   generada desde js/data.js de la web pública. Las descripciones marcadas para revisar
   en la web siguen pendientes de confirmar con Fredy. No editar a mano: regenerar. */

export const CATEGORIAS_DEMO = [
  {
    "id": "menus",
    "nombre": "Menús y tablas"
  },
  {
    "id": "entradas",
    "nombre": "Entradas"
  },
  {
    "id": "achuras",
    "nombre": "Achuras"
  },
  {
    "id": "parrilla",
    "nombre": "Parrilla"
  },
  {
    "id": "cocina",
    "nombre": "Cocina especial"
  },
  {
    "id": "minutas",
    "nombre": "Minutas"
  },
  {
    "id": "pastas",
    "nombre": "Pastas"
  },
  {
    "id": "salsas",
    "nombre": "Salsas"
  },
  {
    "id": "ensaladas",
    "nombre": "Ensaladas"
  },
  {
    "id": "postres",
    "nombre": "Postres"
  },
  {
    "id": "bodega",
    "nombre": "Bodega"
  }
];

export const GRUPOS_DEMO = [
  {
    "id": "malbec",
    "nombre": "Vinos tintos · Malbec"
  },
  {
    "id": "tintos",
    "nombre": "Cabernet, Merlot y Syrah"
  },
  {
    "id": "especiales",
    "nombre": "Vinos especiales"
  },
  {
    "id": "blancos",
    "nombre": "Vinos blancos y otras uvas"
  },
  {
    "id": "espumantes",
    "nombre": "Champagne y espumantes"
  },
  {
    "id": "cervezas",
    "nombre": "Cervezas y bebidas"
  },
  {
    "id": "tragos",
    "nombre": "Tragos y whiskies"
  },
  {
    "id": "cafeteria",
    "nombre": "Cafetería"
  }
];

export const PLATOS_DEMO = [
 {
  "id": "menus-menu-2-personas",
  "categoria": "menus",
  "nombre": {
   "es": "Menú 2 personas"
  },
  "descripcion": {
   "es": "Empanada o bastoncitos de muzzarella, bife de chorizo de 400 g con papas, flan o budín, y vino o bebida sin alcohol.",
   "en": "Empanada or mozzarella sticks, 400 g bife de chorizo with potatoes, flan or bread pudding, and wine or a non-alcoholic drink.",
   "pt": "Empanada ou palitos de muçarela, bife de chorizo de 400 g com batatas, flan ou pudim de pão, e vinho ou bebida sem álcool."
  },
  "precio": 99000,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "menus-super-tabla-fredy-2p",
  "categoria": "menus",
  "nombre": {
   "es": "Super Tabla Fredy (2P)"
  },
  "descripcion": {
   "es": "Bife de chorizo, asado especial, picaña, mollejas, chorizo, provoletas y papas fritas a caballo.",
   "en": "Bife de chorizo, special asado, picaña, sweetbreads, chorizo, provoletas and fries topped with eggs.",
   "pt": "Bife de chorizo, asado especial, picanha, mollejas, chorizo, provoletas e batatas fritas com ovos."
  },
  "precio": 89000,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "menus-tabla-fredy-4-personas",
  "categoria": "menus",
  "nombre": {
   "es": "Tabla Fredy (4 personas)"
  },
  "descripcion": {
   "es": "Bife de chorizo, asado especial, picaña, mollejas, chorizo, provoletas y papas a caballo.",
   "en": "Bife de chorizo, special asado, picaña, sweetbreads, chorizo, provoletas and potatoes topped with eggs.",
   "pt": "Bife de chorizo, asado especial, picanha, mollejas, chorizo, provoletas e batatas com ovos."
  },
  "precio": 178000,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "entradas-empanadas-de-lomo-a-cuchillo",
  "categoria": "entradas",
  "nombre": {
   "es": "Empanadas de lomo a cuchillo"
  },
  "descripcion": {
   "es": "Fritas, con lomo cortado a cuchillo.",
   "en": "Fried, with hand-cut tenderloin.",
   "pt": "Fritas, com filé cortado à faca."
  },
  "precio": 4000,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "entradas-sopa-del-dia",
  "categoria": "entradas",
  "nombre": {
   "es": "Sopa del día"
  },
  "descripcion": {
   "es": "La sopa casera que preparamos hoy.",
   "en": "Today’s homemade soup.",
   "pt": "A sopa caseira de hoje."
  },
  "precio": 8900,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "entradas-provoleta-grillada",
  "categoria": "entradas",
  "nombre": {
   "es": "Provoleta Grillada"
  },
  "descripcion": {
   "es": "Queso provolone a la parrilla, dorado por fuera y fundido por dentro.",
   "en": "Grilled provolone cheese, golden outside and melted inside.",
   "pt": "Queijo provolone na parrilla, dourado por fora e derretido por dentro."
  },
  "precio": 12900,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "entradas-milanesa-de-muzzarella",
  "categoria": "entradas",
  "nombre": {
   "es": "Milanesa de muzzarella"
  },
  "descripcion": {
   "es": "Con salsa y albahaca.",
   "en": "With sauce and basil.",
   "pt": "Com molho e manjericão."
  },
  "precio": 15990,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "entradas-provoleta-fredy",
  "categoria": "entradas",
  "nombre": {
   "es": "Provoleta Fredy"
  },
  "descripcion": {
   "es": "Provoleta con rúcula, tomates secos y morrones, para compartir.",
   "en": "Provoleta with arugula, sun-dried tomatoes and bell peppers, to share.",
   "pt": "Provoleta com rúcula, tomates secos e pimentões, para compartilhar."
  },
  "precio": 19800,
  "disponible": true,
  "orden": 5
 },
 {
  "id": "entradas-rabas",
  "categoria": "entradas",
  "nombre": {
   "es": "Rabas"
  },
  "descripcion": {
   "es": "Anillos de calamar rebozados y fritos.",
   "en": "Battered and fried squid rings.",
   "pt": "Anéis de lula empanados e fritos."
  },
  "precio": 22800,
  "disponible": true,
  "orden": 6
 },
 {
  "id": "entradas-mollejitas-al-verdeo",
  "categoria": "entradas",
  "nombre": {
   "es": "Mollejitas al verdeo"
  },
  "descripcion": {
   "es": "Mollejitas con salsa de verdeo.",
   "en": "Sweetbreads with spring onion sauce.",
   "pt": "Mollejas com molho de cebolinha."
  },
  "precio": 32500,
  "disponible": true,
  "orden": 7
 },
 {
  "id": "achuras-morcilla-bombon",
  "categoria": "achuras",
  "nombre": {
   "es": "Morcilla Bombón"
  },
  "descripcion": {
   "es": "Morcilla pequeña, a la parrilla.",
   "en": "Small blood sausage, grilled.",
   "pt": "Morcela pequena, na parrilla."
  },
  "precio": 3000,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "achuras-chorizo",
  "categoria": "achuras",
  "nombre": {
   "es": "Chorizo"
  },
  "descripcion": {
   "es": "Chorizo a la parrilla.",
   "en": "Grilled Argentine sausage.",
   "pt": "Linguiça argentina na parrilla."
  },
  "precio": 4000,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "achuras-chorizo-de-puro-cerdo",
  "categoria": "achuras",
  "nombre": {
   "es": "Chorizo de Puro Cerdo"
  },
  "descripcion": {
   "es": "Chorizo de cerdo a la parrilla.",
   "en": "Grilled pork sausage.",
   "pt": "Linguiça de porco na parrilla."
  },
  "precio": 6000,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "achuras-chinchulines-de-ternera",
  "categoria": "achuras",
  "nombre": {
   "es": "Chinchulines de Ternera"
  },
  "descripcion": {
   "es": "Chinchulines de ternera, crocantes a la parrilla.",
   "en": "Veal chitterlings, crisp from the grill.",
   "pt": "Chinchulines de vitela, crocantes na parrilla."
  },
  "precio": 14900,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "achuras-chorizo-o-morcilla",
  "categoria": "achuras",
  "nombre": {
   "es": "Chorizo o Morcilla"
  },
  "descripcion": {
   "es": "A la parrilla. Elegí chorizo o morcilla.",
   "en": "Grilled. Choose sausage or blood sausage.",
   "pt": "Na parrilla. Escolha linguiça ou morcela."
  },
  "precio": 14000,
  "disponible": true,
  "orden": 5
 },
 {
  "id": "achuras-rinon-a-la-provenzal",
  "categoria": "achuras",
  "nombre": {
   "es": "Riñón a la Provenzal"
  },
  "descripcion": {
   "es": "Riñón con ajo y perejil.",
   "en": "Kidney with garlic and parsley.",
   "pt": "Rim com alho e salsinha."
  },
  "precio": 22900,
  "disponible": true,
  "orden": 6
 },
 {
  "id": "achuras-mollejas-de-corazon",
  "categoria": "achuras",
  "nombre": {
   "es": "Mollejas de Corazón"
  },
  "descripcion": {
   "es": "Mollejas de corazón a la parrilla.",
   "en": "Grilled heart sweetbreads.",
   "pt": "Mollejas de coração na parrilla."
  },
  "precio": 30000,
  "disponible": true,
  "orden": 7
 },
 {
  "id": "parrilla-bondiola-grillada",
  "categoria": "parrilla",
  "nombre": {
   "es": "Bondiola Grillada"
  },
  "descripcion": {
   "es": "Bondiola de cerdo a la parrilla.",
   "en": "Grilled pork neck.",
   "pt": "Copa-lombo suína na parrilla."
  },
  "precio": 26500,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "parrilla-asado-de-tira-banderita",
  "categoria": "parrilla",
  "nombre": {
   "es": "Asado de Tira Banderita"
  },
  "descripcion": {
   "es": "El clásico de la parrilla argentina, corte banderita.",
   "en": "The classic of the Argentine grill, banderita cut.",
   "pt": "O clássico da parrilla argentina, corte banderita."
  },
  "precio": 26890,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "parrilla-vacio-del-fino",
  "categoria": "parrilla",
  "nombre": {
   "es": "Vacío del Fino"
  },
  "descripcion": {
   "es": "Vacío a la parrilla, uno de los cortes más argentinos.",
   "en": "Grilled vacío, one of Argentina’s signature cuts.",
   "pt": "Vacío na parrilla, um dos cortes mais argentinos."
  },
  "precio": 29870,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "parrilla-bife-de-chorizo-400-gr",
  "categoria": "parrilla",
  "nombre": {
   "es": "Bife de Chorizo (400 gr)"
  },
  "descripcion": {
   "es": "Porción abundante de 400 g, a la brasa.",
   "en": "Generous 400 g portion, cooked over embers.",
   "pt": "Porção generosa de 400 g, na brasa."
  },
  "precio": 32000,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "parrilla-ojo-de-bife-400-gr",
  "categoria": "parrilla",
  "nombre": {
   "es": "Ojo de Bife (400 gr)"
  },
  "descripcion": {
   "es": "Ojo de bife de 400 g, a la parrilla.",
   "en": "400 g ribeye, grilled.",
   "pt": "Ojo de bife de 400 g, na parrilla."
  },
  "precio": 32000,
  "disponible": true,
  "orden": 5
 },
 {
  "id": "parrilla-picana",
  "categoria": "parrilla",
  "nombre": {
   "es": "Picaña"
  },
  "descripcion": {
   "es": "Corte jugoso, a la brasa.",
   "en": "Juicy cut, cooked over embers.",
   "pt": "Corte suculento, na brasa."
  },
  "precio": 33900,
  "disponible": true,
  "orden": 6
 },
 {
  "id": "parrilla-entrana",
  "categoria": "parrilla",
  "nombre": {
   "es": "Entraña"
  },
  "descripcion": {
   "es": "Entraña a la parrilla.",
   "en": "Grilled skirt steak.",
   "pt": "Fraldinha na parrilla."
  },
  "precio": 34980,
  "disponible": true,
  "orden": 7
 },
 {
  "id": "parrilla-lomo-300-gr",
  "categoria": "parrilla",
  "nombre": {
   "es": "Lomo (300 gr)"
  },
  "descripcion": {
   "es": "Lomo de 300 g, a la parrilla.",
   "en": "300 g tenderloin, grilled.",
   "pt": "Filé mignon de 300 g, na parrilla."
  },
  "precio": 36000,
  "disponible": true,
  "orden": 8
 },
 {
  "id": "parrilla-bife-especial-700-gr",
  "categoria": "parrilla",
  "nombre": {
   "es": "Bife Especial (700 gr)"
  },
  "descripcion": {
   "es": "Corte especial de 700 g, a la parrilla.",
   "en": "Special 700 g cut, grilled.",
   "pt": "Corte especial de 700 g, na parrilla."
  },
  "precio": 56000,
  "disponible": true,
  "orden": 9
 },
 {
  "id": "parrilla-bife-mariposa-700-gr",
  "categoria": "parrilla",
  "nombre": {
   "es": "Bife Mariposa (700 gr)"
  },
  "descripcion": {
   "es": "Bife de 700 g abierto en mariposa, a la parrilla.",
   "en": "700 g butterfly-cut steak, grilled.",
   "pt": "Bife de 700 g aberto em borboleta, na parrilla."
  },
  "precio": 56000,
  "disponible": true,
  "orden": 10
 },
 {
  "id": "parrilla-tomahawk",
  "categoria": "parrilla",
  "nombre": {
   "es": "Tomahawk"
  },
  "descripcion": {
   "es": "Bife con hueso largo, a la parrilla.",
   "en": "Long-bone steak, grilled.",
   "pt": "Bife com osso longo, na parrilla."
  },
  "precio": 59000,
  "disponible": true,
  "orden": 11
 },
 {
  "id": "parrilla-medallon-de-lomo-600-gr",
  "categoria": "parrilla",
  "nombre": {
   "es": "Medallón de Lomo (600 gr)"
  },
  "descripcion": {
   "es": "Medallón de lomo de 600 g, a la parrilla.",
   "en": "600 g tenderloin medallion, grilled.",
   "pt": "Medalhão de filé mignon de 600 g, na parrilla."
  },
  "precio": 72000,
  "disponible": true,
  "orden": 12
 },
 {
  "id": "cocina-arroz-a-la-valenciana-pastel-de-papa",
  "categoria": "cocina",
  "nombre": {
   "es": "Arroz a la Valenciana / Pastel de Papa"
  },
  "descripcion": {
   "es": "Dos clásicos caseros: elegí arroz a la valenciana o pastel de papa.",
   "en": "Two home-style classics: Valencian-style rice or potato and meat pie.",
   "pt": "Dois clássicos caseiros: arroz à valenciana ou escondidinho de batata."
  },
  "precio": 18000,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "cocina-milanesa-de-calabaza-a-la-suiza",
  "categoria": "cocina",
  "nombre": {
   "es": "Milanesa de Calabaza a la Suiza"
  },
  "descripcion": {
   "es": "Milanesa de calabaza con salsa cremosa gratinada.",
   "en": "Breaded squash cutlet with a gratinated creamy sauce.",
   "pt": "Milanesa de abóbora com molho cremoso gratinado."
  },
  "precio": 18000,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "cocina-ribs-de-cerdo-bbq-c-papas-espanola",
  "categoria": "cocina",
  "nombre": {
   "es": "Ribs de Cerdo BBQ c/Papas Española"
  },
  "descripcion": {
   "es": "Costillas de cerdo con salsa BBQ y papas a la española.",
   "en": "Pork ribs with BBQ sauce and Spanish-style potatoes.",
   "pt": "Costelinha de porco com molho barbecue e batatas à espanhola."
  },
  "precio": 27980,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "cocina-brochette-mixto-c-papas-matambrito-cerdo",
  "categoria": "cocina",
  "nombre": {
   "es": "Brochette Mixto c/Papas / Matambrito Cerdo"
  },
  "descripcion": {
   "es": "Elegí brochette mixto con papas o matambrito de cerdo.",
   "en": "Choose a mixed skewer with potatoes or pork matambrito.",
   "pt": "Escolha espetinho misto com batatas ou matambrito suíno."
  },
  "precio": 29800,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "cocina-trucha-grillada-c-vegetales-salteados",
  "categoria": "cocina",
  "nombre": {
   "es": "Trucha Grillada c/Vegetales Salteados"
  },
  "descripcion": {
   "es": "Trucha a la plancha con vegetales salteados.",
   "en": "Grilled trout with sautéed vegetables.",
   "pt": "Truta grelhada com legumes salteados."
  },
  "precio": 29878,
  "disponible": true,
  "orden": 5
 },
 {
  "id": "cocina-risotto-fungi",
  "categoria": "cocina",
  "nombre": {
   "es": "Risotto Fungi"
  },
  "descripcion": {
   "es": "Risotto con hongos.",
   "en": "Mushroom risotto.",
   "pt": "Risoto de cogumelos."
  },
  "precio": 32000,
  "disponible": true,
  "orden": 6
 },
 {
  "id": "cocina-gambas-al-ajillo-c-papas-espanola",
  "categoria": "cocina",
  "nombre": {
   "es": "Gambas al Ajillo c/Papas Española"
  },
  "descripcion": {
   "es": "Gambas salteadas con ajo y papas a la española.",
   "en": "Garlic prawns with Spanish-style potatoes.",
   "pt": "Camarões ao alho com batatas à espanhola."
  },
  "precio": 32900,
  "disponible": true,
  "orden": 7
 },
 {
  "id": "cocina-asado-especial-c-vegetales-gratinados",
  "categoria": "cocina",
  "nombre": {
   "es": "Asado Especial c/Vegetales Gratinados"
  },
  "descripcion": {
   "es": "Asado especial con vegetales gratinados.",
   "en": "Special asado with vegetables au gratin.",
   "pt": "Asado especial com legumes gratinados."
  },
  "precio": 33900,
  "disponible": true,
  "orden": 8
 },
 {
  "id": "cocina-salmon-grillado-c-timbal-de-arroz",
  "categoria": "cocina",
  "nombre": {
   "es": "Salmón Grillado c/Timbal de Arroz"
  },
  "descripcion": {
   "es": "Salmón grillado con timbal de arroz.",
   "en": "Grilled salmon with a rice timbale.",
   "pt": "Salmão grelhado com timbale de arroz."
  },
  "precio": 33900,
  "disponible": true,
  "orden": 9
 },
 {
  "id": "cocina-bife-campestre",
  "categoria": "cocina",
  "nombre": {
   "es": "Bife Campestre"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 36900,
  "disponible": true,
  "orden": 10
 },
 {
  "id": "cocina-salmon-c-veg-salteados-y-p-provenzal",
  "categoria": "cocina",
  "nombre": {
   "es": "Salmón c/Veg. Salteados y P. Provenzal"
  },
  "descripcion": {
   "es": "Salmón con vegetales salteados y papas a la provenzal.",
   "en": "Salmon with sautéed vegetables and garlic-parsley potatoes.",
   "pt": "Salmão com legumes salteados e batatas à provençal."
  },
  "precio": 37900,
  "disponible": true,
  "orden": 11
 },
 {
  "id": "cocina-lomo-1000g-pimienta-negra-c-papas-crema",
  "categoria": "cocina",
  "nombre": {
   "es": "Lomo (1000g) Pimienta Negra c/Papas Crema"
  },
  "descripcion": {
   "es": "Lomo de 1 kg a la pimienta negra con papas a la crema.",
   "en": "1 kg tenderloin with black pepper and creamed potatoes.",
   "pt": "Filé mignon de 1 kg à pimenta-do-reino com batatas ao creme."
  },
  "precio": 132000,
  "disponible": true,
  "orden": 12
 },
 {
  "id": "minutas-suprema-grillada",
  "categoria": "minutas",
  "nombre": {
   "es": "Suprema Grillada"
  },
  "descripcion": {
   "es": "Pechuga de pollo a la plancha.",
   "en": "Grilled chicken breast.",
   "pt": "Peito de frango grelhado."
  },
  "precio": 11900,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "minutas-milanesa-de-ternera",
  "categoria": "minutas",
  "nombre": {
   "es": "Milanesa de Ternera"
  },
  "descripcion": {
   "es": "Milanesa de ternera, un clásico argentino.",
   "en": "Breaded veal cutlet, an Argentine classic.",
   "pt": "Milanesa de vitela, um clássico argentino."
  },
  "precio": 12800,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "minutas-ave-deshuesada-al-verdeo-w-noisette",
  "categoria": "minutas",
  "nombre": {
   "es": "Ave Deshuesada al Verdeo w/Noisette"
  },
  "descripcion": {
   "es": "Ave deshuesada con salsa de verdeo y papas noisette.",
   "en": "Boneless chicken with spring onion sauce and noisette potatoes.",
   "pt": "Frango desossado com molho de cebolinha e batatas noisette."
  },
  "precio": 18980,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "minutas-pure-papas-calabaza-mixto",
  "categoria": "minutas",
  "nombre": {
   "es": "Puré (Papas / Calabaza / Mixto)"
  },
  "descripcion": {
   "es": "Puré de papas, de calabaza o mixto.",
   "en": "Mashed potatoes, squash or mixed.",
   "pt": "Purê de batatas, abóbora ou misto."
  },
  "precio": 8900,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "minutas-papas-a-la-espanola-arroz",
  "categoria": "minutas",
  "nombre": {
   "es": "Papas a la Española / Arroz"
  },
  "descripcion": {
   "es": "Guarnición: papas a la española o arroz.",
   "en": "Side: Spanish-style potatoes or rice.",
   "pt": "Acompanhamento: batatas à espanhola ou arroz."
  },
  "precio": 8900,
  "disponible": true,
  "orden": 5
 },
 {
  "id": "minutas-papas-noisette",
  "categoria": "minutas",
  "nombre": {
   "es": "Papas Noisette"
  },
  "descripcion": {
   "es": "Papas noisette doradas.",
   "en": "Golden noisette potatoes.",
   "pt": "Batatas noisette douradas."
  },
  "precio": 9990,
  "disponible": true,
  "orden": 6
 },
 {
  "id": "minutas-papas-fritas-a-la-provenzal",
  "categoria": "minutas",
  "nombre": {
   "es": "Papas Fritas a la Provenzal"
  },
  "descripcion": {
   "es": "Papas fritas con ajo y perejil.",
   "en": "Fries with garlic and parsley.",
   "pt": "Batatas fritas com alho e salsinha."
  },
  "precio": 10900,
  "disponible": true,
  "orden": 7
 },
 {
  "id": "pastas-noquis-de-papa-tallarines",
  "categoria": "pastas",
  "nombre": {
   "es": "Ñoquis de Papa / Tallarines"
  },
  "descripcion": {
   "es": "Pasta artesanal: ñoquis de papa o tallarines.",
   "en": "Handmade pasta: potato gnocchi or tagliatelle.",
   "pt": "Massa artesanal: nhoque de batata ou talharim."
  },
  "precio": 13900,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "pastas-tallarines-tirabuzon",
  "categoria": "pastas",
  "nombre": {
   "es": "Tallarines / Tirabuzón"
  },
  "descripcion": {
   "es": "Elegí tallarines o tirabuzón.",
   "en": "Choose tagliatelle or fusilli.",
   "pt": "Escolha talharim ou parafuso."
  },
  "precio": 13900,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "pastas-sorrentinos-j-q-capresse-ravioles",
  "categoria": "pastas",
  "nombre": {
   "es": "Sorrentinos J&Q / Capresse / Ravioles"
  },
  "descripcion": {
   "es": "Pasta rellena: sorrentinos de jamón y queso, capresse o ravioles.",
   "en": "Filled pasta: ham and cheese sorrentinos, caprese or ravioli.",
   "pt": "Massa recheada: sorrentinos de presunto e queijo, caprese ou ravióli."
  },
  "precio": 15900,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "pastas-canelones-de-verdura",
  "categoria": "pastas",
  "nombre": {
   "es": "Canelones de Verdura"
  },
  "descripcion": {
   "es": "Canelones rellenos de verdura.",
   "en": "Vegetable-filled cannelloni.",
   "pt": "Canelones recheados de verdura."
  },
  "precio": 16500,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "pastas-tallarines-de-tinta-de-calamar",
  "categoria": "pastas",
  "nombre": {
   "es": "Tallarines de Tinta de Calamar"
  },
  "descripcion": {
   "es": "Tallarines negros con tinta de calamar.",
   "en": "Black tagliatelle made with squid ink.",
   "pt": "Talharim negro com tinta de lula."
  },
  "precio": 16900,
  "disponible": true,
  "orden": 5
 },
 {
  "id": "pastas-agnelotti-de-bondioli",
  "categoria": "pastas",
  "nombre": {
   "es": "Agnelotti de Bondioli"
  },
  "descripcion": {
   "es": "Agnelotti rellenos de bondiola.",
   "en": "Agnolotti filled with pork neck.",
   "pt": "Agnelotti recheados de copa-lombo."
  },
  "precio": 18900,
  "disponible": true,
  "orden": 6
 },
 {
  "id": "pastas-raviolon-de-cordero-salmon",
  "categoria": "pastas",
  "nombre": {
   "es": "Raviolón de Cordero / Salmón"
  },
  "descripcion": {
   "es": "Raviolón relleno de cordero o de salmón.",
   "en": "Large ravioli filled with lamb or salmon.",
   "pt": "Raviolão recheado de cordeiro ou salmão."
  },
  "precio": 19900,
  "disponible": true,
  "orden": 7
 },
 {
  "id": "salsas-fileto-blanca-mixta-rosa",
  "categoria": "salsas",
  "nombre": {
   "es": "Fileto / Blanca / Mixta Rosa"
  },
  "descripcion": {
   "es": "Para acompañar tu pasta.",
   "en": "To go with your pasta.",
   "pt": "Para acompanhar sua massa."
  },
  "precio": 5000,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "salsas-pesto-crema",
  "categoria": "salsas",
  "nombre": {
   "es": "Pesto / Crema"
  },
  "descripcion": {
   "es": "Para acompañar tu pasta.",
   "en": "To go with your pasta.",
   "pt": "Para acompanhar sua massa."
  },
  "precio": 5500,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "salsas-crema-de-camaron-jamon-calamares-4-quesos-bolognesa",
  "categoria": "salsas",
  "nombre": {
   "es": "Crema de Camarón / Jamón / Calamares / 4 Quesos / Bolognesa"
  },
  "descripcion": {
   "es": "Salsas especiales para tu pasta.",
   "en": "Special sauces for your pasta.",
   "pt": "Molhos especiais para sua massa."
  },
  "precio": 6000,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "ensaladas-tradicional",
  "categoria": "ensaladas",
  "nombre": {
   "es": "Tradicional"
  },
  "descripcion": {
   "es": "Lechuga, tomate, zanahoria, huevo y rúcula.",
   "en": "Lettuce, tomato, carrot, egg and arugula.",
   "pt": "Alface, tomate, cenoura, ovo e rúcula."
  },
  "precio": 12000,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "ensaladas-rucula-y-parmesano-caesar",
  "categoria": "ensaladas",
  "nombre": {
   "es": "Rúcula y Parmesano / Caesar"
  },
  "descripcion": {
   "es": "Elegí rúcula con parmesano o ensalada Caesar.",
   "en": "Choose arugula with parmesan or Caesar salad.",
   "pt": "Escolha rúcula com parmesão ou salada Caesar."
  },
  "precio": 12000,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "ensaladas-ensalada-mixta",
  "categoria": "ensaladas",
  "nombre": {
   "es": "Ensalada Mixta"
  },
  "descripcion": {
   "es": "Ensalada mixta de la casa.",
   "en": "House mixed salad.",
   "pt": "Salada mista da casa."
  },
  "precio": 12800,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "ensaladas-ensalada-moni-mo",
  "categoria": "ensaladas",
  "nombre": {
   "es": "Ensalada Moni Mo"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 15900,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "postres-flan-casero-budin-de-pan-artesanal",
  "categoria": "postres",
  "nombre": {
   "es": "Flan Casero / Budín de Pan Artesanal"
  },
  "descripcion": {
   "es": "Elegí flan casero o budín de pan artesanal.",
   "en": "Choose homemade flan or handmade bread pudding.",
   "pt": "Escolha flan caseiro ou pudim de pão artesanal."
  },
  "precio": 10900,
  "disponible": true,
  "orden": 1
 },
 {
  "id": "postres-helados-suizo-almendrado-crema-choc",
  "categoria": "postres",
  "nombre": {
   "es": "Helados (Suizo, Almendrado, Crema, Choc)"
  },
  "descripcion": {
   "es": "Helados: suizo, almendrado, crema o chocolate.",
   "en": "Ice cream: Swiss, almond, cream or chocolate.",
   "pt": "Sorvetes: suíço, amêndoas, creme ou chocolate."
  },
  "precio": 11000,
  "disponible": true,
  "orden": 2
 },
 {
  "id": "postres-lemon-champ",
  "categoria": "postres",
  "nombre": {
   "es": "Lemon Champ"
  },
  "descripcion": {
   "es": "Postre helado de limón con champagne.",
   "en": "Frozen lemon dessert with champagne.",
   "pt": "Sobremesa gelada de limão com champanhe."
  },
  "precio": 14000,
  "disponible": true,
  "orden": 3
 },
 {
  "id": "postres-queso-y-dulce",
  "categoria": "postres",
  "nombre": {
   "es": "Queso y Dulce"
  },
  "descripcion": {
   "es": "Queso con dulce, el postre más argentino.",
   "en": "Cheese with fruit paste, Argentina’s classic dessert.",
   "pt": "Queijo com doce, a sobremesa mais argentina."
  },
  "precio": 15000,
  "disponible": true,
  "orden": 4
 },
 {
  "id": "postres-crumble-de-manzana-c-helado",
  "categoria": "postres",
  "nombre": {
   "es": "Crumble de Manzana c/Helado"
  },
  "descripcion": {
   "es": "Crumble tibio de manzana con helado.",
   "en": "Warm apple crumble with ice cream.",
   "pt": "Crumble morno de maçã com sorvete."
  },
  "precio": 16949,
  "disponible": true,
  "orden": 5
 },
 {
  "id": "postres-tiramisu-argentino",
  "categoria": "postres",
  "nombre": {
   "es": "Tiramisú Argentino"
  },
  "descripcion": {
   "es": "Tiramisú con un toque argentino.",
   "en": "Tiramisu with an Argentine touch.",
   "pt": "Tiramisù com um toque argentino."
  },
  "precio": 17800,
  "disponible": true,
  "orden": 6
 },
 {
  "id": "postres-volcan-de-choc-brownie-c-helado",
  "categoria": "postres",
  "nombre": {
   "es": "Volcán de Choc / Brownie c/Helado"
  },
  "descripcion": {
   "es": "Volcán de chocolate o brownie, con helado.",
   "en": "Chocolate lava cake or brownie, with ice cream.",
   "pt": "Vulcão de chocolate ou brownie, com sorvete."
  },
  "precio": 19900,
  "disponible": true,
  "orden": 7
 },
 {
  "id": "malbec-hormiga-negra",
  "categoria": "bodega",
  "nombre": {
   "es": "Hormiga Negra"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 17500,
  "disponible": true,
  "orden": 1,
  "grupo": "malbec"
 },
 {
  "id": "malbec-alma-mora",
  "categoria": "bodega",
  "nombre": {
   "es": "Alma Mora"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 18680,
  "disponible": true,
  "orden": 2,
  "grupo": "malbec"
 },
 {
  "id": "malbec-intocables",
  "categoria": "bodega",
  "nombre": {
   "es": "Intocables"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 21880,
  "disponible": true,
  "orden": 3,
  "grupo": "malbec"
 },
 {
  "id": "malbec-finca-la-linda",
  "categoria": "bodega",
  "nombre": {
   "es": "Finca La Linda"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 22789,
  "disponible": true,
  "orden": 4,
  "grupo": "malbec"
 },
 {
  "id": "malbec-los-alamos-nieto-senetiner",
  "categoria": "bodega",
  "nombre": {
   "es": "Los Álamos / Nieto Senetiner"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 22800,
  "disponible": true,
  "orden": 5,
  "grupo": "malbec"
 },
 {
  "id": "malbec-fond-de-cave",
  "categoria": "bodega",
  "nombre": {
   "es": "Fond de Cave"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 23796,
  "disponible": true,
  "orden": 6,
  "grupo": "malbec"
 },
 {
  "id": "malbec-saint-felicien",
  "categoria": "bodega",
  "nombre": {
   "es": "Saint Felicien"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 27856,
  "disponible": true,
  "orden": 7,
  "grupo": "malbec"
 },
 {
  "id": "malbec-trumpeter",
  "categoria": "bodega",
  "nombre": {
   "es": "Trumpeter"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 27880,
  "disponible": true,
  "orden": 8,
  "grupo": "malbec"
 },
 {
  "id": "malbec-animal-natural-vine-yards",
  "categoria": "bodega",
  "nombre": {
   "es": "Animal Natural Vine Yards"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 29300,
  "disponible": true,
  "orden": 9,
  "grupo": "malbec"
 },
 {
  "id": "malbec-nicasia",
  "categoria": "bodega",
  "nombre": {
   "es": "Nicasia"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 29490,
  "disponible": true,
  "orden": 10,
  "grupo": "malbec"
 },
 {
  "id": "malbec-luigi-bosca",
  "categoria": "bodega",
  "nombre": {
   "es": "Luigi Bosca"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 32800,
  "disponible": true,
  "orden": 11,
  "grupo": "malbec"
 },
 {
  "id": "malbec-pequenas-producciones",
  "categoria": "bodega",
  "nombre": {
   "es": "Pequeñas Producciones"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 38780,
  "disponible": true,
  "orden": 12,
  "grupo": "malbec"
 },
 {
  "id": "malbec-anaia-gran-malbec",
  "categoria": "bodega",
  "nombre": {
   "es": "Anaia Gran Malbec"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 39000,
  "disponible": true,
  "orden": 13,
  "grupo": "malbec"
 },
 {
  "id": "malbec-el-enemigo",
  "categoria": "bodega",
  "nombre": {
   "es": "El Enemigo"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 39300,
  "disponible": true,
  "orden": 14,
  "grupo": "malbec"
 },
 {
  "id": "malbec-alma-negra",
  "categoria": "bodega",
  "nombre": {
   "es": "Alma Negra"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 39500,
  "disponible": true,
  "orden": 15,
  "grupo": "malbec"
 },
 {
  "id": "malbec-rutini",
  "categoria": "bodega",
  "nombre": {
   "es": "Rutini"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 39890,
  "disponible": true,
  "orden": 16,
  "grupo": "malbec"
 },
 {
  "id": "malbec-jose-zuccardi",
  "categoria": "bodega",
  "nombre": {
   "es": "José Zuccardi"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 42650,
  "disponible": true,
  "orden": 17,
  "grupo": "malbec"
 },
 {
  "id": "malbec-dv-catena",
  "categoria": "bodega",
  "nombre": {
   "es": "DV Catena"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 43900,
  "disponible": true,
  "orden": 18,
  "grupo": "malbec"
 },
 {
  "id": "malbec-angelica-zapata",
  "categoria": "bodega",
  "nombre": {
   "es": "Angélica Zapata"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 58670,
  "disponible": true,
  "orden": 19,
  "grupo": "malbec"
 },
 {
  "id": "tintos-los-alamos-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "Los Álamos (Cabernet)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 21500,
  "disponible": true,
  "orden": 20,
  "grupo": "tintos"
 },
 {
  "id": "tintos-salentein-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "Salentein (Cabernet)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 22900,
  "disponible": true,
  "orden": 21,
  "grupo": "tintos"
 },
 {
  "id": "tintos-finca-la-linda-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "Finca La Linda (Cabernet)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 24880,
  "disponible": true,
  "orden": 22,
  "grupo": "tintos"
 },
 {
  "id": "tintos-nieto-senetiner-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "Nieto Senetiner (Cabernet)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 26800,
  "disponible": true,
  "orden": 23,
  "grupo": "tintos"
 },
 {
  "id": "tintos-nieto-senetiner-merlot",
  "categoria": "bodega",
  "nombre": {
   "es": "Nieto Senetiner (Merlot)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 32800,
  "disponible": true,
  "orden": 24,
  "grupo": "tintos"
 },
 {
  "id": "tintos-saint-felicien-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "Saint Felicien (Cabernet)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 33479,
  "disponible": true,
  "orden": 25,
  "grupo": "tintos"
 },
 {
  "id": "tintos-luigi-bosca-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "Luigi Bosca (Cabernet)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 35846,
  "disponible": true,
  "orden": 26,
  "grupo": "tintos"
 },
 {
  "id": "tintos-luigi-bosca-syrah",
  "categoria": "bodega",
  "nombre": {
   "es": "Luigi Bosca (Syrah)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 36890,
  "disponible": true,
  "orden": 27,
  "grupo": "tintos"
 },
 {
  "id": "tintos-luigi-bosca-merlot",
  "categoria": "bodega",
  "nombre": {
   "es": "Luigi Bosca (Merlot)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 37864,
  "disponible": true,
  "orden": 28,
  "grupo": "tintos"
 },
 {
  "id": "tintos-dv-catena-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "DV Catena (Cabernet)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 37900,
  "disponible": true,
  "orden": 29,
  "grupo": "tintos"
 },
 {
  "id": "tintos-zuccardi-syrah",
  "categoria": "bodega",
  "nombre": {
   "es": "Zuccardi (Syrah)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 37960,
  "disponible": true,
  "orden": 30,
  "grupo": "tintos"
 },
 {
  "id": "tintos-anaia-gran-savinon-cabernet",
  "categoria": "bodega",
  "nombre": {
   "es": "Anaia Gran Savinón Cabernet"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 39000,
  "disponible": true,
  "orden": 31,
  "grupo": "tintos"
 },
 {
  "id": "especiales-presidente",
  "categoria": "bodega",
  "nombre": {
   "es": "Presidente"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 68900,
  "disponible": true,
  "orden": 32,
  "grupo": "especiales"
 },
 {
  "id": "especiales-chanarmuyo",
  "categoria": "bodega",
  "nombre": {
   "es": "Chañarmuyo"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 78000,
  "disponible": true,
  "orden": 33,
  "grupo": "especiales"
 },
 {
  "id": "especiales-gran-enemigo",
  "categoria": "bodega",
  "nombre": {
   "es": "Gran Enemigo"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 85800,
  "disponible": true,
  "orden": 34,
  "grupo": "especiales"
 },
 {
  "id": "especiales-gran-enemigo-corte",
  "categoria": "bodega",
  "nombre": {
   "es": "Gran Enemigo Corte"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 89500,
  "disponible": true,
  "orden": 35,
  "grupo": "especiales"
 },
 {
  "id": "especiales-judas",
  "categoria": "bodega",
  "nombre": {
   "es": "Judas"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 99000,
  "disponible": true,
  "orden": 36,
  "grupo": "especiales"
 },
 {
  "id": "blancos-copa-de-vino-chardonnay",
  "categoria": "bodega",
  "nombre": {
   "es": "Copa de Vino Chardonnay"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 7000,
  "disponible": true,
  "orden": 37,
  "grupo": "blancos"
 },
 {
  "id": "blancos-cosecha-tardia-norton",
  "categoria": "bodega",
  "nombre": {
   "es": "Cosecha Tardía Norton"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 16500,
  "disponible": true,
  "orden": 38,
  "grupo": "blancos"
 },
 {
  "id": "blancos-santa-julia-chenin-alma-mora",
  "categoria": "bodega",
  "nombre": {
   "es": "Santa Julia Chenin / Alma Mora"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 18900,
  "disponible": true,
  "orden": 39,
  "grupo": "blancos"
 },
 {
  "id": "blancos-los-alamos-chardonnay",
  "categoria": "bodega",
  "nombre": {
   "es": "Los Álamos Chardonnay"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 21500,
  "disponible": true,
  "orden": 40,
  "grupo": "blancos"
 },
 {
  "id": "blancos-nieto-senetiner-chardonnay",
  "categoria": "bodega",
  "nombre": {
   "es": "Nieto Senetiner Chardonnay"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 22800,
  "disponible": true,
  "orden": 41,
  "grupo": "blancos"
 },
 {
  "id": "blancos-trumpeter-chardonnay",
  "categoria": "bodega",
  "nombre": {
   "es": "Trumpeter Chardonnay"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 27800,
  "disponible": true,
  "orden": 42,
  "grupo": "blancos"
 },
 {
  "id": "blancos-saint-felicien-chardonnay",
  "categoria": "bodega",
  "nombre": {
   "es": "Saint Felicien Chardonnay"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 29750,
  "disponible": true,
  "orden": 43,
  "grupo": "blancos"
 },
 {
  "id": "blancos-luigi-bosca-chard-sauv-blanc",
  "categoria": "bodega",
  "nombre": {
   "es": "Luigi Bosca Chard / Sauv. Blanc"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 29900,
  "disponible": true,
  "orden": 44,
  "grupo": "blancos"
 },
 {
  "id": "blancos-rutini-sauvignon-blanc",
  "categoria": "bodega",
  "nombre": {
   "es": "Rutini Sauvignon Blanc"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 37490,
  "disponible": true,
  "orden": 45,
  "grupo": "blancos"
 },
 {
  "id": "blancos-rutini-chardonnay",
  "categoria": "bodega",
  "nombre": {
   "es": "Rutini Chardonnay"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 39800,
  "disponible": true,
  "orden": 46,
  "grupo": "blancos"
 },
 {
  "id": "blancos-dv-catena-chardonnay",
  "categoria": "bodega",
  "nombre": {
   "es": "DV Catena Chardonnay"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 42890,
  "disponible": true,
  "orden": 47,
  "grupo": "blancos"
 },
 {
  "id": "blancos-anaia-gran-viognier",
  "categoria": "bodega",
  "nombre": {
   "es": "Anaia Gran Viognier"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 45000,
  "disponible": true,
  "orden": 48,
  "grupo": "blancos"
 },
 {
  "id": "espumantes-sidra-saenz-briones-1888",
  "categoria": "bodega",
  "nombre": {
   "es": "Sidra Saenz Briones 1888"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 12000,
  "disponible": true,
  "orden": 49,
  "grupo": "espumantes"
 },
 {
  "id": "espumantes-norton-cosecha-especial-extra-brut",
  "categoria": "bodega",
  "nombre": {
   "es": "Norton Cosecha Especial Extra Brut"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 24000,
  "disponible": true,
  "orden": 50,
  "grupo": "espumantes"
 },
 {
  "id": "espumantes-navarro-correa-extra-brut",
  "categoria": "bodega",
  "nombre": {
   "es": "Navarro Correa Extra Brut"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 27000,
  "disponible": true,
  "orden": 51,
  "grupo": "espumantes"
 },
 {
  "id": "espumantes-nieto-senetiner-extra-brut",
  "categoria": "bodega",
  "nombre": {
   "es": "Nieto Senetiner Extra Brut"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 37900,
  "disponible": true,
  "orden": 52,
  "grupo": "espumantes"
 },
 {
  "id": "espumantes-chandon-extra-brut",
  "categoria": "bodega",
  "nombre": {
   "es": "Chandon Extra Brut"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 37800,
  "disponible": true,
  "orden": 53,
  "grupo": "espumantes"
 },
 {
  "id": "espumantes-chandon-brut-nature",
  "categoria": "bodega",
  "nombre": {
   "es": "Chandon Brut Nature"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 43760,
  "disponible": true,
  "orden": 54,
  "grupo": "espumantes"
 },
 {
  "id": "espumantes-baron-b-extra-brut",
  "categoria": "bodega",
  "nombre": {
   "es": "Baron B Extra Brut"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 55000,
  "disponible": true,
  "orden": 55,
  "grupo": "espumantes"
 },
 {
  "id": "espumantes-baron-b-brut-nature",
  "categoria": "bodega",
  "nombre": {
   "es": "Baron B Brut Nature"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 65000,
  "disponible": true,
  "orden": 56,
  "grupo": "espumantes"
 },
 {
  "id": "cervezas-agua-mineral-saborizada",
  "categoria": "bodega",
  "nombre": {
   "es": "Agua Mineral / Saborizada"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 4000,
  "disponible": true,
  "orden": 57,
  "grupo": "cervezas"
 },
 {
  "id": "cervezas-gaseosas",
  "categoria": "bodega",
  "nombre": {
   "es": "Gaseosas"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 5000,
  "disponible": true,
  "orden": 58,
  "grupo": "cervezas"
 },
 {
  "id": "cervezas-quilmes-tirada-clasica",
  "categoria": "bodega",
  "nombre": {
   "es": "Quilmes Tirada Clásica"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 6500,
  "disponible": true,
  "orden": 59,
  "grupo": "cervezas"
 },
 {
  "id": "cervezas-quilmes-andes-corona-porron",
  "categoria": "bodega",
  "nombre": {
   "es": "Quilmes / Andes / Corona Porrón"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 6600,
  "disponible": true,
  "orden": 60,
  "grupo": "cervezas"
 },
 {
  "id": "cervezas-quilmes-clasica-doble-malta-1l",
  "categoria": "bodega",
  "nombre": {
   "es": "Quilmes Clásica / Doble Malta (1L)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 8500,
  "disponible": true,
  "orden": 61,
  "grupo": "cervezas"
 },
 {
  "id": "cervezas-budweiser-1l-andes-origen-1l",
  "categoria": "bodega",
  "nombre": {
   "es": "Budweiser (1L) / Andes Origen (1L)"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 8900,
  "disponible": true,
  "orden": 62,
  "grupo": "cervezas"
 },
 {
  "id": "cervezas-stella-artois-patagonia-corona-710",
  "categoria": "bodega",
  "nombre": {
   "es": "Stella Artois / Patagonia / Corona 710"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 11000,
  "disponible": true,
  "orden": 63,
  "grupo": "cervezas"
 },
 {
  "id": "tragos-gancia-fernet-aperol-negroni-cuba-libre",
  "categoria": "bodega",
  "nombre": {
   "es": "Gancia / Fernet / Aperol / Negroni / Cuba Libre"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 8900,
  "disponible": true,
  "orden": 64,
  "grupo": "tragos",
  "precioHasta": 9900
 },
 {
  "id": "tragos-whisky-nacional-chivas-regal",
  "categoria": "bodega",
  "nombre": {
   "es": "Whisky Nacional / Chivas Regal"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 14000,
  "disponible": true,
  "orden": 65,
  "grupo": "tragos",
  "precioHasta": 15000
 },
 {
  "id": "tragos-jw-etiqueta-roja-negra",
  "categoria": "bodega",
  "nombre": {
   "es": "JW Etiqueta Roja / Negra"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 19000,
  "disponible": true,
  "orden": 66,
  "grupo": "tragos",
  "precioHasta": 20000
 },
 {
  "id": "tragos-johnnie-walker-blue-label",
  "categoria": "bodega",
  "nombre": {
   "es": "Johnnie Walker Blue Label"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 55000,
  "disponible": true,
  "orden": 67,
  "grupo": "tragos"
 },
 {
  "id": "cafeteria-cafe-americano-doble",
  "categoria": "bodega",
  "nombre": {
   "es": "Café / Americano / Doble"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 5000,
  "disponible": true,
  "orden": 68,
  "grupo": "cafeteria",
  "precioHasta": 7000
 },
 {
  "id": "cafeteria-limonada-jugo-naranja-licuado",
  "categoria": "bodega",
  "nombre": {
   "es": "Limonada / Jugo Naranja / Licuado"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 5900,
  "disponible": true,
  "orden": 69,
  "grupo": "cafeteria",
  "precioHasta": 8900
 },
 {
  "id": "cafeteria-cafe-c-leche-pastafrola",
  "categoria": "bodega",
  "nombre": {
   "es": "Café c/Leche + Pastafrola"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 9900,
  "disponible": true,
  "orden": 70,
  "grupo": "cafeteria"
 },
 {
  "id": "cafeteria-cafe-c-leche-tostado-j-q-pan-arabe",
  "categoria": "bodega",
  "nombre": {
   "es": "Café c/Leche + Tostado J&Q Pan Árabe"
  },
  "descripcion": {
   "es": ""
  },
  "precio": 14000,
  "disponible": true,
  "orden": 71,
  "grupo": "cafeteria"
 }
];
