import React from "react";
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";

export function SmallCardSkeleton() {
  return (
    <Card className="w-[180px] h-[176px] space-y-5 p-4" radius="lg">
      <div className="absolute inset-x-0 bottom-2 min-h-[64px] bg-gray-100 bg-background/80 rounded-small mx-2 py-2 px-4">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg my-3">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </Card>
  );
}

export function SearchSkelton() {
  return (
    <section className="w-[1200px] flex gap-8 m-auto my-24">
      <SmallCardSkeleton />
      <SmallCardSkeleton />
      <SmallCardSkeleton />
      <SmallCardSkeleton />
      <SmallCardSkeleton />
      <SmallCardSkeleton />
    </section>
  );
}
