<script setup lang="ts">
import { parseBackendError } from "~/utils/errorParser";

defineOptions({ name: "AdminOptions" });
definePageMeta({
  name: "admin-options",
  layout: "admin",
  middleware: "auth-admin",
  ssr: false,
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
  nameKet: "Booking Lapangan Olahraga Universitas Diponegoro",
  description: "Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.",
  unitName: "UPT Layanan Seni, Budaya dan Olahraga",
  unitDesc: "Unit Pelaksana Teknis untuk mengelola fasilitas olahraga di lingkungan Universitas Diponegoro",
  email: "contact@venueundip.id",
  nohp: "+62 851 6566 0339",
  address: "Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah",
};

const { options: appOptions, refresh } = useAppOptions();

// Create computed wrappers to match existing template usage
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
  formState.unitName = source.unitName;
  formState.unitDesc = source.unitDesc;
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
    !formState.unitName ||
    !formState.unitDesc ||
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
    await refresh(); // Refresh global state to reflect changes
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
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16">
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
              d="M7 3V5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H17V3H15V5H9V3H7ZM5 9H19V19H5V9ZM7 11V13H12V11H7ZM13 11V13H17V11H13ZM7 15V17H12V15H7ZM13 15V17H17V15H13Z"
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
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
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
            Gagal memuat data: {{ error.message }}
          </p>
          <button
            class="mt-2 text-sm font-bold underline hover:text-red-800"
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
            class="group lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <!-- Decorative Elements -->
            <div class="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div
                    class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-white/40 transition-all duration-300"
                  >
                    <svg
                      class="w-8 h-8 text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
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
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors"
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
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-cyan-300 transition-all duration-300"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-cyan-600 group-hover:text-white transition-colors"
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
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all duration-300"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-violet-50 to-purple-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-violet-600 group-hover:text-white transition-colors"
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
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-rose-300 transition-all duration-300"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-rose-600 group-hover:text-white transition-colors"
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
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors"
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
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-purple-600 group-hover:text-white transition-colors"
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
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300"
          >
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <svg
                    class="w-5 h-5 text-orange-600 group-hover:text-white transition-colors"
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
          <div
            class="relative overflow-hidden mb-8 pb-6 border-b-2 border-gray-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <svg
                    class="w-7 h-7 text-white"
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
                </div>
                <div>
                  <h2 class="text-2xl font-black text-gray-900 tracking-tight">
                    Edit Informasi Platform
                  </h2>
                  <p class="text-sm text-gray-500 mt-0.5 font-medium">
                    Perbarui data {{ options?.name }} yang ditampilkan pada halaman publik
                  </p>
                </div>
              </div>
              <button
                class="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                @click="cancelEditing"
              >
                <svg
                  class="w-6 h-6"
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
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400"
                    placeholder="Contoh: VENUE UNDIP"
                    required
                    :disabled="submitting"
                  >
                </div>
              </div>
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Alamat</label
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
                  <input
                    v-model="formState.address"
                    type="text"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400"
                    placeholder="Jl. Prof. Soedarto, Tembalang..."
                    required
                    :disabled="submitting"
                  >
                </div>
              </div>
              <div class="space-y-2">
                <label
                  class="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >Deskripsi</label
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formState.description"
                    type="text"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400"
                    placeholder="Platform booking lapangan..."
                    required
                    :disabled="submitting"
                  >
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
              <p class="text-xs text-gray-500 mb-5 ml-3">Data tambahan platform dan unit pengelola</p>
              
              <div class="grid gap-6 sm:grid-cols-2">
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
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400"
                    placeholder="Contoh: Booking Lapangan Olahraga Universitas Diponegoro"
                    required
                    :disabled="submitting"
                  >
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Teks di bawah nama venue di TopBar</span>
                  <span :class="formState.nameKet.length > 60 ? 'text-amber-600 font-medium' : ''">{{ formState.nameKet.length }}/70</span>
                </div>
              </div>
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formState.unitName"
                    type="text"
                    maxlength="70"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400"
                    placeholder="Contoh: UPT Layanan Seni, Budaya dan Olahraga"
                    required
                    :disabled="submitting"
                  >
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Nama unit pengelola di halaman utama</span>
                  <span :class="formState.unitName.length > 60 ? 'text-amber-600 font-medium' : ''">{{ formState.unitName.length }}/70</span>
                </div>
              </div>
              <div class="space-y-2 sm:col-span-2">
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
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400 resize-none"
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
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400"
                    placeholder="contact@venueundip.id"
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
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400"
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
            <div class="flex items-center justify-end gap-4 pt-6 border-t-2 border-gray-100">
              <button
                type="button"
                class="px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95 shadow-sm"
                :disabled="submitting"
                @click="cancelEditing"
              >
                Batal
              </button>
              <button
                type="submit"
                class="inline-flex items-center gap-3 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                :disabled="submitting"
              >
                <svg
                  v-if="submitting"
                  class="animate-spin h-5 w-5 text-white"
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
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
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
