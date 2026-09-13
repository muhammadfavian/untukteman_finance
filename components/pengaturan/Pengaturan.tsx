'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  getUserProfile,
  uploadProfileAvatar,
  removeProfileAvatar,
  updateUserPassword,
  UserProfileData,
} from '@/lib/supabase/services';
import AdminProfileDropdown from '@/components/common/AdminProfileDropdown';
import styles from './Pengaturan.module.css';

/* ── SVG Icons ── */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}



function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState<'avatar' | 'password'>('avatar');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* User profile data from Supabase Auth */
  const [profile, setProfile] = useState<UserProfileData>({
    id: '',
    email: '',
    nama: '',
    role: 'Admin',
    avatarUrl: '',
  });

  /* Avatar upload state */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  /* Password state */
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* Toast notification */
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  /* Load profile from Supabase Auth */
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        if (isMounted) {
          setProfile(data);
          setPreviewUrl(data.avatarUrl);
        }
      } catch (e) {
        console.error('Error loading user profile:', e);
      }
    };

    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
    };
  }, []);

  /* ── 1. Avatar Handlers ── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG, WebP
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Format file tidak didukung! Gunakan format JPG, PNG, atau WebP.', 'error');
      return;
    }

    // Validate max size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file terlalu besar! Maksimal 5MB.', 'error');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!selectedFile) {
      showToast('Silakan pilih foto profil terlebih dahulu.', 'error');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const uploadedUrl = await uploadProfileAvatar(selectedFile);
      setProfile((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
      setSelectedFile(null);
      showToast('Foto profil berhasil diperbarui!');
    } catch (err: unknown) {
      console.error('Upload avatar error:', err);
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah foto profil.';
      showToast(msg, 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelAvatarSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(profile.avatarUrl);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      await removeProfileAvatar();
      setProfile((prev) => ({ ...prev, avatarUrl: '' }));
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Foto profil berhasil dihapus.');
    } catch {
      showToast('Gagal menghapus foto profil.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  /* ── 2. Password Handlers ── */
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword.trim()) {
      showToast('Kata sandi saat ini wajib diisi!', 'error');
      return;
    }

    if (!passwordForm.newPassword.trim()) {
      showToast('Kata sandi baru wajib diisi!', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('Kata sandi baru minimal harus 6 karakter!', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Kata sandi baru dan konfirmasi kata sandi harus sama!', 'error');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await updateUserPassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      showToast('Kata sandi berhasil diubah!');
    } catch (err: unknown) {
      console.error('Update password error:', err);
      const msg = err instanceof Error ? err.message : 'Gagal mengubah kata sandi.';
      showToast(msg, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getInitials = (name: string, email?: string) => {
    const str = (name || email?.split('@')[0] || 'User').trim();
    const parts = str.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className={styles.container}>
      {/* ── Top Header Bar ── */}
      <div className={styles.topHeader}>
        <div className={styles.topSearchWrap}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Cari pengaturan akun atau profil..."
            className={styles.topSearchInput}
          />
        </div>
        <div className={styles.topRightActions}>
          <AdminProfileDropdown profile={profile} />
        </div>
      </div>

      {/* ── Toast Alert ── */}
      {toast && (
        <div className={toast.type === 'success' ? styles.toastSuccess : styles.toastError}>
          <div className={styles.toastLeft}>
            {toast.type === 'success' ? <CheckIcon /> : <span>⚠️</span>}
            <span>{toast.message}</span>
          </div>
          <button className={styles.toastCloseBtn} onClick={() => setToast(null)}>
            &times;
          </button>
        </div>
      )}

      {/* ── Section Title ── */}
      <div className={styles.titleSection}>
        <div className={styles.sectionTag}>PENGATURAN AKUN</div>
        <h1 className={styles.mainTitle}>Pengaturan Akun &amp; Profil</h1>
        <p className={styles.mainSubtitle}>
          Kelola foto profil akun dan atur kata sandi keamanan Anda.
        </p>
      </div>

      {/* ── Profile Hero Summary Card ── */}
      <div className={styles.profileHeroCard}>
        <div className={styles.heroLeft}>
          <div className={styles.bigAvatarWrapper}>
            <div className={styles.bigAvatar}>
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={previewUrl} alt={profile.nama} />
              ) : (
                getInitials(profile.nama, profile.email)
              )}
            </div>
            <button
              className={styles.avatarEditBadge}
              title="Ubah Foto Profil"
              onClick={() => {
                setActiveTab('avatar');
                fileInputRef.current?.click();
              }}
            >
              <CameraIcon />
            </button>
          </div>
          <div className={styles.heroInfo}>
            <h2 className={styles.heroName}>
              {profile.nama || 'User'}
            </h2>
            {profile.email && <p className={styles.heroEmail}>{profile.email}</p>}
          </div>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statPill}>
            <span className={styles.statPillLabel}>Status Akun</span>
            <span className={styles.statPillValue}>
              <span className={styles.statusIndicatorDot} /> Aktif &amp; Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className={styles.tabsNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'avatar' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('avatar')}
        >
          <UserIcon />
          <span>Ubah Foto Profil</span>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'password' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <LockIcon />
          <span>Atur / Ubah Kata Sandi</span>
        </button>
      </div>

      {/* ── BAGIAN 1: UBAH FOTO PROFIL ── */}
      {activeTab === 'avatar' && (
        <div className={styles.contentCard}>
          <div className={styles.cardSectionHeader}>
            <h3 className={styles.cardSectionTitle}>Foto Profil Akun</h3>
            <p className={styles.cardSectionDesc}>
              Unggah dan perbarui foto profil Anda. Foto ini akan ditampilkan di seluruh aplikasi yayasan.
            </p>
          </div>

          <div className={styles.avatarSection}>
            <div className={styles.avatarSectionPreview}>
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={previewUrl} alt="Preview Foto Profil" />
              ) : (
                getInitials(profile.nama)
              )}
            </div>
            <div className={styles.avatarSectionControls}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <div className={styles.avatarBtnRow}>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  <CameraIcon /> Ubah Foto
                </button>
                {selectedFile && (
                  <button
                    type="button"
                    className={styles.saveBtn}
                    onClick={handleSaveAvatar}
                    disabled={isUploadingAvatar}
                  >
                    <CheckIcon /> {isUploadingAvatar ? 'Menyimpan...' : 'Simpan Foto Profil'}
                  </button>
                )}
                {selectedFile && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={handleCancelAvatarSelection}
                    disabled={isUploadingAvatar}
                  >
                    Batal
                  </button>
                )}
                {!selectedFile && profile.avatarUrl && (
                  <button
                    type="button"
                    className={styles.deleteAvatarBtn}
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
              <span className={styles.avatarTip}>
                Format yang didukung: JPG, JPEG, PNG, atau WebP (Maks. 5MB).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── BAGIAN 2: ATUR / UBAH KATA SANDI ── */}
      {activeTab === 'password' && (
        <form onSubmit={handleSavePassword} className={styles.contentCard}>
          <div className={styles.cardSectionHeader}>
            <h3 className={styles.cardSectionTitle}>Atur / Ubah Kata Sandi</h3>
            <p className={styles.cardSectionDesc}>
              Perbarui kata sandi akun Supabase Auth Anda untuk menjaga keamanan akses.
            </p>
          </div>

          <div className={styles.formGrid}>
            {/* Kata Sandi Saat Ini */}
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.label}>Kata Sandi Saat Ini</label>
              <div className={styles.inputWrap}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Masukkan kata sandi saat ini"
                />
                <button
                  type="button"
                  className={styles.eyeToggleBtn}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Kata Sandi Baru */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Kata Sandi Baru</label>
              <div className={styles.inputWrap}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Masukkan kata sandi baru"
                />
                <button
                  type="button"
                  className={styles.eyeToggleBtn}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Konfirmasi Kata Sandi Baru</label>
              <div className={styles.inputWrap}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Ulangi kata sandi baru"
                />
                <button
                  type="button"
                  className={styles.eyeToggleBtn}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className={styles.cardFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}
              disabled={isUpdatingPassword}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isUpdatingPassword}
            >
              <LockIcon /> {isUpdatingPassword ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
