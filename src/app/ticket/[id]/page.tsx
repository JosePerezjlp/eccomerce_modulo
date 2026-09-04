import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrder } from '@/lib/api';
import Countdown from '@/components/Countdown';

function money(v: string | number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v));
}

const STATUS_LABEL: Record<string, string> = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_CONFIRMADO: 'Pago confirmado',
  EN_PREPARACION: 'En preparación',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
  VENCIDO: 'Vencido',
};

export default async function TicketPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id).catch(() => null);
  if (!order) return notFound();

  const isPending = order.status === 'PENDIENTE_PAGO';

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Ticket</p>
            <h1 className="text-2xl font-extrabold text-gray-900">{order.ticketNumber}</h1>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>

        {isPending && (
          <div className="mb-6 rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-sm font-semibold text-amber-700">Tiempo restante para transferir</p>
            <Countdown expiresAt={order.expiresAt} />
            <p className="mt-1 text-xs text-amber-600">
              Si no se acredita el pago a tiempo, el pedido se cancela y el stock se libera automáticamente.
            </p>
          </div>
        )}

        <div className="mb-6 rounded-xl border border-gray-200 p-4">
          <h2 className="mb-2 font-bold text-gray-900">Detalle del pedido</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.quantity} × {i.productName}
                </span>
                <span>{money(i.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="my-3 border-t border-gray-200" />
          <div className="flex justify-between text-lg font-extrabold">
            <span>Total a transferir</span>
            <span>{money(order.total)}</span>
          </div>
        </div>

        <div className="rounded-xl bg-gray-900 p-4 text-white">
          <h2 className="mb-2 font-bold">Datos para transferir</h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">CBU</span>
            <span className="font-mono font-bold">{order.bankCbu}</span>
          </div>
          {order.bankAlias && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Alias</span>
              <span className="font-mono font-bold">{order.bankAlias}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Titular</span>
            <span className="font-bold">{order.bankHolder}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Importe</span>
            <span className="font-bold">{money(order.total)}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Una vez realizada la transferencia, guardá el comprobante. El local confirmará el pago y comenzará
          a preparar tu pedido.
        </p>

        <Link href="/" className="mt-6 block text-center text-sm font-semibold text-brand-500 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
