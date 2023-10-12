import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";

interface AddNewMemberProps {}

export const AddNewMember = React.forwardRef(
    (props: AddNewMemberProps, ref: any) => {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <button ref={ref} />
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4"></div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <button type="submit">Add member</button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }
);
