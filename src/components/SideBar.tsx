"use client";
import { sidebarLinks } from '../../constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const SideBar = () => {
  const pathname = usePathname();
  return (
    <div className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-[#1C1F2E] p-6 pt-28 text-white max-sm:hidden
    lg:w-[264px]">
        <div className='flex flex-1 flex-col gap-6'>
            {
                sidebarLinks.map((link) =>{
                    const isActive = pathname ===link.route || pathname.startsWith(`${link.route}/s`);

                    return(
                        <Link
                        href={link.route}
                        key={link.label}
                        className={cn('flex gap-4 items-center p-4 rounded-lg justify-start',{
                            'bg-[#0E78F9]':isActive
                        })}
                        >
                            <Image 
                            src={link.Imgurl}
                            width={24}
                            height={24}
                            alt={link.label}
                            />
                            <p className='text-lg font-semibold max-lg-hidden'>{link.label}</p>
                    
                        </Link>
                    )
                })
            }

        </div>
    </div>
  )
}

export default SideBar
