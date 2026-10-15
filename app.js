// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://vznplgatlnjoklwtjbuv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_eXNP2uoJFlw-1wTqpZyTqQ_VROsmtNF' ;

const supabaseC = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fileInput = document.getElementById('fileInput');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsContainer = document.getElementById('resultsContainer');
const originalImg = document.getElementById('originalImg');
const thumbnailImg = document.getElementById('thumbnailImg');
const dropZone = document.getElementById('dropZone');

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar sección de carga
    dropZone.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    resultsContainer.classList.add('hidden');

    try {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `uploads/${fileName}`;
        const thumbnailPath = `thumbnails/thumb_${fileName}`;

        // 1. Subir la imagen original al bucket "imagenes"
        const { data, error } = await supabase.storage
            .from('imagenes')
            .upload(filePath, file);

        if (error) throw error;

        // Obtener URL pública de la imagen original
        const { data: publicOriginal } = supabase.storage
            .from('imagenes')
            .getPublicUrl(filePath);

        originalImg.src = publicOriginal.publicUrl;

        // 2. Esperar unos segundos a que la Edge Function procese y cree la miniatura
        // (Dependiendo del rendimiento, entre 2 a 4 segundos)
        await new Promise(resolve => setTimeout(resolve, 3500));

        // Obtener URL pública de la miniatura generada
        const { data: publicThumb } = supabase.storage
            .from('imagenes')
            .getPublicUrl(thumbnailPath);

        thumbnailImg.src = publicThumb.publicUrl;

        // Ocultar carga y mostrar resultados
        loadingIndicator.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

    } catch (error) {
        alert('Error al procesar la imagen: ' + error.message);
        loadingIndicator.classList.add('hidden');
        dropZone.classList.remove('hidden');
    }
});