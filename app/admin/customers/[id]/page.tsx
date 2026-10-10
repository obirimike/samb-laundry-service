type CustomerDetailPageProps = {
  params: { id: string };
};

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = params;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Customer {id}</h1>
      <p className="mt-2 text-slate-600">This page is ready for content.</p>
    </main>
  );
}
