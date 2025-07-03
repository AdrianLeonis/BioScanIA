// ——— Drop-zone & preview ———
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const preview = document.getElementById('preview');

  if (dropZone && fileInput && preview) {
    ;['dragenter', 'dragover'].forEach(evt =>
      dropZone.addEventListener(evt, e => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      })
    );
    ;['dragleave', 'drop'].forEach(evt =>
      dropZone.addEventListener(evt, e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      })
    );

    dropZone.addEventListener('drop', e => {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      fileInput.files = e.dataTransfer.files;
      updatePreview(file);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        updatePreview(fileInput.files[0]);
      }
    });

    function updatePreview(file) {
      const url = URL.createObjectURL(file);
      preview.innerHTML = `<img src="${url}" alt="Preview">`;
    }
  }

  // ——— Modal dinámico ———
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalContent = modal?.querySelector('.modal-content');

  if (modal && modalClose && modalTitle && modalBody && modalContent) {

    const INFO = {
      "Rice Leaf Caterpillar": `La oruga de la hoja de arroz (Cnaphalocrocis medinalis) es una mariposa cuya larva se alimenta del tejido foliar interior de la hoja, dejando únicamente la epidermis. Al principio aparecen pequeñas ventanillas translúcidas que luego se agrandan, debilitando la planta y reduciendo su capacidad fotosintética. Si la población es elevada, puede llegar a causar defoliación severa y pérdidas de rendimiento de hasta el 30 %.`,
      "Yellow Rice Borer": `El barrenador amarillo del arroz (Scirpophaga incertulas) deposita huevos en el tallo. Las larvas perforan desde la base hacia arriba, interrumpiendo el flujo de savia y provocando tallos huecos (‘dead‐hearts’) en etapa vegetativa y espigas blanquecinas en etapa reproductiva (‘white‐heads’). Es una de las plagas más destructivas del cultivo.`,
      "Rice Gall Midge": `El mosquito de agalla del arroz (Orseolia oryzae) induce la formación de agallas en la base de la planta. La larva secreta compuestos que deforman el tallo, impidiendo la salida de la panícula—el grano no se desarrolla y la planta muere en el nudo afectado.`,
      "Rice Stemfly": `El moscardón del tallo (Hydrellia philippina) pone huevos en la superficie de la planta. Las larvas excavadoras socavan el interior del tallo y reducen la absorción de nutrientes, provocando marchitez y caída de tallos en brotes jóvenes.`,
      "Small Brown Plant Hopper": `El saltahojas marrón pequeño (Nilaparvata lugens) chupa savia de hojas y tallos, causando amarilleo y debilitamiento (‘hopper burn’). Además es vector de virus como el tungro, y su ataque masivo puede matar completas hiladas de arroz.`,
      "Rice Leafhopper": `El saltahojas del arroz (Nephotettix spp.) succiona savia y transmite fitopatógenos (virus del machaquito amarillo). El ataque provoca punteaduras, amarilleo, pérdida de turgencia y puede disminuir el rendimiento hasta un 25 %.`,
      "Rice Shell Pest": `El insecto del grano (Sitophilus zeamais) penetra y se alimenta dentro del grano seco. Produce polvo fino y granos respiraderos que reducen calidad y germinación, afectando el almacenaje postcosecha.`,
      "Large Cutworm": `La oruga cortadora grande (Agrotis ipsilon) corta las plántulas justo por encima del suelo durante la noche. Puede destruir más del 50 % de las plántulas en siembras tempranas.`,
      "Yellow Cutworm": `La oruga cortadora amarilla (Agrotis segetum) actúa igual que la anterior, pero en suelos secos y arenosos. Su ataque produce hileras despobladas y manchas irregulares en el campo.`,
      "Red Spider": `El ácaro rojo (Tetranychus urticae) se alimenta succionando clorofila de las hojas, dejando un moteado amarillento, telarañas finas y defoliación en ataques graves. Se multiplica muy rápido en condiciones cálidas y secas.`,
      "Potosiabre Vitarsis": `El escarabajo Potosiabre vitarsis roe los bordes de las hojas, creando muescas y agujeros irregulares. Afecta más a plantas jóvenes y ornamental, reduciendo su vigor y desarrollo.`,
      "English Grain Aphid": `El pulgón del cereal (Sitobion avenae) chupa savia y excreta melaza que favorece la fumagina. Transmite virus y puede reducir rendimiento hasta un 40 % en cereal.`,
      "Wheat Blossom Midge": `El mosquito de la espiga (Sitodiplosis mosellana) pone huevos al florecer el trigo. Las larvas devoran el ovario, dejando espigas vacías y granos deformes.`,
      "Wheat Sawfly": `La avispa serradora del trigo (Cephus cinctus) perfora el tallo y causa tallos huecos que se tumban (‘lodging’). Reduce cosecha y dificulta la recolección mecánica.`,
      "Alfalfa Weevil": `El gorgojo de la alfalfa (Hypera postica) come las hojas nuevas en hileras de muescas, dejando nervaduras. Afecta el rebrote, disminuye la biomasa y la calidad forrajera.`,
      "Alfalfa Plant Bug": `El chinche de la alfalfa (Adelphocoris lineolatus) chupa jugos de tallos y flores, causando tallos retorcidos, caída de botones florales y reducción de semilla.`,
      "Lytta Polita": `El escarabajo brilloso (Lytta polita) se alimenta de follaje de varias plantas, dejando muescas grandes. En cultivos hortícolas puede defoliar rápidamente plantas jóvenes.`,
      "Pieris Canidia": `La mariposa colias (Pieris canidia) es plaga de crucíferas; las orugas perforan hojas y tallos, crean hoyos y pueden llegar a defoliar totalmente.`,
      "Apolygus Lucorum": `El chinche verde (Apolygus lucorum) chupa brotes y flores en frutales y hortícolas, provocando malformaciones y caída de frutos jóvenes.`,
      "Viteus Vitifoliae": `La araña roja de la vid (Panonychus vitis) produce moteado y telarañas finas en hojas de vid, causando defoliación y debilitamiento del viñedo.`,
      "Papilio Xuthus": `La mariposa citrus (Papilio xuthus) ataca cítricos, sus orugas devoran hojas y brotes jóvenes, llegando a dejar ramas desnudas.`,
      "Unaspis Yanonensis": `La cochinilla escamosa (Unaspis yanonensis) se adhiere a tallos y hojas, succionando savia, dejando manchas amarillas y debilidad general de la planta.`,
      "Dacus Dorsalis(Hendel)": `La mosca de la fruta oriental (Bactrocera dorsalis) pone huevos en fruto maduro. Las larvas se alimentan de pulpa y generan putrefacción interna, arruinando la cosecha.`,
      "Phyllocnistis Citrella Stainton": `La minadora de hoja de cítricos (Phyllocnistis citrella) crea galerías sinuosas entre epidermis de hoja, dejando hojas plateadas y debilitando al árbol.`,
      "Aphis Citricola Vander Goot": `El pulgón amarillo de cítricos (Aphis citricola) forma colonias en brotes tiernos, chupando savia, causando enrollamiento y transmitiendo virus.`,
      "Dasineura Sp": `Los mosquitos de agallas (Dasineura spp.) inducen agallas en hojas y tallos de diversas plantas. Las agallas retienen agua y nutrientes, deforman el tejido y reducen crecimiento.`,
      "Lawana Imitata Melichar": `El saltahojas Lawana imitada (Lawana imitata) chupa savia y excreta melaza, favoreciendo fumagina. Sus picaduras provocan manchas cloróticas en hojas.`,
      "Salurnis Marginella Guerr": `La polilla Salurnis marginella se alimenta de semillas y hojas secas en almacenaje, generando polvo y pérdida de calidad.`,
      "Rhytidodera Bowrinii White": `El escarabajo Rhytidodera bowrinii roe corteza y tallos en plantas tropicales, creando surcos profundos que afectan la circulación de savia.`,
      "Sternochetus Frigidus": `El gorgojo del mango (Sternochetus frigidus) ataca frutos de mango. Las larvas se alimentan en el interior, provocando necrosis y pudrición del fruto.`
    };

    const TREATMENTS = {
      "Rice Leaf Caterpillar": [
        "Monitoreo semanal con trampas de feromonas para detectar poblaciones tempranas.",
        "Aplicar Bacillus thuringiensis (Bt) al 1 % en fase inicial de larva.",
        "Fertilización balanceada: plantas vigorosas soportan mejor el ataque."
      ],
      "Yellow Rice Borer": [
        "Sumergir el arroz 3–5 días después de la siembra para ahogar larvas.",
        "Rotación con leguminosas para interrumpir ciclo de barrenador.",
        "Liberar avispas parasitoides (e.g., Trichogramma japonicum)."
      ],
      "Rice Gall Midge": [
        "Sembrar variedades resistentes cuando estén disponibles.",
        "Evitar siembras escalonadas para romper su ciclo.",
        "Inspección y eliminación de plantas agalladas antes de la pupación."
      ],
      "Rice Stemfly": [
        "Aplicar insecticidas sistémicos como imidacloprid en la base del tallo.",
        "Control biológico con crisopas y mariquitas.",
        "Mantener niveles de agua constantes para dificultar el desarrollo."
      ],
      "Small Brown Plant Hopper": [
        "Aplicar dimetoato o fipronil al 0.1 % en la hoja y tallo.",
        "Fumigación con esferas de caolín para repeler al insecto.",
        "Establecer barreras de vegetación no hospedante alrededor del campo."
      ],
      "Rice Leafhopper": [
        "Spray de neem (aceite de neem al 0.5 %) en brotes tiernos.",
        "Liberar chinches depredadores (e.g., Cyrtorhinus lividipennis).",
        "Mantener el nivel de agua alto durante periodos críticos."
      ],
      "Rice Shell Pest": [
        "Almacenaje en cámaras herméticas o con desecante para reducir humedad.",
        "Aplicar tratamientos con fosfina (PH₃) bajo supervisión.",
        "Limpieza y desinfección de silos tras cada cosecha."
      ],
      "Large Cutworm": [
        "Aplicar carbaryl o clorpirifós en el suelo antes de la siembra.",
        "Arar justo antes de sembrar para exponer pupas al sol y aves.",
        "Instalar trampas de suelo con cebos de melaza."
      ],
      "Yellow Cutworm": [
        "Uso de triflumuron en preemergencia para inhibir muda.",
        "Rotación de cultivos que no sirvan de hospedante (ej. cultivos de cobertura).",
        "Control biológico con nematodos entomopatógenos (Steinernema spp.)."
      ],
      "Red Spider": [
        "Aumentar la humedad ambiental o riego foliar para reducir infestación.",
        "Aplicar acaricidas específicos (e.g., abamectina al 0.02 %).",
        "Introducir depredadores como Phytoseiulus persimilis."
      ],
      "Potosiabre Vitarsis": [
        "Rociar con spinosad al 0.02 % en las hojas afectadas.",
        "Monitorear cada 3 días y retirar manualmente insectos grandes.",
        "Mantener plantas bien nutridas y vigorizadas."
      ],
      "English Grain Aphid": [
        "Aplicar pirimicarb al 0.1 % en brotes jóvenes.",
        "Liberar crisopas y mariquitas como agentes biológicos.",
        "Evitar exceso de nitrógeno para no favorecer proliferación."
      ],
      "Wheat Blossom Midge": [
        "Sembrar temprano o tardío para evitar vuelo máximo de adultos.",
        "Aplicar imidacloprid en la base del tallo durante la floración.",
        "Trampas de feromonas para seguimiento poblacional."
      ],
      "Wheat Sawfly": [
        "Rotación de trigo con avena o leguminosas.",
        "Arado profundo para enterrar pupas.",
        "Resembrar con variedades de tallo más resistentes."
      ],
      "Alfalfa Weevil": [
        "Corte temprano del primer corte para reducir población larvaria.",
        "Aplicar Bacillus thuringiensis en brotes tiernos.",
        "Liberar crisopas verdes como control biológico."
      ],
      "Alfalfa Plant Bug": [
        "Spray de aceite hortícola al 1 % en botones florales.",
        "Plantar bordes con vegetación huésped de hipéridos para trampas de confusión.",
        "Aplicar insecticida sistémico si la infestación supera el umbral económico."
      ],
      "Lytta Polita": [
        "Monitoreo visual y recolección manual en plantas ornamentales.",
        "Fumigación localizada con piretroides (e.g., deltametrina al 0.05 %).",
        "Mantener suelo limpio de malezas para no favorecer refugio."
      ],
      "Pieris Canidia": [
        "Instalar trampas con feromonas de mariposa adulta.",
        "Spray foliar con Bacillus thuringiensis en su fase temprana.",
        "Cubrir plantas jóvenes con malla anti-insectos."
      ],
      "Apolygus Lucorum": [
        "Aplicar oxamil o profenofos en floración.",
        "Mantener cobertura de plantas no hospederas como barrera.",
        "Liberar depredadores como chinches Orius spp."
      ],
      "Viteus Vitifoliae": [
        "Riego por goteo para mantener humedad foliar alta.",
        "Aplicar acaricidas sistémicos (e.g., abamectina al 0.025 %).",
        "Podar hojas muy infestadas y destruir restos vegetales."
      ],
      "Papilio Xuthus": [
        "Instalar trampas de luz para adultos.",
        "Rociar extracto de neem al 0.5 % en brotes jóvenes.",
        "Cubrir brotes tiernos con malla fina."
      ],
      "Unaspis Yanonensis": [
        "Fumigar con aceite blanco mineral en invierno para controlar ninfas.",
        "Aplicar sistémicos como imidacloprid vía suelo.",
        "Podar ramas muy infestadas y quemar los restos."
      ],
      "Dacus Dorsalis(Hendel)": [
        "Trampas con atrayente proteico y amoníaco alrededor del huerto.",
        "Aplicar insecticidas de contacto en la superficie de frutos.",
        "Recolectar frutos caídos e incinerarlos."
      ],
      "Phyllocnistis Citrella Stainton": [
        "Poda de brotes con minas y destrucción de hojas parasitadas.",
        "Spray de Bacillus thuringiensis var. kurstaki en galerías nuevas.",
        "Liberar avispas parasitoides como Ageniaspis citricola."
      ],
      "Aphis Citricola Vander Goot": [
        "Riego foliar con jabón potásico al 2 %.",
        "Introducir mariquitas Hippodamia convergens.",
        "Evitar exceso de nitrógeno en abonado."
      ],
      "Dasineura Sp": [
        "Eliminar y quemar hojas agalladas antes de la pupación.",
        "Aplicar aceites hortícolas durante la expansión de agallas.",
        "Control biológico con parasitoides específicos (Platygaster spp.)."
      ],
      "Lawana Imitata Melichar": [
        "Spray foliar con insecticidas piretroides en brotes tiernos.",
        "Liberar crisopas como depredadores naturales.",
        "Monitoreo con trampas cromáticas amarillas."
      ],
      "Salurnis Marginella Guerr": [
        "Almacenaje en frío (< 15 °C) para inhibir plagas de grano.",
        "Tratamiento con fosfina en atmósfera controlada.",
        "Limpiar y desinfectar depósitos tras cada uso."
      ],
      "Rhytidodera Bowrinii White": [
        "Aplicar insecticidas de contacto en corteza (e.g., carbaryl).",
        "Rastrillar corteza vieja para exponer larvas.",
        "Introducir nematodos entomopatógenos en base del tallo."
      ],
      "Sternochetus Frigidus": [
        "Cosechar antes de la madurez total y secar rápidamente.",
        "Tratar frutos cosechados con calor (45 °C durante 4 h).",
        "Almacenaje hermético con control de temperatura y humedad."
      ]
    };


    // Función para abrir modal
    function openModal(action, pest) {
      if (action === 'info') {
        // Título: "Acerca de [plaga]", con nombre en negrita
        modalTitle.innerHTML = `Acerca de <strong>${pest}</strong>`;
        // Descripción en párrafo
        const text = INFO[pest] || 'No hay información disponible para esta plaga.';
        modalBody.innerHTML = `<p>${text}</p>`;
      } else {
        // Título: "Tratamientos contra [plaga]", con nombre en negrita
        modalTitle.innerHTML = `Tratamientos contra <strong>${pest}</strong>`;
        // Tratamientos como lista con sangría
        const list = TREATMENTS[pest];
        if (!list) {
          modalBody.innerHTML = `<p>No hay tratamientos disponibles para esta plaga.</p>`;
        } else {
          modalBody.innerHTML =
            `<ul style="padding-left: 1.5rem; margin-top: .5rem;">` +
            list.map(item => `<li>${item}</li>`).join('\n') +
            `</ul>`;
        }
      }

      // Mostrar con animación
      modal.classList.remove('hidden');
      modalContent.style.animation = 'zoomIn 0.25s ease-out forwards';
      modal.style.animation = 'fadeIn 0.25s ease-out forwards';
    }


    // Función para cerrar modal con animación
    function closeModal() {
      modalContent.style.animation = 'zoomOut 0.2s ease-in forwards';
      modal.style.animation = 'fadeOut 0.2s ease-in forwards';
      setTimeout(() => {
        modal.classList.add('hidden');
        modalContent.style.animation = '';
        modal.style.animation = '';
      }, 200);
    }


    document.addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const strong = document.querySelector('.result strong');
      if (!strong) return;
      const pest = strong.textContent.trim();
      openModal(btn.dataset.action, pest);
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  // ——— Password toggle ———
  const eyeOpen = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="currentColor" d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/>
      <circle fill="currentColor" cx="8" cy="8" r="2"/>
    </svg>`;
  const eyeClosed = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="currentColor" d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/>
      <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" stroke-width="1"/>
    </svg>`;

  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.innerHTML = eyeOpen;
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper')?.querySelector('input');
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = eyeClosed;
        btn.setAttribute('aria-label', 'Ocultar contraseña');
      } else {
        input.type = 'password';
        btn.innerHTML = eyeOpen;
        btn.setAttribute('aria-label', 'Mostrar contraseña');
      }
    });
  });
});
