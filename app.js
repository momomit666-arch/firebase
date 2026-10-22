// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://vznplgatlnjoklwtjbuv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bnBsZ2F0bG5qb2tsd3RqYnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNDIwODgsImV4cCI6MjEwNzYxODA4OH0.6Wi4n-LPRl8eQIJ_m3C8aN5xSI4V_9kBekFi8FyebiA' ;

let supabase = null;

// Función para inicializar Supabase de forma segura
function initSupabase() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase inicializado correctamente.");
    } else {
        console.error("La librería de Supabase aún no carga, reintentando...");
        setTimeout(initSupabase, 100);
    }
}

// Ejecutar inicialización al cargar la ventana
window.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});

// Referencias a elementos del DOM
const fileInput = document.getElementById('fileInput');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsContainer = document.getElementById('resultsContainer');
const originalImg = document.getElementById('originalImg');
const thumbnailImg = document.getElementById('thumbnailImg');
const dropZone = document.getElementById('dropZone');

if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!supabase) {
            alert("Error: Supabase no terminó de inicializarse. Recarga la página.");
            return;
        }

        // Mostrar sección de carga
        dropZone.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        resultsContainer.classList.add('hidden');

        try {
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `uploads/${fileName}`;

            // Subir imagen original a Supabase Storage
            const { data, error } = await supabase.storage
                .from('imageness')
                .upload(filePath, file);

            if (error) throw error;

            console.log("Imagen subida con éxito:", data);
            alert("¡Imagen subida con éxito!");

            // Ocultar carga
            loadingIndicator.classList.add('hidden');
            dropZone.classList.remove('hidden');

        } catch (err) {
            console.error("Error al procesar la imagen:", err);
            alert("Error al procesar la imagen: " + err.message);
            loadingIndicator.classList.add('hidden');
            dropZone.classList.remove('hidden');
        }
    });
}