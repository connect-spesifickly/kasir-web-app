import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { signOut } from "next-auth/react";

export default function DialogLogout({
  setIsDialogOpen,
  isDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <form>
        <DialogTrigger asChild className="w-full">
          <div
            // variant="outline"
            className="w-full text-left text-red-500 hover:bg-transparent"
          >
            {" "}
          </div>
        </DialogTrigger>
        <DialogContent className="!max-w-[400px] !w-full !h-160px !p-6 !gap-4 !rounded-lg !bg-white">
          <DialogHeader className="">
            <DialogTitle className=" !text-[18px] text-slate-900 font-semibold ">
              Logout
            </DialogTitle>
            <DialogDescription className=" text-[14px] font-normal text-slate-500">
              Are you sure want to logout?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-1  sm:gap-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="!bg-white !text-[14px] !text-slate-900  !h-10 rounded-md"
                onClick={() => {
                  setIsDialogOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                signOut();
              }}
              className="!h-10 rounded-md !text-[14px] !text-slate-50"
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
