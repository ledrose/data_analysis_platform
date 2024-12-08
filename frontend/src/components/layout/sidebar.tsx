import { ScrollableList } from "../list";

const tables = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
  "Table 8",
  "Table 9",
  "Table 10",
  "Table 11",
  "Table 12",
];
const fields = [
  "Fields 1",
  "Fields 2",
  "Fields 3",
  "Fields 4",
  "Fields 5",
  "Fields 6",
  "Fields 7",
  "Fields 8",
  "Fields 9",
  "Fields 10",
  "Fields 11",
  "Fields 12",
];

export function Sidebar() {
  return (
    <aside className="w-1/4 border-r border-border/40 flex flex-col">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Tables
        </h2>
        <div className="relative">
          <ScrollableList name="Tables" data={tables} />
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Fields
        </h2>
        <div className="relative">
          <ScrollableList name="Fields" data={fields} />
        </div>
      </div>
    </aside>
  );
}