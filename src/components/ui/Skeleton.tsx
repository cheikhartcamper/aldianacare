interface SkeletonProps {
  className?: string;
  rows?: number;
  height?: string;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-5 h-5 rounded" />
      </div>
      <Skeleton className="h-3 w-20 mt-3" />
      <Skeleton className="h-8 w-12 mt-1.5" />
    </div>
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  const widths = ['w-32', 'w-20', 'w-24', 'w-16', 'w-20', 'w-14'];
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3.5 pr-4">
          <Skeleton className={`h-4 ${widths[i % widths.length]}`} />
          {i === 0 && <Skeleton className="h-3 w-24 mt-1.5" />}
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: SkeletonProps & { cols?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </tbody>
  );
}

export function SkeletonList({ rows = 5 }: SkeletonProps) {
  return (
    <div className="divide-y divide-gray-50">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3.5">
          <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
