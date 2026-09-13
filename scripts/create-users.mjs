/**
 * Script untuk membuat user akun Supabase
 * 
 * CARA PAKAI:
 * 1. Buka: https://supabase.com/dashboard/project/epyfhgqavfrkbrycofay/settings/api
 * 2. Salin "service_role" key (bukan anon key)
 * 3. Paste di bawah ini pada variabel SERVICE_ROLE_KEY
 * 4. Jalankan: node scripts/create-users.mjs
 */

const SUPABASE_URL = 'https://epyfhgqavfrkbrycofay.supabase.co';
const SERVICE_ROLE_KEY = 'PASTE_SERVICE_ROLE_KEY_DI_SINI'; // ← ganti ini

// ============================================================
// Daftar user yang akan dibuat
// Password sementara — bisa diubah di halaman Pengaturan
// ============================================================
const USERS = [
  { email: 'keuangan@untukteman.id',                    password: 'UntukTeman@2024' },
  { email: 'admin@untukteman.id',                       password: 'UntukTeman@2024' },
  { email: 'untuktemanid@gmail.com',                    password: 'UntukTeman@2024' },
  { email: 'muhammadfavian.2023@student.uny.ac.id',     password: 'UntukTeman@2024' },
  { email: 'saprinamelita.2023@student.uny.ac.id',      password: 'UntukTeman@2024' },
];

// ============================================================

if (SERVICE_ROLE_KEY === 'PASTE_SERVICE_ROLE_KEY_DI_SINI') {
  console.error('❌  Harap isi SERVICE_ROLE_KEY terlebih dahulu di dalam script ini!');
  console.error('   Buka: https://supabase.com/dashboard/project/epyfhgqavfrkbrycofay/settings/api');
  process.exit(1);
}

async function createUser(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true, // langsung aktif, tidak perlu konfirmasi email
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.message?.includes('already been registered') || data.code === 'email_exists') {
      return { status: 'exists', email };
    }
    return { status: 'error', email, message: data.message || data.msg || JSON.stringify(data) };
  }

  return { status: 'created', email, id: data.id };
}

async function main() {
  console.log('Membuat user akun Supabase...\n');

  for (const user of USERS) {
    const result = await createUser(user.email, user.password);

    if (result.status === 'created') {
      console.log(`OK  Berhasil dibuat : ${result.email}`);
    } else if (result.status === 'exists') {
      console.log(`!   Sudah ada       : ${result.email}`);
    } else {
      console.log(`ERR Gagal           : ${result.email}`);
      console.log(`    Error: ${result.message}`);
    }
  }

  console.log('\nSelesai! Password sementara: UntukTeman@2024');
  console.log('Setiap user bisa ubah password sendiri di halaman Pengaturan.');
}

main().catch(console.error);
