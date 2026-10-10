type AdminBookingDetailPageProps = {
  params: { id: string };
};

export default function AdminBookingDetailPage({ params }: AdminBookingDetailPageProps) {
  const { id } = params;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Booking {id}</h1>
      <p className="mt-2 text-slate-600">This page is ready for content.</p>
    </main>
  );
}
