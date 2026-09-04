import LoadingScreen from '@/componets/LoadingScreen';

export default function Loading() {
  return (
    <LoadingScreen
      message="Memuat Halaman..."
      subMessage="Kelana AI sedang menyiapkan rencana perjalananmu"
      fullScreen={true}
    />
  );
}
