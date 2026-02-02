<script setup lang="ts">
import { parseBackendError } from "~/utils/errorParser";

const { onFormEnter } = useFormNavigation()

defineOptions({ name: "AdminOptions" });
definePageMeta({
  name: "admin-options",
  layout: "admin",
  middleware: "auth-admin",
});

useHead({
  title: 'Pengaturan - VENUE UNDIP',
  meta: [
    { name: "description", content: 'Kelola pengaturan VENUE UNDIP' },
  ],
});

type OptionRecord = {
  id: number;
  name: string;
  nameKet: string;
  description: string;
  unitName: string;
  unitDesc: string;
  email: string;
  nohp: string;
  address: string;
};

const FALLBACK_OPTIONS = {
  name: "VENUE UNDIP",
  nameKet: "Sistem Reservasi Fasilitas Olahraga Universitas Diponegoro",
  description: "Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.",
  unitName: "UPT Layanan Seni, Budaya dan Olahraga",
  unitDesc: "Unit Pelaksana Teknis yang mengelola fasilitas seni, budaya, dan olahraga di lingkungan Universitas Diponegoro",
  email: "helpdesk@undip.ac.id",
  nohp: "+62 851 6566 0339",
  address: "Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah",
};

const { options: appOptions, refresh } = useAppOptions();

const options = computed(() => appOptions.value.data);
const pending = computed(() => appOptions.value.pending);
const error = computed(() => appOptions.value.error);

const editing = ref(false);
const submitting = ref(false);
const submitError = ref<string | null>(null);
const formState = reactive({
  name: "",
  nameKet: "",
  description: "",
  unitName: "",
  unitDesc: "",
  email: "",
  nohp: "",
  address: "",
});

const syncFormFromData = () => {
  const source = options.value ?? FALLBACK_OPTIONS;
  formState.name = source.name;
  formState.nameKet = source.nameKet;
  formState.description = source.description;
  formState.unitName = source.unitName;
  formState.unitDesc = source.unitDesc;
  formState.email = source.email;
  formState.nohp = source.nohp;
  formState.address = source.address;
};

watch(
  () => options.value,
  () => {
    if (!editing.value) {
      syncFormFromData();
    }
  },
  { immediate: true }
);

watch(editing, (isEditing) => {
  if (!isEditing) {
    submitError.value = null;
    syncFormFromData();
  }
});

// Auto-format WhatsApp number with specific pattern: +62 8XX XXXX XXXX
watch(() => formState.nohp, (newVal) => {
  if (!newVal) return;
  
  let digits = newVal.replace(/\D/g, '');
  
  if (digits.startsWith('08')) {
    digits = '62' + digits.slice(1);
  }

  if (digits.startsWith('62')) {
    let rest = digits.slice(2);
    let formatted = '+62';
    
    if (rest.length > 0) {
      const part1 = rest.slice(0, 3);
      formatted += ' ' + part1;
      
      if (rest.length > 3) {
        const part2 = rest.slice(3, 7);
        formatted += ' ' + part2;
        
        if (rest.length > 7) {
          const part3 = rest.slice(7, 15); 
          formatted += ' ' + part3;
        }
      }
    }
    
    if (formatted !== newVal) {
      formState.nohp = formatted;
    }
  }
});

const startEditing = () => {
  editing.value = true;
  submitError.value = null;
  if (
    !formState.name ||
    !formState.nameKet ||
    !formState.description ||
    !formState.unitName ||
    !formState.unitDesc ||
    !formState.email ||
    !formState.nohp ||
    !formState.address
  ) {
    syncFormFromData();
  }
};

const cancelEditing = () => {
  editing.value = false;
};

