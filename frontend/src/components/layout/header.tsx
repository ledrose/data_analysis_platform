import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import Link from "next/link";

export function Header() {
  return (
    <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 justify-center flex">
      <div className="container flex h-14 justify-between mx-12 w-full">
        <div className="mr-4 hidden md:flex">
          <Link href="#" className="mr-6 flex items-center space-x-2">
            {/* Replace with your logo */}
            <span className="hidden font-bold sm:inline-block">
              Your Logo
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Menu 1</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/item1" className={buttonVariants({ variant: "link" })}>
                      Item 1
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/item2" className={buttonVariants({ variant: "link" })}>
                      Item 2
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Menu 2</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/another1" className={buttonVariants({ variant: "link" })}>
                      Another 1
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/another2" className={buttonVariants({ variant: "link" })}>
                      Another 2
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button>
            Action
          </Button>
        </div>
      </div>
    </header>
  );
}