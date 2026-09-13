import Link from 'next/link'

type ProblemPageProps = {
  bgClassName: string
  textClassName: string
  buttonClassName: string
}

export function ProblemPage({
  bgClassName,
  textClassName,
  buttonClassName,
}: ProblemPageProps) {
  return (
    <main
      className={`flex min-h-dvh w-full items-center justify-center px-6 ${bgClassName}`}
    >
      <div className="flex max-w-md flex-col items-center gap-8 text-center">
        <p className={`text-base font-medium leading-relaxed md:text-lg ${textClassName}`}>
          何か問題が発生しました。下記のボタンからお戻りください。
        </p>
        <Link
          href="/"
          prefetch={false}
          className={`inline-flex min-h-11 min-w-[160px] items-center justify-center rounded-md px-6 text-sm font-bold ${buttonClassName}`}
        >
          Topへ戻る
        </Link>
      </div>
    </main>
  )
}