const handleSubmit = async () => {
  if (
    !formState.name ||
    !formState.nameKet ||
    !formState.description ||
    !formState.unitName ||
    !formState.unitDesc ||
    !formState.email ||
    !formState.nohp ||
    !formState.address
  ) {
    submitError.value = "Semua field wajib diisi.";
    return;
  }
  const nohp = formState.nohp;
  const phoneRegex = /^(\+62|62)/;
  
  const cleanForValidation = nohp.replace(/\s+/g, '');
  
  if (!phoneRegex.test(cleanForValidation)) {
    submitError.value = "Nomor WhatsApp harus diawali dengan 62 atau +62.";
    return;
  }

  submitting.value = true;
  submitError.value = null;

  try {
    const updated = await $fetch<OptionRecord>("/api/options/update", {
      method: "POST",
      body: {
        name: formState.name,
        nameKet: formState.nameKet,
        description: formState.description,
        unitName: formState.unitName,
        unitDesc: formState.unitDesc,
        email: formState.email,
        nohp: formState.nohp,
        address: formState.address,
      },
    });
    await refresh();
    editing.value = false;
  } catch (err) {
    const parsed = parseBackendError(err);
    submitError.value = parsed.message;
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16 max-w-7xl mx-auto">
    <header
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
    >
      <div class="flex items-start gap-4">
        <div
          class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"
        >
          <svg
            class="w-6 h-6 text-blue-800"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">
            Pengaturan
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Atur pengaturan untuk informasi dasar {{ options?.name || 'VENUE UNDIP' }} yang akan ditampilkan
            pada halaman publik.
          </p>
        </div>
      </div>

      <button
        v-if="!editing"
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm sm:hover:bg-blue-700 sm:hover:shadow-md transition-all active:scale-[0.98]"
        :disabled="pending || Boolean(error)"
        @click="startEditing"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span>Ubah Pengaturan</span>
      </button>
    </header>

    <div
      class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300"
    >
      <div v-if="pending" class="p-12 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"
        ></div>
        <p class="text-sm text-gray-500 font-medium">Memuat data option...</p>
      </div>

      <div v-else-if="error" class="p-6">
        <div
          class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          <p class="font-semibold text-sm">
            Gagal memuat data: {{ error }}
          </p>
          <button
            class="mt-2 text-sm font-bold underline [@media(hover:hover)]:hover:text-red-800 active:text-red-800"
            @click="refresh()"
          >
            Coba lagi
          </button>
        </div>
      </div>

      <div v-else-if="!editing" class="p-6 sm:p-8">
        <!-- Primary Info Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Nama Venue Card - Large Featured -->
          <div
            @click="startEditing"
            class="group lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 text-white shadow-xl sm:hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-[0.99]"
          >
            <!-- Decorative Elements -->
            <div class="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div
                    class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg sm:group-hover:bg-white/40 transition-all duration-300"
                  >
                    <svg
                      class="w-8 h-8 text-white sm:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3C6.48 3 2 5.24 2 8V12C2 14.76 6.48 17 12 17C17.52 17 22 14.76 22 12V8C22 5.24 17.52 3 12 3ZM4 8C4 6.34 7.58 5 12 5C16.42 5 20 6.34 20 8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8ZM20 12C20 12.24 19.94 12.48 19.8 12.71C18.92 14.15 15.78 15 12 15C8.22 15 5.08 14.15 4.2 12.71C4.06 12.48 4 12.24 4 12V10.74C5.77 11.64 8.64 12.25 12 12.25C15.36 12.25 18.23 11.64 20 10.74V12Z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">
                      Nama Venue
                    </p>
                    <p class="text-xs text-blue-200 opacity-90">
                      Identitas Utama Platform
                    </p>
                  </div>
                </div>
                <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold text-white">
                  PRIMARY
                </span>
              </div>
              
              <h2 class="text-4xl font-black tracking-tight break-words">
                {{ options?.name }}
              </h2>
            </div>
          </div>

          <!-- Description Card -->
          <div
            @click="startEditing"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:hover:shadow-lg sm:hover:border-indigo-300 transition-all duration-300 cursor-pointer active:bg-gray-50"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center sm:group-hover:bg-indigo-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-indigo-600 sm:group-hover:text-white transition-colors"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </p>
                </div>
              </div>
              
              <p class="text-sm font-semibold text-gray-900 break-words leading-relaxed mb-1 line-clamp-3">
                {{ options?.description }}
              </p>
              <p class="text-xs text-gray-500">Tagline Platform</p>
            </div>
          </div>
        </div>

        <!-- Secondary Info Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <!-- Nama Keterangan Card -->
          <div
            @click="startEditing"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:hover:shadow-lg sm:hover:border-cyan-300 transition-all duration-300 cursor-pointer active:bg-gray-50"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center sm:group-hover:bg-cyan-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-cyan-600 sm:group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Keterangan Nama
                  </p>
                </div>
              </div>
              
              <p class="text-sm font-semibold text-gray-900 break-words leading-relaxed mb-1 line-clamp-2">
                {{ options?.nameKet }}
              </p>
              <p class="text-xs text-gray-500">Teks di bawah nama venue</p>
            </div>
          </div>

          <!-- Unit Name Card -->
          <div
            @click="startEditing"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:hover:shadow-lg sm:hover:border-violet-300 transition-all duration-300 cursor-pointer active:bg-gray-50"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-violet-50 to-purple-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center sm:group-hover:bg-violet-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-violet-600 sm:group-hover:text-white transition-colors"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-11v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-4z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nama Unit
                  </p>
                </div>
              </div>
              
              <p class="text-sm font-semibold text-gray-900 break-words leading-relaxed mb-1 line-clamp-2">
                {{ options?.unitName }}
              </p>
              <p class="text-xs text-gray-500">Nama unit pengelola</p>
            </div>
          </div>

          <!-- Unit Description Card -->
          <div
            @click="startEditing"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:hover:shadow-lg sm:hover:border-rose-300 transition-all duration-300 cursor-pointer active:bg-gray-50"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center sm:group-hover:bg-rose-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-rose-600 sm:group-hover:text-white transition-colors"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Deskripsi Unit
                  </p>
                </div>
              </div>
              
              <p class="text-sm font-semibold text-gray-900 break-words leading-relaxed mb-1 line-clamp-2">
                {{ options?.unitDesc }}
              </p>
              <p class="text-xs text-gray-500">Keterangan unit pengelola</p>
            </div>
          </div>
        </div>

        <!-- Contact Information Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <!-- Email Card -->
          <div
            @click="startEditing"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:hover:shadow-lg sm:hover:border-purple-300 transition-all duration-300 cursor-pointer active:bg-gray-50"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center sm:group-hover:bg-purple-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-purple-600 sm:group-hover:text-white transition-colors"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email Kontak
                  </p>
                </div>
              </div>
              
              <p class="text-sm font-semibold text-gray-900 break-words mb-1">
                {{ options?.email }}
              </p>
              <p class="text-xs text-gray-500">Kontak Resmi</p>
            </div>
          </div>

          <!-- WhatsApp Card -->
          <div
            @click="startEditing"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:hover:shadow-lg sm:hover:border-emerald-300 transition-all duration-300 cursor-pointer active:bg-gray-50"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center sm:group-hover:bg-emerald-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-emerald-600 sm:group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    WhatsApp
                  </p>
                </div>
              </div>
              
              <p class="text-sm font-semibold text-gray-900 break-words mb-1">
                {{ options?.nohp }}
              </p>
              <p class="text-xs text-gray-500">Layanan Chat</p>
            </div>
          </div>

          <!-- Address Card -->
          <div
            @click="startEditing"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm sm:hover:shadow-lg sm:hover:border-orange-300 transition-all duration-300 cursor-pointer active:bg-gray-50"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center sm:group-hover:bg-orange-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-orange-600 sm:group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </p>
                </div>
              </div>
              
              <p class="text-sm font-semibold text-gray-900 break-words leading-relaxed mb-1 line-clamp-2">
                {{ options?.address }}
              </p>
              <p class="text-xs text-gray-500">Alamat Fisik</p>
            </div>
          </div>
        </div>

        <!-- Info Alert -->
        <div
          class="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 p-5 shadow-sm"
        >
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
          
          <div class="relative z-10 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-blue-900 mb-1">Informasi Penting</h4>
              <p class="text-sm text-blue-800 leading-relaxed">
                Perubahan pada pengaturan ini akan mempengaruhi informasi dasar yang
                ditampilkan pada halaman publik <span class="font-bold">{{ options?.name }}</span>. 
                Pastikan data yang dimasukkan akurat dan sesuai dengan kebijakan institusi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-6 sm:p-8">
        <div class="max-w-5xl mx-auto">
          <!-- Edit Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                Edit Informasi Platform
              </h2>
              <p class="text-xs text-gray-500 mt-1">
                Perbarui data {{ options?.name }} yang ditampilkan pada halaman publik
              </p>
            </div>
            <button
              class="p-2 text-gray-400 sm:hover:text-gray-600 sm:hover:bg-gray-100 active:bg-gray-100 rounded-full transition-colors"
              @click="cancelEditing"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Warning Alert -->
          <div
            class="relative overflow-hidden mb-8 flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-200 shadow-sm"
          >
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl"></div>
            
            <div class="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="flex-1 relative z-10">
              <p class="text-sm font-bold text-amber-900 mb-1">Perhatian Penting</p>
              <p class="text-sm text-amber-800 leading-relaxed">
                Mengubah informasi dasar {{ options?.name }} akan mempengaruhi
                tampilan pada halaman publik. Pastikan data yang dimasukkan
                akurat dan sesuai dengan kebijakan institusi.
              </p>
            </div>
          </div>

          <!-- FORM with PREMIUM DESIGN -->
          <form
            @submit.prevent="handleSubmit"
            @keydown.enter="onFormEnter"
            class="space-y-8 bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-xl"
          >
            <!-- Primary Fields Section -->
            <div>
              <h3 class="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                Informasi Utama
              </h3>
              <p class="text-xs text-gray-500 mb-5 ml-3">Data identitas platform</p>
              
              <div class="grid gap-6 sm:grid-cols-2">
              <!-- Nama Venue -->
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Nama Venue</label
                >
                <div class="relative group">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formState.name"
                    type="text"
                    maxlength="30"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400"
                    placeholder="Contoh: VENUE UNDIP"
                    required
                    :disabled="submitting"
                  >
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Identitas utama platform</span>
                  <span :class="formState.name.length > 25 ? 'text-amber-600 font-medium' : ''">{{ formState.name.length }}/30</span>
                </div>
              </div>
              <!-- Keterangan Nama -->
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Keterangan Nama</label
                >
                <div class="relative group">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formState.nameKet"
                    type="text"
                    maxlength="70"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400"
                    placeholder="Contoh: Booking Lapangan Olahraga Universitas Diponegoro"
                    required
                    :disabled="submitting"
                  >
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Ditampilkan di bawah nama venue di TopBar</span>
                  <span :class="formState.nameKet.length > 60 ? 'text-amber-600 font-medium' : ''">{{ formState.nameKet.length }}/70</span>
                </div>
              </div>
              <!-- Deskripsi -->
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Deskripsi</label
                >
                <div class="relative group">
                  <div
                    class="absolute top-3 left-0 pl-3 flex items-start pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <textarea
                    v-model="formState.description"
                    rows="3"
                    maxlength="300"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400 resize-none"
                    placeholder="Platform booking lapangan olahraga..."
                    required
                    :disabled="submitting"
                  ></textarea>
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Ditampilkan sebagai tagline platform di halaman utama</span>
                  <span :class="formState.description.length > 280 ? 'text-amber-600 font-medium' : ''">{{ formState.description.length }}/300</span>
                </div>
              </div>
              <!-- Alamat -->
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Alamat</label
                >
                <div class="relative group">
                  <div
                    class="absolute top-3 left-0 pl-3 flex items-start pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <textarea
                    v-model="formState.address"
                    rows="3"
                    maxlength="200"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400 resize-none"
                    placeholder="Jl. Prof. Soedarto, Tembalang, Semarang..."
                    required
                    :disabled="submitting"
                  ></textarea>
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Ditampilkan di Footer dan halaman bantuan</span>
                  <span :class="formState.address.length > 180 ? 'text-amber-600 font-medium' : ''">{{ formState.address.length }}/200</span>
                </div>
              </div>
              </div>
            </div>

            <!-- Secondary Info Section -->
            <div class="pt-6 border-t-2 border-gray-100">
              <h3 class="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                <div class="w-1 h-5 bg-cyan-600 rounded-full"></div>
                Informasi Tambahan
              </h3>
              <p class="text-xs text-gray-500 mb-5 ml-3">Data unit pengelola</p>
              
              <div class="grid gap-6 sm:grid-cols-2">
              <!-- Nama Unit -->
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Nama Unit</label
                >
                <div class="relative group">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formState.unitName"
                    type="text"
                    maxlength="70"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400"
                    placeholder="Contoh: UPT Layanan Seni, Budaya dan Olahraga"
                    required
                    :disabled="submitting"
                  >
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Ditampilkan di halaman utama dan footer</span>
                  <span :class="formState.unitName.length > 60 ? 'text-amber-600 font-medium' : ''">{{ formState.unitName.length }}/70</span>
                </div>
              </div>
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Deskripsi Unit</label
                >
                <div class="relative group">
                  <div
                    class="absolute top-3 left-0 pl-3 flex items-start pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <textarea
                    v-model="formState.unitDesc"
                    rows="3"
                    maxlength="300"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400 resize-none"
                    placeholder="Deskripsi tentang unit pengelola..."
                    required
                    :disabled="submitting"
                  ></textarea>
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Keterangan unit pengelola</span>
                  <span :class="formState.unitDesc.length > 280 ? 'text-amber-600 font-medium' : ''">{{ formState.unitDesc.length }}/300</span>
                </div>
              </div>
              </div>
            </div>
            <!-- Contact Section -->
            <div class="pt-6 border-t-2 border-gray-100">
              <h3 class="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                <div class="w-1 h-5 bg-emerald-600 rounded-full"></div>
                Informasi Kontak
              </h3>
              <p class="text-xs text-gray-500 mb-5 ml-3">Data untuk komunikasi dengan pengguna</p>
              
              <div class="grid gap-6 sm:grid-cols-2">
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Email</label
                >
                <div class="relative group">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formState.email"
                    type="email"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400"
                    placeholder="helpdesk@undip.ac.id"
                    required
                    :disabled="submitting"
                  >
                </div>
              </div>
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >No. WhatsApp</label
                >
                <div class="relative group">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formState.nohp"
                    type="text"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400"
                    placeholder="+62 851 6566 0339"
                    required
                    :disabled="submitting"
                  >
                </div>
              </div>
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="submitError"
              class="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-semibold flex items-center gap-3"
            >
              <svg
                class="w-5 h-5 shrink-0 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ submitError }}
            </div>

            <!-- Action Buttons -->
            <!-- Action Buttons -->
            <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all active:scale-[0.98] sm:hover:bg-blue-50 sm:hover:text-blue-700 sm:hover:border-blue-300"
                :disabled="submitting"
                @click="cancelEditing"
              >
                Batal
              </button>
              <button
                type="submit"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm sm:hover:bg-blue-700 sm:hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                :disabled="submitting"
              >
                <svg
                  v-if="submitting"
                  class="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
