// app/ui/dashboard/control/button.tsx
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export function EditButton({ productid }: { productid: string }) {
  return (
    <Button as={Link} href={`/dashboard/edit?productid=${productid}`} radius="full" size="sm">
      編集
    </Button>
  );
}
