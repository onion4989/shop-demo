import { Link, Button } from "@nextui-org/react";

export function EditButton({ productid }: { productid: string }) {
  return (
    <Button as={Link} href={`/dashboard/edit?productid=${productid}`} radius="full" size="sm">
      編集
    </Button>
  );
}
