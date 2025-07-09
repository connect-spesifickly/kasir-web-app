import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
export const ProductSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
    </CardContent>
  </Card>
);
