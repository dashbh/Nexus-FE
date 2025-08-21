import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardSkeletonProps {
  title?: boolean;
  description?: boolean;
}

export function CardSkeleton({ title = true, description = true }: CardSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        {title && <Skeleton className="h-6 w-32" />}
        {description && <Skeleton className="h-4 w-48" />}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

export function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}
