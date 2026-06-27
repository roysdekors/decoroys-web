import UrunClient from "./UrunClient";

export default async function UrunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UrunClient id={id} />;
}
