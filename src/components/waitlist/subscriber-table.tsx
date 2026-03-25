import type { Subscriber } from "@/types";

type Props = { subscribers: Subscriber[] };

export function SubscriberTable({ subscribers }: Props) {
  if (subscribers.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No subscribers yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-zinc-500">
            <th className="pb-2 pr-4 font-medium">#</th>
            <th className="pb-2 pr-4 font-medium">Email</th>
            <th className="pb-2 pr-4 font-medium">Status</th>
            <th className="pb-2 pr-4 font-medium">Referral Code</th>
            <th className="pb-2 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => (
            <tr key={sub.id} className="border-b last:border-0">
              <td className="py-3 pr-4 font-medium">{sub.position}</td>
              <td className="py-3 pr-4">{sub.email}</td>
              <td className="py-3 pr-4">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  sub.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : sub.status === "invited"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}>
                  {sub.status}
                </span>
              </td>
              <td className="py-3 pr-4 font-mono text-xs text-zinc-500">
                {sub.referral_code}
              </td>
              <td className="py-3 text-zinc-500">
                {new Date(sub.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
