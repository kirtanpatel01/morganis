"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActiveStore } from "../../actions";
import { Separator } from "@/components/ui/separator";

interface StoreCardProps {
  store: ActiveStore;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Card className="max-w-72">
      <CardHeader>
          <div>
            <div className="flex justify-between items-start w-full">
                <CardTitle>{store.name}</CardTitle>
                <Badge variant="secondary">Active</Badge>
            </div>
            <CardDescription>
              {store.owner_name}
            </CardDescription>
          </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {store.category_names && store.category_names.length > 0 ? (
            store.category_names.slice(0, 3).map((cat, i) => ( // Show max 3 categories
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {cat}
              </Badge>
            ))
          ) : (
             <span className="text-xs text-muted-foreground italic">No categories</span>
          )}
          {store.category_names && store.category_names.length > 3 && (
             <Badge variant="outline" className="text-xs font-normal">+{store.category_names.length - 3}</Badge>
          )}
        </div>
        
        {store.address && (
          <div className="flex items-start gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed line-clamp-2">{store.address}</p>
          </div>
        )}
      </CardContent>
      {/* <Separator /> */}
      <CardFooter>
        <Link href={`/stores/${store.id}`} className="mx-auto">
          <Button className="cursor-pointer" size="sm">
            Visit Shop
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
