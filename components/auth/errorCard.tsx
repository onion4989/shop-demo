// /home/takashi_ogawa/shop-demo/components/auth/errorCard.tsx
import { CardWrapper } from "@/components/auth/cardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="おっと! 何か問題が発生しました。"
      backButtonHref="/auth/login"
      backButtonLabel="ログインへ戻る"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
    /*     <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="" />
      </CardHeader>
      <CardFooter>
        <BackButton label="ログインへ戻る" href="" />
      </CardFooter>
    </Card> */
  );
};
