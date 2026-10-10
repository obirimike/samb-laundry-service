type ServicePageProps = {
  params: { slug: string };
};

export default function ServicePage({ params }: ServicePageProps) {
  const { slug } = params;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Service: {slug}</h1>
      <p className="mt-2 text-slate-600">This page is ready for content.</p>
    </main>
  );
}
