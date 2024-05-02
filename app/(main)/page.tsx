'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col items-center justify-center p-4 gap-2">
      <div className="relative w-[150px] h-[150px] lg:w-[300px] lg:h-[300px] mb-8 lg:mb-0">
        <Image src='/images/undraw_folder_files_re_2cbm.svg' fill alt='folders' className="object-contain" />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl lg:text-2xl font-bold text-neutral-600 max-w-[480px] text-center">
          Personal File Management App
        </h1>
      </div>
    </div>
    </>
  );
}
