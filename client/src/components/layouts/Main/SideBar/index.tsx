import { ContactItem } from "./ContactItem";

export function SideBar() {
  return (
    <aside className="h-screen w-[30rem] bg-slate-900 max-h-screen flex flex-col">
      <div className="w-full px-4 py-2 h-[4rem] sticky top-0">

      </div>

      <ul className="flex flex-col gap-1 p-3 overflow-y-auto flex-1">
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
      </ul>
    </aside>
  )
}