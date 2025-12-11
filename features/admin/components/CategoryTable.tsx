// /features/admin/components/CategoryTable.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/error";
import { FormSuccess } from "@/components/success";

import { updateCategory } from "@/lib/server/admin/actions/updateCategory";
import { deleteCategory } from "@/lib/server/admin/actions/deleteCategory";

type CategoryItem = {
  id: number;
  categoryId: string;
  name: string;
};

type CategoryTableProps = {
  categories: CategoryItem[];
};

export function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // どのアクション中か： "update" | "delete" | null
  const [pendingAction, setPendingAction] = useState<"update" | "delete" | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetLabel, setDeleteTargetLabel] = useState<string>("");

  const handleEditStart = (cat: CategoryItem) => {
    setError(undefined);
    setSuccess(undefined);
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleEditSave = () => {
    if (!editingId) return;

    setError(undefined);
    setSuccess(undefined);

    // ★ どのアクションか記録
    setPendingAction("update");

    startTransition(async () => {
      const result = await updateCategory({
        id: editingId,
        name: editingName.trim(),
      });

      if (result?.error) {
        setError(result.error);
        setPendingAction(null);  // ★ 終了
        return;
      }

      setSuccess(result?.success ?? "カテゴリを更新しました。");
      setEditingId(null);
      setEditingName("");
      setPendingAction(null);    // ★ 終了

      router.refresh();
    });
  };

  const handleDeleteClick = (cat: CategoryItem) => {
    setError(undefined);
    setSuccess(undefined);

    setDeleteTargetId(cat.id);
    setDeleteTargetLabel(`${cat.categoryId} / ${cat.name}`);
    onOpen();
  };

  const handleDeleteConfirm = (onClose: () => void) => {
    if (!deleteTargetId) return;

    startTransition(async () => {
      setError(undefined);
      setSuccess(undefined);
      setPendingAction("delete");  // ★

      const result = await deleteCategory({ id: deleteTargetId });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(result?.success ?? "カテゴリを削除しました。");
      }

      setDeleteTargetId(null);
      setPendingAction(null);    // ★
      onClose();
      router.refresh();
    });
  };

  return (
    <>
      <Table aria-label="カテゴリ一覧テーブル">
        <TableHeader>
          <TableColumn className="w-[140px] text-xs font-semibold">
            カテゴリID
          </TableColumn>
          <TableColumn className="text-xs font-semibold">
            カテゴリ名
          </TableColumn>
          <TableColumn className="w-[200px] text-xs font-semibold">
            操作
          </TableColumn>
        </TableHeader>

        {/* ★ ここを items / レンダープロップではなく、普通の map に変更 */}
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                まだカテゴリが登録されていません。
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => {
              const isEditing = editingId === cat.id;

              return (
                <TableRow
                  key={cat.id}
                  className="border-b border-dashed last:border-b-0"
                >
                  <TableCell className="font-mono text-xs">
                    {cat.categoryId}
                  </TableCell>

                  <TableCell className="text-sm">
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        disabled={isPending}
                        className="max-w-xs"
                      />
                    ) : (
                      cat.name
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          intent="primary"
                          onClick={handleEditCancel}
                          disabled={isPending}
                          className="gap-1.5"
                        >
                          <X className="h-4 w-4" />
                          <span>キャンセル</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="default"
                          intent="danger"
                          onClick={handleEditSave}
                          disabled={isPending || editingName.trim().length === 0}
                          className="gap-1.5"
                        >
                          {pendingAction === "update" && isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          <span>保存</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          intent="primary"
                          onClick={() => handleEditStart(cat)}
                          disabled={isPending}
                          className="gap-1.5"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>編集</span>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          intent="danger"
                          onClick={() => handleDeleteClick(cat)}
                          disabled={isPending}
                          className="gap-1.5"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>削除</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="mt-4 space-y-2">
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        hideCloseButton={isPending}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                カテゴリ削除の確認
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  本当に以下のカテゴリを削除してよろしいですか？
                </p>
                <p className="text-sm font-semibold text-destructive">
                  {deleteTargetLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  ※ このカテゴリに商品が登録されている場合、削除できません。
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  variant="outline"
                  intent="primary"
                  onClick={onClose}
                  disabled={isPending}
                  className="gap-1.5"
                >
                  <X className="h-4 w-4" />
                  <span>いいえ</span>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  intent="danger"
                  onClick={() => handleDeleteConfirm(onClose)}
                  disabled={isPending}
                  className="gap-1.5"
                >
                  {pendingAction === "delete" && isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>はい、削除する</span>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
